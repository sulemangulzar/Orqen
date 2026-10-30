from typing import TypedDict
from uuid import UUID
from sqlmodel.ext.asyncio.session import AsyncSession

from app.ai.retrieval import ContextRetriever
from app.core.config import settings


class SupportState(TypedDict, total=False):
    organization_id: UUID
    assistant_id: UUID | None
    message: str
    conversation: list[dict[str, str]]
    context: str
    sources: list[dict[str, str]]
    answer: str
    needs_handoff: bool
    intent: str


async def retrieve_context(state: SupportState) -> SupportState:
    result = await ContextRetriever(state.get("session"), state.get("assistant_id")).retrieve(state["organization_id"], state["message"])
    return {**state, "context": result.text, "sources": result.sources}


def classify_intent(state: SupportState) -> SupportState:
    message = state["message"].lower()
    if any(term in message for term in ("human", "agent", "representative", "complaint", "法律", "lawyer")):
        intent = "handoff"
    elif any(term in message for term in ("order", "delivery", "shipment", "tracking", "refund")):
        intent = "order"
    elif any(term in message for term in ("product", "size", "color", "price", "available", "stock")):
        intent = "product"
    elif any(term in message for term in ("policy", "return", "exchange", "warranty", "shipping")):
        intent = "policy"
    else:
        intent = "general"
    return {**state, "intent": intent}


async def generate_answer(state: SupportState) -> SupportState:
    if state.get("intent") == "handoff":
        return {**state, "answer": "I’ll connect you with a member of our support team for this request.", "needs_handoff": True}
    if not settings.openai_api_key:
        return {
            **state,
            "answer": "I’m not able to access the store knowledge base yet. Please connect the Shopify store or add support documents, and I’ll be able to help.",
            "needs_handoff": True,
        }

    try:
        from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
        from langchain_openai import ChatOpenAI
    except ImportError as exc:
        raise RuntimeError("AI dependencies are not installed. Run `uv sync` in backend.") from exc

    history = [HumanMessage(item["content"]) if item["role"] == "user" else AIMessage(item["content"]) for item in state.get("conversation", [])]
    system = (
        "You are Orqen, a precise and friendly Shopify customer-support assistant. "
        "Use only the supplied store context for store-specific claims. If the context "
        "does not answer the question, say so and recommend human handoff. Never invent "
        "order status, prices, policies, or delivery dates.\n\n"
        f"STORE CONTEXT:\n{state.get('context') or '(none available)'}"
    )
    model = ChatOpenAI(model=settings.openai_model, temperature=0.1, max_tokens=settings.ai_max_tokens, api_key=settings.openai_api_key)
    result = await model.ainvoke([SystemMessage(system), *history, HumanMessage(state["message"])])
    answer = result.content if isinstance(result.content, str) else str(result.content)
    return {**state, "answer": answer, "needs_handoff": not bool(state.get("context"))}


async def run_support_graph(organization_id: UUID, message: str, conversation: list[dict[str, str]], session: AsyncSession | None = None, assistant_id: UUID | None = None) -> SupportState:
    try:
        from langgraph.graph import END, START, StateGraph
    except ImportError as exc:
        raise RuntimeError("AI dependencies are not installed. Run `uv sync` in backend.") from exc

    graph = StateGraph(SupportState)
    graph.add_node("classify_intent", classify_intent)
    graph.add_node("retrieve_context", retrieve_context)
    graph.add_node("generate_answer", generate_answer)
    graph.add_edge(START, "classify_intent")
    graph.add_edge("classify_intent", "retrieve_context")
    graph.add_edge("retrieve_context", "generate_answer")
    graph.add_edge("generate_answer", END)
    return await graph.compile().ainvoke({"organization_id": organization_id, "assistant_id": assistant_id, "message": message, "conversation": conversation, "session": session})

from fastapi import FastAPI

app = FastAPI(
    title="Orqen",
    version="0.1.0",
    description="AI Operation Copilot"
)

@app.get("/")
def health():
    return {"message": "running"}


def main() -> None:
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000)

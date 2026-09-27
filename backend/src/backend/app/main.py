from fastapi import FastAPI

app = FastAPI(
    title="Orqen",
    version="0.1.0",
    description="AI Operation Copilot"
)

@app.get("/")
def health():
    return {"message" : "running"}

from fastapi import FastAPI

app = FastAPI(
    title="DataCanvasAI API",
    description="From Raw Dataset to ML-Ready Dataset",
    version="0.1.0"
)


@app.get("/")
def root():
    return {
        "message": "DataCanvasAI Backend is running!"
    }
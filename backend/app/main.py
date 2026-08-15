from fastapi import FastAPI, UploadFile, File

from app.services.dataset_loader import load_dataset
from app.services.dataset_validator import validate_dataset
from app.schemas.dataset import DatasetUploadResponse


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


@app.post("/upload", response_model=DatasetUploadResponse)
async def upload_dataset(file: UploadFile = File(...)):
    file_content = await file.read()

    dataframe = load_dataset(
        file_content=file_content,
        filename=file.filename
    )

    validate_dataset(dataframe)

    return DatasetUploadResponse(
        filename=file.filename,
        file_type=file.filename.split(".")[-1].lower(),
        rows=dataframe.shape[0],
        columns=dataframe.shape[1],
        column_names=dataframe.columns.tolist(),
        message="Dataset uploaded and validated successfully."
    )
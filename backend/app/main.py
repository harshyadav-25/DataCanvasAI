from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import JSONResponse

from app.services.dataset_loader import load_dataset
from app.services.dataset_validator import validate_dataset
from app.schemas.dataset import DatasetUploadResponse
from app.schemas.error import ErrorResponse
from app.exceptions.dataset import (
    UnsupportedFileTypeError,
    EmptyDatasetError,
    DatasetReadError,
    DatasetValidationError,
    DatasetTooLargeError,
)


MAX_UPLOAD_SIZE = 25 * 1024 * 1024


app = FastAPI(
    title="DataCanvasAI API",
    description="From Raw Dataset to ML-Ready Dataset",
    version="0.1.0"
)


@app.exception_handler(UnsupportedFileTypeError)
async def unsupported_file_type_handler(
    request: Request,
    error: UnsupportedFileTypeError
):
    response = ErrorResponse(
        error={
            "code": "UNSUPPORTED_FILE_TYPE",
            "message": str(error)
        }
    )

    return JSONResponse(
        status_code=415,
        content=response.model_dump()
    )


@app.exception_handler(EmptyDatasetError)
async def empty_dataset_handler(
    request: Request,
    error: EmptyDatasetError
):
    response = ErrorResponse(
        error={
            "code": "EMPTY_DATASET",
            "message": str(error)
        }
    )

    return JSONResponse(
        status_code=400,
        content=response.model_dump()
    )


@app.exception_handler(DatasetReadError)
async def dataset_read_handler(
    request: Request,
    error: DatasetReadError
):
    response = ErrorResponse(
        error={
            "code": "DATASET_READ_ERROR",
            "message": str(error)
        }
    )

    return JSONResponse(
        status_code=400,
        content=response.model_dump()
    )


@app.exception_handler(DatasetValidationError)
async def dataset_validation_handler(
    request: Request,
    error: DatasetValidationError
):
    response = ErrorResponse(
        error={
            "code": "DATASET_VALIDATION_ERROR",
            "message": str(error)
        }
    )

    return JSONResponse(
        status_code=400,
        content=response.model_dump()
    )


@app.exception_handler(DatasetTooLargeError)
async def dataset_too_large_handler(
    request: Request,
    error: DatasetTooLargeError
):
    response = ErrorResponse(
        error={
            "code": "DATASET_TOO_LARGE",
            "message": str(error)
        }
    )

    return JSONResponse(
        status_code=413,
        content=response.model_dump()
    )


@app.get("/")
def root():
    return {
        "message": "DataCanvasAI Backend is running!"
    }


@app.post("/upload", response_model=DatasetUploadResponse)
async def upload_dataset(file: UploadFile = File(...)):
    file_content = await file.read()

    if len(file_content) > MAX_UPLOAD_SIZE:
        raise DatasetTooLargeError(
            "Uploaded file exceeds the maximum allowed size of 25 MB."
        )

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
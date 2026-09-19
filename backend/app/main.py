from fastapi import FastAPI, UploadFile, File, Request, Depends
from fastapi.responses import JSONResponse

from app.services.dataset_loader import load_dataset
from app.api.risks import router as risks_router
from app.api.recommendations import router as recommendations_router
from app.services.dataset_validator import validate_dataset
from app.schemas.dataset import DatasetUploadResponse
from app.schemas.error import ErrorResponse
from uuid import uuid4
from app.models.dataset import DatasetRecord
from app.services.registry import dataset_registry
from app.exceptions.dataset import (
    UnsupportedFileTypeError,
    EmptyDatasetError,
    DatasetReadError,
    DatasetValidationError,
    DatasetTooLargeError,
    DatasetNotFoundError,
)
from app.core.db import connect_to_mongo, close_mongo_connection
from app.api.auth import router as auth_router
from app.core.dependencies import get_current_user
from fastapi.middleware.cors import CORSMiddleware



MAX_UPLOAD_SIZE = 25 * 1024 * 1024


app = FastAPI(
    title="DataCanvasAI API",
    description="From Raw Dataset to ML-Ready Dataset",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# MongoDB connection events
@app.on_event("startup")
async def startup_event():
    """Connect to MongoDB on app startup."""
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_event():
    """Close MongoDB connection on app shutdown."""
    await close_mongo_connection()


# Include authentication router
app.include_router(auth_router, tags=["Authentication"])
app.include_router(recommendations_router)
app.include_router(risks_router)


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
async def upload_dataset(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Upload and validate a dataset. 
    Protected endpoint - requires authentication.
    
    - **file**: CSV or XLSX file to upload (max 25MB)
    - **current_user**: Authenticated user (from JWT token)
    
    Returns: Dataset metadata with dataset_id for reference
    """
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

    dataset_id = str(uuid4())

    dataset_record = DatasetRecord(
        dataset_id=dataset_id,
        filename=file.filename,
        file_type=file.filename.split(".")[-1].lower(),
        rows=dataframe.shape[0],
        columns=dataframe.shape[1],
        column_names=dataframe.columns.tolist(),
    )

    dataset_registry.register(
        dataset_record,
        dataframe,
    )

    return DatasetUploadResponse(
        dataset_id=dataset_id,
        filename=file.filename,
        file_type=file.filename.split(".")[-1].lower(),
        rows=dataframe.shape[0],
        columns=dataframe.shape[1],
        column_names=dataframe.columns.tolist(),
        message="Dataset uploaded and validated successfully."
    )

@app.exception_handler(DatasetNotFoundError)
async def dataset_not_found_handler(
    request: Request,
    exc: DatasetNotFoundError,
):
    return JSONResponse(
        status_code=404,
        content={"detail": str(exc)},
    )

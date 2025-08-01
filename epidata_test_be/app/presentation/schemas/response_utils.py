from typing import Any, Optional, Union
from fastapi.responses import JSONResponse
from app.presentation.schemas.base_response import ResponseSchema

def ok_response(message: str, data: Any) -> Union[ResponseSchema, JSONResponse]:
    response = ResponseSchema(estado="ok", message=message, data=data)
    return JSONResponse(status_code=200, content=response.model_dump())

def error_response(message: str, exc: Optional[Exception], status_code: int) -> Union[ResponseSchema, JSONResponse]:
    response = ResponseSchema(
        estado="error",
        message=message,
        data={
            "error": str(exc)
        }
    )
    return JSONResponse(status_code=status_code, content=response.model_dump())
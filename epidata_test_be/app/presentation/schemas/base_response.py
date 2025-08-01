from pydantic import BaseModel
from typing import Any

class ResponseSchema(BaseModel):
    estado: str
    message: str
    data: Any
from pydantic import BaseModel, Field

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)

class TaskUpdate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    completed: bool
    
class TaskOut(BaseModel):
    id: int
    title: str
    completed: bool
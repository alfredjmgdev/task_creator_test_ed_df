from fastapi import APIRouter, Depends
from typing import List
from app.presentation.schemas.base_response import ResponseSchema
from app.presentation.schemas.task_schema import TaskOut, TaskCreate, TaskUpdate
from app.use_cases.task_use_case import TaskUseCase
from app.infrastructure.repositories.task_sqlalchemy_repo import TaskSQLAlchemyRepo
from app.domain.models.task_entity import Task
from app.presentation.schemas.response_utils import ok_response, error_response

router = APIRouter()

def get_use_case() -> TaskUseCase:
    return TaskUseCase(TaskSQLAlchemyRepo())

@router.get("/tasks", response_model=ResponseSchema)
def get_all_tasks(use_case: TaskUseCase = Depends(get_use_case)):
    try:
        return ok_response("Tareas Obtenidas", use_case.list_tasks())
    except Exception as e:
        return error_response("Error retrieving tasks", e, status_code=500)

@router.get("/tasks/{task_id}", response_model=ResponseSchema)
def get_task(task_id: int, use_case: TaskUseCase = Depends(get_use_case)):
    try:
        return ok_response("Tarea obtenida", use_case.get_task_by_id(task_id))
    except ValueError as ve:
        return error_response(str(ve), None, status_code=404)
    except Exception as e:
        return error_response("Error retrieving task", e, status_code=500)

@router.post("/tasks", response_model=ResponseSchema, status_code=201)
def create_task(task_create: TaskCreate, use_case: TaskUseCase = Depends(get_use_case)):
    try:
        return ok_response("Tarea creada", use_case.create_task(task_create.title))
    except ValueError as ve:
        return error_response(str(ve), None, status_code=404)
    except Exception as e:
        return error_response("Error creating task", e, status_code=500)

@router.put("/tasks/{task_id}", response_model=ResponseSchema)
def update_task(task_id: int, task_update: TaskUpdate, use_case: TaskUseCase = Depends(get_use_case)):
    try:
        task = Task(id=None, title=task_update.title, completed=task_update.completed)
        return ok_response("Tarea actualizada",use_case.update_task(task_id, task))
    except ValueError as ve:
        return error_response(str(ve), None, status_code=404)
    except Exception as e:
        return error_response("Error updating task", e, status_code=500)
    
@router.patch("/tasks/{task_id}/complete", response_model=ResponseSchema)
def mark_task_complete(task_id: int, use_case: TaskUseCase = Depends(get_use_case)):
    try:
        return ok_response("Tarea marcada como terminada",use_case.mark_task_complete(task_id))
    except ValueError as ve:
        return error_response(str(ve), None, status_code=404)
    except Exception as e:
        return error_response("Error marking task as completed", e, status_code=500)

@router.delete("/tasks/{task_id}/complete", response_model=ResponseSchema)
def delete_task(task_id: int, use_case: TaskUseCase = Depends(get_use_case)):
    try:
        use_case.delete_task(task_id)
        return ok_response("Tarea borrada", None)
    except ValueError as ve:
        return error_response(str(ve), None, status_code=404)
    except Exception as e:
        return error_response("Error deleting task", e, status_code=500)
from typing import List, Optional
from app.domain.models.task_entity import Task
from app.domain.repositories.task_repository import TaskRepository
from app.infrastructure.db.models.task_model import TaskModel
from app.infrastructure.db.models.session import SessionLocal
import logging

logger = logging.getLogger(__name__)

class TaskSQLAlchemyRepo(TaskRepository):
    def get_all(self) -> List[Task]:
        try:
            with SessionLocal() as db:
                tasks = db.query(TaskModel)
                return [self._to_entity(t) for t in tasks]
        except Exception as e:
            logger.exception((f'Error in TaskRepository.get_all: {e}'))
            raise RuntimeError(f"Failed to retrieve tasks: {e}")
    
    def get_by_id(self, task_id: int) -> Optional[Task]:
        try:
            with SessionLocal() as db:
                task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
                if not task:
                    raise ValueError(f"Task with ID {task_id} not found")
                return self._to_entity(task) if task else None
        except ValueError: 
            raise
        except Exception as e:
            logger.exception((f'Error in TaskRepository.get_by_id: {e}'))
            raise RuntimeError(f"Failed to retrieve task with ID {task_id}: {e}")
        
    def create(self, task_title: str) -> Task:
        try:
            with SessionLocal() as db:
                db_task = TaskModel(title=task_title, completed=False)
                db.add(db_task)
                db.commit()
                db.refresh(db_task)
                return self._to_entity(db_task)
        except Exception as e:
            logger.exception((f'Error in TaskRepository.create: {e}'))
            raise RuntimeError(f"Failed to create task: {e}")
    
    def update(self, task_id: int, updated_task: Task) -> Task:
        try:
            with SessionLocal() as db:
                db_task = db.query(TaskModel).filter(TaskModel.id == task_id). first()
                if not db_task:
                    raise ValueError(f"Task with ID {task_id} not found")
                setattr(db_task, 'title', updated_task.title)
                setattr(db_task, 'completed', updated_task.completed)
                db.commit()
                db.refresh(db_task)
                return self._to_entity(db_task)
        except ValueError: 
            raise
        except Exception as e:
            logger.exception((f'Error in TaskRepository.update: {e}'))
            raise RuntimeError(f"Failed to update task with ID {task_id}: {e}")
        
    def mark_complete(self, task_id: int) -> Task:
        try: 
            with SessionLocal() as db:
                db_task = db.query(TaskModel).filter(TaskModel.id == task_id). first()
                if not db_task:
                    raise ValueError(f"Task with ID {task_id} not found")
                setattr(db_task, 'completed', True)
                db.commit()
                db.refresh(db_task)
                return self._to_entity(db_task)
        except ValueError: 
            raise
        except Exception as e:
            logger.exception((f'Error in TaskRepository.mark_complete: {e}'))
            raise RuntimeError(f"Failed to mark task as completed with ID {task_id}: {e}")
        
    def delete(self, task_id: int) -> None:
        try:
            with SessionLocal() as db:
                db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
                if not db_task:
                    raise ValueError(f"Task with ID {task_id} not found")
                db.delete(db_task)
                db.commit()
        except ValueError: 
            raise
        except Exception as e:
            logger.exception((f'Error in TaskRepository.delete: {e}'))
            raise RuntimeError(f"Failed to delete task with ID {task_id}: {e}")
        
    def _to_entity(self, model: TaskModel) -> Task:
        return Task(
            id=model.id_value,
            title=model.title_value,
            completed=model.completed_value
        )
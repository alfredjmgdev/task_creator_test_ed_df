from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.models.task_entity import Task

class TaskRepository(ABC):
    
    @abstractmethod
    def get_all(self) -> List[Task]:
        pass
    
    @abstractmethod
    def get_by_id(self, task_id: int) -> Optional[Task]:
        pass
    
    @abstractmethod
    def create(self, task_title: str) -> Task:
        pass
    
    @abstractmethod
    def update(self, task_id: int, updated_task: Task) -> Task:
        pass
    
    @abstractmethod
    def delete(self, task_id: int) -> None:
        pass
    
    @abstractmethod
    def mark_complete(self, task_id: int) -> Task:
        pass
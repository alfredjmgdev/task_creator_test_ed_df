from app.domain.models.task_entity import Task
from app.domain.repositories.task_repository import TaskRepository

class TaskUseCase:
    def __init__(self, repo: TaskRepository):
        self.repo = repo
        
    def list_tasks(self):
        return self.repo.get_all()
    
    def get_task_by_id(self, task_id: int):
        return self.repo.get_by_id(task_id)
    
    def create_task(self, title: str):
        return self.repo.create(title)
    
    def update_task(self, task_id: int, task: Task):
        return self.repo.update(task_id, task)
    
    def mark_task_complete(self, task_id: int):
        return self.repo.mark_complete(task_id)
    
    def delete_task(self, task_id: int):    
        return self.repo.delete(task_id)
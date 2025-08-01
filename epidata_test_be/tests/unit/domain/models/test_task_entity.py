import pytest
from app.domain.models.task_entity import Task

class TestTaskEntity:
    """Test cases for task entity"""
    
    def test_create_task_with_all_fields(self):
        """Test creating a task with all fields  specified"""
        task = Task(id=1, title="Test Task", completed=True)
        
        assert task.id == 1
        assert task.title == "Test Task"
        assert task.completed is True
    
    def test_create_task_with_default_completed(self):
        """Test creating task with default completed"""
        task = Task(id=1, title="Test task")
        
        assert task.id == 1
        assert task.title == "Test task"
        assert task.completed is False
        
    def test_task_with_none_id(self):
        """Test creating task with default completed"""
        task = Task(id=None, title="Test task", completed=False)
        
        assert task.id == None
        assert task.title == "Test task"
        assert task.completed is False
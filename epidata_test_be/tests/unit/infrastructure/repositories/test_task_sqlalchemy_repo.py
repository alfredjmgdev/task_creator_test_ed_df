import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from unittest.mock import patch

from app.infrastructure.db.models.base import Base
from app.domain.models.task_entity import Task
from app.infrastructure.repositories.task_sqlalchemy_repo import TaskSQLAlchemyRepo

@pytest.fixture(scope="function")
def db_session():
    test_engine = create_engine("sqlite:///:memory:")
    TestingSessionLocal = sessionmaker(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    
    with patch('app.infrastructure.db.models.session.SessionLocal', TestingSessionLocal):
        yield TestingSessionLocal
    
    # Clean up
    Base.metadata.drop_all(bind=test_engine)
    test_engine.dispose()
    
@pytest.fixture
def task_repo(db_session):
    import importlib
    import app.infrastructure.repositories.task_sqlalchemy_repo
    importlib.reload(app.infrastructure.repositories.task_sqlalchemy_repo)
    
    
    return app.infrastructure.repositories.task_sqlalchemy_repo.TaskSQLAlchemyRepo()

def test_get_all_empty(task_repo):
    """Test getting all tasks when database is empty"""
    tasks = task_repo.get_all()
    assert tasks == []
    
def test_get_all_with_tasks(task_repo):
    """Test getting all tasks when database has tasks"""
    task1 = task_repo.create("Task 1")
    task2 = task_repo.create("Task 2")
    
    tasks = task_repo.get_all()
    assert len(tasks) == 2
    assert any(t.id == task1.id and t.title == "Task 1" and not t.completed for t in tasks)
    assert any(t.id == task2.id and t.title == "Task 2" and not t.completed for t in tasks)
    
def test_create_task_success(task_repo):
    """Test creating a new task"""
    created = task_repo.create("Task created")
    
    assert created.id is not None
    assert created.title == "Task created"
    assert created.completed == False
    
def test_update_task_success(task_repo):
    """Test updating a task"""
    task_to_update = task_repo.create("Task to update")
    updated_task = Task(id=None, title="Task updated", completed=True)
    result = task_repo.update(task_to_update.id, updated_task)
    
    assert result.id is not None
    assert result.title == "Task updated"
    assert result.completed == True
    
def test_update_task_not_found(task_repo):
    """Test updating a task that doesn't exist"""
    updated_task = Task(id=None, title="Task updated", completed=True)
    
    with pytest.raises(ValueError, match="Task with ID 999 not found"):
        task_repo.update(999, updated_task)

def test_mark_complete_success(task_repo):
    """Test marking a task as complete successfully"""
    task_to_update = task_repo.create("Incompleted task")
    
    result = task_repo.mark_complete(task_to_update.id)
    
    
    assert result.id is not None
    assert result.title == "Incompleted task"
    assert result.completed == True
    
def test_mark_complete_already_completed(task_repo):
    """Test marking a task already completed as complete successfully"""
    task = task_repo.create("Completed task")
    result = task_repo.mark_complete(task.id)
    
    
    assert result.id == task.id
    assert result.completed == True
    
def test_mark_complete_task_not_found(task_repo):
    """Test marking a task not found as complete successfully"""
    with pytest.raises(ValueError, match="Task with ID 999 not found"):
        task_repo.mark_complete(999)
        
def test_delete_task_success(task_repo):
    """Test deleting a task successfully"""
    task = task_repo.create("Task to delete")
    task_id = task.id
    
    task_repo.delete(task_id)
    
    with pytest.raises(ValueError, match=f"Task with ID {task_id} not found"):
        task_repo.get_by_id(task_id)
        
def test_delete_task_not_found(task_repo):
    """Test deleting a task that doesn't exist"""
    with pytest.raises(ValueError, match="Task with ID 999 not found"):
        task_repo.mark_complete(999)
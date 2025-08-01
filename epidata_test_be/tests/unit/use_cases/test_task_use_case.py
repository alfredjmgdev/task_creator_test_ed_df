import pytest
from unittest.mock import Mock
from app.domain.models.task_entity import Task
from app.domain.repositories.task_repository import TaskRepository
from app.use_cases.task_use_case import TaskUseCase

@pytest.fixture
def mock_repository():
    """Create a mock repository for testing"""
    return Mock(spec=TaskRepository)

@pytest.fixture
def task_use_case(mock_repository):
    """Create TaskUsecase instance with mocked repository"""
    return TaskUseCase(mock_repository)

class TestTaskUseCase:
    """Test cases for TaskUseCase class"""
    
    def test_list_tasks_success(self, task_use_case, mock_repository):
        """Test listing all tasks successfully"""
        
        expected_tasks = [
            Task(id=1, title="Task 1", completed=False),
            Task(id=2, title="Task 2", completed=True)
        ]
        
        mock_repository.get_all.return_value = expected_tasks
        
        result = task_use_case.list_tasks()
        
        assert result == expected_tasks
        mock_repository.get_all.assert_called_once()
        
    def test_list_tasks_empty(self, task_use_case, mock_repository):
        """Test listing all when repository returns empty list"""
     
        mock_repository.get_all.return_value = []
        
        result = task_use_case.list_tasks()
        
        assert result == []
        mock_repository.get_all.assert_called_once()
    
    def test_task_get_by_id_success(self, task_use_case, mock_repository):
        """Test getting a task by id successfully"""
        
        expected_task = Task(id=1, title="Test task", completed=False)
        mock_repository.get_by_id.return_value = expected_task
        
        result = task_use_case.get_task_by_id(1)
        
        assert result == expected_task
        mock_repository.get_by_id.assert_called_once_with(1)
        
    def test_task_get_by_id_not_found(self, task_use_case, mock_repository):
        """Test getting a task by id that doesn't exist"""
        
        mock_repository.get_by_id.return_value = None
        
        result = task_use_case.get_task_by_id(999)
        
        assert result is None
        mock_repository.get_by_id.assert_called_once_with(999)
        
    def test_task_get_by_id_exception(self, task_use_case, mock_repository):
        """Test getting a task by id when repository raises an exception"""
        
        mock_repository.get_by_id.side_effect = ValueError("Task not found")
        
        with pytest.raises(ValueError, match="Task not found"):
            task_use_case.get_task_by_id(999)
            
    def test_create_task_success(self, task_use_case, mock_repository):
        """Test creating a task successfully"""
        title = "New task"
        expected_task = Task(id=1, title=title, completed=False)
        mock_repository.create.return_value = expected_task
        
        result = task_use_case.create_task(title)
        
        assert result == expected_task
        mock_repository.create.assert_called_once_with(title)
        
    def test_create_task_repository_exception(self, task_use_case, mock_repository):
        """Test creating a task when repository raises an exception"""
        mock_repository.create.side_effect = RuntimeError("Database error")
        
        with pytest.raises(RuntimeError, match="Database error"):
            task_use_case.create_task("New task")
        
    def test_update_task_success(self, task_use_case, mock_repository):
        """Test updating a task successfully"""
        task_id = 1
        updated_task = Task(id=None, title="Updated task", completed=True)
        expected_result = Task(id=1, title="Updated task", completed=True)
        mock_repository.update.return_value = expected_result
        
        result = task_use_case.update_task(task_id, updated_task)
        
        assert result == expected_result
        mock_repository.update.assert_called_once_with(task_id, updated_task)
        
    def test_update_task_repository_exception(self, task_use_case, mock_repository):
        """Test updating a task when repository raises an exception"""
        task_id = 999
        updated_task = Task(id=None, title="Updated task", completed=True)
        mock_repository.update.side_effect = ValueError("Task not found")
        
        with pytest.raises(ValueError, match=("Task not found")):
            task_use_case.update_task(task_id, updated_task)
        
    def test_mark_as_complete_task_success(self, task_use_case, mock_repository):
        """Test marking as complete a task successfully"""
        task_id = 1
        expected_task = Task(id=1, title="Task", completed=True)
        mock_repository.mark_complete.return_value = expected_task
        
        result = task_use_case.mark_task_complete(task_id)
        
        assert result == expected_task
        mock_repository.mark_complete.assert_called_once_with(task_id)
        
    def test_task_mark_as_complete_repository_exception(self, task_use_case, mock_repository):
        """Test marking as complete a task when repository raises an exception"""
        task_id = 999
        mock_repository.mark_complete.side_effect = ValueError("Task not found")
        
        with pytest.raises(ValueError, match=("Task not found")):
            task_use_case.mark_task_complete(task_id)
            
    def test_delete_task_success(self, task_use_case, mock_repository):
        """Test deleting a task successfully"""
        task_id = 1
        mock_repository.delete.return_value = None
        
        result = task_use_case.delete_task(task_id)
        
        assert result is None
        mock_repository.delete.assert_called_once_with(task_id)
        
    def test_delete_task_repository_exception(self, task_use_case, mock_repository):
        """Test deleting a task when repository raises an exception"""
        task_id = 999
        mock_repository.delete.side_effect = ValueError("Task not found")
        
        with pytest.raises(ValueError, match=("Task not found")):
            task_use_case.delete_task(task_id)
            
    def test_use_case_methods_call_repository_correctly(self, task_use_case, mock_repository):
        """Test that all use case methods delegate to repository correctly"""
        task_id = 1
        title = "Test task"
        task = Task(id=None, title=title, completed=False)
        
        task_use_case.list_tasks()
        task_use_case.get_task_by_id(task_id)
        task_use_case.create_task(title)
        task_use_case.update_task(task_id, title)
        task_use_case.mark_task_complete(task_id)
        task_use_case.delete_task(task_id)
        
        assert mock_repository.get_all.call_count == 1
        assert mock_repository.get_by_id.call_count == 1
        assert mock_repository.create.call_count == 1
        assert mock_repository.update.call_count == 1
        assert mock_repository.mark_complete.call_count == 1
        assert mock_repository.delete.call_count == 1
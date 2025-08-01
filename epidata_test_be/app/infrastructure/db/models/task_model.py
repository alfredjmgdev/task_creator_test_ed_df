from app.infrastructure.db.models.base import Base
from sqlalchemy import Column, Integer, String, Boolean
from typing import cast

class TaskModel(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    completed = Column(Boolean, default=False)
    
    @property
    def id_value(self) -> int:
        return cast(int, self.id)
    
    @property
    def title_value(self) -> str:
        return cast(str, self.title)
    
    @property
    def completed_value(self) -> bool:
        return cast(bool, self.completed)
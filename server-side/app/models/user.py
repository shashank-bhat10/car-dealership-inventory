from enum import Enum

from sqlalchemy import Column, Integer, String, Enum as SQLEnum
from app.database import Base


class UserRole(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(
        String,
        unique=True,
        nullable=False,
    )

    email = Column(
        String,
        unique=True,
        nullable=False,
    )

    password_hash = Column(
        String,
        nullable=False,
    )

    role = Column(
        SQLEnum(UserRole, name="userrole"),
        nullable=False,
        default=UserRole.USER,
    )
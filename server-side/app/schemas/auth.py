from typing import Annotated

from pydantic import BaseModel, EmailStr, Field, StringConstraints, field_validator


class RegisterRequest(BaseModel):
    username: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]
    email: EmailStr
    password: str = Field(min_length=6)

    @field_validator('password')
    @classmethod
    def password_fits_bcrypt(cls, value):
        if len(value.encode('utf-8')) > 72:
            raise ValueError('Password cannot exceed 72 UTF-8 bytes')
        return value


class RegisterResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str

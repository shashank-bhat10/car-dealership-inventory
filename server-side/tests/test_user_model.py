from app.models.user import User, UserRole

import pytest
from sqlalchemy.exc import IntegrityError


def test_user_role_enum_values():
    assert UserRole.USER.value == "USER"
    assert UserRole.ADMIN.value == "ADMIN"


def test_user_default_role_is_user():
    assert User.__table__.c.role.default.arg == UserRole.USER


def test_create_user():
    user = User(
        username="adithi",
        email="adithi@example.com",
        password_hash="hashed_password",
        role=UserRole.USER,
    )

    assert user.username == "adithi"
    assert user.email == "adithi@example.com"
    assert user.password_hash == "hashed_password"
    assert user.role == UserRole.USER


def test_user_default_role():
    assert User.__table__.c.role.default.arg == UserRole.USER


def test_save_user_to_database(db_session):
    user = User(
        username="databaseuser",
        email="database@example.com",
        password_hash="hashed_password",
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    assert user.id is not None
    assert user.username == "databaseuser"
    assert user.role == UserRole.USER


def test_username_must_be_unique(db_session):
    user1 = User(
        username="duplicate",
        email="first@example.com",
        password_hash="hashed_password",
    )

    user2 = User(
        username="duplicate",
        email="second@example.com",
        password_hash="hashed_password",
    )

    db_session.add(user1)
    db_session.commit()

    db_session.add(user2)

    with pytest.raises(IntegrityError):
        db_session.commit()

    db_session.rollback()


def test_email_must_be_unique(db_session):
    user1 = User(
        username="user1",
        email="duplicate@example.com",
        password_hash="hashed_password",
    )

    user2 = User(
        username="user2",
        email="duplicate@example.com",
        password_hash="hashed_password",
    )

    db_session.add(user1)
    db_session.commit()

    db_session.add(user2)

    with pytest.raises(IntegrityError):
        db_session.commit()

    db_session.rollback()


def test_username_is_required(db_session):
    user = User(
        email="test@example.com",
        password_hash="hashed_password",
    )

    db_session.add(user)

    with pytest.raises(IntegrityError):
        db_session.commit()

    db_session.rollback()


def test_email_is_required(db_session):
    user = User(
        username="testuser",
        password_hash="hashed_password",
    )

    db_session.add(user)

    with pytest.raises(IntegrityError):
        db_session.commit()

    db_session.rollback()


def test_password_hash_is_required(db_session):
    user = User(
        username="testuser",
        email="test@example.com",
    )

    db_session.add(user)

    with pytest.raises(IntegrityError):
        db_session.commit()

    db_session.rollback()
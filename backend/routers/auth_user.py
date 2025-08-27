from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

import models, schemas, auth
from database import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", status_code=201)
def register(payload: schemas.RegisterIn, db: Session = Depends(get_db)):
    existing = db.execute(select(models.User).where(models.User.email == payload.email)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    user = models.User(email=payload.email, hashed_password=auth.hash_password(payload.password))
    db.add(user)
    db.commit()
    return {"message": "Registered"}

@router.post("/login", response_model=schemas.TokenOut)
def login(payload: schemas.LoginIn, db: Session = Depends(get_db)):
    user = db.execute(select(models.User).where(models.User.email == payload.email)).scalar_one_or_none()
    if not user or not auth.verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    access_token = auth.create_access_token(user.email)
    refresh_token = auth.create_refresh_token(user.email)
    return schemas.TokenOut(access_token=access_token, refresh_token=refresh_token)

@router.post("/refresh", response_model=schemas.TokenOut)
def refresh(payload: schemas.RefreshIn):
    email = auth.decode_token(payload.refresh_token, "refresh")
    access_token = auth.create_access_token(email)
    refresh_token = auth.create_refresh_token(email)
    return schemas.TokenOut(access_token=access_token, refresh_token=refresh_token)

@router.post("/logout")
def logout(payload: schemas.RefreshIn):
    # For stateless JWT, just accept and return success.
    return {"message": "Logged out successfully"}

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models, schemas
from auth import get_current_user
from database import get_db

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=schemas.MeOut)
def me(current_user: models.User = Depends(get_current_user)):
    return schemas.MeOut(id=current_user.id, email=current_user.email)

from fastapi import APIRouter, Depends
from auth import get_current_user

router = APIRouter(prefix="/protected", tags=["protected"])

@router.get("/")
def read_protected(current_user: dict = Depends(get_current_user)):
    return {"message": f"Hello, {current_user['username']}! This is a protected route."}

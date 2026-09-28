from fastapi import APIRouter


router = APIRouter(tags=["Organization"])

@router.post("/onboarding")
async def onboarding():
    pass

@router.put("/{organization_id}")
async def update_org():
    pass

@router.delete("/{organization_id}")
async def delete_org():
    pass

@router.post("/invite_user")
async def invite_user():
    pass

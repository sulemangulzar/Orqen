from pydantic import BaseModel, EmailStr

class Register(BaseModel):
    full_name : str
    org_name : str
    email : EmailStr
    password : str
    plan : str

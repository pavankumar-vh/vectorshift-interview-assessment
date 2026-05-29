from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    full_name: Optional[str] = None

    class Config:
        orm_mode = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class PipelinePayload(BaseModel):
    nodes: List[Dict]
    edges: List[Dict]


class PipelineValidationResult(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


class PipelineBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = Field(None, max_length=500)


class PipelineCreate(PipelineBase):
    nodes: List[Dict]
    edges: List[Dict]


class PipelineUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=120)
    description: Optional[str] = Field(None, max_length=500)
    nodes: Optional[List[Dict]] = None
    edges: Optional[List[Dict]] = None


class PipelineOut(PipelineBase):
    id: int
    owner_id: int
    nodes: List[Dict]
    edges: List[Dict]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class PipelineListItem(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    num_nodes: int
    num_edges: int
    created_at: datetime
    updated_at: datetime


class PipelineListResponse(BaseModel):
    pipelines: List[PipelineListItem]
    total: int


class RunCreate(BaseModel):
    note: Optional[str] = None


class RunOut(BaseModel):
    id: int
    status: str
    result: PipelineValidationResult
    created_at: datetime

    class Config:
        orm_mode = True


class RunListResponse(BaseModel):
    runs: List[RunOut]


class ShareResponse(BaseModel):
    token: str


class SharedPipeline(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    nodes: List[Dict]
    edges: List[Dict]

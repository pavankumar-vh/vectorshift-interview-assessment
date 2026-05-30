import secrets
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_or_create_user,
)
from app.config import get_settings
from app.dag import is_dag
from app.db import Base, engine, get_db
from app.models import Pipeline, PipelineRun, ShareLink, User
from app.schemas import (
    LoginRequest,
    PipelineCreate,
    PipelineListItem,
    PipelineListResponse,
    PipelineOut,
    PipelinePayload,
    PipelineUpdate,
    PipelineValidationResult,
    RunCreate,
    RunListResponse,
    RunOut,
    ShareResponse,
    SharedPipeline,
    TokenResponse,
    UserOut,
)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="VectorShift Pipeline API", lifespan=lifespan)

origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_origin_regex=r"^(https://.*|http://(localhost|127\.0\.0\.1)(:\d+)?)$",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def pipeline_summary(nodes: List[dict], edges: List[dict]) -> PipelineValidationResult:
    return PipelineValidationResult(
        num_nodes=len(nodes),
        num_edges=len(edges),
        is_dag=is_dag(nodes, edges),
    )


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user_info = authenticate_user(payload.username, payload.password)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    user = get_or_create_user(db, payload.username, user_info.get("full_name"))
    token = create_access_token({"sub": user.username, "user_id": user.id})
    return {"access_token": token, "token_type": "bearer", "user": user}


@app.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@app.post("/pipelines/parse", response_model=PipelineValidationResult)
def parse_pipeline(payload: PipelinePayload):
    return pipeline_summary(payload.nodes, payload.edges)


@app.get("/pipelines", response_model=PipelineListResponse)
def list_pipelines(
    q: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Pipeline).filter(Pipeline.owner_id == current_user.id)
    if q:
        query = query.filter(
            or_(
                Pipeline.name.ilike(f"%{q}%"),
                Pipeline.description.ilike(f"%{q}%"),
            )
        )

    pipelines = query.order_by(Pipeline.updated_at.desc()).all()
    items = [
        PipelineListItem(
            id=pipeline.id,
            name=pipeline.name,
            description=pipeline.description,
            num_nodes=len(pipeline.nodes or []),
            num_edges=len(pipeline.edges or []),
            created_at=pipeline.created_at,
            updated_at=pipeline.updated_at,
        )
        for pipeline in pipelines
    ]
    return {"pipelines": items, "total": len(items)}


@app.post("/pipelines", response_model=PipelineOut)
def create_pipeline(
    payload: PipelineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pipeline = Pipeline(
        owner_id=current_user.id,
        name=payload.name,
        description=payload.description,
        nodes=payload.nodes,
        edges=payload.edges,
    )
    db.add(pipeline)
    db.commit()
    db.refresh(pipeline)
    return pipeline


@app.get("/pipelines/{pipeline_id}", response_model=PipelineOut)
def get_pipeline(
    pipeline_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pipeline = db.query(Pipeline).filter(Pipeline.id == pipeline_id).first()
    if not pipeline or pipeline.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    return pipeline


@app.put("/pipelines/{pipeline_id}", response_model=PipelineOut)
def update_pipeline(
    pipeline_id: int,
    payload: PipelineUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pipeline = db.query(Pipeline).filter(Pipeline.id == pipeline_id).first()
    if not pipeline or pipeline.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    if payload.name is not None:
        pipeline.name = payload.name
    if payload.description is not None:
        pipeline.description = payload.description
    if payload.nodes is not None:
        pipeline.nodes = payload.nodes
    if payload.edges is not None:
        pipeline.edges = payload.edges

    db.commit()
    db.refresh(pipeline)
    return pipeline


@app.delete("/pipelines/{pipeline_id}")
def delete_pipeline(
    pipeline_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pipeline = db.query(Pipeline).filter(Pipeline.id == pipeline_id).first()
    if not pipeline or pipeline.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    db.delete(pipeline)
    db.commit()
    return {"status": "deleted"}


@app.get("/pipelines/{pipeline_id}/runs", response_model=RunListResponse)
def list_runs(
    pipeline_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pipeline = db.query(Pipeline).filter(Pipeline.id == pipeline_id).first()
    if not pipeline or pipeline.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    runs = (
        db.query(PipelineRun)
        .filter(PipelineRun.pipeline_id == pipeline_id)
        .order_by(PipelineRun.created_at.desc())
        .all()
    )
    return {"runs": runs}


@app.post("/pipelines/{pipeline_id}/runs", response_model=RunOut)
def run_pipeline(
    pipeline_id: int,
    payload: RunCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pipeline = db.query(Pipeline).filter(Pipeline.id == pipeline_id).first()
    if not pipeline or pipeline.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    result = pipeline_summary(pipeline.nodes or [], pipeline.edges or []).dict()

    run = PipelineRun(
        pipeline_id=pipeline.id,
        status="completed",
        result=result,
    )
    db.add(run)
    db.commit()
    db.refresh(run)
    return run


@app.post("/pipelines/{pipeline_id}/share", response_model=ShareResponse)
def create_share_link(
    pipeline_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pipeline = db.query(Pipeline).filter(Pipeline.id == pipeline_id).first()
    if not pipeline or pipeline.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    token = secrets.token_urlsafe(16)
    share = ShareLink(pipeline_id=pipeline.id, token=token)
    db.add(share)
    db.commit()
    return {"token": token}


@app.get("/share/{token}", response_model=SharedPipeline)
def get_shared_pipeline(token: str, db: Session = Depends(get_db)):
    share = db.query(ShareLink).filter(ShareLink.token == token).first()
    if not share:
        raise HTTPException(status_code=404, detail="Share link not found")

    pipeline = db.query(Pipeline).filter(Pipeline.id == share.pipeline_id).first()
    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    return pipeline

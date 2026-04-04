"""
AIBLTY Code — FastAPI Backend | AI coding assistant and pair programmer
Domain: developer tools | Focus: code generation, debugging, code review, documentation
"""
from __future__ import annotations
import asyncio, time, uuid
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from starlette.requests import Request
from starlette.responses import Response

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"[AIBLTY Code] Starting...")
    yield
    print(f"[AIBLTY Code] Shutting down...")

app = FastAPI(title="AIBLTY Code API", description="AI coding assistant and pair programmer", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
    request.state.request_id = str(uuid.uuid4())
    start = time.time()
    response = await call_next(request)
    response.headers["X-Request-ID"] = request.state.request_id
    response.headers["X-Response-Time"] = f"{time.time()-start:.3f}s"
    return response

class AIRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=4000)
    model: str = Field("gpt-4o-mini")
    temperature: float = Field(0.7, ge=0.0, le=2.0)
    domain: str = Field("developer tools")

class AgentTask(BaseModel):
    task_type: str
    input: str
    context: dict[str, Any] = Field(default_factory=dict)

@app.get("/health")
async def health() -> dict:
    return {"status":"healthy","service":"AIBLTY Code","version":"1.0.0","domain":"developer tools"}

@app.get("/")
async def root() -> dict:
    return {"service":"AIBLTY Code","tagline":"AI coding assistant and pair programmer","domain":"developer tools","version":"1.0.0","docs":"/docs"}

@app.post("/api/ai/complete")
async def ai_complete(req_body: AIRequest, request: Request) -> dict:
    import os, httpx
    key = os.getenv("OPENAI_API_KEY","")
    if not key:
        return {"request_id": request.state.request_id, "content": f"[DEV] AIBLTY Code AI: {req_body.prompt[:80]}", "model": req_body.model, "domain": "developer tools", "usage": {"total_tokens":20}}
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post("https://api.openai.com/v1/chat/completions",
            headers={"Authorization":f"Bearer {key}"},
            json={"model":req_body.model,"messages":[{"role":"system","content":"Expert developer tools AI. Focus: code generation, debugging, code review, documentation."},{"role":"user","content":req_body.prompt}],"temperature":req_body.temperature})
        if r.status_code != 200: return {"error":"AI provider error","status":r.status_code}
        d = r.json()
    return {"request_id":request.state.request_id,"content":d["choices"][0]["message"]["content"],"model":d["model"],"domain":"developer tools","usage":d["usage"]}

@app.post("/api/ai/agent")
async def run_agent(task: AgentTask, request: Request) -> dict:
    return {"task_id":request.state.request_id,"task_type":task.task_type,"status":"queued","domain":"developer tools"}

@app.post("/api/analytics/batch")
async def analytics_batch(payload: dict) -> dict:
    return {"received": len(payload.get("events",[])), "status":"ok"}

@app.post("/api/users/push-token")
async def push_token(payload: dict) -> dict:
    return {"status":"registered"}

class CM:
    def __init__(self): self.active: list[WebSocket] = []
    async def connect(self, ws): await ws.accept(); self.active.append(ws)
    def disconnect(self, ws): self.active.remove(ws) if ws in self.active else None
    async def send(self, ws, msg):
        try: await ws.send_text(msg)
        except: self.disconnect(ws)

cm = CM()

@app.websocket("/ws/ai")
async def ws_ai(ws: WebSocket):
    await cm.connect(ws)
    try:
        while True:
            data = await ws.receive_text()
            await cm.send(ws, f"[AIBLTY Code AI] Processing: {data[:50]}")
            await asyncio.sleep(0.1)
            await cm.send(ws, f"[STREAM] Domain: developer tools | Complete")
    except WebSocketDisconnect:
        cm.disconnect(ws)

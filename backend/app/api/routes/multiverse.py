from typing import Optional

from agno.run.team import TeamRunOutput
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.api.deps import MultiverseTeamDep

router = APIRouter(prefix="/multiverse", tags=["Multiverse"])


class MultiverseRequest(BaseModel):
    decision: str
    user_id: str


class MultiverseResponse(BaseModel):
    content: str
    session_id: Optional[str] = None
    run_id: Optional[str] = None
    member_names: list[str] = []


@router.post("", response_model=MultiverseResponse)
async def multiverse(req: MultiverseRequest, team: MultiverseTeamDep):
    response: TeamRunOutput = await team.arun(
        req.decision,
        user_id=req.user_id,
        stream=False,
    )

    member_names: list[str] = []
    for member_run in response.member_responses:
        name = getattr(member_run, "agent_name", None)
        if name:
            member_names.append(name)

    if not response or not response.content:
        raise HTTPException(
            status_code=500, detail="Multiverse Council returned an empty response"
        )

    return MultiverseResponse(
        content=str(response.content),
        session_id=response.session_id,
        run_id=response.run_id,
        member_names=member_names,
    )

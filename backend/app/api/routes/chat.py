from typing import Optional

from agno.run.agent import RunOutput
from agno.run.team import TeamRunOutput
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.api.deps import TeamDep

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatRequest(BaseModel):
    message: str
    user_id: str
    session_id: Optional[str] = None
    # use_research_agent: bool = False


class ChatResponse(BaseModel):
    content: str
    session_id: Optional[str] = None
    run_id: Optional[str] = None
    team_name: Optional[str] = None
    team_tools: Optional[list[str]] = None
    member_name: Optional[str] = None
    member_tools: Optional[list[str]] = None


@router.post("", response_model=ChatResponse)
async def chat(
    req: ChatRequest,
    # base_agent: BaseAgentDep,
    # research_agent: ResearchAgentDep,
    team: TeamDep,
):
    # agent = research_agent if req.use_research_agent else base_agent

    response: TeamRunOutput = await team.arun(
        req.message,
        user_id=req.user_id,
        session_id=req.session_id,
        stream=False,
    )

    print("--- Team-level tools ---")
    team_tools = []
    team_name = response.team_name
    for tool in response.tools:
        print(tool.tool_name)
        team_tools.append(tool.tool_name)

    print("--- Member agent tools ---")
    member_tools = []
    member_name = None
    for member_run in response.member_responses:
        member_name = getattr(member_run, 'agent_name', None) #or getattr(member_run, 'team_name', None)
        print(f"Agent: {member_name}")
        for tool in member_run.tools:
            print(tool.tool_name)
            member_tools.append(tool.tool_name)
        # print(f"Agent: {getattr(member_run, 'agent_name', None) or getattr(member_run, 'team_name', None)}")
        # print(f"Tools called: {member_run.tools}")

    if not response or not response.content:
        raise HTTPException(status_code=500, detail="Agent returned an empty response")

    return ChatResponse(
        content=str(response.content),
        session_id=response.session_id,
        run_id=response.run_id,
        team_tools=team_tools,
        member_tools=member_tools,
        team_name=team_name, 
        member_name=member_name,
    )
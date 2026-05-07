from agno.agent import Agent
from agno.tools.googlecalendar import GoogleCalendarTools

from app.agents.base import get_base_agent


def get_calender_agent() -> Agent:

    return get_base_agent(
        tools=[
            GoogleCalendarTools(
                credentials_path="backend/data/client_secret.json",  # Path to your downloaded OAuth credentials
                # token_path="token.json",  # Path to your downloaded OAuth credentials
                oauth_port=8080,  # port used for oauth authentication
                allow_update=True,
                # name="Calendar Agent",
                instructions="A scheduling assistant. You should help users to perform these actions in their Google calendar: get their scheduled events from a certain date and time, create events based on provided details, update existing events, delete events, find available time slots for scheduling",
            )
        ],
    )
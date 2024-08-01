import os
from __future__ import annotations
from datetime import datetime
from dotenv import load_dotenv
from tzfpy import get_tz
from typing import Callable
import json
import pytz
import ipinfo

from deephaven.plugin.object_type import MessageStream

load_dotenv()

access_token = os.getenv("IPINFO_ACCESS_TOKEN")

def get_payload_from_ip(ip: str, notify: bool|None = False) -> dict[str, float]:
    handler = ipinfo.getHandler(access_token)
    details = handler.getDetails(ip)
    local_tz = pytz.timezone(details.timezone)
    local_time = datetime.now(local_tz)
    return {
        "lat": float(details.latitude),
        "lng": float(details.longitude),
        "timezone": details.timezone,
        "localtime": local_time.isoformat(),
        "notify": notify,
    }

def get_payload_from_coordinates(coordinates: dict[str, float], notify: bool|None = False) -> dict[str, float]:
    lat = float(coordinates["lat"])
    lng = float(coordinates["lng"])
    timezone = get_tz(lng, lat)
    local_tz = pytz.timezone(timezone)
    local_time = datetime.now(local_tz)
    return {
        "lat": lat,
        "lng": lng,
        "timezone": timezone,
        "localtime": local_time.isoformat(),
        "notify": notify,
    }

class DeephavenPluginHackathonObject:
    """
    This is a simple object that demonstrates how to send messages to the client.
    When the object is created, it will be passed a connection to the client.
    This connection can be used to send messages back to the client.

    Attributes:
        _connection: MessageStream: The connection to the client
    """
    def __init__(self, on_change: Callable[[str], None] | None = None):
        self._connection: MessageStream = None
        self._on_change = on_change

    def _set_connection(self, connection: MessageStream) -> None:
        """
        Set the connection to the client.
        This is called on the object when it is created.

        Args:
            connection: The connection to the client
        """
        self._connection = connection

    def _send_response(self, payload: dict[str, float]) -> None:
        """
        Send a response to the client

        Args:
            payload: The payload to send
        """
        print(f"Response: {payload}")
        
        self._connection.send_message(json.dumps({"action": "marker_set", "payload": payload}))

        if self._on_change:
            self._on_change(payload)
        

    def set_marker(self, payload: dict[str, float]) -> None:
        """
        Set the marker on the client and trigger on_change
        """
        response_payload = get_payload_from_coordinates(payload, True)
        self._send_response(response_payload)
        

    def set_ip(self, ip: str) -> None:
        """
        Set the ip on the client and trigger on_change
        """
        response_payload = get_payload_from_ip(ip)
        self._send_response(response_payload)





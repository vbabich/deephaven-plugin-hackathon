import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import { useApi } from "@deephaven/jsapi-bootstrap";
import Log from "@deephaven/log";
import { WidgetComponentProps } from "@deephaven/plugin";
import { dh } from "@deephaven/jsapi-types";
import {
  APIProvider,
  Map,
  MapMouseEvent,
  Marker,
} from "@vis.gl/react-google-maps";
import useIP from "./useIP";

const log = Log.module(
  "deephaven-plugin-hackathon.DeephavenPluginHackathonView"
);

// Create a custom style for the component
// export const DeephavenPluginHackathonViewStyle: CSSProperties = {
//   display: "flex",
//   height: "100%",
//   width: "100%",
//   flexDirection: "column",
// };

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function DeephavenPluginHackathonView(
  props: WidgetComponentProps
): JSX.Element {
  const { fetch } = props;
  const [widget, setWidget] = useState<dh.Widget | null>(null);
  const dh = useApi();
  const ip = useIP();

  const [mapLat, setMapLat] = useState(43.61509308538717);
  const [mapLng, setMapLng] = useState(-116.21056581773938);

  const [markerLat, setMarkerLat] = useState<number>();
  const [markerLng, setMarkerLng] = useState<number>();

  useEffect(() => {
    if (ip != null && widget != null) {
      log.info("Sending IP address to server", ip, widget);
      widget.sendMessage(JSON.stringify({ action: "ip_set", payload: ip }), []);
    }
  }, [ip, widget]);

  useEffect(() => {
    async function init() {
      // Fetch the widget from the server
      const fetched_widget = (await fetch()) as dh.Widget;
      setWidget(fetched_widget);

      // Add an event listener to the widget to listen for messages from the server
      fetched_widget.addEventListener<dh.Widget>(
        dh.Widget.EVENT_MESSAGE,
        ({ detail }) => {
          const message = detail.getDataAsString();
          let action, payload;
          try {
            ({ action, payload } = JSON.parse(message));
          } catch (e) {
            log.error("Error parsing message", e);
            return;
          }
          switch (action) {
            case "marker_set":
              log.info("Setting marker", payload);
              setMarkerLat(payload.lat);
              setMarkerLng(payload.lng);
              break;
            default:
              log.error("Unknown action", action);
          }
        }
      );
    }

    init();
  }, [dh, fetch]);

  const handleMarkerClick = useCallback((event) => {
    log.info("Marker clicked", event);
  }, []);

  return (
    <>
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultZoom={5}
          defaultCenter={{ lat: mapLat, lng: mapLng }}
          disableDefaultUI={true}
          disableDoubleClickZoom={true}
          onDblclick={(event: MapMouseEvent) => {
            const { lat, lng } = event.detail.latLng ?? { lat: 0, lng: 0 };
            setMarkerLat(lat);
            setMarkerLng(lng);
            widget?.sendMessage(
              JSON.stringify({ action: "marker_set", payload: { lat, lng } }),
              []
            );
          }}
        >
          {markerLat != null && markerLng != null && (
            <Marker
              position={{ lat: markerLat, lng: markerLng }}
              onClick={(event) => handleMarkerClick(event)}
            />
          )}
        </Map>
      </APIProvider>
    </>
  );
}

export default DeephavenPluginHackathonView;

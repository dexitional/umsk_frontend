import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

//@ts-ignore
const { REACT_APP_WS_URL }: any = import.meta.env;

// Subscribes to the backend's real-time election channel (backend/util/ws/server.ts)
// and either hands the pushed payload to `onData` (for pages that keep their
// own local copy of the live data) or, if the push carries no usable
// payload, falls back to invalidating `queryKey` so react-query refetches.
// Auto-reconnects on close. Shared by PgPublic/PgStrongroom/PgResult so the
// subscribe/reconnect plumbing isn't duplicated per page.
export function useElectionSocket(electionId: string | number | undefined, queryKey: any[], onData?: (data: any) => void) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!electionId) return;

    let socket: WebSocket | null = null;
    let shouldReconnect = true;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      socket = new WebSocket(REACT_APP_WS_URL);
      socket.onopen = () => {
        socket?.send(JSON.stringify({ type: "subscribe", electionId: Number(electionId) }));
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "election") {
            if (message?.data?.portfolios) {
              onData?.(message.data);
            } else {
              queryClient.invalidateQueries({ queryKey });
            }
          }
        } catch (err) {}
      };

      socket.onclose = () => {
        if (shouldReconnect) {
          reconnectTimeout = setTimeout(connect, 3000);
        }
      };
    };

    connect();

    return () => {
      shouldReconnect = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socket) socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [electionId, queryClient]);
}

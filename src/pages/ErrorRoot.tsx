import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export function ErrorBoundary() {
  const error = useRouteError();

  // Handle specific HTTP-like errors (404, 401, etc.)
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status} {error.statusText}</h1>
        <p>{typeof error.data === "string" ? error.data : JSON.stringify(error.data)}</p>
      </div>
    );
  }

  // Handle unexpected JavaScript errors
  return (
    <div>
      <h1>Unexpected Error</h1>
      <p>{error instanceof Error ? error.message : "Unknown error"}</p>
    </div>
  );
}

import React from "react";
// @ts-ignore
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";
import Header from "../components/Header";
import { useUserStore } from "../utils/authService";

function ErrorIllustration() {
  return (
    <svg
      viewBox="0 0 200 160"
      className="w-56 h-auto md:w-64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ground shadow */}
      <ellipse cx="100" cy="140" rx="62" ry="7" className="fill-primary/15" />

      {/* decorative dots / plus marks */}
      <circle cx="34" cy="112" r="3.5" className="fill-primary/25" />
      <circle cx="168" cy="108" r="3" className="fill-secondary-accent/40" />
      <circle cx="150" cy="34" r="3.5" className="fill-primary/20" />
      <path d="M44 30h10M49 25v10" className="stroke-secondary-accent" strokeWidth="2" strokeLinecap="round" />
      <path d="M150 92h8M154 88v8" className="stroke-primary/30" strokeWidth="2" strokeLinecap="round" />

      {/* back panel */}
      <rect
        x="58"
        y="52"
        width="66"
        height="76"
        rx="10"
        transform="rotate(8 91 90)"
        className="fill-secondary-accent/10 stroke-primary-dark"
        strokeWidth="2.5"
      />
      <rect
        x="66"
        y="64"
        width="50"
        height="10"
        rx="3"
        transform="rotate(8 91 90)"
        className="fill-primary-dark/70"
      />

      {/* front panel (torn edge via polygon) */}
      <path
        d="M42 58 L106 50 C110 49 113 52 113 56 L118 118 C118.5 123 115 127 110 127 L46 132 C41 132.5 37 129 37 124 L38 66 C38.3 61.8 39.9 58.6 42 58 Z"
        className="fill-white stroke-primary"
        strokeWidth="2.5"
      />
      <rect x="46" y="68" width="60" height="11" rx="3" className="fill-secondary-accent" />
      <rect x="46" y="98" width="30" height="6" rx="2" className="fill-primary/20" />
      <rect x="46" y="108" width="42" height="6" rx="2" className="fill-primary/20" />

      {/* jagged tear line */}
      <path
        d="M104 52 L98 66 L108 76 L96 90 L106 104 L94 120"
        className="stroke-primary-dark/40"
        strokeWidth="2"
        strokeDasharray="1 5"
        strokeLinecap="round"
      />

      {/* warning badge */}
      <g transform="translate(120 24)">
        <path
          d="M17.3 2.6a4 4 0 0 1 6.9 0l15.4 26.6a4 4 0 0 1-3.5 6H5.4a4 4 0 0 1-3.5-6L17.3 2.6Z"
          className="fill-secondary-accent stroke-primary-dark"
          strokeWidth="2"
        />
        <path d="M20.5 13v9" className="stroke-white" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="20.5" cy="27" r="1.6" className="fill-white" />
      </g>
    </svg>
  );
}

function Error() {
  const { user, logout } = useUserStore((state: any) => state);
  const navigate = useNavigate();
  let error: any = useRouteError();
  console.log(error);

  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  const isUnauthorized = isRouteErrorResponse(error) && error.status === 401;
  // Service methods (aisService.ts/amsService.ts's checkSession) throw the
  // raw axios error on failure — its .message is a generic "Request failed
  // with status code 403", not the backend's actual reason. That reason
  // lives at error.response.data.message and takes priority when present.
  const isForbidden = error?.response?.status === 403;

  if (isUnauthorized) {
    // If token expired
    logout();
    navigate("/");
  }

  const message = isRouteErrorResponse(error)
    ? error.statusText ||
      (typeof error.data === "string" ? error.data : error.data && JSON.stringify(error.data))
    : error?.response?.data?.message
    ? error.response.data.message
    : error instanceof globalThis.Error
    ? error.message
    : typeof error === "string"
    ? error
    : "An unexpected error occurred.";

  const heading = isNotFound
    ? "404 error"
    : isForbidden
    ? "Access denied"
    : "Something went wrong";
  const subtext = isNotFound
    ? "Page not found. Let's get you back on track!"
    : message || "An unexpected error occurred. Let's get you back on track!";

  return (
    <div className="w-full h-screen flex flex-col">
      <Header user={user} logout={logout} />
      <main className="w-full flex-1 flex flex-col items-center justify-center px-6 text-center">
        <ErrorIllustration />
        <h1 className="mt-6 text-3xl md:text-4xl font-bold text-primary">{heading}</h1>
        <p className="mt-2 text-primary/60 max-w-sm">{subtext}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-8 py-3.5 rounded shadow bg-secondary-accent/90 hover:bg-secondary-accent font-bold tracking-wider text-white flex items-center space-x-2 transition-colors"
        >
          <span>Refresh the page</span>
          <span aria-hidden="true">&rarr;</span>
        </button>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-primary/50 hover:text-primary-dark underline underline-offset-2"
        >
          Go back
        </button>
      </main>
    </div>
  );
}

export default Error;

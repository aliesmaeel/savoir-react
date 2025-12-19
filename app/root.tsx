import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import AOS from "aos";
import "aos/dist/aos.css";
import "./app.css";
import { useEffect } from "react";
import { NotificationsProvider } from "./components/notifications/NotificationsProvider";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    AOS.init({
      duration: 700, // ms
      once: false, // <--- allow it to animate every time it enters viewport
      mirror: true, // <--- animate elements out while scrolling past them
      offset: 0,
      delay: 100,
    });

    // Refresh on component update (helps with dynamic content)
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => AOS.refreshHard());
  }, [pathname]);

  useEffect(() => {
    // Check if chatbot container already exists
    if (document.getElementById("chatbot-container")) {
      return;
    }

    // Create chatbot container
    const container = document.createElement("div");
    container.id = "chatbot-container";
    container.style.cssText = `
      position: fixed;
      bottom: 40px;
      right: 40px;
      width: 400px;
      height: 600px;
      z-index: 9999;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      display: none;
    `;

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.src = "https://chat.savoirproperties.com/";
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
    `;
    iframe.setAttribute("allow", "microphone; camera");

    container.appendChild(iframe);
    document.body.appendChild(container);

    // Create toggle button
    const button = document.createElement("button");
    button.id = "chatbot-toggle-button";
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
      </svg>
    `;
    button.style.cssText = `
      position: fixed;
      bottom: 40px;
      right: 40px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #B59B62;
      color: white;
      border: none;
      cursor: pointer;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
      transition: transform 0.2s;
    `;
    button.setAttribute("aria-label", "Toggle chatbot");
    button.setAttribute("tabindex", "0");

    const handleToggle = () => {
      const isVisible = container.style.display !== "none";
      container.style.display = isVisible ? "none" : "block";
      button.style.transform = isVisible ? "scale(1)" : "scale(0.9)";
    };

    button.addEventListener("click", handleToggle);
    button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleToggle();
      }
    });

    document.body.appendChild(button);

    return () => {
      const existingContainer = document.getElementById("chatbot-container");
      const existingButton = document.getElementById("chatbot-toggle-button");
      if (existingContainer) {
        document.body.removeChild(existingContainer);
      }
      if (existingButton) {
        document.body.removeChild(existingButton);
      }
    };
  }, []);

  return (
    <NotificationsProvider>
      <Outlet />
    </NotificationsProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

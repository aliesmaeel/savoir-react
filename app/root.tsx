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
    const script = document.createElement("script");
    script.id = "chatbot-embed";
    script.src = "https://chat.savoirproperties.com/embed.js";
    script.setAttribute("data-server-url", "https://chat.savoirproperties.com");

    document.body.appendChild(script);

    // Style the chatbot button after it loads
    const styleChatbotButton = () => {
      const chatbotButton = document.querySelector(
        '[data-chatbot-button], #chatbot-button, .chatbot-button, [id*="chatbot"], [class*="chatbot"]'
      ) as HTMLElement;
      if (chatbotButton) {
        chatbotButton.style.bottom = "40px";
        chatbotButton.style.top = "auto";
        chatbotButton.style.transform = "scale(0.4)";
        chatbotButton.style.right = "40px";
      }
    };

    // Try to style immediately and also after a delay to catch dynamically created buttons
    setTimeout(styleChatbotButton, 100);
    setTimeout(styleChatbotButton, 500);
    setTimeout(styleChatbotButton, 1000);

    // Use MutationObserver to watch for dynamically added chatbot elements
    const observer = new MutationObserver(() => {
      styleChatbotButton();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      const existingScript = document.getElementById("chatbot-embed");
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      observer.disconnect();
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

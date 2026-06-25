import comingSoonHtml from "../../public/comingsoon.html?raw";

export function loader() {
  return new Response(comingSoonHtml, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

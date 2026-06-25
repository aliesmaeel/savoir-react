import type { Route } from "./+types/ppsfTool";
import ppsfHtml from "public/savoir_ppsf_tool_4.html?raw";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Savoir PPSF Tool" }];
}

export default function PPSFToolPage() {
  return (
    <div className="h-screen w-full bg-[#F8F4EE]">
      <iframe
        title="Savoir PPSF Tool"
        srcDoc={ppsfHtml}
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-forms allow-modals allow-popups allow-downloads"
      />
    </div>
  );
}

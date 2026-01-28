"use client";

import { ProjectContextView } from "./ProjectContextView";
import { TechnicalView } from "./TechnicalView";
import { CommercialView } from "./CommercialView";
import { MeetingsView } from "./MeetingsView";

interface SystemFolderViewProps {
  systemView: string;
  spaceId: string;
  spaceColor?: string;
}

export function SystemFolderView({ systemView, spaceId, spaceColor }: SystemFolderViewProps) {
  switch (systemView) {
    case "context":
      return <ProjectContextView spaceId={spaceId} spaceColor={spaceColor} />;
    case "technical":
      return <TechnicalView spaceId={spaceId} spaceColor={spaceColor} />;
    case "commercial":
      return <CommercialView spaceId={spaceId} spaceColor={spaceColor} />;
    case "meetings":
      return <MeetingsView spaceId={spaceId} spaceColor={spaceColor} />;
    default:
      return <div className="text-center py-12 text-muted-foreground">Vista no reconocida: {systemView}</div>;
  }
}

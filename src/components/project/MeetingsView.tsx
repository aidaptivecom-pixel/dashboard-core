"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  Loader2,
  Video,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectContext } from "@/hooks/useProjectContext";

interface MeetingsViewProps {
  spaceId: string;
  spaceColor?: string;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function MeetingsView({ spaceId, spaceColor = "#4F6BFF" }: MeetingsViewProps) {
  const { context, loading } = useProjectContext(spaceId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter only meetings from comms_log
  const meetings = (context?.comms_log || []).filter(
    (comm) => comm.channel === "meeting"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${spaceColor}15` }}>
          <Calendar className="h-5 w-5" style={{ color: spaceColor }} />
        </div>
        <div>
          <h3 className="font-semibold">Reuniones</h3>
          <p className="text-sm text-muted-foreground">Historial de reuniones del proyecto</p>
        </div>
      </div>

      {/* Meetings List */}
      {meetings.length > 0 ? (
        <div className="space-y-4">
          {meetings.map((meeting, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 rounded-2xl border border-border bg-background hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(meeting.date)}
                  </div>
                  <h4 className="font-semibold text-lg">{meeting.summary}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Reunión</span>
                </div>
              </div>

              {meeting.outcome && (
                <div className="p-4 rounded-xl bg-muted/50 mt-4">
                  <span className="text-xs font-medium text-muted-foreground mb-2 block">
                    Resultado / Acuerdos
                  </span>
                  <p className="text-sm">{meeting.outcome}</p>
                </div>
              )}

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Registrado por {meeting.by}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h4 className="font-medium text-lg mb-2">No hay reuniones registradas</h4>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Las reuniones aparecerán aquí cuando se registren comunicaciones de tipo "reunión" 
            en la sección de Contexto o Comercial.
          </p>
        </motion.div>
      )}
    </div>
  );
}

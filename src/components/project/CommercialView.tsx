"use client";

import { motion } from "framer-motion";
import {
  Users,
  Phone,
  Mail,
  MessageSquare,
  Loader2,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectContext } from "@/hooks/useProjectContext";

interface CommercialViewProps {
  spaceId: string;
  spaceColor?: string;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CommercialView({ spaceId, spaceColor = "#4F6BFF" }: CommercialViewProps) {
  const { context, loading } = useProjectContext(spaceId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const commsLog = context?.comms_log || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${spaceColor}15` }}>
          <Users className="h-5 w-5" style={{ color: spaceColor }} />
        </div>
        <div>
          <h3 className="font-semibold">Información Comercial</h3>
          <p className="text-sm text-muted-foreground">Cliente y comunicaciones</p>
        </div>
      </div>

      {/* Client Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl border border-border bg-background"
      >
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Datos del Cliente
        </h4>

        {context?.client_name ? (
          <div className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Nombre</span>
              <p className="font-medium text-lg">{context.client_name}</p>
            </div>

            {context.client_contact && (
              <div className="grid grid-cols-2 gap-4">
                {context.client_contact.phone && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-xs text-muted-foreground">Teléfono</span>
                      <p className="font-mono text-sm">{context.client_contact.phone}</p>
                    </div>
                  </div>
                )}
                {context.client_contact.email && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-xs text-muted-foreground">Email</span>
                      <p className="text-sm">{context.client_contact.email}</p>
                    </div>
                  </div>
                )}
                {context.client_contact.telegram && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-xs text-muted-foreground">Telegram</span>
                      <p className="text-sm">{context.client_contact.telegram}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {context.client_contact?.preferred_channel && (
              <div className="text-sm">
                <span className="text-muted-foreground">Canal preferido: </span>
                <span className="font-medium">{context.client_contact.preferred_channel}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No hay datos del cliente configurados
          </p>
        )}
      </motion.div>

      {/* Communications History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl border border-border bg-background"
      >
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Historial de Comunicaciones
        </h4>

        {commsLog.length > 0 ? (
          <div className="space-y-3">
            {commsLog.map((comm, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 rounded-xl bg-muted/30 border-l-4"
                style={{ borderLeftColor: spaceColor }}
              >
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatDate(comm.date)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      comm.channel === "whatsapp" && "bg-green-500/10 text-green-600",
                      comm.channel === "email" && "bg-blue-500/10 text-blue-600",
                      comm.channel === "call" && "bg-yellow-500/10 text-yellow-600",
                      comm.channel === "meeting" && "bg-purple-500/10 text-purple-600",
                    )}>
                      {comm.channel}
                    </span>
                    <span className="text-xs text-muted-foreground">por {comm.by}</span>
                  </div>
                  <p className="text-sm">{comm.summary}</p>
                  {comm.outcome && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <span className="font-medium">Resultado:</span> {comm.outcome}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No hay comunicaciones registradas
          </p>
        )}
      </motion.div>
    </div>
  );
}

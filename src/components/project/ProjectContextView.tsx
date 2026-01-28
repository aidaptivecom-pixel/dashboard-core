"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  User,
  MessageSquare,
  ChevronRight,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectContext, ProjectContext } from "@/hooks/useProjectContext";

interface ProjectContextViewProps {
  spaceId: string;
  spaceColor?: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  planning: { label: "Planificación", color: "bg-blue-500" },
  development: { label: "En desarrollo", color: "bg-yellow-500" },
  review: { label: "En revisión", color: "bg-purple-500" },
  waiting_payment: { label: "Esperando pago", color: "bg-orange-500" },
  waiting_client: { label: "Esperando cliente", color: "bg-gray-500" },
  paused: { label: "Pausado", color: "bg-gray-400" },
  completed: { label: "Completado", color: "bg-green-500" },
  cancelled: { label: "Cancelado", color: "bg-red-500" },
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "text-red-500 bg-red-500/10",
  medium: "text-yellow-600 bg-yellow-500/10",
  low: "text-gray-500 bg-gray-500/10",
};

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return "Nunca";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return formatDate(dateString);
}

export function ProjectContextView({ spaceId, spaceColor = "#4F6BFF" }: ProjectContextViewProps) {
  const { context, loading, error, updateContext, addNextAction, removeNextAction, addCommsLog } = useProjectContext(spaceId);
  
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editSummary, setEditSummary] = useState("");
  const [showAddAction, setShowAddAction] = useState(false);
  const [newAction, setNewAction] = useState({ action: "", owner: "matias", priority: "medium" });
  const [showAddComm, setShowAddComm] = useState(false);
  const [newComm, setNewComm] = useState({ channel: "whatsapp", summary: "", outcome: "" });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 text-red-500">
        <AlertCircle className="h-5 w-5 mr-2" />
        Error: {error}
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[context?.status || "planning"];

  const handleSaveSummary = async () => {
    await updateContext({ summary: editSummary });
    setIsEditingSummary(false);
  };

  const handleAddAction = async () => {
    if (!newAction.action.trim()) return;
    await addNextAction(newAction);
    setNewAction({ action: "", owner: "matias", priority: "medium" });
    setShowAddAction(false);
  };

  const handleAddComm = async () => {
    if (!newComm.summary.trim()) return;
    await addCommsLog({
      date: new Date().toISOString(),
      channel: newComm.channel,
      summary: newComm.summary,
      outcome: newComm.outcome || undefined,
      by: "matias",
    });
    setNewComm({ channel: "whatsapp", summary: "", outcome: "" });
    setShowAddComm(false);
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl border border-border bg-background"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ backgroundColor: `${spaceColor}15` }}>
              <Activity className="h-5 w-5" style={{ color: spaceColor }} />
            </div>
            <h3 className="font-semibold">Estado del Proyecto</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Actualizado {formatTimeAgo(context?.updated_at || null)}
            {context?.updated_by && <span className="text-xs">por {context.updated_by}</span>}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3 mb-4">
          <span className={cn("px-3 py-1.5 rounded-full text-white text-sm font-medium", statusInfo.color)}>
            {statusInfo.label}
          </span>
          {context?.current_phase && (
            <span className="text-muted-foreground">
              <ChevronRight className="h-4 w-4 inline" />
              {context.current_phase}
            </span>
          )}
          <button
            onClick={() => setIsEditingStatus(!isEditingStatus)}
            className="ml-auto text-sm text-primary hover:underline"
          >
            Cambiar
          </button>
        </div>

        {/* Status Selector */}
        {isEditingStatus && (
          <div className="grid grid-cols-4 gap-2 mb-4 p-3 rounded-xl bg-muted/50">
            {Object.entries(STATUS_LABELS).map(([key, { label, color }]) => (
              <button
                key={key}
                onClick={async () => {
                  await updateContext({ status: key });
                  setIsEditingStatus(false);
                }}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium transition-all",
                  context?.status === key
                    ? "ring-2 ring-primary"
                    : "hover:bg-accent"
                )}
              >
                <span className={cn("inline-block w-2 h-2 rounded-full mr-2", color)} />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Resumen</span>
            {!isEditingSummary && (
              <button
                onClick={() => {
                  setEditSummary(context?.summary || "");
                  setIsEditingSummary(true);
                }}
                className="text-xs text-primary hover:underline"
              >
                <Edit3 className="h-3 w-3 inline mr-1" />
                Editar
              </button>
            )}
          </div>
          {isEditingSummary ? (
            <div className="space-y-2">
              <textarea
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                className="w-full p-3 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={3}
                placeholder="Describe el estado actual del proyecto..."
              />
              <div className="flex gap-2">
                <button onClick={handleSaveSummary} className="btn-primary text-sm">
                  <Check className="h-4 w-4 mr-1" />
                  Guardar
                </button>
                <button onClick={() => setIsEditingSummary(false)} className="px-3 py-1.5 text-sm hover:bg-accent rounded-lg">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm">
              {context?.summary || <span className="text-muted-foreground italic">Sin resumen</span>}
            </p>
          )}
        </div>

        {/* Next Milestone */}
        {context?.next_milestone && (
          <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
            <span className="text-xs font-medium text-primary">Próximo hito</span>
            <p className="font-medium">{context.next_milestone}</p>
            {context.next_milestone_date && (
              <p className="text-sm text-muted-foreground">{formatDate(context.next_milestone_date)}</p>
            )}
          </div>
        )}
      </motion.div>

      {/* Next Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl border border-border bg-background"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Próximas Acciones</h3>
          <button
            onClick={() => setShowAddAction(true)}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </button>
        </div>

        {showAddAction && (
          <div className="mb-4 p-4 rounded-xl bg-muted/50 space-y-3">
            <input
              type="text"
              value={newAction.action}
              onChange={(e) => setNewAction({ ...newAction, action: e.target.value })}
              placeholder="Descripción de la acción..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
            <div className="flex gap-2">
              <select
                value={newAction.owner}
                onChange={(e) => setNewAction({ ...newAction, owner: e.target.value })}
                className="px-3 py-2 rounded-lg border border-border bg-background"
              >
                <option value="matias">Matias</option>
                <option value="pulso">Pulso</option>
                <option value="closer">Closer</option>
                <option value="cliente">Cliente</option>
              </select>
              <select
                value={newAction.priority}
                onChange={(e) => setNewAction({ ...newAction, priority: e.target.value })}
                className="px-3 py-2 rounded-lg border border-border bg-background"
              >
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
              <button onClick={handleAddAction} className="btn-primary">
                <Check className="h-4 w-4" />
              </button>
              <button onClick={() => setShowAddAction(false)} className="px-3 py-2 hover:bg-accent rounded-lg">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {(context?.next_actions || []).length > 0 ? (
            context?.next_actions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-accent/50 transition-colors group"
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{action.action}</span>
                <span className="text-xs text-muted-foreground">{action.owner}</span>
                <span className={cn("text-xs px-2 py-0.5 rounded-full", PRIORITY_COLORS[action.priority || "medium"])}>
                  {action.priority === "high" ? "Alta" : action.priority === "low" ? "Baja" : "Media"}
                </span>
                <button
                  onClick={() => removeNextAction(index)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 hover:text-red-500 rounded transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No hay acciones definidas</p>
          )}
        </div>
      </motion.div>

      {/* Client Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl border border-border bg-background"
      >
        <div className="flex items-center gap-3 mb-4">
          <User className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Cliente</h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="font-medium">{context?.client_name || "Sin asignar"}</p>
            {context?.client_contact && (
              <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                {context.client_contact.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {context.client_contact.phone}
                  </span>
                )}
                {context.client_contact.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {context.client_contact.email}
                  </span>
                )}
              </div>
            )}
          </div>
          {context?.last_client_update && (
            <div className="text-right text-sm text-muted-foreground">
              <p>Último contacto</p>
              <p className="font-medium">{formatTimeAgo(context.last_client_update)}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Communications Log */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl border border-border bg-background"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Comunicaciones</h3>
          </div>
          <button
            onClick={() => setShowAddComm(true)}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Registrar
          </button>
        </div>

        {showAddComm && (
          <div className="mb-4 p-4 rounded-xl bg-muted/50 space-y-3">
            <select
              value={newComm.channel}
              onChange={(e) => setNewComm({ ...newComm, channel: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="call">Llamada</option>
              <option value="meeting">Reunión</option>
            </select>
            <input
              type="text"
              value={newComm.summary}
              onChange={(e) => setNewComm({ ...newComm, summary: e.target.value })}
              placeholder="Resumen de la comunicación..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none"
            />
            <input
              type="text"
              value={newComm.outcome}
              onChange={(e) => setNewComm({ ...newComm, outcome: e.target.value })}
              placeholder="Resultado/Acuerdo (opcional)..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none"
            />
            <div className="flex gap-2">
              <button onClick={handleAddComm} className="btn-primary">
                <Check className="h-4 w-4 mr-1" />
                Guardar
              </button>
              <button onClick={() => setShowAddComm(false)} className="px-3 py-2 hover:bg-accent rounded-lg">
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {(context?.comms_log || []).length > 0 ? (
            context?.comms_log.slice(0, 5).map((comm, index) => (
              <div key={index} className="flex gap-3 p-3 rounded-xl bg-muted/30">
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(comm.date)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent">
                      {comm.channel}
                    </span>
                    <span className="text-xs text-muted-foreground">por {comm.by}</span>
                  </div>
                  <p className="text-sm">{comm.summary}</p>
                  {comm.outcome && (
                    <p className="text-xs text-muted-foreground mt-1">→ {comm.outcome}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Sin comunicaciones registradas</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

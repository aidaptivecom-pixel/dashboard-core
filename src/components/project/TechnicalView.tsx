"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Trash2,
  Loader2,
  Globe,
  Webhook,
  Database,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectCredentials, ProjectCredential } from "@/hooks/useProjectCredentials";

interface TechnicalViewProps {
  spaceId: string;
  spaceColor?: string;
}

const CATEGORY_INFO: Record<string, { label: string; icon: any; color: string }> = {
  whatsapp: { label: "WhatsApp Business", icon: Globe, color: "text-green-500 bg-green-500/10" },
  n8n: { label: "n8n / Automatización", icon: Webhook, color: "text-orange-500 bg-orange-500/10" },
  supabase: { label: "Supabase", icon: Database, color: "text-emerald-500 bg-emerald-500/10" },
  hosting: { label: "Hosting / Servidor", icon: Server, color: "text-blue-500 bg-blue-500/10" },
  otros: { label: "Otros", icon: Key, color: "text-gray-500 bg-gray-500/10" },
};

export function TechnicalView({ spaceId, spaceColor = "#4F6BFF" }: TechnicalViewProps) {
  const { groupedCredentials, loading, addCredential, deleteCredential } = useProjectCredentials(spaceId);
  
  const [visibleValues, setVisibleValues] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCred, setNewCred] = useState({
    category: "otros",
    name: "",
    credential_type: "api_key",
    value: "",
    notes: "",
  });

  const toggleVisibility = (id: string) => {
    const next = new Set(visibleValues);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setVisibleValues(next);
  };

  const copyToClipboard = async (value: string, id: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAdd = async () => {
    if (!newCred.name.trim() || !newCred.value.trim()) return;
    await addCredential({
      ...newCred,
      visible_to: ["pulso", "closer"],
    } as any);
    setNewCred({ category: "otros", name: "", credential_type: "api_key", value: "", notes: "" });
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const categories = Object.keys(groupedCredentials).length > 0
    ? Object.keys(groupedCredentials)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ backgroundColor: `${spaceColor}15` }}>
            <Key className="h-5 w-5" style={{ color: spaceColor }} />
          </div>
          <div>
            <h3 className="font-semibold">Credenciales Técnicas</h3>
            <p className="text-sm text-muted-foreground">APIs, tokens y configuraciones</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl border border-border bg-muted/30 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Categoría</label>
              <select
                value={newCred.category}
                onChange={(e) => setNewCred({ ...newCred, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
              >
                {Object.entries(CATEGORY_INFO).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Tipo</label>
              <select
                value={newCred.credential_type}
                onChange={(e) => setNewCred({ ...newCred, credential_type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
              >
                <option value="api_key">API Key</option>
                <option value="token">Token</option>
                <option value="password">Password</option>
                <option value="url">URL</option>
                <option value="webhook">Webhook</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Nombre</label>
            <input
              type="text"
              value={newCred.name}
              onChange={(e) => setNewCred({ ...newCred, name: e.target.value })}
              placeholder="ej: Phone Number ID"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Valor</label>
            <input
              type="text"
              value={newCred.value}
              onChange={(e) => setNewCred({ ...newCred, value: e.target.value })}
              placeholder="El valor de la credencial"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Notas (opcional)</label>
            <input
              type="text"
              value={newCred.notes}
              onChange={(e) => setNewCred({ ...newCred, notes: e.target.value })}
              placeholder="Para qué se usa..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn-primary">
              <Check className="h-4 w-4 mr-1" />
              Guardar
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 hover:bg-accent rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </motion.div>
      )}

      {/* Credentials by Category */}
      {categories.length > 0 ? (
        categories.map((category) => {
          const info = CATEGORY_INFO[category] || CATEGORY_INFO.otros;
          const Icon = info.icon;
          const creds = groupedCredentials[category];

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-background overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
                <div className={cn("p-2 rounded-lg", info.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-medium">{info.label}</span>
                <span className="text-sm text-muted-foreground">({creds.length})</span>
              </div>

              <div className="divide-y divide-border">
                {creds.map((cred) => (
                  <div
                    key={cred.id}
                    className="flex items-center gap-4 p-4 hover:bg-accent/30 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{cred.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {cred.credential_type}
                        </span>
                      </div>
                      {cred.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{cred.notes}</p>
                      )}
                      <div className="mt-2 font-mono text-sm bg-muted/50 px-3 py-1.5 rounded-lg inline-block">
                        {visibleValues.has(cred.id) ? cred.value : "••••••••••••••••"}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleVisibility(cred.id)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                        title={visibleValues.has(cred.id) ? "Ocultar" : "Mostrar"}
                      >
                        {visibleValues.has(cred.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(cred.value, cred.id)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                        title="Copiar"
                      >
                        {copiedId === cred.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteCredential(cred.id)}
                        className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })
      ) : (
        <div className="text-center py-12">
          <Key className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No hay credenciales configuradas</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 text-primary hover:underline"
          >
            Agregar primera credencial
          </button>
        </div>
      )}
    </div>
  );
}

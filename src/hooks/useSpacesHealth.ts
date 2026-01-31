'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export type HealthStatus = 'active' | 'warning' | 'danger' | 'neutral';

export interface SpaceHealth {
  spaceId: string;
  status: HealthStatus;
  color: string;
  daysInactive: number;
  projectStatus: string | null;
}

// Colores de semáforo
const HEALTH_COLORS = {
  active: '#10B981',   // Verde - activo
  warning: '#F59E0B',  // Amarillo - en riesgo
  danger: '#EF4444',   // Rojo - abandonado/bloqueado
  neutral: '#6B7280',  // Gris - sin contexto
};

function calculateDaysInactive(updatedAt: string | null): number {
  if (!updatedAt) return 999;
  const updated = new Date(updatedAt);
  const now = new Date();
  const diffMs = now.getTime() - updated.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function calculateHealth(projectContext: any | null): { status: HealthStatus; daysInactive: number } {
  if (!projectContext) {
    return { status: 'neutral', daysInactive: 0 };
  }

  const daysInactive = calculateDaysInactive(projectContext.updated_at);
  const projectStatus = projectContext.status;

  // Bloqueado siempre es rojo
  if (projectStatus === 'blocked') {
    return { status: 'danger', daysInactive };
  }

  // Pausado es amarillo
  if (projectStatus === 'paused') {
    return { status: 'warning', daysInactive };
  }

  // Completado es verde
  if (projectStatus === 'completed') {
    return { status: 'active', daysInactive };
  }

  // Para activos, basamos en días de inactividad
  if (projectStatus === 'active') {
    if (daysInactive > 5) {
      return { status: 'danger', daysInactive }; // Abandonado
    }
    if (daysInactive > 3) {
      return { status: 'warning', daysInactive }; // En riesgo
    }
    return { status: 'active', daysInactive }; // Todo bien
  }

  return { status: 'neutral', daysInactive };
}

export function useSpacesHealth() {
  const [healthMap, setHealthMap] = useState<Map<string, SpaceHealth>>(new Map());
  const [loading, setLoading] = useState(true);

  const fetchHealth = useCallback(async () => {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('project_context')
      .select('space_id, status, updated_at');

    if (error) {
      console.error('Error fetching project_context:', error);
      setLoading(false);
      return;
    }

    const newMap = new Map<string, SpaceHealth>();
    
    if (data) {
      for (const ctx of data) {
        const { status, daysInactive } = calculateHealth(ctx);
        newMap.set(ctx.space_id, {
          spaceId: ctx.space_id,
          status,
          color: HEALTH_COLORS[status],
          daysInactive,
          projectStatus: ctx.status,
        });
      }
    }

    setHealthMap(newMap);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHealth();

    // Suscribirse a cambios en project_context
    const supabase = createClient();
    const channel = supabase
      .channel('project_context_health')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_context' }, () => {
        fetchHealth();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchHealth]);

  const getHealth = (spaceId: string): SpaceHealth => {
    return healthMap.get(spaceId) || {
      spaceId,
      status: 'neutral',
      color: HEALTH_COLORS.neutral,
      daysInactive: 0,
      projectStatus: null,
    };
  };

  return {
    healthMap,
    loading,
    getHealth,
    refetch: fetchHealth,
  };
}

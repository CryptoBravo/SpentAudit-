"use client";

import { useCallback, useEffect, useState } from "react";
import { INITIAL_AUDIT_STATE, type AuditFormState } from "@/types/audit";

const STORAGE_KEY = "spent-audit:v0.2";

function load(): AuditFormState {
  if (typeof window === "undefined") return INITIAL_AUDIT_STATE;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_AUDIT_STATE;
    const parsed = JSON.parse(raw) as Partial<AuditFormState>;
    return { ...INITIAL_AUDIT_STATE, ...parsed };
  } catch {
    return INITIAL_AUDIT_STATE;
  }
}

function save(state: AuditFormState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private mode */
  }
}

export function useAuditSession() {
  const [data, setData] = useState<AuditFormState>(INITIAL_AUDIT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    save(data);
  }, [data, hydrated]);

  const update = useCallback((patch: Partial<AuditFormState>) => {
    setData((d) => ({ ...d, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setData(INITIAL_AUDIT_STATE);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { data, update, reset, hydrated };
}

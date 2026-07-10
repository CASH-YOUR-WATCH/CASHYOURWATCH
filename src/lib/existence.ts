/**
 * Lógica compartida de la prueba de existencia. El estado se deriva de las
 * fechas y de si ya hay foto — no se guarda en la base.
 */

export type ExistenceProof = {
  id: string;
  window_start: string;
  window_end: string;
  instrucciones: string | null;
  storage_path: string | null;
  responded_at: string | null;
  created_at: string;
};

export type ProofStateKey =
  | "programada"
  | "abierta"
  | "vencida"
  | "enviada"
  | "enviada_tarde";

export type ProofState = {
  key: ProofStateKey;
  label: string;
  /** true si el usuario aún puede subir la foto ahora mismo. */
  puedeResponder: boolean;
};

export function proofState(p: ExistenceProof, nowMs: number): ProofState {
  const start = new Date(p.window_start).getTime();
  const end = new Date(p.window_end).getTime();

  if (p.storage_path) {
    const onTime = p.responded_at
      ? new Date(p.responded_at).getTime() <= end
      : true;
    return onTime
      ? { key: "enviada", label: "Enviada a tiempo", puedeResponder: false }
      : {
          key: "enviada_tarde",
          label: "Enviada fuera de la ventana",
          puedeResponder: false,
        };
  }
  if (nowMs > end) return { key: "vencida", label: "Vencida", puedeResponder: false };
  if (nowMs < start)
    return { key: "programada", label: "Programada", puedeResponder: false };
  return { key: "abierta", label: "Abierta — responde ahora", puedeResponder: true };
}

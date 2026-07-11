/**
 * Tipos del esquema de la base de datos.
 *
 * Escritos a mano para reflejar la migración inicial
 * (supabase/migrations/20260617121300_init_schema.sql). Son la fuente de
 * verdad de tipos para los clientes de Supabase.
 *
 * Cuando configuremos `supabase login` + `link`, este archivo se podrá
 * regenerar automáticamente con:
 *   pnpm supabase gen types typescript --linked > src/lib/supabase/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ApplicationStatus =
  | "recibida"
  | "en_revision"
  | "preaprobada"
  | "cita_agendada"
  | "formalizada"
  | "rechazada";

export type DueDiligence = "pendiente" | "verificado" | "alerta";

export type ContraofertaStatus =
  | "ninguna"
  | "pendiente"
  | "aceptada"
  | "rechazada";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nombre: string | null;
          telefono: string | null;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          nombre?: string | null;
          telefono?: string | null;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string | null;
          telefono?: string | null;
          role?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      applications: {
        Row: {
          id: string;
          folio: string;
          user_id: string;
          marca: string;
          modelo: string;
          numero_referencia: string | null;
          anio_fabricacion: number | null;
          diametro_mm: number | null;
          atributos_extra: string | null;
          tiene_caja: boolean;
          tiene_papeles: boolean;
          tiene_ajustadores: boolean;
          full_set: boolean;
          estado_reloj: string;
          valor_estimado: number | null;
          monto_deseado: number | null;
          declaracion_licitud: boolean;
          due_diligence: DueDiligence;
          prueba_hora: string | null;
          monto_contraoferta: number | null;
          contraoferta_status: ContraofertaStatus;
          contraoferta_at: string | null;
          contraoferta_respondida_at: string | null;
          guia_paqueteria: string | null;
          guia_tracking: string | null;
          guia_storage_path: string | null;
          monto_asegurado: number | null;
          status: ApplicationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          folio?: string;
          user_id: string;
          marca: string;
          modelo: string;
          numero_referencia?: string | null;
          anio_fabricacion?: number | null;
          diametro_mm?: number | null;
          atributos_extra?: string | null;
          tiene_caja?: boolean;
          tiene_papeles?: boolean;
          tiene_ajustadores?: boolean;
          full_set?: boolean;
          estado_reloj: string;
          valor_estimado?: number | null;
          monto_deseado?: number | null;
          declaracion_licitud?: boolean;
          due_diligence?: DueDiligence;
          prueba_hora?: string | null;
          monto_contraoferta?: number | null;
          contraoferta_status?: ContraofertaStatus;
          contraoferta_at?: string | null;
          contraoferta_respondida_at?: string | null;
          guia_paqueteria?: string | null;
          guia_tracking?: string | null;
          guia_storage_path?: string | null;
          monto_asegurado?: number | null;
          status?: ApplicationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          folio?: string;
          user_id?: string;
          marca?: string;
          modelo?: string;
          numero_referencia?: string | null;
          anio_fabricacion?: number | null;
          diametro_mm?: number | null;
          atributos_extra?: string | null;
          tiene_caja?: boolean;
          tiene_papeles?: boolean;
          tiene_ajustadores?: boolean;
          full_set?: boolean;
          estado_reloj?: string;
          valor_estimado?: number | null;
          monto_deseado?: number | null;
          declaracion_licitud?: boolean;
          due_diligence?: DueDiligence;
          prueba_hora?: string | null;
          monto_contraoferta?: number | null;
          contraoferta_status?: ContraofertaStatus;
          contraoferta_at?: string | null;
          contraoferta_respondida_at?: string | null;
          guia_paqueteria?: string | null;
          guia_tracking?: string | null;
          guia_storage_path?: string | null;
          monto_asegurado?: number | null;
          status?: ApplicationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "applications_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      application_files: {
        Row: {
          id: string;
          application_id: string;
          tipo: string;
          storage_path: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          tipo: string;
          storage_path: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          tipo?: string;
          storage_path?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "application_files_application_id_fkey";
            columns: ["application_id"];
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
        ];
      };
      application_status_history: {
        Row: {
          id: string;
          application_id: string;
          status: ApplicationStatus;
          nota: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          status: ApplicationStatus;
          nota?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          status?: ApplicationStatus;
          nota?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "application_status_history_application_id_fkey";
            columns: ["application_id"];
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
        ];
      };
      application_notes: {
        Row: {
          id: string;
          application_id: string;
          nota: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          nota: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          nota?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "application_notes_application_id_fkey";
            columns: ["application_id"];
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
        ];
      };
      existence_proofs: {
        Row: {
          id: string;
          application_id: string;
          window_start: string;
          window_end: string;
          instrucciones: string | null;
          storage_path: string | null;
          responded_at: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          window_start: string;
          window_end: string;
          instrucciones?: string | null;
          storage_path?: string | null;
          responded_at?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          window_start?: string;
          window_end?: string;
          instrucciones?: string | null;
          storage_path?: string | null;
          responded_at?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "existence_proofs_application_id_fkey";
            columns: ["application_id"];
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
        ];
      };
      logistics_events: {
        Row: {
          id: string;
          application_id: string;
          etapa: string;
          nota: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          etapa: string;
          nota?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          etapa?: string;
          nota?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "logistics_events_application_id_fkey";
            columns: ["application_id"];
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
        ];
      };
      heartbeat: {
        Row: {
          id: number;
          last_ping: string;
        };
        Insert: {
          id?: number;
          last_ping?: string;
        };
        Update: {
          id?: number;
          last_ping?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      application_status: ApplicationStatus;
    };
    CompositeTypes: Record<never, never>;
  };
};

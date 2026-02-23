export type ReorganisationType = 'unitary_creation' | 'merger' | 'boundary_change' | 'abolition';

export type ReorganisationStatus = 'completed' | 'proposed' | 'cancelled';

export interface LGRReorganisation {
  id: string;
  name: string;
  year: number;
  type: ReorganisationType;
  description: string | null;
  councils_involved: string[];
  effective_date: string | null;
  status: ReorganisationStatus;
  name_before?: string | null;
  name_after?: string | null;
  merger_headline?: string | null;
  current_status?: string | null;
  created_at: string;
  updated_at: string;
}

export const REORGANISATION_TYPE_LABELS: Record<ReorganisationType, string> = {
  unitary_creation: 'Unitary Authority Creation',
  merger: 'Council Merger',
  boundary_change: 'Boundary Change',
  abolition: 'Council Abolition',
};

/** Reason text as used on the Reorganisations page (includes two-tier/unitary nuance). */
export const REORGANISATION_REASON_LABELS: Record<ReorganisationType, string> = {
  boundary_change: 'Boundary Change',
  merger: 'Council Merger (Two-tier system retained)',
  unitary_creation: 'Unitary Authority Creation (Council Merger & Abolition)',
  abolition: 'Council Abolition',
};

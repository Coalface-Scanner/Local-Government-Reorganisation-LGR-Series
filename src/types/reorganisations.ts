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
  created_at: string;
  updated_at: string;
}

export const REORGANISATION_TYPE_LABELS: Record<ReorganisationType, string> = {
  unitary_creation: 'Unitary Authority Creation',
  merger: 'Council Merger',
  boundary_change: 'Boundary Change',
  abolition: 'Council Abolition',
};

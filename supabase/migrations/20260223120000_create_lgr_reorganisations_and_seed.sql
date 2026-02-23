/*
  # Create LGR Reorganisations table and seed (2012–2025)

  - Creates `lgr_reorganisations` table for the Reorganisations page
  - Seeds Minor Boundary Changes (2012–2025) and Major Structural Changes (mergers & unitaries)
  - Table matches src/types/reorganisations.ts (LGRReorganisation)
*/

-- Create table (skip if already present)
CREATE TABLE IF NOT EXISTS lgr_reorganisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  year integer NOT NULL,
  type text NOT NULL CHECK (type IN ('unitary_creation', 'merger', 'boundary_change', 'abolition')),
  description text,
  councils_involved text[] DEFAULT '{}',
  effective_date date,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'proposed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Allow public read
ALTER TABLE lgr_reorganisations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view lgr reorganisations"
  ON lgr_reorganisations FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated writes (e.g. admin)
CREATE POLICY "Authenticated users can insert lgr reorganisations"
  ON lgr_reorganisations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update lgr reorganisations"
  ON lgr_reorganisations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete lgr reorganisations"
  ON lgr_reorganisations FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_lgr_reorganisations_year ON lgr_reorganisations(year DESC);
CREATE INDEX IF NOT EXISTS idx_lgr_reorganisations_type ON lgr_reorganisations(type);

-- Seed: Minor Boundary Changes (1–4) and Major Structural Changes (5–16)
-- Use ON CONFLICT only if we add a unique constraint; for first run we just INSERT.
INSERT INTO lgr_reorganisations (name, year, type, description, councils_involved, effective_date, status) VALUES

-- 1. Welwyn Hatfield / St Albans
('Welwyn Hatfield / St Albans', 2012, 'boundary_change',
 'A minor boundary realignment to resolve anomalies where a housing development crossed historic council borders. Current status: Both councils continue to operate normally under their adjusted borders within the Hertfordshire two-tier system.',
 ARRAY['Welwyn Hatfield Borough Council', 'St Albans City and District Council'],
 NULL, 'completed'),

-- 2. Gateshead / Northumberland
('Gateshead / Northumberland', 2013, 'boundary_change',
 'A micro-boundary adjustment to correct a historic anomaly where a handful of properties sat precisely on the boundary line. Current status: Fully resolved; administrative boundaries now accurately match property lines.',
 ARRAY['Gateshead Metropolitan Borough Council', 'Northumberland County Council'],
 NULL, 'completed'),

-- 3. East Hertfordshire / Stevenage
('East Hertfordshire / Stevenage', 2013, 'boundary_change',
 'A land transfer to Stevenage to accommodate urban expansion and new housing developments stretching into East Hertfordshire. Current status: Fully integrated, allowing Stevenage to effectively manage its required housing allocations.',
 ARRAY['East Hertfordshire District Council', 'Stevenage Borough Council'],
 NULL, 'completed'),

-- 4. Barnsley / Sheffield
('Barnsley / Sheffield', 2025, 'boundary_change',
 'A highly localised boundary change to transfer the newly built Oughtibridge Mill housing development entirely into Sheffield''s jurisdiction. Current status: The boundary change legally takes effect in April 2025, simplifying council tax and refuse collection for residents in the development.',
 ARRAY['Barnsley Metropolitan Borough Council', 'Sheffield City Council'],
 '2025-04-01', 'completed'),

-- 5. East Suffolk Council
('East Suffolk Council', 2019, 'merger',
 'A "super-district" merger of two coastal authorities that had already been sharing a workforce for a decade, creating the largest district council by population in the country. Current status: Operating stably, the council is heavily focused on mitigating coastal erosion and managing the local impacts of the major Sizewell C nuclear project.',
 ARRAY['Suffolk Coastal District Council', 'Waveney District Council'],
 NULL, 'completed'),

-- 6. West Suffolk Council
('West Suffolk Council', 2019, 'merger',
 'United the rural heartlands and historic towns of West Suffolk to share management, reduce back-office costs, and streamline local planning. Current status: Functioning well, the council is maintaining a stable financial position while actively pursuing local economic and housing growth along the A14 corridor.',
 ARRAY['Forest Heath District Council', 'St Edmundsbury Borough Council'],
 NULL, 'completed'),

-- 7. Somerset West and Taunton Council
('Somerset West and Taunton Council', 2019, 'merger',
 'A proactive district-level merger intended to cut administrative costs and financially bail out the heavily constrained, sparsely populated West Somerset council. Current status: Abolished. The merged council was short-lived and existed for only four years before being entirely absorbed into the new county-wide Somerset Council in 2023.',
 ARRAY['Taunton Deane Borough Council', 'West Somerset District Council'],
 NULL, 'completed'),

-- 8. Bournemouth, Christchurch and Poole (BCP) Council
('Bournemouth, Christchurch and Poole Council', 2019, 'unitary_creation',
 'A highly contentious coastal merger designed to streamline services and save costs, pushed through by the government despite fierce initial resistance from Christchurch. Current status: Facing severe financial difficulties. The council is battling a massive historic deficit in Special Educational Needs and Disabilities (SEND) funding and is relying on government statutory overrides to avoid a Section 114 bankruptcy notice.',
 ARRAY['Bournemouth Borough Council', 'Christchurch Borough Council', 'Poole Borough Council'],
 NULL, 'completed'),

-- 9. Dorset Council
('Dorset Council', 2019, 'unitary_creation',
 'Consolidated rural Dorset''s complex two-tier system into a single unitary authority to bridge funding gaps and simplify service delivery. Current status: Stable but cautious. The council is faring relatively well financially compared to its peers, having successfully delivered its planned merger savings, though it continues to manage typical rural social care pressures.',
 ARRAY['Dorset County Council', 'East Dorset District Council', 'North Dorset District Council', 'Purbeck District Council', 'West Dorset District Council', 'Weymouth and Portland Borough Council'],
 NULL, 'completed'),

-- 10. Buckinghamshire Council
('Buckinghamshire Council', 2020, 'unitary_creation',
 'A massive super-unitary formed to save millions annually, following a bitter, years-long political battle between the county council and independent districts. Current status: Operationally solid but feeling the strain. The council has delivered over £116m in savings over its first five years but continues to wrestle with severe multi-million-pound budget pressures in adult social care.',
 ARRAY['Buckinghamshire County Council', 'Aylesbury Vale District Council', 'Chiltern District Council', 'South Bucks District Council', 'Wycombe District Council'],
 NULL, 'completed'),

-- 11. North Northamptonshire Council
('North Northamptonshire Council', 2021, 'unitary_creation',
 'Born out of crisis, taking over the northern half of the county as a government-mandated rescue package after the spectacular financial collapse of the former County Council in 2018. Current status: Stabilising legacy debts. The council is navigating difficult budgets by balancing necessary service cuts against rising demand for adult social care, while children''s services run via an independent trust.',
 ARRAY['Northamptonshire County Council', 'Corby Borough Council', 'East Northamptonshire District Council', 'Kettering Borough Council', 'Wellingborough Borough Council'],
 NULL, 'completed'),

-- 12. West Northamptonshire Council
('West Northamptonshire Council', 2021, 'unitary_creation',
 'The second unitary created to replace the bankrupt Northamptonshire County Council, taking over the western half of the county to restore financial competence. Current status: Facing severe funding pressures. The council is working hard to close recurring in-year budget gaps driven by a massive surge in social care demands and special educational needs costs.',
 ARRAY['Northamptonshire County Council', 'Daventry District Council', 'Northampton Borough Council', 'South Northamptonshire Council'],
 NULL, 'completed'),

-- 13. Cumberland Council
('Cumberland Council', 2023, 'unitary_creation',
 'Split the geographically massive historic county of Cumbria in two, taking the western half to create a new unitary authority focused on industrial regeneration and the nuclear sector. Current status: Driving major transformation. The council is undertaking a comprehensive transformation plan but has required "Exceptional Financial Support" from the government to balance its initial budgets.',
 ARRAY['Cumbria County Council', 'Allerdale Borough Council', 'Carlisle City Council', 'Copeland Borough Council'],
 NULL, 'completed'),

-- 14. Westmorland and Furness Council
('Westmorland and Furness Council', 2023, 'unitary_creation',
 'The eastern/southern half of the Cumbria split, uniting the Lake District heartlands with the industrial port of Barrow to tackle unique rural and demographic challenges. Current status: Consolidating services. Faring relatively better financially than its Cumberland neighbour, the council is focused on balancing the economic boom from Barrow''s submarine shipyards with a severe affordable housing crisis in the Lake District.',
 ARRAY['Cumbria County Council', 'Barrow-in-Furness Borough Council', 'Eden District Council', 'South Lakeland District Council'],
 NULL, 'completed'),

-- 15. North Yorkshire Council
('North Yorkshire Council', 2023, 'unitary_creation',
 'Created England''s largest single unitary authority by geographical area, swallowing a county and seven districts specifically to simplify services and unlock a regional devolution deal. Current status: Battling a structural deficit. Having successfully unlocked a Mayoral devolution deal, the council is now warning of significant funding shortfalls driven by the vast costs of rural service delivery and the loss of rural service grants.',
 ARRAY['North Yorkshire County Council', 'Craven District Council', 'Hambleton District Council', 'Harrogate Borough Council', 'Richmondshire District Council', 'Ryedale District Council', 'Scarborough Borough Council', 'Selby District Council'],
 NULL, 'completed'),

-- 16. Somerset Council
('Somerset Council', 2023, 'unitary_creation',
 'A massive county-wide consolidation that replaced the county and four district councils to address a looming financial cliff-edge and unify fragmented public services. Current status: In a financial emergency. The council is currently relying on tens of millions of pounds in "Exceptional Financial Support" from the government and massive asset sales to avoid issuing a Section 114 bankruptcy notice.',
 ARRAY['Somerset County Council', 'Mendip District Council', 'Sedgemoor District Council', 'Somerset West and Taunton Council', 'South Somerset District Council'],
 NULL, 'completed');

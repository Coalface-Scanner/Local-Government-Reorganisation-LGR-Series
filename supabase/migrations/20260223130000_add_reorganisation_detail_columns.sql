/*
  # Add detail columns to lgr_reorganisations and populate with full content

  - Adds name_before, name_after, merger_headline, current_status for rich display
  - Updates all 16 seeded reorganisations with the exact copy for the Reorganisations page
*/

ALTER TABLE lgr_reorganisations
  ADD COLUMN IF NOT EXISTS name_before text,
  ADD COLUMN IF NOT EXISTS name_after text,
  ADD COLUMN IF NOT EXISTS merger_headline text,
  ADD COLUMN IF NOT EXISTS current_status text;

-- 1. Welwyn Hatfield / St Albans
UPDATE lgr_reorganisations SET
  name_before = 'Welwyn Hatfield Borough Council, St Albans City and District Council',
  name_after = 'St Albans City and District Council (Small area transferred)',
  merger_headline = 'A minor boundary realignment to resolve anomalies where a housing development crossed historic council borders.',
  current_status = 'Both councils continue to operate normally under their adjusted borders within the Hertfordshire two-tier system.'
WHERE name = 'Welwyn Hatfield / St Albans' AND year = 2012;

-- 2. Gateshead / Northumberland
UPDATE lgr_reorganisations SET
  name_before = 'Gateshead Metropolitan Borough Council, Northumberland County Council',
  name_after = 'Northumberland County Council and Gateshead Metropolitan Borough Council (Realignment)',
  merger_headline = 'A micro-boundary adjustment to correct a historic anomaly where a handful of properties sat precisely on the boundary line.',
  current_status = 'Fully resolved; administrative boundaries now accurately match property lines.'
WHERE name = 'Gateshead / Northumberland' AND year = 2013;

-- 3. East Hertfordshire / Stevenage
UPDATE lgr_reorganisations SET
  name_before = 'East Hertfordshire District Council, Stevenage Borough Council',
  name_after = 'Stevenage Borough Council (Small area transferred)',
  merger_headline = 'A land transfer to Stevenage to accommodate urban expansion and new housing developments stretching into East Hertfordshire.',
  current_status = 'Fully integrated, allowing Stevenage to effectively manage its required housing allocations.'
WHERE name = 'East Hertfordshire / Stevenage' AND year = 2013;

-- 4. Barnsley / Sheffield
UPDATE lgr_reorganisations SET
  name_before = 'Barnsley Metropolitan Borough Council, Sheffield City Council',
  name_after = 'Sheffield City Council (Small area transferred)',
  merger_headline = 'A highly localised boundary change to transfer the newly built Oughtibridge Mill housing development entirely into Sheffield''s jurisdiction.',
  current_status = 'The boundary change legally takes effect in April 2025, simplifying council tax and refuse collection for residents in the development.'
WHERE name = 'Barnsley / Sheffield' AND year = 2025;

-- 5. East Suffolk Council
UPDATE lgr_reorganisations SET
  name_before = 'Suffolk Coastal District Council, Waveney District Council',
  name_after = 'East Suffolk Council',
  merger_headline = 'A "super-district" merger of two coastal authorities that had already been sharing a workforce for a decade, creating the largest district council by population in the country.',
  current_status = 'Operating stably, the council is heavily focused on mitigating coastal erosion and managing the local impacts of the major Sizewell C nuclear project.'
WHERE name = 'East Suffolk Council' AND year = 2019;

-- 6. West Suffolk Council
UPDATE lgr_reorganisations SET
  name_before = 'Forest Heath District Council, St Edmundsbury Borough Council',
  name_after = 'West Suffolk Council',
  merger_headline = 'United the rural heartlands and historic towns of West Suffolk to share management, reduce back-office costs, and streamline local planning.',
  current_status = 'Functioning well, the council is maintaining a stable financial position while actively pursuing local economic and housing growth along the A14 corridor.'
WHERE name = 'West Suffolk Council' AND year = 2019;

-- 7. Somerset West and Taunton Council
UPDATE lgr_reorganisations SET
  name_before = 'Taunton Deane Borough Council, West Somerset District Council',
  name_after = 'Somerset West and Taunton Council',
  merger_headline = 'A proactive district-level merger intended to cut administrative costs and financially bail out the heavily constrained, sparsely populated West Somerset council.',
  current_status = 'Abolished. The merged council was short-lived and existed for only four years before being entirely absorbed into the new county-wide Somerset Council in 2023.'
WHERE name = 'Somerset West and Taunton Council' AND year = 2019;

-- 8. Bournemouth, Christchurch and Poole (BCP) Council
UPDATE lgr_reorganisations SET
  name_before = 'Bournemouth Borough Council, Christchurch Borough Council, Poole Borough Council',
  name_after = 'Bournemouth, Christchurch and Poole Council',
  merger_headline = 'A highly contentious coastal merger designed to streamline services and save costs, pushed through by the government despite fierce initial resistance from Christchurch.',
  current_status = 'Facing severe financial difficulties. The council is battling a massive historic deficit in Special Educational Needs and Disabilities (SEND) funding and is relying on government statutory overrides to avoid a Section 114 bankruptcy notice.'
WHERE name = 'Bournemouth, Christchurch and Poole Council' AND year = 2019;

-- 9. Dorset Council
UPDATE lgr_reorganisations SET
  name_before = 'Dorset County Council, East Dorset District Council, North Dorset District Council, Purbeck District Council, West Dorset District Council, Weymouth and Portland Borough Council',
  name_after = 'Dorset Council',
  merger_headline = 'Consolidated rural Dorset''s complex two-tier system into a single unitary authority to bridge funding gaps and simplify service delivery.',
  current_status = 'Stable but cautious. The council is faring relatively well financially compared to its peers, having successfully delivered its planned merger savings, though it continues to manage typical rural social care pressures.'
WHERE name = 'Dorset Council' AND year = 2019;

-- 10. Buckinghamshire Council
UPDATE lgr_reorganisations SET
  name_before = 'Buckinghamshire County Council, Aylesbury Vale District Council, Chiltern District Council, South Bucks District Council, Wycombe District Council',
  name_after = 'Buckinghamshire Council',
  merger_headline = 'A massive super-unitary formed to save millions annually, following a bitter, years-long political battle between the county council and independent districts.',
  current_status = 'Operationally solid but feeling the strain. The council has delivered over £116m in savings over its first five years but continues to wrestle with severe multi-million-pound budget pressures in adult social care.'
WHERE name = 'Buckinghamshire Council' AND year = 2020;

-- 11. North Northamptonshire Council
UPDATE lgr_reorganisations SET
  name_before = 'Northamptonshire County Council, Corby Borough Council, East Northamptonshire District Council, Kettering Borough Council, Wellingborough Borough Council',
  name_after = 'North Northamptonshire Council',
  merger_headline = 'Born out of crisis, taking over the northern half of the county as a government-mandated rescue package after the spectacular financial collapse of the former County Council in 2018.',
  current_status = 'Stabilising legacy debts. The council is navigating difficult budgets by balancing necessary service cuts against rising demand for adult social care, while children''s services run via an independent trust.'
WHERE name = 'North Northamptonshire Council' AND year = 2021;

-- 12. West Northamptonshire Council
UPDATE lgr_reorganisations SET
  name_before = 'Northamptonshire County Council, Daventry District Council, Northampton Borough Council, South Northamptonshire Council',
  name_after = 'West Northamptonshire Council',
  merger_headline = 'The second unitary created to replace the bankrupt Northamptonshire County Council, taking over the western half of the county to restore financial competence.',
  current_status = 'Facing severe funding pressures. The council is working hard to close recurring in-year budget gaps driven by a massive surge in social care demands and special educational needs costs.'
WHERE name = 'West Northamptonshire Council' AND year = 2021;

-- 13. Cumberland Council
UPDATE lgr_reorganisations SET
  name_before = 'Cumbria County Council, Allerdale Borough Council, Carlisle City Council, Copeland Borough Council',
  name_after = 'Cumberland Council',
  merger_headline = 'Split the geographically massive historic county of Cumbria in two, taking the western half to create a new unitary authority focused on industrial regeneration and the nuclear sector.',
  current_status = 'Driving major transformation. The council is undertaking a comprehensive transformation plan but has required "Exceptional Financial Support" from the government to balance its initial budgets.'
WHERE name = 'Cumberland Council' AND year = 2023;

-- 14. Westmorland and Furness Council
UPDATE lgr_reorganisations SET
  name_before = 'Cumbria County Council, Barrow-in-Furness Borough Council, Eden District Council, South Lakeland District Council',
  name_after = 'Westmorland and Furness Council',
  merger_headline = 'The eastern/southern half of the Cumbria split, uniting the Lake District heartlands with the industrial port of Barrow to tackle unique rural and demographic challenges.',
  current_status = 'Consolidating services. Faring relatively better financially than its Cumberland neighbour, the council is focused on balancing the economic boom from Barrow''s submarine shipyards with a severe affordable housing crisis in the Lake District.'
WHERE name = 'Westmorland and Furness Council' AND year = 2023;

-- 15. North Yorkshire Council
UPDATE lgr_reorganisations SET
  name_before = 'North Yorkshire County Council, Craven District Council, Hambleton District Council, Harrogate Borough Council, Richmondshire District Council, Ryedale District Council, Scarborough Borough Council, Selby District Council',
  name_after = 'North Yorkshire Council',
  merger_headline = 'Created England''s largest single unitary authority by geographical area, swallowing a county and seven districts specifically to simplify services and unlock a regional devolution deal.',
  current_status = 'Battling a structural deficit. Having successfully unlocked a Mayoral devolution deal, the council is now warning of significant funding shortfalls driven by the vast costs of rural service delivery and the loss of rural service grants.'
WHERE name = 'North Yorkshire Council' AND year = 2023;

-- 16. Somerset Council
UPDATE lgr_reorganisations SET
  name_before = 'Somerset County Council, Mendip District Council, Sedgemoor District Council, Somerset West and Taunton Council, South Somerset District Council',
  name_after = 'Somerset Council',
  merger_headline = 'A massive county-wide consolidation that replaced the county and four district councils to address a looming financial cliff-edge and unify fragmented public services.',
  current_status = 'In a financial emergency. The council is currently relying on tens of millions of pounds in "Exceptional Financial Support" from the government and massive asset sales to avoid issuing a Section 114 bankruptcy notice.'
WHERE name = 'Somerset Council' AND year = 2023;

-- ==============================================
-- Migration 004: Optionale Promillewert-Spalte in party_members
-- ==============================================

-- Ermöglicht es Nutzern, ihren berechneten Promillewert (ohne Körperdaten!)
-- freiwillig für die Party-Rangliste freizugeben.
alter table public.party_members
add column if not exists current_bac numeric;

-- ==========================================
-- AlcoholTracker 2.0: Party Password / Symbol Code
-- ==========================================

-- Spalte symbol_code hinzufügen falls noch nicht vorhanden
ALTER TABLE public.parties 
ADD COLUMN IF NOT EXISTS symbol_code text DEFAULT NULL;

COMMENT ON COLUMN public.parties.symbol_code IS 'Optionaler 4-stelliger Symbol-Code (z.B. spade,heart,spade,club) für passwortgeschützte Partys';

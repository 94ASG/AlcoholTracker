-- ====================================================================
-- AlcoholTracker 2.0: pg_cron & pg_net Setup für automatische Party-Beendigung
-- ====================================================================
-- Dieser Job läuft alle 5 Minuten und ruft die Edge Function "end-parties" auf,
-- wenn eine Party ends_at erreicht hat und noch nicht beendet wurde.

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Funktion zum Beenden abgelaufener Partys direkt in Postgres
create or replace function public.check_and_end_expired_parties()
returns table (ended_count int) as $$
declare
  v_count int;
begin
  update public.parties
  set ended_at = now()
  where ended_at is null
    and ends_at <= now();
    
  get diagnostics v_count = row_count;
  return query select v_count;
end;
$$ language plpgsql;

-- Cronjob alle 5 Minuten
select cron.schedule(
  'auto-end-parties',
  '*/5 * * * *',
  $$select public.check_and_end_expired_parties();$$
);

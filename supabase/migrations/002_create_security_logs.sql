-- Create security_logs table for audit trail
create table if not exists public.security_logs (
  id uuid default gen_random_uuid() primary key,
  event_type text not null check (event_type in (
    'login_attempt', 'login_success', 'login_failure', 'logout', 
    'password_reset', 'trade_created', 'trade_updated', 'trade_deleted', 
    'unauthorized_access'
  )),
  user_id uuid references auth.users(id) on delete set null,
  ip_address inet,
  user_agent text,
  metadata jsonb default '{}',
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index if not exists idx_security_logs_event_type on public.security_logs(event_type);
create index if not exists idx_security_logs_user_id on public.security_logs(user_id);
create index if not exists idx_security_logs_created_at on public.security_logs(created_at);
create index if not exists idx_security_logs_severity on public.security_logs(severity);

-- RLS policies for security_logs
alter table public.security_logs enable row level security;

-- Only allow service role to insert security logs
create policy "Service role can insert security logs" on public.security_logs
  for insert to service_role
  with check (true);

-- Users can only view their own security logs
create policy "Users can view own security logs" on public.security_logs
  for select using (auth.uid() = user_id);

-- Admins can view all security logs (if you have admin role system)
-- create policy "Admins can view all security logs" on public.security_logs
--   for select using (
--     exists (
--       select 1 from public.user_roles 
--       where user_id = auth.uid() and role = 'admin'
--     )
--   );

-- Create a function to automatically clean old security logs (optional)
create or replace function public.cleanup_old_security_logs()
returns void
language plpgsql
security definer
as $$
begin
  delete from public.security_logs 
  where created_at < now() - interval '90 days';
end;
$$;

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant select on public.security_logs to authenticated;
grant insert on public.security_logs to service_role;
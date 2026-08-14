-- Add ai_key_iv column to store the IV for AES-GCM encrypted API keys.

alter table user_settings add column if not exists ai_key_iv text;

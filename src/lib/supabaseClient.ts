import { createClient } from '@supabase/supabase-js';

// URL e chave publica (anon) do projeto Supabase do LabSul.
// A anon key e feita para ser publica: ela so funciona dentro das
// regras de Row Level Security (RLS) configuradas no banco.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
          'Supabase nao configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas variaveis de ambiente.'
        );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

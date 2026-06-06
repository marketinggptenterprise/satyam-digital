import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wgpkaxmmuzspnkzavpln.supabase.co';
const supabaseAnonKey = 'sb_publishable_TdwblGj1kMYIs1qlVGWikA_K2RJG43h';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
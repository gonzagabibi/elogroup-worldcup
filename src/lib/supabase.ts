import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nzlhiekcvstxjeglniqy.supabase.co'
const supabaseKey = 'sb_publishable_SbqH3Lmjb1Xkp1oC9DuNpw_XFoC7kFk'

export const supabase = createClient(supabaseUrl, supabaseKey)
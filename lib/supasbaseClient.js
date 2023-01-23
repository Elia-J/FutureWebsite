import { createClient } from "@supabase/supabase-js"

//This supabase client is using the server role key which is stored in the .env file, this key gives the client access to all the tables in the database and is used for server side functions only, it is not used for the client side, because the key needs to be kept secret.

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const supabaseAdmin = () =>
    createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SERVER_ROLE_SUPABASE_KEY
        , {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )


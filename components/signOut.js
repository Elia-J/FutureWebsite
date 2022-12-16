// import React from 'react'
// import { useRouter } from 'next/router'

// import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
// export default function SignOut() {
//     const session = useSession()
//     const supabase = useSupabaseClient()
//     const router = useRouter()

//     //sign out function
//     async function handleSignOut() {
//         const { error } = await supabase.auth.signOut()
//         if (error) alert(error.message)
//         if (!error) {
//             //redirect to home page using next router
//             router.push("/")
//         }
//     }

//     return (
//         <button onClick={handleSignOut} >
//             Sign Out
//         </button>
//     )
// }

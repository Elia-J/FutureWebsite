import '../styles/globals.scss'
import { ThemeProvider } from 'next-themes'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs' //importing the supabase client
import { SessionContextProvider } from '@supabase/auth-helpers-react' //Importing the session context provider from the 
import { useState } from 'react'

import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

// Fonts Inter
import { Inter } from '@next/font/google'
const inter = Inter({
  subsets: ['latin'],
})
import { StateProvider } from "/layouts/stateStore"


function MyApp({ Component, pageProps }) {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(
    <StateProvider>

      <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession} >
        <ThemeProvider forcedTheme={Component.theme || null} defaultTheme="light">

          <main className={inter.className}>
            <Component {...pageProps} />
          </main>

        </ThemeProvider>
      </SessionContextProvider>

    </StateProvider>
  )
}

export default MyApp


// Test.getLayout = function getLayout(page) {
//   return (
//       <TestLayout>
//           <TestLayout2>
//               {page}
//           </TestLayout2>
//       </TestLayout>
//   )
// }
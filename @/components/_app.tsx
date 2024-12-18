import type { AppProps } from 'next/app'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from '@/contexts/auth-context'
import '@/styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default MyApp


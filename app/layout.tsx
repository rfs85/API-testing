import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { ThemeProvider } from "components/theme-provider"
import { ModeToggle } from "components/mode-toggle"
import { AuthProvider } from 'contexts/auth-context'
import { UserMenu } from 'components/user-menu'
import { ToastProvider } from "components/ui/toast"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Google API Testing Suite',
  description: 'Test and analyze various Google APIs',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ToastProvider>
              <div className="min-h-screen bg-background flex flex-col">
                <header className="sticky top-0 z-40 w-full border-b bg-background">
                  <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                    <div className="flex gap-6 md:gap-10">
                      <Link href="/" className="flex items-center space-x-2">
                        <span className="inline-block font-bold">Google API Testing Suite</span>
                      </Link>
                      <nav className="flex gap-6">
                        <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground">
                          Home
                        </Link>
                        <Link href="/docs" className="flex items-center text-sm font-medium text-muted-foreground">
                          Documentation
                        </Link>
                      </nav>
                    </div>
                    <div className="flex flex-1 items-center justify-end space-x-4">
                      <nav className="flex items-center space-x-2">
                        <UserMenu />
                        <ModeToggle />
                      </nav>
                    </div>
                  </div>
                </header>
                <main className="flex-1">
                  <div className="container py-6">
                    {children}
                  </div>
                </main>
                <footer className="border-t">
                  <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                    <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                      <p className="text-center text-sm leading-loose md:text-left">
                        Built by the API Testing Team. The source code is available on{" "}
                        <a
                          href="#"
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium underline underline-offset-4"
                        >
                          GitHub
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </footer>
              </div>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}


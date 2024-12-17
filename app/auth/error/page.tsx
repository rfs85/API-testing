import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthError({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams.error || "An unknown error occurred"

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
      <p className="text-muted-foreground mb-4">Error: {error}</p>
      <p className="text-muted-foreground mb-4">Please try again or contact support if the problem persists.</p>
      <Button asChild>
        <Link href="/auth/signin">Try Again</Link>
      </Button>
    </div>
  )
}


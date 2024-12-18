import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { GoogleSheetsTestForm } from '@/components/google-sheets-test-form'

export default async function GoogleSheetsTestPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div>Please log in to access this page.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Google Sheets API Test</h1>
      <GoogleSheetsTestForm />
    </div>
  )
}


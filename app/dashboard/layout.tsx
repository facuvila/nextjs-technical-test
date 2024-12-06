import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AmazonCx Products List",
  description: "Search and manage products",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg px-4 sm:px-8">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">AmazonCx</a>
        </div>
      </div>
      <main className="container mx-auto py-4 sm:py-8 px-4 sm:px-8">
        {children}
      </main>
    </div>
  )
}
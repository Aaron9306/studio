import { ProtectedRoute } from "@/components/ProtectedRoute";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['student', 'admin']}>
      <div className="flex flex-col min-h-screen">
        <Header />
        {children}
      </div>
    </ProtectedRoute>
  )
}

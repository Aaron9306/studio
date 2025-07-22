import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import Header from "@/components/Header";

export default function AdminDashboardPage() {

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Header />
      <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage and moderate all opportunities.</p>
          </div>
          <AdminDashboardClient />
      </div>
    </ProtectedRoute>
  )
}

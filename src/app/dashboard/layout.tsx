import { ProtectedRoute } from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['student', 'admin']}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex">
          {children}
        </div>
        <Footer/>
      </div>
    </ProtectedRoute>
  )
}

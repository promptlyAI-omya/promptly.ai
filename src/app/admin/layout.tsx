import { AdminSidebar } from "@/components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-950 text-white">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto bg-gray-950 p-8">
                {children}
            </main>
        </div>
    );
}

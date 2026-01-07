import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Navigation } from "@/components/navigation"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Navigation />
            <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
                {children}
            </main>
        </div>
    )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
    BarChart3,
    Building2,
    Users,
    Target,
    Home,
    MapPin,
    UserSquare2,
    LogOut,
    Shield,
    Eye,
    Menu,
    X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const userRole = session?.user?.role
    const [isOpen, setIsOpen] = useState(false)

    const menuItems = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: Home,
            roles: ["superadmin", "admin", "user"],
        },
        {
            title: "Transportadoras",
            href: "/dashboard/transportadoras",
            icon: Shield,
            roles: ["superadmin"],
        },
        {
            title: "Usuários",
            href: "/dashboard/usuarios",
            icon: UserSquare2,
            roles: ["superadmin"],
        },
        {
            title: "Unidades",
            href: "/dashboard/unidades",
            icon: MapPin,
            roles: ["admin"],
        },
        {
            title: "Filiais",
            href: "/dashboard/filiais",
            icon: Building2,
            roles: ["admin"],
        },
        {
            title: "Vendedores",
            href: "/dashboard/vendedores",
            icon: Users,
            roles: ["admin"],
        },
        {
            title: "Cotadores",
            href: "/dashboard/cotadores",
            icon: UserSquare2,
            roles: ["admin"],
        },
        {
            title: "Metas",
            href: "/dashboard/metas",
            icon: Target,
            roles: ["admin"],
        },
    ]

    const visibleMenuItems = menuItems.filter(item =>
        item.roles.includes(userRole || "")
    )

    const closeMobileMenu = () => setIsOpen(false)

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-purple-100 z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Portal Analytics
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Overlay para mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 mt-16"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed lg:relative flex h-full w-64 flex-col bg-gradient-to-b from-purple-50 to-white border-r border-purple-100 z-40 transition-transform duration-300",
                "lg:translate-x-0",
                isOpen ? "translate-x-0 mt-16 lg:mt-0" : "-translate-x-full"
            )}>
                {/* Desktop Header */}
                <div className="hidden lg:flex h-16 items-center border-b border-purple-100 px-6">
                    <BarChart3 className="h-6 w-6 text-primary mr-2" />
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Portal Analytics
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto py-6">
                    <nav className="space-y-2 px-4">
                        {visibleMenuItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMobileMenu}
                                    className={cn(
                                        "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                                            : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.title}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="border-t border-purple-100 p-4">
                    <div className="mb-3 px-3">
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{session?.user?.name}</p>
                            {userRole === "superadmin" && (
                                <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full font-medium">
                                    Super
                                </span>
                            )}
                            {userRole === "admin" && (
                                <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
                                    Admin
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-purple-600 font-medium truncate">{session?.user?.companyName || session?.user?.clisigla}</p>
                        <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full justify-start rounded-full border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                        onClick={() => {
                            closeMobileMenu()
                            signOut({ callbackUrl: "/login" })
                        }}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </Button>
                </div>
            </div>
        </>
    )
}

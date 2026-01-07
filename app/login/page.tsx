"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

interface BrandingData {
    clisigla: string
    nomeEmpresa: string
    logoUrl: string | null
    corPrimaria: string
    corSecundaria: string
    corFundoLogin: string
}

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        domain: "",
        login: "",
        password: "",
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [branding, setBranding] = useState<BrandingData | null>(null)

    // Carregar branding quando o domínio tiver 3 caracteres
    useEffect(() => {
        if (formData.domain.length === 3) {
            fetch(`/api/branding/${formData.domain.toUpperCase()}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.error) {
                        setBranding(data)
                    } else {
                        setBranding(null)
                    }
                })
                .catch(() => setBranding(null))
        } else {
            setBranding(null)
        }
    }, [formData.domain])

    // Aplicar cores dinamicamente
    useEffect(() => {
        if (branding) {
            document.documentElement.style.setProperty('--brand-primary', branding.corPrimaria)
            document.documentElement.style.setProperty('--brand-secondary', branding.corSecundaria)
            document.documentElement.style.setProperty('--brand-login-bg', branding.corFundoLogin)
        } else {
            document.documentElement.style.setProperty('--brand-primary', '#7C3AED')
            document.documentElement.style.setProperty('--brand-secondary', '#EC4899')
            document.documentElement.style.setProperty('--brand-login-bg', '#1F2937')
        }
    }, [branding])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const result = await signIn("credentials", {
                domain: formData.domain,
                login: formData.login,
                password: formData.password,
                redirect: false,
            })

            if (result?.error) {
                setError("Credenciais inválidas")
            } else {
                router.push("/dashboard")
            }
        } catch (error) {
            setError("Erro ao fazer login")
        } finally {
            setLoading(false)
        }
    }

    const bgColor = branding?.corFundoLogin || "#1F2937"
    const primaryColor = branding?.corPrimaria || "#7C3AED"

    return (
        <div className="min-h-screen flex transition-colors duration-500" style={{ backgroundColor: bgColor }}>
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"
                style={{ background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)` }}>
                <div className="max-w-md text-white">
                    {branding?.logoUrl ? (
                        <img src={branding.logoUrl} alt={branding.nomeEmpresa} className="mb-8 max-w-xs" />
                    ) : (
                        <>
                            <h1 className="text-5xl font-bold mb-6">
                                {branding?.nomeEmpresa || "Portal Analytics"}
                            </h1>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                Gerencie metas e cadastros da sua empresa com eficiência e segurança.
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
                <Card className="w-full max-w-md bg-gray-900 border-gray-800 shadow-2xl">
                    <CardHeader className="space-y-1 pb-8">
                        {branding?.logoUrl && (
                            <div className="flex justify-center mb-4">
                                <img src={branding.logoUrl} alt="Logo" className="h-16 object-contain" />
                            </div>
                        )}
                        <CardTitle className="text-2xl font-bold text-white">Entrar</CardTitle>
                        <p className="text-sm text-gray-400">
                            Digite suas credenciais para acessar o painel
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Domínio */}
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Domínio (3 caracteres)
                                </label>
                                <Input
                                    type="text"
                                    placeholder="DEM"
                                    value={formData.domain}
                                    onChange={(e) => setFormData({ ...formData, domain: e.target.value.toUpperCase() })}
                                    maxLength={3}
                                    className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-11 uppercase tracking-widest text-center focus:ring-2"
                                    style={{
                                        borderColor: branding ? primaryColor + '40' : undefined,
                                        boxShadow: branding ? `0 0 0 1px ${primaryColor}40` : undefined
                                    }}
                                    required
                                />
                                {branding && (
                                    <p className="text-xs mt-2 text-gray-400">
                                        ✓ {branding.nomeEmpresa}
                                    </p>
                                )}
                            </div>

                            {/* Usuário */}
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Usuário
                                </label>
                                <Input
                                    type="text"
                                    placeholder="admin"
                                    value={formData.login}
                                    onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                                    className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-11"
                                    style={{
                                        borderColor: branding ? primaryColor + '40' : undefined
                                    }}
                                    required
                                />
                            </div>

                            {/* Senha */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-gray-300 text-sm font-medium">
                                        Senha
                                    </label>
                                    <button
                                        type="button"
                                        className="text-xs hover:underline"
                                        style={{ color: primaryColor }}
                                    >
                                        Esqueceu sua senha?
                                    </button>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-11 pr-10"
                                        style={{
                                            borderColor: branding ? primaryColor + '40' : undefined
                                        }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Erro */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Botão Login */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 text-base font-semibold rounded-md shadow-lg text-white"
                                style={{
                                    backgroundColor: primaryColor,
                                    boxShadow: `0 10px 25px ${primaryColor}40`
                                }}
                            >
                                {loading ? "ENTRANDO..." : "Entrar"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

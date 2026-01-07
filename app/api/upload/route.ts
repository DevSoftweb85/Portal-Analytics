import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

// POST /api/upload - Upload de imagem
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get("file") as File
        const folder = formData.get("folder") as string || "logos"

        if (!file) {
            return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
        }

        // Validar tipo de arquivo
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Tipo de arquivo não permitido" }, { status: 400 })
        }

        // Validar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "Arquivo muito grande (máx. 5MB)" }, { status: 400 })
        }

        // Criar nome único para o arquivo
        const timestamp = Date.now()
        const extension = file.name.split('.').pop()
        const filename = `${folder}_${timestamp}.${extension}`

        // Criar diretório se não existir
        const uploadDir = path.join(process.cwd(), "public", "uploads", folder)
        await mkdir(uploadDir, { recursive: true })

        // Salvar arquivo
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filepath = path.join(uploadDir, filename)
        await writeFile(filepath, buffer)

        // Retornar URL pública
        const url = `/uploads/${folder}/${filename}`

        return NextResponse.json({ url, filename })
    } catch (error) {
        console.error("Error uploading file:", error)
        return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 500 })
    }
}

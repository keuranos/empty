import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { getServerSession } from 'next-auth'
import { checkUsageLimit, incrementUsage } from '@/lib/usage'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    const identifier = session?.user?.email || request.headers.get('x-forwarded-for') || 'anonymous'
    const isPro = session?.user?.isPro || false

    const { allowed } = checkUsageLimit(identifier, isPro)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Daily limit reached. Upgrade to Pro for unlimited access.' },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const quality = parseInt(formData.get('quality') as string) || 80

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const results = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const originalSize = buffer.length

      let compressedBuffer: Buffer

      const image = sharp(buffer)
      const metadata = await image.metadata()

      if (metadata.format === 'png') {
        compressedBuffer = await image
          .png({ quality, compressionLevel: 9 })
          .toBuffer()
      } else if (metadata.format === 'webp') {
        compressedBuffer = await image
          .webp({ quality })
          .toBuffer()
      } else {
        // Default to JPEG
        compressedBuffer = await image
          .jpeg({ quality, mozjpeg: true })
          .toBuffer()
      }

      // Convert to base64 data URL for easy download
      const base64 = compressedBuffer.toString('base64')
      const mimeType = `image/${metadata.format || 'jpeg'}`
      const dataUrl = `data:${mimeType};base64,${base64}`

      results.push({
        name: file.name,
        url: dataUrl,
        originalSize,
        compressedSize: compressedBuffer.length,
      })
    }

    incrementUsage(identifier)

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Image compress error:', error)
    return NextResponse.json(
      { error: 'Failed to compress images' },
      { status: 500 }
    )
  }
}

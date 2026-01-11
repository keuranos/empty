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
    const file = formData.get('file') as File
    const format = formData.get('format') as string || 'png'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const validFormats = ['png', 'jpg', 'jpeg', 'webp', 'gif']
    if (!validFormats.includes(format.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid format. Supported: PNG, JPG, WebP, GIF' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let image = sharp(buffer)
    let convertedBuffer: Buffer
    let mimeType: string

    switch (format.toLowerCase()) {
      case 'png':
        convertedBuffer = await image.png().toBuffer()
        mimeType = 'image/png'
        break
      case 'jpg':
      case 'jpeg':
        convertedBuffer = await image.jpeg({ quality: 90 }).toBuffer()
        mimeType = 'image/jpeg'
        break
      case 'webp':
        convertedBuffer = await image.webp({ quality: 90 }).toBuffer()
        mimeType = 'image/webp'
        break
      case 'gif':
        convertedBuffer = await image.gif().toBuffer()
        mimeType = 'image/gif'
        break
      default:
        convertedBuffer = await image.png().toBuffer()
        mimeType = 'image/png'
    }

    incrementUsage(identifier)

    return new NextResponse(convertedBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="converted.${format}"`,
      },
    })
  } catch (error) {
    console.error('Image convert error:', error)
    return NextResponse.json(
      { error: 'Failed to convert image' },
      { status: 500 }
    )
  }
}

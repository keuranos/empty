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
    const width = parseInt(formData.get('width') as string)
    const height = parseInt(formData.get('height') as string)

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!width || !height || width <= 0 || height <= 0) {
      return NextResponse.json(
        { error: 'Invalid dimensions' },
        { status: 400 }
      )
    }

    if (width > 10000 || height > 10000) {
      return NextResponse.json(
        { error: 'Maximum dimension is 10000px' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const resizedBuffer = await sharp(buffer)
      .resize(width, height, {
        fit: 'fill',
        withoutEnlargement: false,
      })
      .png()
      .toBuffer()

    incrementUsage(identifier)

    return new NextResponse(resizedBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="resized.png"',
      },
    })
  } catch (error) {
    console.error('Image resize error:', error)
    return NextResponse.json(
      { error: 'Failed to resize image' },
      { status: 500 }
    )
  }
}

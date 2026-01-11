import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'
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

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const pdfDoc = await PDFDocument.create()

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())

      // Get image dimensions
      const metadata = await sharp(buffer).metadata()
      const width = metadata.width || 595 // A4 width in points
      const height = metadata.height || 842 // A4 height in points

      // Convert to PNG or JPG for PDF embedding
      let imageBytes: Uint8Array
      let embedFn: 'embedPng' | 'embedJpg'

      if (metadata.format === 'png') {
        imageBytes = new Uint8Array(buffer)
        embedFn = 'embedPng'
      } else {
        // Convert to JPEG for other formats
        const jpegBuffer = await sharp(buffer).jpeg({ quality: 95 }).toBuffer()
        imageBytes = new Uint8Array(jpegBuffer)
        embedFn = 'embedJpg'
      }

      const image = await pdfDoc[embedFn](imageBytes)

      // Calculate page size to fit image (max A4 proportions)
      const maxWidth = 595
      const maxHeight = 842
      let pageWidth = width
      let pageHeight = height

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        pageWidth = width * ratio
        pageHeight = height * ratio
      }

      const page = pdfDoc.addPage([pageWidth, pageHeight])
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
      })
    }

    const pdfBytes = await pdfDoc.save()

    incrementUsage(identifier)

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="images.pdf"',
      },
    })
  } catch (error) {
    console.error('Image to PDF error:', error)
    return NextResponse.json(
      { error: 'Failed to create PDF' },
      { status: 500 }
    )
  }
}

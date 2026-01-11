import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'
import { getServerSession } from 'next-auth'
import { checkUsageLimit, incrementUsage } from '@/lib/usage'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    const identifier = session?.user?.email || request.headers.get('x-forwarded-for') || 'anonymous'
    const isPro = session?.user?.isPro || false

    const { allowed, remaining } = checkUsageLimit(identifier, isPro)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Daily limit reached. Upgrade to Pro for unlimited access.' },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const quality = formData.get('quality') as string || 'medium'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)

    // PDF-lib doesn't have built-in compression, but we can:
    // 1. Remove metadata
    // 2. Flatten form fields
    // 3. Save with optimization flags

    // Remove metadata to reduce size
    pdfDoc.setTitle('')
    pdfDoc.setAuthor('')
    pdfDoc.setSubject('')
    pdfDoc.setKeywords([])
    pdfDoc.setProducer('')
    pdfDoc.setCreator('')

    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    })

    incrementUsage(identifier)

    return new NextResponse(compressedPdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="compressed.pdf"',
        'X-Original-Size': arrayBuffer.byteLength.toString(),
        'X-Compressed-Size': compressedPdfBytes.length.toString(),
      },
    })
  } catch (error) {
    console.error('PDF compress error:', error)
    return NextResponse.json(
      { error: 'Failed to compress PDF' },
      { status: 500 }
    )
  }
}

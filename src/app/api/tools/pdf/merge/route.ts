import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'
import { getServerSession } from 'next-auth'
import { checkUsageLimit, incrementUsage } from '@/lib/usage'

export async function POST(request: NextRequest) {
  try {
    // Check authentication and usage limits
    const session = await getServerSession()
    const identifier = session?.user?.email || request.headers.get('x-forwarded-for') || 'anonymous'
    const isPro = session?.user?.isPro || false

    const { allowed, remaining } = checkUsageLimit(identifier, isPro)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Daily limit reached. Upgrade to Pro for unlimited access.', remaining: 0 },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (files.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 PDF files are required' },
        { status: 400 }
      )
    }

    // Create a new PDF document
    const mergedPdf = await PDFDocument.create()

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      copiedPages.forEach((page) => mergedPdf.addPage(page))
    }

    const mergedPdfBytes = await mergedPdf.save()

    // Increment usage counter
    incrementUsage(identifier)

    return new NextResponse(mergedPdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged.pdf"',
        'X-Usage-Remaining': (remaining - 1).toString(),
      },
    })
  } catch (error) {
    console.error('PDF merge error:', error)
    return NextResponse.json(
      { error: 'Failed to merge PDF files' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'
import { getServerSession } from 'next-auth'
import { checkUsageLimit, incrementUsage } from '@/lib/usage'

function parsePageRanges(input: string, maxPages: number): number[] {
  const pages: Set<number> = new Set()
  const parts = input.split(',').map(p => p.trim())

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim()))
      for (let i = start; i <= Math.min(end, maxPages); i++) {
        if (i >= 1) pages.add(i - 1) // Convert to 0-indexed
      }
    } else {
      const page = parseInt(part)
      if (page >= 1 && page <= maxPages) {
        pages.add(page - 1) // Convert to 0-indexed
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b)
}

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
    const pagesInput = formData.get('pages') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!pagesInput) {
      return NextResponse.json(
        { error: 'No pages specified' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const sourcePdf = await PDFDocument.load(arrayBuffer)
    const pageCount = sourcePdf.getPageCount()

    const pageIndices = parsePageRanges(pagesInput, pageCount)

    if (pageIndices.length === 0) {
      return NextResponse.json(
        { error: 'No valid pages specified' },
        { status: 400 }
      )
    }

    const newPdf = await PDFDocument.create()
    const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices)
    copiedPages.forEach(page => newPdf.addPage(page))

    const splitPdfBytes = await newPdf.save()

    incrementUsage(identifier)

    return new NextResponse(splitPdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="split.pdf"',
      },
    })
  } catch (error) {
    console.error('PDF split error:', error)
    return NextResponse.json(
      { error: 'Failed to split PDF' },
      { status: 500 }
    )
  }
}

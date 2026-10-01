import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.api_dev_key || !body.api_paste_code) {
      return NextResponse.json({ error: 'Developer key and script code are required.' }, { status: 400 })
    }
    const params = new URLSearchParams()
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.set(key, String(value))
    })
    const response = await fetch('https://pastebin.com/api/api_post.php', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params,
      cache: 'no-store'
    })
    const text = await response.text()
    if (!response.ok || text.startsWith('Bad API request')) return NextResponse.json({ error: text || 'Pastebin rejected the request.' }, { status: 400 })
    const match = text.match(/https?:\/\/pastebin\.com\/([^\s]+)/)
    const id = match?.[1]
    return NextResponse.json({ url: text.trim(), rawUrl: id ? `https://pastebin.com/raw/${id}` : text.trim() })
  } catch { return NextResponse.json({ error: 'Unable to reach Pastebin right now.' }, { status: 502 }) }
}

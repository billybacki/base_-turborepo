import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ res: 'ok', req: request.headers })
}

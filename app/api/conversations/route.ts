import { NextResponse } from 'next/server'
import { initialConversations, Conversation } from '@/lib/store'

// Global in-memory cache for serverless invocation reuse
let conversations = [...initialConversations]

export async function GET() {
  return NextResponse.json({ conversations })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      customerName: body.customerName || 'Anonymous Visitor',
      customerEmail: body.customerEmail || 'visitor@guest.com',
      status: 'open',
      lastMessage: body.initialMessage || 'Started conversation',
      lastMessageAt: 'Just now',
      unreadCount: 1,
      channel: 'website',
      location: body.location || 'Unknown Location',
      device: body.device || 'Desktop Browser',
    }
    conversations.unshift(newConv)
    return NextResponse.json({ conversation: newConv })
  } catch {
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 400 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json()
    conversations = conversations.map(c => (c.id === id ? { ...c, status, unreadCount: 0 } : c))
    return NextResponse.json({ success: true, conversations })
  } catch {
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 400 })
  }
}

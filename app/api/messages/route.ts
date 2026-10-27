import { NextResponse } from 'next/server'
import { initialMessages, Message } from '@/lib/store'

let messagesStore: Record<string, Message[]> = { ...initialMessages }

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const conversationId = searchParams.get('conversationId') || 'conv-101'
  return NextResponse.json({ messages: messagesStore[conversationId] || [] })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      conversationId,
      content,
      sender = 'customer',
      senderName = 'Visitor',
      channel = 'website',
      emailSubject,
      deliveredTo,
    } = body

    if (!conversationId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!messagesStore[conversationId]) {
      messagesStore[conversationId] = []
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      conversationId,
      sender,
      senderName,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel,
      emailSubject,
      deliveredTo,
    }

    messagesStore[conversationId].push(newMessage)

    // Optional simulated intelligent auto-reply if visitor writes
    let autoReply: Message | null = null
    if (sender === 'customer') {
      const lower = content.toLowerCase()
      let replyContent =
        channel === 'email'
          ? 'Thank you for your email inquiry. We have assigned this ticket to an agent and will email you back shortly.'
          : 'Thanks for your message! An agent has been alerted and will reply shortly.'

      if (lower.includes('hello') || lower.includes('hi')) {
        replyContent = 'Hello there! Welcome to our live support. How can we assist you today?'
      } else if (lower.includes('pricing') || lower.includes('cost') || lower.includes('free')) {
        replyContent = 'Our platform is 100% free and open-source on GitHub with zero credit card required!'
      } else if (lower.includes('help') || lower.includes('support')) {
        replyContent = 'We are here to help! Please share more details about what you need assistance with.'
      }

      autoReply = {
        id: `msg-${Date.now() + 1}-bot`,
        conversationId,
        sender: 'bot',
        senderName: channel === 'email' ? 'Email Auto-Dispatcher' : 'AI Support Assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel,
      }
      messagesStore[conversationId].push(autoReply)
    }

    return NextResponse.json({ message: newMessage, autoReply })
  } catch {
    return NextResponse.json({ error: 'Failed to post message' }, { status: 400 })
  }
}

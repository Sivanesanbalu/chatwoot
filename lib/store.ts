export interface Message {
  id: string
  conversationId: string
  sender: 'customer' | 'agent' | 'bot'
  senderName: string
  content: string
  timestamp: string
  channel?: 'website' | 'email' | 'whatsapp'
  emailSubject?: string
  deliveredTo?: string
}

export interface Conversation {
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  status: 'open' | 'pending' | 'resolved'
  subject?: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  channel: 'website' | 'email' | 'whatsapp'
  location: string
  device: string
  deviceType: 'mobile' | 'desktop' | 'tablet'
  browser: string
  os: string
}

export let initialConversations: Conversation[] = [
  {
    id: 'conv-101',
    customerName: 'Alex Rivera',
    customerEmail: 'alex.rivera@example.com',
    status: 'open',
    channel: 'website',
    subject: 'Live Website Inquiry',
    lastMessage: 'Is this live chat open-source and free to self-host?',
    lastMessageAt: 'Just now',
    unreadCount: 1,
    location: 'San Francisco, US',
    device: 'Apple iPhone 15 Pro',
    deviceType: 'mobile',
    browser: 'Mobile Safari 17.4',
    os: 'iOS 17.4',
  },
  {
    id: 'conv-104',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@enterprise.com',
    status: 'open',
    channel: 'email',
    subject: '[TICKET #4829] Pricing quote for 50 agents on custom domain',
    lastMessage: 'Hello Support, Could you please forward us the enterprise quote and SLA details?',
    lastMessageAt: '8m ago',
    unreadCount: 2,
    location: 'London, UK',
    device: 'Mozilla Thunderbird / Mail Client',
    deviceType: 'desktop',
    browser: 'Outlook / SMTP Inbound',
    os: 'Windows 11 Pro',
  },
  {
    id: 'conv-102',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.s@techcorp.in',
    status: 'pending',
    channel: 'website',
    subject: 'WordPress Integration Guide',
    lastMessage: 'We would like to integrate this widget with our WordPress store.',
    lastMessageAt: '15m ago',
    unreadCount: 0,
    location: 'Bengaluru, IN',
    device: 'Samsung Galaxy S24 Ultra',
    deviceType: 'mobile',
    browser: 'Chrome Mobile 123.0',
    os: 'Android 14',
  },
  {
    id: 'conv-105',
    customerName: 'David Miller',
    customerEmail: 'david.m@logistics.de',
    status: 'open',
    channel: 'email',
    subject: '[TICKET #4820] Webhook callback failed for order updates',
    lastMessage: 'Our server received a 504 gateway timeout when calling the webhook API.',
    lastMessageAt: '45m ago',
    unreadCount: 1,
    location: 'Berlin, DE',
    device: 'Apple Mail / Gmail SMTP',
    deviceType: 'desktop',
    browser: 'Direct Inbound Mail',
    os: 'macOS Sonoma',
  },
  {
    id: 'conv-103',
    customerName: 'Michael Chang',
    customerEmail: 'm.chang@enterprise.sg',
    status: 'resolved',
    channel: 'website',
    subject: 'API Documentation Access',
    lastMessage: 'Thank you! The automated response solved my query.',
    lastMessageAt: '2h ago',
    unreadCount: 0,
    location: 'Singapore',
    device: 'Apple iPad Pro 12.9"',
    deviceType: 'tablet',
    browser: 'Safari Mobile',
    os: 'iPadOS 17.2',
  }
]

export let initialMessages: Record<string, Message[]> = {
  'conv-101': [
    {
      id: 'm-1',
      conversationId: 'conv-101',
      sender: 'bot',
      senderName: 'Chat Assistant',
      content: 'Welcome to Live Support! We are online and ready to help on mobile and web.',
      timestamp: '10:40 AM',
      channel: 'website',
    },
    {
      id: 'm-2',
      conversationId: 'conv-101',
      sender: 'customer',
      senderName: 'Alex Rivera',
      content: 'Is this live chat open-source and free to self-host?',
      timestamp: '10:41 AM',
      channel: 'website',
    }
  ],
  'conv-104': [
    {
      id: 'm-e1',
      conversationId: 'conv-104',
      sender: 'customer',
      senderName: 'Sarah Jenkins',
      content: 'Hello Support,\n\nCould you please forward us the enterprise quote and SLA details for 50 agents? Also, does this support forwarding directly to our Zendesk/Freshdesk email?\n\nBest regards,\nSarah Jenkins\nDirector of Operations',
      timestamp: '09:15 AM',
      channel: 'email',
      emailSubject: '[TICKET #4829] Pricing quote for 50 agents on custom domain',
      deliveredTo: 'support@yourdomain.com',
    },
    {
      id: 'm-e2',
      conversationId: 'conv-104',
      sender: 'bot',
      senderName: 'Email Auto-Responder',
      content: 'Hi Sarah, We have received your email request regarding "[TICKET #4829] Pricing quote for 50 agents". Ticket #4829 has been assigned to our team.',
      timestamp: '09:16 AM',
      channel: 'email',
      emailSubject: 'Re: [TICKET #4829] Pricing quote for 50 agents on custom domain',
      deliveredTo: 'sarah.j@enterprise.com',
    }
  ],
  'conv-102': [
    {
      id: 'm-3',
      conversationId: 'conv-102',
      sender: 'customer',
      senderName: 'Priya Sharma',
      content: 'We would like to integrate this widget with our WordPress store.',
      timestamp: '10:28 AM',
      channel: 'website',
    },
    {
      id: 'm-4',
      conversationId: 'conv-102',
      sender: 'agent',
      senderName: 'Sivanesan (Agent)',
      content: 'Absolutely! You can paste the 1-line script tag into your WordPress header and it works seamlessly across iPhone, Android, and desktop.',
      timestamp: '10:30 AM',
      channel: 'website',
    }
  ],
  'conv-105': [
    {
      id: 'm-e3',
      conversationId: 'conv-105',
      sender: 'customer',
      senderName: 'David Miller',
      content: 'Hi Support,\n\nOur server received a 504 gateway timeout when calling the webhook API during peak traffic today. Could you check the server logs?\n\nAttached error payload: { code: 504, path: "/api/webhooks" }',
      timestamp: '08:30 AM',
      channel: 'email',
      emailSubject: '[TICKET #4820] Webhook callback failed for order updates',
      deliveredTo: 'support@yourdomain.com',
    }
  ],
  'conv-103': [
    {
      id: 'm-5',
      conversationId: 'conv-103',
      sender: 'customer',
      senderName: 'Michael Chang',
      content: 'Where can I find documentation?',
      timestamp: '8:45 AM',
      channel: 'website',
    },
    {
      id: 'm-6',
      conversationId: 'conv-103',
      sender: 'agent',
      senderName: 'Sivanesan (Agent)',
      content: 'You can check our GitHub repository or help center for full guides!',
      timestamp: '8:48 AM',
      channel: 'website',
    },
    {
      id: 'm-7',
      conversationId: 'conv-103',
      sender: 'customer',
      senderName: 'Michael Chang',
      content: 'Thank you! The automated response solved my query.',
      timestamp: '8:50 AM',
      channel: 'website',
    }
  ]
}

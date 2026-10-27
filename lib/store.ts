export interface Message {
  id: string
  conversationId: string
  sender: 'customer' | 'agent' | 'bot'
  senderName: string
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  customerName: string
  customerEmail: string
  status: 'open' | 'pending' | 'resolved'
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  channel: 'website' | 'email' | 'whatsapp'
  location: string
  device: string
}

export let initialConversations: Conversation[] = [
  {
    id: 'conv-101',
    customerName: 'Alex Rivera',
    customerEmail: 'alex.rivera@example.com',
    status: 'open',
    lastMessage: 'Is this live chat open-source and free to self-host?',
    lastMessageAt: 'Just now',
    unreadCount: 1,
    channel: 'website',
    location: 'San Francisco, US',
    device: 'Chrome on macOS',
  },
  {
    id: 'conv-102',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.s@techcorp.in',
    status: 'pending',
    lastMessage: 'We would like to integrate this widget with our WordPress store.',
    lastMessageAt: '12m ago',
    unreadCount: 0,
    channel: 'website',
    location: 'Bengaluru, IN',
    device: 'Safari on iPhone',
  },
  {
    id: 'conv-103',
    customerName: 'Michael Chang',
    customerEmail: 'm.chang@enterprise.sg',
    status: 'resolved',
    lastMessage: 'Thank you! The automated response solved my query.',
    lastMessageAt: '2h ago',
    unreadCount: 0,
    channel: 'website',
    location: 'Singapore',
    device: 'Edge on Windows 11',
  }
]

export let initialMessages: Record<string, Message[]> = {
  'conv-101': [
    {
      id: 'm-1',
      conversationId: 'conv-101',
      sender: 'bot',
      senderName: 'Chat Assistant',
      content: 'Welcome! How can our support team help you today?',
      timestamp: '10:40 AM',
    },
    {
      id: 'm-2',
      conversationId: 'conv-101',
      sender: 'customer',
      senderName: 'Alex Rivera',
      content: 'Is this live chat open-source and free to self-host?',
      timestamp: '10:41 AM',
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
    },
    {
      id: 'm-4',
      conversationId: 'conv-102',
      sender: 'agent',
      senderName: 'Support Agent',
      content: 'Absolutely! You can paste the 1-line script tag into your WordPress header and it works instantly.',
      timestamp: '10:30 AM',
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
    },
    {
      id: 'm-6',
      conversationId: 'conv-103',
      sender: 'agent',
      senderName: 'Support Agent',
      content: 'You can check our GitHub repository or help center for full guides!',
      timestamp: '8:48 AM',
    },
    {
      id: 'm-7',
      conversationId: 'conv-103',
      sender: 'customer',
      senderName: 'Michael Chang',
      content: 'Thank you! The automated response solved my query.',
      timestamp: '8:50 AM',
    }
  ]
}

'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  MessageSquare,
  ShieldCheck,
  Headphones,
  Code,
  Sparkles,
  Laptop,
  Smartphone,
  Tablet,
  Mail,
  Zap,
  Globe,
  Monitor,
} from 'lucide-react'
import LiveWidget from '@/components/LiveWidget'
import AgentInbox from '@/components/AgentInbox'
import EmbedGuide from '@/components/EmbedGuide'
import EmailChannelSettings from '@/components/EmailChannelSettings'
import { initialConversations, initialMessages, Conversation, Message } from '@/lib/store'

function MainApp() {
  const searchParams = useSearchParams()
  const isWidgetOnly = searchParams.get('view') === 'widget_only'

  const [activeTab, setActiveTab] = useState<'inbox' | 'customer' | 'email' | 'embed'>('inbox')
  const [deviceMode, setDeviceMode] = useState<'responsive' | 'mobile' | 'tablet' | 'desktop'>('responsive')
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedConvId, setSelectedConvId] = useState<string>('conv-101')
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)

  const activeMessages = messagesMap[selectedConvId] || []
  const activeCustomer =
    conversations.find((c) => c.id === selectedConvId) || conversations[0]

  // Send message as Customer (from Live Widget or Email Ticket)
  const handleCustomerSendMessage = async (
    text: string,
    channel: 'website' | 'email' = 'website',
    subject?: string
  ) => {
    let convId = selectedConvId

    // If an email ticket was sent with a new subject, create or update conversation
    if (channel === 'email' && subject) {
      const newEmailConvId = `conv-email-${Date.now()}`
      const newEmailConv: Conversation = {
        id: newEmailConvId,
        customerName: activeCustomer?.customerName || 'Inbound Customer',
        customerEmail: activeCustomer?.customerEmail || 'customer@example.com',
        status: 'open',
        channel: 'email',
        subject,
        lastMessage: text,
        lastMessageAt: 'Just now',
        unreadCount: 1,
        location: 'United States',
        device: 'Web & Mobile Client',
        deviceType: 'mobile',
        browser: 'Mail / Mobile Safari',
        os: 'iOS / Android',
      }
      setConversations((prev) => [newEmailConv, ...prev])
      setSelectedConvId(newEmailConvId)
      convId = newEmailConvId
    }

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      sender: 'customer',
      senderName: activeCustomer?.customerName || 'Customer',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel,
      emailSubject: subject,
    }

    setMessagesMap((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg],
    }))

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              lastMessage: text,
              lastMessageAt: 'Just now',
              unreadCount: c.unreadCount + 1,
              status: 'open',
            }
          : c
      )
    )

    // Automated intelligent bot reply
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      let replyContent =
        channel === 'email'
          ? `Thank you for your email ticket. Our customer operations team has received your inquiry and will email you back shortly.`
          : `Thanks for messaging us! Our support desk has received your request and will reply right away.`

      const lower = text.toLowerCase()
      if (lower.includes('price') || lower.includes('cost') || lower.includes('quote')) {
        replyContent =
          'Our platform is 100% free and open-source on GitHub with zero credit card required! For enterprise volume, custom deployments are also available.'
      } else if (lower.includes('mobile') || lower.includes('phone') || lower.includes('device')) {
        replyContent =
          'We support all iOS (iPhone/iPad), Android smartphones, and desktop email clients seamlessly.'
      }

      const botReply: Message = {
        id: `msg-${Date.now()}-bot`,
        conversationId: convId,
        sender: 'bot',
        senderName: channel === 'email' ? 'Email Auto-Dispatcher' : 'AI Support Bot',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel,
      }

      setMessagesMap((prev) => ({
        ...prev,
        [convId]: [...(prev[convId] || []), botReply],
      }))

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, lastMessage: replyContent, lastMessageAt: 'Just now' }
            : c
        )
      )
    }, 1200)
  }

  // Send message as Agent (Live chat or email dispatch)
  const handleAgentSendMessage = (text: string, channel: 'website' | 'email' = 'website') => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConvId,
      sender: 'agent',
      senderName: 'Sivanesan (Agent)',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel,
      deliveredTo: activeCustomer?.customerEmail,
    }

    setMessagesMap((prev) => ({
      ...prev,
      [selectedConvId]: [...(prev[selectedConvId] || []), newMsg],
    }))

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConvId
          ? {
              ...c,
              lastMessage: text,
              lastMessageAt: 'Just now',
              unreadCount: 0,
            }
          : c
      )
    )
  }

  const handleCreateTicket = (ticket: {
    customerName: string
    customerEmail: string
    subject: string
    message: string
  }) => {
    const newId = `conv-ticket-${Date.now()}`
    const newConv: Conversation = {
      id: newId,
      customerName: ticket.customerName,
      customerEmail: ticket.customerEmail,
      status: 'open',
      channel: 'email',
      subject: ticket.subject,
      lastMessage: ticket.message,
      lastMessageAt: 'Just now',
      unreadCount: 0,
      location: 'Email Inbound',
      device: 'Email Client / SMTP',
      deviceType: 'desktop',
      browser: 'Direct Inbound',
      os: 'All Operating Systems',
    }

    const firstMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: newId,
      sender: 'agent',
      senderName: 'Sivanesan (Agent)',
      content: ticket.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: 'email',
      emailSubject: ticket.subject,
      deliveredTo: ticket.customerEmail,
    }

    setConversations((prev) => [newConv, ...prev])
    setMessagesMap((prev) => ({ ...prev, [newId]: [firstMsg] }))
    setSelectedConvId(newId)
  }

  const handleUpdateStatus = (id: string, status: 'open' | 'resolved') => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, unreadCount: 0 } : c))
    )
  }

  // If embedded in an iframe as widget_only
  if (isWidgetOnly) {
    return (
      <LiveWidget
        conversationId={selectedConvId}
        customerName={activeCustomer?.customerName || 'Visitor'}
        customerEmail={activeCustomer?.customerEmail || 'visitor@example.com'}
        messages={activeMessages}
        onSendMessage={handleCustomerSendMessage}
        isTyping={isTyping}
        devicePreviewMode="responsive"
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
              CW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">Chatwoot Lite</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  All Devices & Email
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Omnichannel Customer Support Suite</p>
            </div>
          </div>

          {/* Navigation Mode Tabs */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'inbox'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" /> Agent Inbox
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </button>
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'customer'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Device Preview
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'email'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Email Channel
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'embed'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> Embed Code
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>All Devices Online</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8">
        {/* TAB 1: AGENT INBOX */}
        {activeTab === 'inbox' && (
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200/60 p-3.5 rounded-xl text-xs text-indigo-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Omnichannel Desk:</strong> Managing both <strong>Live Web Chats</strong> and <strong>Email Tickets</strong> across all devices (iPhone, Android, Tablets, and PCs).
                </span>
              </div>
              <button
                onClick={() => setActiveTab('email')}
                className="underline font-semibold hover:text-indigo-800 text-xs shrink-0"
              >
                Configure Email Forwarding →
              </button>
            </div>

            <AgentInbox
              conversations={conversations}
              selectedConvId={selectedConvId}
              onSelectConversation={setSelectedConvId}
              messages={activeMessages}
              onAgentSendMessage={handleAgentSendMessage}
              onUpdateStatus={handleUpdateStatus}
              onCreateTicket={handleCreateTicket}
              onRefresh={() => {}}
            />
          </div>
        )}

        {/* TAB 2: DEVICE PREVIEW & CUSTOMER VIEW */}
        {activeTab === 'customer' && (
          <div className="space-y-6">
            {/* Device Switcher Toolbar */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Device Compatibility Tester:</span>
              </div>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setDeviceMode('responsive')}
                  className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition ${
                    deviceMode === 'responsive'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" /> Full Responsive
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition ${
                    deviceMode === 'mobile'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> iPhone / Android
                </button>
                <button
                  onClick={() => setDeviceMode('tablet')}
                  className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition ${
                    deviceMode === 'tablet'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" /> iPad / Tablet
                </button>
              </div>

              <span className="text-xs text-slate-400 hidden lg:inline">
                Test chat & email ticket forms live
              </span>
            </div>

            {/* Interactive Preview Canvas */}
            <div className="flex justify-center items-center py-4">
              {deviceMode === 'mobile' ? (
                <div className="w-[380px] h-[680px] bg-slate-900 rounded-[48px] p-4 shadow-2xl border-4 border-slate-700 flex flex-col items-center">
                  <div className="w-28 h-4 bg-slate-800 rounded-full mb-3 shrink-0"></div>
                  <div className="w-full flex-1 bg-white rounded-[32px] overflow-hidden flex flex-col relative">
                    <LiveWidget
                      conversationId={selectedConvId}
                      customerName={activeCustomer?.customerName || 'Mobile Visitor'}
                      customerEmail={activeCustomer?.customerEmail || 'mobile@example.com'}
                      messages={activeMessages}
                      onSendMessage={handleCustomerSendMessage}
                      isTyping={isTyping}
                      devicePreviewMode="mobile"
                    />
                  </div>
                </div>
              ) : deviceMode === 'tablet' ? (
                <div className="w-[540px] h-[700px] bg-slate-800 rounded-[36px] p-5 shadow-2xl border-4 border-slate-600 flex flex-col items-center">
                  <div className="w-16 h-3 bg-slate-700 rounded-full mb-3 shrink-0"></div>
                  <div className="w-full flex-1 bg-white rounded-[24px] overflow-hidden flex flex-col relative">
                    <LiveWidget
                      conversationId={selectedConvId}
                      customerName={activeCustomer?.customerName || 'Tablet Visitor'}
                      customerEmail={activeCustomer?.customerEmail || 'tablet@example.com'}
                      messages={activeMessages}
                      onSendMessage={handleCustomerSendMessage}
                      isTyping={isTyping}
                      devicePreviewMode="tablet"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full relative">
                  {/* Demo Business Landing Page */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-8 sm:p-12 min-h-[640px]">
                    <div className="max-w-2xl space-y-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Cross-Device Live Messaging Active
                      </div>
                      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Support Customers Anywhere, on Any Device & Email
                      </h1>
                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                        Test your live chat and email ticket form in real time below. Open the chat bubble on the bottom right to see mobile-friendly instant replies and email transcript features!
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                          <h3 className="font-semibold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
                            <Smartphone className="w-4 h-4 text-blue-600" /> Mobile & Tablet Ready
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            Seamless full-screen mobile drawers on smartphones and floating modals on desktop.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                          <h3 className="font-semibold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-indigo-600" /> Email Ticket Integration
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            Allow visitors to submit email tickets and receive chat transcripts straight to their email.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Widget */}
                  <LiveWidget
                    conversationId={selectedConvId}
                    customerName={activeCustomer?.customerName || 'Visitor'}
                    customerEmail={activeCustomer?.customerEmail || 'visitor@example.com'}
                    messages={activeMessages}
                    onSendMessage={handleCustomerSendMessage}
                    isTyping={isTyping}
                    devicePreviewMode="responsive"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: EMAIL CHANNEL & FORWARDING */}
        {activeTab === 'email' && <EmailChannelSettings />}

        {/* TAB 4: EMBED CODE */}
        {activeTab === 'embed' && <EmbedGuide />}
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-medium">Loading Chatwoot Lite...</div>}>
      <MainApp />
    </Suspense>
  )
}

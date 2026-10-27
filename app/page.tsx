'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  MessageSquare,
  ShieldCheck,
  Headphones,
  Code,
  Sparkles,
  ExternalLink,
  Laptop,
  CheckCircle2,
  Users,
  Zap,
} from 'lucide-react'
import LiveWidget from '@/components/LiveWidget'
import AgentInbox from '@/components/AgentInbox'
import EmbedGuide from '@/components/EmbedGuide'
import { initialConversations, initialMessages, Conversation, Message } from '@/lib/store'

function MainApp() {
  const searchParams = useSearchParams()
  const isWidgetOnly = searchParams.get('view') === 'widget_only'

  const [activeTab, setActiveTab] = useState<'customer' | 'inbox' | 'embed'>('inbox')
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedConvId, setSelectedConvId] = useState<string>('conv-101')
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)

  const activeMessages = messagesMap[selectedConvId] || []
  const activeCustomer =
    conversations.find((c) => c.id === selectedConvId) || conversations[0]

  // Send message as Customer (from the Live Widget)
  const handleCustomerSendMessage = async (text: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConvId,
      sender: 'customer',
      senderName: activeCustomer.customerName,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    // Update messages locally
    setMessagesMap((prev) => ({
      ...prev,
      [selectedConvId]: [...(prev[selectedConvId] || []), newMsg],
    }))

    // Update conversation preview
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConvId
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

    // Simulate AI / automated response after 1s
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      let replyContent = "Thanks for your message! Our team has received it and will answer shortly."
      const lower = text.toLowerCase()
      if (lower.includes('hello') || lower.includes('hi')) {
        replyContent = "Hello! Thanks for reaching out. How can I help you today?"
      } else if (lower.includes('price') || lower.includes('free') || lower.includes('cost')) {
        replyContent = "Chatwoot Lite is 100% free and open-source on GitHub with zero credit card required!"
      }

      const botReply: Message = {
        id: `msg-${Date.now()}-bot`,
        conversationId: selectedConvId,
        sender: 'bot',
        senderName: 'AI Support Bot',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessagesMap((prev) => ({
        ...prev,
        [selectedConvId]: [...(prev[selectedConvId] || []), botReply],
      }))

      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConvId
            ? { ...c, lastMessage: replyContent, lastMessageAt: 'Just now' }
            : c
        )
      )
    }, 1200)
  }

  // Send message as Agent (from the Agent Inbox)
  const handleAgentSendMessage = (text: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConvId,
      sender: 'agent',
      senderName: 'Sivanesan (Agent)',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
              CW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">Chatwoot Lite</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                  Vercel Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Open-Source Customer Support Suite</p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'inbox'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" /> Agent Inbox
              <span className="ml-1 w-2 h-2 rounded-full bg-emerald-400"></span>
            </button>
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'customer'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" /> Customer View & Widget
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'embed'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> Embed Code
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="hidden sm:inline">Agent Online</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Tab 1: Agent Inbox View */}
        {activeTab === 'inbox' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200/60 p-3.5 rounded-xl text-xs text-blue-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>
                  <strong>Support Agent Inbox:</strong> You are viewing incoming visitor chats. Replies sent here synchronize instantly to the live chat widget!
                </span>
              </div>
              <button
                onClick={() => setActiveTab('customer')}
                className="underline font-semibold hover:text-blue-700 text-xs shrink-0"
              >
                Switch to Customer View →
              </button>
            </div>
            <AgentInbox
              conversations={conversations}
              selectedConvId={selectedConvId}
              onSelectConversation={setSelectedConvId}
              messages={activeMessages}
              onAgentSendMessage={handleAgentSendMessage}
              onUpdateStatus={handleUpdateStatus}
              onRefresh={() => {}}
            />
          </div>
        )}

        {/* Tab 2: Customer Website View */}
        {activeTab === 'customer' && (
          <div className="relative">
            {/* Demo website backdrop */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-8 sm:p-12 min-h-[680px]">
              <div className="max-w-2xl space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Support is Active
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Modern Customer Support & Live Messaging
                </h1>
                <p className="text-slate-600 text-base leading-relaxed">
                  Test your live chat widget in real time below. Click the floating chat bubble in the bottom right corner, send a query, and see real-time AI and agent responses!
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <h3 className="font-semibold text-sm text-slate-800">Omnichannel Ready</h3>
                    <p className="text-xs text-slate-500 mt-1">Connect your website, email, and social messaging into one shared inbox.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <h3 className="font-semibold text-sm text-slate-800">100% Free on Vercel</h3>
                    <p className="text-xs text-slate-500 mt-1">Serverless compute with zero monthly hosting costs and no credit card required.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Live Widget */}
            <LiveWidget
              conversationId={selectedConvId}
              customerName={activeCustomer?.customerName || 'Visitor'}
              customerEmail={activeCustomer?.customerEmail || 'visitor@example.com'}
              messages={activeMessages}
              onSendMessage={handleCustomerSendMessage}
              isTyping={isTyping}
            />
          </div>
        )}

        {/* Tab 3: Embed Code Guide */}
        {activeTab === 'embed' && <EmbedGuide />}
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Chatwoot Lite...</div>}>
      <MainApp />
    </Suspense>
  )
}

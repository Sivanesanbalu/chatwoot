'use client'

import React, { useState } from 'react'
import {
  Inbox,
  CheckCircle,
  Clock,
  Search,
  Send,
  User,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Mail,
  MessageSquare,
  Sparkles,
  UserCheck,
  RefreshCw,
  ChevronLeft,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Reply,
  Check,
} from 'lucide-react'
import { Conversation, Message } from '@/lib/store'

interface AgentInboxProps {
  conversations: Conversation[]
  selectedConvId: string
  onSelectConversation: (id: string) => void
  messages: Message[]
  onAgentSendMessage: (text: string, channel?: 'website' | 'email') => void
  onUpdateStatus: (id: string, status: 'open' | 'resolved') => void
  onCreateTicket?: (ticket: {
    customerName: string
    customerEmail: string
    subject: string
    message: string
  }) => void
  onRefresh: () => void
}

export default function AgentInbox({
  conversations,
  selectedConvId,
  onSelectConversation,
  messages,
  onAgentSendMessage,
  onUpdateStatus,
  onCreateTicket,
  onRefresh,
}: AgentInboxProps) {
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all')
  const [channelFilter, setChannelFilter] = useState<'all' | 'website' | 'email'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [replyText, setReplyText] = useState('')
  const [replyMode, setReplyMode] = useState<'chat' | 'email'>('chat')
  const [showNewTicketModal, setShowNewTicketModal] = useState(false)
  const [showMobileChat, setShowMobileChat] = useState(false)

  // New ticket state
  const [newTicket, setNewTicket] = useState({
    customerName: '',
    customerEmail: '',
    subject: '',
    message: '',
  })

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0]

  const filteredConversations = conversations.filter((c) => {
    const matchesFilter = filter === 'all' ? true : c.status === filter
    const matchesChannel = channelFilter === 'all' ? true : c.channel === channelFilter
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.subject && c.subject.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesChannel && matchesSearch
  })

  const cannedResponses = [
    'Hi! How can I assist you today?',
    'I am looking into this right now, please give me a moment.',
    'I have updated your ticket details and sent a confirmation to your email.',
    'Thank you for contacting our support desk. Have a wonderful day!',
  ]

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return
    onAgentSendMessage(
      replyText.trim(),
      activeConv?.channel === 'email' || replyMode === 'email' ? 'email' : 'website'
    )
    setReplyText('')
  }

  const handleCreateNewTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTicket.customerEmail || !newTicket.subject || !newTicket.message) return
    onCreateTicket?.(newTicket)
    setNewTicket({ customerName: '', customerEmail: '', subject: '', message: '' })
    setShowNewTicketModal(false)
  }

  const getDeviceIcon = (deviceType: string) => {
    if (deviceType === 'mobile') return <Smartphone className="w-3.5 h-3.5 text-blue-500" />
    if (deviceType === 'tablet') return <Tablet className="w-3.5 h-3.5 text-purple-500" />
    return <Monitor className="w-3.5 h-3.5 text-slate-500" />
  }

  return (
    <div className="h-[780px] bg-white rounded-2xl border border-slate-200 shadow-xl flex overflow-hidden relative">
      {/* 1. Left Icon Navigation (Desktop & Tablet) */}
      <div className="hidden sm:flex w-16 bg-slate-900 flex-col items-center py-5 space-y-6 text-slate-400 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-lg shadow-blue-500/30">
          CW
        </div>
        <div className="flex-1 space-y-3 w-full px-2">
          <button
            onClick={() => {
              setFilter('all')
              setChannelFilter('all')
            }}
            className={`w-full p-2.5 rounded-xl flex justify-center transition ${
              filter === 'all' && channelFilter === 'all'
                ? 'bg-blue-600/20 text-blue-400'
                : 'hover:bg-slate-800 hover:text-white'
            }`}
            title="All Inboxes"
          >
            <Inbox className="w-5 h-5" />
          </button>
          <button
            onClick={() => setChannelFilter(channelFilter === 'email' ? 'all' : 'email')}
            className={`w-full p-2.5 rounded-xl flex justify-center transition ${
              channelFilter === 'email'
                ? 'bg-blue-600/20 text-blue-400'
                : 'hover:bg-slate-800 hover:text-white'
            }`}
            title="Email Tickets Only"
          >
            <Mail className="w-5 h-5" />
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`w-full p-2.5 rounded-xl flex justify-center transition ${
              filter === 'open'
                ? 'bg-blue-600/20 text-blue-400'
                : 'hover:bg-slate-800 hover:text-white'
            }`}
            title="Open Conversations"
          >
            <Clock className="w-5 h-5" />
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`w-full p-2.5 rounded-xl flex justify-center transition ${
              filter === 'resolved'
                ? 'bg-blue-600/20 text-blue-400'
                : 'hover:bg-slate-800 hover:text-white'
            }`}
            title="Resolved"
          >
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={onRefresh}
          className="p-2.5 hover:bg-slate-800 hover:text-white rounded-xl transition"
          title="Refresh Feed"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Conversations Column */}
      <div
        className={`${
          showMobileChat ? 'hidden md:flex' : 'flex'
        } w-full md:w-80 lg:w-96 border-r border-slate-200 flex-col bg-slate-50 shrink-0`}
      >
        {/* Header & Controls */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-base">Inbox Feed</h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                {filteredConversations.length}
              </span>
            </div>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="text-xs font-semibold px-2.5 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" /> New Ticket
            </button>
          </div>

          {/* Channel Filter Chips */}
          <div className="flex gap-1.5 mb-3 text-xs">
            <button
              onClick={() => setChannelFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                channelFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setChannelFilter('website')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition ${
                channelFilter === 'website'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <MessageSquare className="w-3 h-3" /> Live Chat
            </button>
            <button
              onClick={() => setChannelFilter('email')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition ${
                channelFilter === 'email'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Mail className="w-3 h-3" /> Email Tickets
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by customer, email, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <Mail className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No conversations found in this filter.</p>
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = c.id === activeConv?.id
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectConversation(c.id)
                    setShowMobileChat(true)
                  }}
                  className={`p-4 cursor-pointer transition flex items-start space-x-3 ${
                    isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-white'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-semibold flex items-center justify-center text-xs shrink-0">
                    {c.customerName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-slate-900 truncate">
                        {c.customerName}
                      </span>
                      <span className="text-[11px] text-slate-400">{c.lastMessageAt}</span>
                    </div>

                    {c.subject && (
                      <p className="text-xs font-medium text-slate-800 truncate mb-0.5 flex items-center gap-1">
                        {c.channel === 'email' ? (
                          <Mail className="w-3 h-3 text-indigo-500 shrink-0" />
                        ) : (
                          <MessageSquare className="w-3 h-3 text-blue-500 shrink-0" />
                        )}
                        <span>{c.subject}</span>
                      </p>
                    )}

                    <p className="text-xs text-slate-500 truncate mb-1.5">{c.lastMessage}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                            c.status === 'open'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {c.status}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                          {getDeviceIcon(c.deviceType)}
                          <span className="truncate max-w-[90px]">{c.device}</span>
                        </span>
                      </div>
                      {c.unreadCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* 3. Main Chat & Email Thread View */}
      {activeConv ? (
        <div
          className={`${
            showMobileChat ? 'flex' : 'hidden md:flex'
          } flex-1 flex-col bg-white overflow-hidden`}
        >
          {/* Top Bar */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMobileChat(false)}
                className="md:hidden p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                aria-label="Back to conversations"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                {activeConv.customerName.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm leading-tight flex items-center gap-2">
                  <span>{activeConv.customerName}</span>
                  {activeConv.channel === 'email' ? (
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email Ticket
                    </span>
                  ) : (
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Web Live Chat
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400">{activeConv.customerEmail}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  onUpdateStatus(activeConv.id, activeConv.status === 'open' ? 'resolved' : 'open')
                }
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition ${
                  activeConv.status === 'open'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {activeConv.status === 'open' ? 'Mark Resolved' : 'Reopen Ticket'}
                </span>
              </button>
            </div>
          </div>

          {/* Email Subject Header (If Email Ticket) */}
          {activeConv.subject && (
            <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 text-xs flex items-center justify-between shrink-0">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-600" /> Subject: {activeConv.subject}
              </span>
              <span className="text-[11px] text-slate-400">Channel: {activeConv.channel}</span>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40">
            {messages.map((m) => {
              const isAgent = m.sender === 'agent'
              const isBot = m.sender === 'bot'
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                    {isAgent ? (
                      <>
                        <UserCheck className="w-3 h-3 text-blue-600" />
                        <span className="font-medium text-slate-700">You (SIVANESAN B)</span>
                      </>
                    ) : isBot ? (
                      <>
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        <span className="font-medium text-indigo-700">Support Bot</span>
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 text-slate-500" />
                        <span className="font-medium text-slate-700">{m.senderName}</span>
                      </>
                    )}
                    <span>• {m.timestamp}</span>
                    {m.deliveredTo && (
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-500">
                        Delivered to {m.deliveredTo}
                      </span>
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                      isAgent
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : isBot
                        ? 'bg-indigo-50 text-indigo-950 border border-indigo-200 rounded-bl-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Canned Responses */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
            <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium text-[11px]">
              <Sparkles className="w-3 h-3 text-amber-500" /> Quick Replies:
            </span>
            {cannedResponses.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setReplyText(item)}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md shrink-0 text-xs transition"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Reply Composition Box */}
          <form
            onSubmit={handleSend}
            className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0 space-y-2"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <div className="flex items-center gap-3">
                <span className="font-medium text-slate-700">Reply Channel:</span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="replyChannel"
                    checked={replyMode === 'chat'}
                    onChange={() => setReplyMode('chat')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>Live Web Chat</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="replyChannel"
                    checked={replyMode === 'email' || activeConv.channel === 'email'}
                    onChange={() => setReplyMode('email')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-indigo-600" /> Official Email Dispatch
                  </span>
                </label>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Press Enter to send
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={
                  replyMode === 'email' || activeConv.channel === 'email'
                    ? `Dispatch email reply to ${activeConv.customerEmail}...`
                    : `Send live chat reply to ${activeConv.customerName}...`
                }
                className="flex-1 px-4 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className={`px-4 py-2.5 text-white font-medium text-sm rounded-xl transition flex items-center gap-1.5 shadow-sm shrink-0 ${
                  replyMode === 'email' || activeConv.channel === 'email'
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } disabled:opacity-40`}
              >
                {replyMode === 'email' || activeConv.channel === 'email' ? (
                  <>
                    <Mail className="w-4 h-4" /> Send Email
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Chat
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center text-slate-400 text-sm">
          Select a conversation from the left to view messages
        </div>
      )}

      {/* 4. Customer Details Sidebar (Hidden on mobile / tablet, visible on lg screens) */}
      {activeConv && (
        <div className="hidden lg:block w-72 border-l border-slate-200 bg-slate-50 p-5 space-y-6 shrink-0 overflow-y-auto">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Device & Location
            </h4>
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div>
                <span className="text-[11px] text-slate-400">Device Hardware</span>
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  {getDeviceIcon(activeConv.deviceType)}
                  <span>{activeConv.device}</span>
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Operating System</span>
                <p className="text-xs text-slate-700 font-mono">{activeConv.os}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Client / Browser</span>
                <p className="text-xs text-slate-700 font-mono">{activeConv.browser}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeConv.location}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Contact Profile
            </h4>
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="text-[11px] text-slate-400">Full Name</span>
                <p className="font-semibold text-slate-800">{activeConv.customerName}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Email</span>
                <p className="font-mono text-blue-600 truncate">{activeConv.customerEmail}</p>
              </div>
              <div className="pt-1 border-t border-slate-100 flex justify-between">
                <span className="text-slate-400">Assigned Agent</span>
                <span className="font-semibold text-slate-700">SIVANESAN B</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create New Email Support Ticket */}
      {showNewTicketModal && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-600" /> Create Email Support Ticket
              </h3>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewTicketSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newTicket.customerName}
                  onChange={(e) => setNewTicket({ ...newTicket, customerName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="john.doe@company.com"
                  value={newTicket.customerEmail}
                  onChange={(e) => setNewTicket({ ...newTicket, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="[TICKET] Inquiry regarding support services"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Initial message or ticket inquiry..."
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

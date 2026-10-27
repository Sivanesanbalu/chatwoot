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
  Tag,
  CornerDownRight,
  Sparkles,
  Bot,
  UserCheck,
  RefreshCw,
} from 'lucide-react'
import { Conversation, Message } from '@/lib/store'

interface AgentInboxProps {
  conversations: Conversation[]
  selectedConvId: string
  onSelectConversation: (id: string) => void
  messages: Message[]
  onAgentSendMessage: (text: string) => void
  onUpdateStatus: (id: string, status: 'open' | 'resolved') => void
  onRefresh: () => void
}

export default function AgentInbox({
  conversations,
  selectedConvId,
  onSelectConversation,
  messages,
  onAgentSendMessage,
  onUpdateStatus,
  onRefresh,
}: AgentInboxProps) {
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [replyText, setReplyText] = useState('')

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0]

  const filteredConversations = conversations.filter((c) => {
    const matchesFilter = filter === 'all' ? true : c.status === filter
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const cannedResponses = [
    'Hi! How can I assist you today?',
    'I am looking into this right now, please give me a moment.',
    'Is there anything else I can help you with?',
    'Thank you for reaching out! Have a wonderful day.',
  ]

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return
    onAgentSendMessage(replyText.trim())
    setReplyText('')
  }

  return (
    <div className="h-[750px] bg-white rounded-2xl border border-slate-200 shadow-xl flex overflow-hidden">
      {/* 1. Left Icon Navigation */}
      <div className="w-16 bg-slate-900 flex flex-col items-center py-5 space-y-6 text-slate-400">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-lg shadow-blue-500/30">
          CW
        </div>
        <div className="flex-1 space-y-3 w-full px-2">
          <button
            onClick={() => setFilter('all')}
            className={`w-full p-2.5 rounded-xl flex justify-center transition ${
              filter === 'all'
                ? 'bg-blue-600/20 text-blue-400'
                : 'hover:bg-slate-800 hover:text-white'
            }`}
            title="All Conversations"
          >
            <Inbox className="w-5 h-5" />
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
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50">
        {/* Search & Header */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-900 text-base">Conversations</h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
              {filteredConversations.length}
            </span>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No conversations found.
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = c.id === activeConv?.id
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectConversation(c.id)}
                  className={`p-4 cursor-pointer transition flex items-start space-x-3 ${
                    isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-white'
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
                    <p className="text-xs text-slate-500 truncate mb-1.5">
                      {c.lastMessage}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                          c.status === 'open'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {c.status}
                      </span>
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

      {/* 3. Main Chat View */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Top Chat Bar */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                {activeConv.customerName.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                  {activeConv.customerName}
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
                {activeConv.status === 'open' ? 'Mark Resolved' : 'Reopen Conversation'}
              </button>
            </div>
          </div>

          {/* Messages Area */}
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
                        <span className="font-medium text-slate-700">You (Support Agent)</span>
                      </>
                    ) : isBot ? (
                      <>
                        <Bot className="w-3 h-3 text-indigo-500" />
                        <span className="font-medium text-indigo-700">AI Assistant</span>
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 text-slate-500" />
                        <span className="font-medium text-slate-700">{m.senderName}</span>
                      </>
                    )}
                    <span>• {m.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                      isAgent
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : isBot
                        ? 'bg-indigo-50 text-indigo-950 border border-indigo-200 rounded-bl-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Canned Responses */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium text-[11px]">
              <Sparkles className="w-3 h-3 text-amber-500" /> Canned:
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

          {/* Agent Reply Box */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${activeConv.customerName}...`}
              className="flex-1 px-4 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="px-4 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 transition flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Select a conversation from the left to view messages
        </div>
      )}

      {/* 4. Customer Details Sidebar */}
      {activeConv && (
        <div className="w-72 border-l border-slate-200 bg-slate-50 p-5 space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Customer Profile
            </h4>
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div>
                <span className="text-[11px] text-slate-400">Full Name</span>
                <p className="text-sm font-semibold text-slate-800">{activeConv.customerName}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Email Address</span>
                <p className="text-xs text-blue-600 font-mono">{activeConv.customerEmail}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeConv.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeConv.device}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Conversation Details
            </h4>
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Channel</span>
                <span className="font-medium text-slate-700 capitalize">{activeConv.channel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Status</span>
                <span className="font-semibold text-emerald-600 capitalize">{activeConv.status}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Assigned To</span>
                <span className="font-medium text-slate-700">SIVANESAN B</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

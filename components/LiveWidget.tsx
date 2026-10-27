'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  MessageSquare,
  X,
  Send,
  Mail,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  Paperclip,
  Share2,
  Clock,
  Sparkles,
} from 'lucide-react'
import { Message } from '@/lib/store'

interface LiveWidgetProps {
  conversationId: string
  customerName: string
  customerEmail: string
  messages: Message[]
  onSendMessage: (text: string, channel?: 'website' | 'email', subject?: string) => void
  isTyping?: boolean
  devicePreviewMode?: 'responsive' | 'mobile' | 'tablet' | 'desktop'
}

export default function LiveWidget({
  conversationId,
  customerName,
  customerEmail,
  messages,
  onSendMessage,
  isTyping = false,
  devicePreviewMode = 'responsive',
}: LiveWidgetProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'chat' | 'email'>('chat')
  const [inputText, setInputText] = useState('')
  const [transcriptSent, setTranscriptSent] = useState(false)
  const [transcriptEmail, setTranscriptEmail] = useState(customerEmail)
  const [showTranscriptModal, setShowTranscriptModal] = useState(false)

  // Email Ticket Form state
  const [emailForm, setEmailForm] = useState({
    name: customerName,
    email: customerEmail,
    subject: '',
    message: '',
    sent: false,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, activeTab])

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    onSendMessage(inputText.trim(), 'website')
    setInputText('')
  }

  const handleSendEmailTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailForm.subject.trim() || !emailForm.message.trim()) return
    onSendMessage(emailForm.message.trim(), 'email', emailForm.subject.trim())
    setEmailForm((prev) => ({ ...prev, sent: true }))
    setTimeout(() => {
      setEmailForm({
        name: customerName,
        email: customerEmail,
        subject: '',
        message: '',
        sent: false,
      })
      setActiveTab('chat')
    }, 2000)
  }

  const handleSendTranscript = () => {
    if (!transcriptEmail) return
    setTranscriptSent(true)
    setTimeout(() => {
      setTranscriptSent(false)
      setShowTranscriptModal(false)
    }, 2500)
  }

  return (
    <div
      className={`z-50 ${
        devicePreviewMode === 'mobile'
          ? 'relative w-full h-[620px] rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl flex flex-col'
          : devicePreviewMode === 'tablet'
          ? 'relative w-[500px] h-[640px] rounded-2xl overflow-hidden border-2 border-slate-300 shadow-2xl flex flex-col'
          : 'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex flex-col items-end'
      }`}
    >
      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className={`${
            devicePreviewMode === 'mobile' || devicePreviewMode === 'tablet'
              ? 'w-full h-full flex flex-col bg-white'
              : 'fixed inset-0 sm:inset-auto sm:relative sm:bottom-0 sm:right-0 w-full h-full sm:w-[390px] sm:h-[600px] bg-white sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 sm:mb-4'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white p-4 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="sm:hidden p-1 rounded-lg hover:bg-white/10 text-white"
                aria-label="Back"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-base backdrop-blur-sm border border-white/20">
                  CW
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-indigo-700 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight flex items-center gap-1.5">
                  Live Customer Support
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                </h3>
                <p className="text-[11px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Online on Web & Mobile
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowTranscriptModal(!showTranscriptModal)}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
                title="Send Chat Transcript to Email"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hidden sm:flex text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Omnichannel Channel Selector (Live Chat vs Email Ticket) */}
          <div className="bg-slate-100 p-1 flex border-b border-slate-200 shrink-0 text-xs">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition ${
                activeTab === 'chat'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> ⚡ Live Chat
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition ${
                activeTab === 'email'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> ✉️ Email Ticket
            </button>
          </div>

          {/* Transcript Modal Overlay */}
          {showTranscriptModal && (
            <div className="bg-blue-50 border-b border-blue-200 p-3.5 text-xs text-blue-900 animate-in fade-in duration-150 shrink-0">
              <div className="flex items-center justify-between mb-1.5 font-semibold">
                <span>Send Chat Transcript to Email</span>
                <button
                  onClick={() => setShowTranscriptModal(false)}
                  className="text-blue-500 hover:text-blue-800"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-blue-700 mb-2">
                We will email a complete copy of this conversation to your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={transcriptEmail}
                  onChange={(e) => setTranscriptEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="flex-1 px-2.5 py-1 text-xs bg-white border border-blue-300 rounded-lg focus:outline-none"
                />
                <button
                  onClick={handleSendTranscript}
                  disabled={transcriptSent}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition text-xs shrink-0"
                >
                  {transcriptSent ? '✓ Sent!' : 'Send'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: LIVE CHAT VIEW */}
          {activeTab === 'chat' && (
            <>
              {/* Message Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60">
                {messages.map((msg) => {
                  const isMe = msg.sender === 'customer'
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-400 font-medium mb-1 px-1">
                        {msg.senderName} • {msg.timestamp}
                      </span>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-xs'
                            : msg.sender === 'bot'
                            ? 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                            : 'bg-indigo-600 text-white rounded-bl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        {msg.channel === 'email' && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-blue-200 mt-1 pt-1 border-t border-white/20">
                            <Mail className="w-3 h-3" /> Sent via Email
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}

                {isTyping && (
                  <div className="flex items-center space-x-1.5 text-slate-400 bg-white border border-slate-200 px-3 py-2 rounded-2xl w-fit shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100"></span>
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200"></span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Area */}
              <form
                onSubmit={handleSendChat}
                className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3.5 py-2.5 text-sm bg-slate-100 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none transition"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 transition shadow-sm"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* TAB 2: EMAIL TICKET FORM */}
          {activeTab === 'email' && (
            <div className="flex-1 p-5 overflow-y-auto bg-slate-50/50 flex flex-col justify-between">
              {emailForm.sent ? (
                <div className="my-auto text-center p-6 space-y-3 bg-white rounded-2xl border border-emerald-200 shadow-sm animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Email Ticket Dispatched!</h4>
                  <p className="text-xs text-slate-500">
                    Your request has been routed to our support desk. An agent will respond to{' '}
                    <strong>{emailForm.email}</strong> shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendEmailTicket} className="space-y-3.5">
                  <div className="bg-indigo-50 border border-indigo-200/80 p-3 rounded-xl text-xs text-indigo-950 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>
                      Replies will be delivered directly to your email inbox with full ticket tracking.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={emailForm.email}
                      onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Question regarding pricing or setup"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Message Details
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your issue or inquiry in detail..."
                      value={emailForm.message}
                      onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Support Ticket
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Footer Branding */}
          <div className="py-2 text-center bg-white text-[11px] text-slate-400 border-t border-slate-100 shrink-0 flex items-center justify-center gap-1">
            <Smartphone className="w-3 h-3 text-slate-400" />
            <span>Mobile, Tablet & Email Enabled • Powered by Chatwoot Lite</span>
          </div>
        </div>
      )}

      {/* Floating Trigger Button (Shown on desktop & when closed) */}
      {(!isOpen || devicePreviewMode === 'responsive') && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none ring-4 ring-blue-500/20 ${
            isOpen ? 'hidden sm:flex' : 'flex'
          }`}
          aria-label="Toggle Live Chat"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      )}
    </div>
  )
}

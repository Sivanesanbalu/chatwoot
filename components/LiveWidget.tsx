'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, Smile, Paperclip, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Message } from '@/lib/store'

interface LiveWidgetProps {
  conversationId: string
  customerName: string
  customerEmail: string
  messages: Message[]
  onSendMessage: (text: string) => void
  isTyping?: boolean
}

export default function LiveWidget({
  conversationId,
  customerName,
  customerEmail,
  messages,
  onSendMessage,
  isTyping = false,
}: LiveWidgetProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    onSendMessage(inputText.trim())
    setInputText('')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[380px] h-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 mb-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-base backdrop-blur-sm">
                  CW
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-blue-600 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight flex items-center gap-1.5">
                  Live Customer Support
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                </h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Replies typically within 2 mins
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Badge Notice */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 text-xs text-slate-500 flex justify-between items-center">
            <span>Chatting as <strong className="text-slate-700">{customerName}</strong></span>
            <span className="text-[11px] bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">Online</span>
          </div>

          {/* Message Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
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
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : msg.sender === 'bot'
                        ? 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                        : 'bg-indigo-600 text-white rounded-bl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              )
            })}

            {isTyping && (
              <div className="flex items-center space-x-1.5 text-slate-400 bg-white border border-slate-200 px-3 py-2 rounded-2xl w-fit shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-typing"></span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-typing delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-typing delay-200"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 px-3.5 py-2 text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-blue-500 rounded-xl focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 transition shadow-sm"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Branding */}
          <div className="py-1 text-center bg-white text-[11px] text-slate-400 border-t border-slate-100">
            Powered by <strong>Chatwoot Lite</strong> • Deployed on Vercel
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none ring-4 ring-blue-500/20"
        aria-label="Toggle Live Chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  )
}

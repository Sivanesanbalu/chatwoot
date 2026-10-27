'use client'

import React, { useState } from 'react'
import { Mail, Check, ShieldCheck, Copy, ArrowRight, Settings, Send, Server, Sparkles } from 'lucide-react'

export default function EmailChannelSettings() {
  const [copied, setCopied] = useState(false)
  const [testEmailSent, setTestEmailSent] = useState(false)
  const [recipient, setRecipient] = useState('sivanesanbalu@gmail.com')

  const inboundEmail = 'support@chatwoot-fawn.vercel.app'

  const handleCopy = () => {
    navigator.clipboard.writeText(inboundEmail)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendTestEmail = (e: React.FormEvent) => {
    e.preventDefault()
    setTestEmailSent(true)
    setTimeout(() => setTestEmailSent(false), 3000)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold mb-3">
          <Mail className="w-3.5 h-3.5" /> Omnichannel Email Helpdesk
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Email Channel & Device Forwarding
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Receive customer emails directly inside your Chatwoot Lite Inbox and reply via email or live chat across all devices.
        </p>
      </div>

      {/* Inbound Forwarding Card */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-emerald-400" /> Dedicated Inbound Support Address
          </span>
          <span className="text-[11px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
            Active
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full sm:flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 font-mono text-sm text-emerald-300 truncate">
            {inboundEmail}
          </div>
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 shrink-0 shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Support Email'}
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Tip:</strong> Forward incoming emails from your business address (e.g., <code>support@yourcompany.com</code>) to this inbound address. Each customer email automatically opens a ticket in your Agent Inbox!
        </p>
      </div>

      {/* Test Email Dispatcher */}
      <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Send className="w-4 h-4 text-indigo-600" /> Test Live Email Dispatch
        </h3>
        <p className="text-xs text-slate-500">
          Simulate an outbound email from your support desk to verify how the customer receives your response.
        </p>

        <form onSubmit={handleSendTestEmail} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter your email to receive a test..."
            className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={testEmailSent}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-1.5 shrink-0"
          >
            {testEmailSent ? <Check className="w-4 h-4 text-emerald-400" /> : <Send className="w-4 h-4" />}
            {testEmailSent ? 'Email Dispatched!' : 'Send Test Email'}
          </button>
        </form>
      </div>

      {/* Multi-Device Support Matrix */}
      <div>
        <h3 className="font-bold text-sm text-slate-900 mb-3">
          Cross-Device & Mail Client Compatibility
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
            <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
              📱 Mobile (iOS & Android)
            </h4>
            <p className="text-slate-500">
              iPhone, iPad, Samsung, Google Pixel. Full touch gestures and mobile drawer UI.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
            <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
              ✉️ Mail Clients (IMAP/SMTP)
            </h4>
            <p className="text-slate-500">
              Gmail, Apple Mail, Outlook, Thunderbird, Yahoo Mail. Automated threading.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
            <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
              💻 Desktop Web Browsers
            </h4>
            <p className="text-slate-500">
              Chrome, Safari, Edge, Firefox, Brave. Instant WebSocket & HTTP fallback.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

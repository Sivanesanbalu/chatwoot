'use client'

import React, { useState } from 'react'
import { Copy, Check, Code, Globe, ShieldAlert } from 'lucide-react'

export default function EmbedGuide() {
  const [copied, setCopied] = useState(false)

  const embedCode = `<!-- Chatwoot Lite Live Chat Widget -->
<script>
  (function(d,t) {
    var BASE_URL = window.location.origin;
    var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
    g.src = BASE_URL + "/widget.js";
    g.async = true;
    s.parentNode.insertBefore(g, s);
  })(document,"script");
</script>`

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-3">
          <Code className="w-3.5 h-3.5" /> 1-Minute Website Integration
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Embed Live Chat on Any Website
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Paste this snippet right before the closing <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded">&lt;/body&gt;</code> tag on your WordPress, Shopify, Next.js, or HTML site.
        </p>
      </div>

      {/* Code Snippet Box */}
      <div className="relative bg-slate-900 rounded-xl p-5 text-slate-100 font-mono text-xs overflow-x-auto">
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs flex items-center gap-1.5 transition border border-slate-700"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
        <pre className="pr-20 leading-relaxed text-blue-200">{embedCode}</pre>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-sm text-slate-900 mb-1">Instant Realtime</h4>
          <p className="text-xs text-slate-500">
            Messages synchronize instantly between your visitor and your Vercel Agent Inbox.
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-sm text-slate-900 mb-1">AI Automated Replies</h4>
          <p className="text-xs text-slate-500">
            Built-in intelligent support bot answers common customer questions when you are offline.
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-sm text-slate-900 mb-1">Zero Monthly Hosting Fees</h4>
          <p className="text-xs text-slate-500">
            Deployed on Vercel with 100% free serverless compute and no credit card required.
          </p>
        </div>
      </div>
    </div>
  )
}

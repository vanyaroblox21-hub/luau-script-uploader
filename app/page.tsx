'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Check, Clipboard, Code2, ExternalLink, FileCode2, Info, KeyRound, Loader2, RotateCcw, ShieldCheck, Sparkles, UploadCloud, X } from 'lucide-react'

type Platform = 'pastefy' | 'pastebin'
type Result = { url: string; rawUrl: string; platform: Platform }
type ApiData = { url?: string; rawUrl?: string; error?: string; paste?: { url?: string; link?: string; raw_url?: string } }

const inputClass = 'w-full rounded-xl border border-slate-700/90 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-[.14em] text-slate-400'

export default function Home() {
  const [section, setSection] = useState<'upload' | 'about'>('upload')
  const [platform, setPlatform] = useState<Platform>('pastefy')
  const [token, setToken] = useState('')
  const [devKey, setDevKey] = useState('')
  const [userKey, setUserKey] = useState('')
  const [title, setTitle] = useState('Script.lua')
  const [format, setFormat] = useState('lua')
  const [visibility, setVisibility] = useState('0')
  const [expire, setExpire] = useState('N')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [copied, setCopied] = useState('')

  useEffect(() => { const saved = window.localStorage.getItem('pastefy-draft'); if (saved) setCode(saved) }, [])
  useEffect(() => { if (code) window.localStorage.setItem('pastefy-draft', code) }, [code])

  const copy = async (value: string, name: string) => {
    try { await navigator.clipboard.writeText(value); setCopied(name); window.setTimeout(() => setCopied(''), 1800) }
    catch { setError('Clipboard access is unavailable. Select and copy the value manually.') }
  }
  const clearDraft = () => { setCode(''); window.localStorage.removeItem('pastefy-draft'); setResult(null); setError('') }
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setResult(null)
    if (!code.trim()) return setError('Add some Luau code before publishing.')
    if (code.length > 500000) return setError('Your script is larger than the 500,000 character limit.')
    if (platform === 'pastebin' && !devKey.trim()) return setError('Pastebin requires an API developer key.')
    setLoading(true)
    try {
      let data: ApiData
      if (platform === 'pastefy') {
        const response = await fetch('https://pastefy.app/api/v2/paste', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ content: code, title: title.trim() || 'Script.lua' }) })
        data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || 'Pastefy rejected the request.')
        const url = data.url || data.paste?.url || data.paste?.link
        const rawUrl = data.rawUrl || data.paste?.raw_url || (url ? `${url}/raw` : '')
        if (!url || !rawUrl) throw new Error('Pastefy returned an unexpected response. Please try again.')
        setResult({ url, rawUrl, platform })
      } else {
        const response = await fetch('/api/pastebin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ api_dev_key: devKey, api_user_key: userKey, api_paste_code: code, api_paste_name: title.trim() || 'Script.lua', api_paste_format: format, api_paste_private: visibility, api_paste_expire_date: expire }) })
        data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || 'Pastebin rejected the request.')
        if (!data.url || !data.rawUrl) throw new Error('Pastebin returned an unexpected response. Please try again.')
        setResult({ url: data.url, rawUrl: data.rawUrl, platform })
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong while publishing.') }
    finally { setLoading(false) }
  }
  const loadstring = result ? `loadstring(game:HttpGet("${result.rawUrl}"))()` : ''

  return <main className="grid-bg min-h-screen overflow-hidden"><div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-10">
    <header className="mb-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
      <div><div className="mb-5 flex items-center gap-3"><div className="rounded-2xl bg-indigo-500/15 p-3 text-indigo-300 ring-1 ring-indigo-400/20"><Code2 size={24}/></div><span className="font-mono text-sm font-bold tracking-[.28em] text-indigo-300">PASTEFY</span><span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">Online</span></div><h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-6xl">Publish code.<br/><span className="bg-gradient-to-r from-indigo-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Ship faster.</span></h1><p className="mt-5 max-w-lg text-base leading-7 text-slate-400">The clean, fast way to publish Luau scripts and turn them into ready-to-use Roblox loadstrings.</p></div>
      <nav aria-label="Main navigation" className="flex rounded-xl border border-slate-800 bg-slate-900/80 p-1 shadow-lg"><button onClick={() => setSection('upload')} className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${section === 'upload' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950' : 'text-slate-400 hover:text-white'}`}>Upload</button><button onClick={() => setSection('about')} className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${section === 'about' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950' : 'text-slate-400 hover:text-white'}`}>How it works</button></nav>
    </header>
    {section === 'about' ? <About/> : <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
      <section className="glow rounded-2xl border border-slate-800 bg-slate-950/85 p-5 sm:p-7"><div className="mb-7 flex items-start justify-between"><div><div className="mb-2 flex items-center gap-2 text-indigo-300"><Sparkles size={16}/><span className="text-xs font-bold uppercase tracking-[.15em]">New paste</span></div><h2 className="text-xl font-bold text-white">Create something useful</h2><p className="mt-1 text-sm text-slate-500">Your credentials are never stored by Pastefy.</p></div><ShieldCheck className="text-slate-600" size={22}/></div>
        <div className="mb-7 grid grid-cols-2 rounded-xl border border-slate-800 bg-slate-900/60 p-1"><button onClick={() => { setPlatform('pastefy'); setError('') }} className={`rounded-lg py-3 text-sm font-bold transition ${platform === 'pastefy' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Pastefy <span className="ml-1 text-[10px] opacity-70">RECOMMENDED</span></button><button onClick={() => { setPlatform('pastebin'); setError('') }} className={`rounded-lg py-3 text-sm font-bold transition ${platform === 'pastebin' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Pastebin</button></div>
        <form onSubmit={submit} className="space-y-5">
          {platform === 'pastefy' ? <div><label className={labelClass}>Pastefy API token <span className="normal-case tracking-normal text-slate-600">(optional)</span></label><div className="relative"><KeyRound className="absolute left-3 top-3.5 text-slate-600" size={17}/><input className={`${inputClass} pl-10`} type="password" value={token} onChange={e => setToken(e.target.value)} placeholder="Bearer token" autoComplete="off"/></div></div> : <div className="grid gap-5 sm:grid-cols-2"><div><label className={labelClass}>Developer key</label><input className={inputClass} value={devKey} onChange={e => setDevKey(e.target.value)} placeholder="Required" type="password" autoComplete="off"/></div><div><label className={labelClass}>User key <span className="normal-case tracking-normal text-slate-600">(optional)</span></label><input className={inputClass} value={userKey} onChange={e => setUserKey(e.target.value)} placeholder="Optional" type="password" autoComplete="off"/></div></div>}
          <div className="grid gap-5 sm:grid-cols-2"><div><label className={labelClass}>Paste title</label><input className={inputClass} value={title} maxLength={120} onChange={e => setTitle(e.target.value)} placeholder="Script.lua"/></div>{platform === 'pastebin' && <div><label className={labelClass}>Syntax</label><select className={inputClass} value={format} onChange={e => setFormat(e.target.value)}><option value="lua">Lua</option><option value="text">Plain text</option><option value="javascript">JavaScript</option><option value="python">Python</option></select></div>}</div>
          {platform === 'pastebin' && <div className="grid gap-5 sm:grid-cols-2"><div><label className={labelClass}>Visibility</label><select className={inputClass} value={visibility} onChange={e => setVisibility(e.target.value)}><option value="0">Public</option><option value="1">Unlisted</option><option value="2">Private</option></select></div><div><label className={labelClass}>Expiration</label><select className={inputClass} value={expire} onChange={e => setExpire(e.target.value)}><option value="N">Never</option><option value="10M">10 minutes</option><option value="1H">1 hour</option><option value="1D">1 day</option><option value="1W">1 week</option><option value="1M">1 month</option></select></div></div>}
          <div><div className="mb-2 flex items-center justify-between"><label className={labelClass}>Source code</label><span className="font-mono text-xs text-slate-600">{code.length.toLocaleString()} / 500,000</span></div><textarea className={`${inputClass} min-h-[300px] resize-y font-mono text-sm leading-6`} value={code} onChange={e => setCode(e.target.value)} placeholder="-- paste your Luau script here\nprint('Hello from Pastefy')" spellCheck={false}/></div>
          {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm leading-5 text-red-300"><AlertCircle size={18} className="mt-0.5 shrink-0"/>{error}</div>}
          <div className="flex flex-col gap-3 sm:flex-row"><button type="submit" disabled={loading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">{loading ? <><Loader2 className="animate-spin" size={18}/> Publishing...</> : <><UploadCloud size={18}/> Publish to {platform === 'pastefy' ? 'Pastefy' : 'Pastebin'}</>}</button><button type="button" onClick={clearDraft} className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-slate-500 hover:text-white"><RotateCcw size={16}/> Clear</button></div>
        </form>
      </section>
      <aside>{result ? <ResultCard result={result} loadstring={loadstring} copy={copy}/> : <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/45 p-6 lg:sticky lg:top-6"><div className="mb-5 inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400"><FileCode2/></div><h3 className="font-bold text-white">Your result lands here</h3><p className="mt-2 text-sm leading-6 text-slate-500">Publish a script to receive a raw URL and a ready-to-paste Roblox loadstring.</p><div className="mt-6 space-y-3 border-t border-slate-800 pt-5 text-xs text-slate-600"><p><span className="mr-2 text-indigo-400">01</span> Pick a paste provider.</p><p><span className="mr-2 text-indigo-400">02</span> Add your source code.</p><p><span className="mr-2 text-indigo-400">03</span> Copy your generated snippet.</p></div></div>}</aside>
    </div>}
    <footer className="mt-12 flex items-center justify-between border-t border-slate-900 pt-5 text-xs text-slate-600"><span>Pastefy · built for developers</span><span className="font-mono">v1.1.0</span></footer>
    {copied && <div role="status" className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-500/30 bg-slate-900 px-4 py-2 text-sm text-emerald-300 shadow-xl"><Check size={16}/> Copied!</div>}
  </div></main>
}

function ResultCard({ result, loadstring, copy }: { result: Result; loadstring: string; copy: (value: string, name: string) => void }) { return <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[.04] p-5 shadow-[0_0_55px_rgba(16,185,129,.08)] lg:sticky lg:top-6"><div className="mb-5 flex items-center gap-3"><div className="rounded-full bg-emerald-500/15 p-2 text-emerald-400"><Check size={18}/></div><div><h3 className="font-bold text-white">Published successfully</h3><p className="text-xs capitalize text-emerald-400">Live on {result.platform}</p></div></div><label className={labelClass}>Loadstring</label><div className="relative mb-5 rounded-xl border border-slate-700 bg-slate-950 p-3 pr-11"><code className="break-all font-mono text-xs leading-5 text-indigo-300">{loadstring}</code><button onClick={() => copy(loadstring, 'load')} className="absolute right-2 top-2 rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white" aria-label="Copy loadstring"><Clipboard size={16}/></button></div><label className={labelClass}>Raw URL</label><div className="relative mb-5 rounded-xl border border-slate-700 bg-slate-950 p-3 pr-11"><a href={result.rawUrl} target="_blank" rel="noreferrer" className="block truncate text-sm text-indigo-400 hover:underline">{result.rawUrl}</a><button onClick={() => copy(result.rawUrl, 'url')} className="absolute right-2 top-2 rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white" aria-label="Copy raw URL"><Clipboard size={16}/></button></div><a href={result.url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-sm font-bold text-slate-200 hover:border-indigo-500 hover:text-white"><ExternalLink size={16}/> Open live paste</a></div> }

function About() { return <section className="glow mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-950/85 p-6 sm:p-9"><div className="mb-8 flex items-center gap-3"><Info className="text-indigo-400"/><h2 className="text-xl font-bold text-white">How Pastefy works</h2></div><div className="space-y-7 text-sm leading-7 text-slate-400"><div><h3 className="mb-1 font-bold text-white">Choose a destination</h3><p>Pastefy is the recommended destination and supports optional bearer authentication. Pastebin is also available and uses a secure Next.js server proxy to avoid browser CORS restrictions.</p></div><div><h3 className="mb-1 font-bold text-white">Publish your source</h3><p>Add a title, paste your Luau source, and publish. Draft code is saved locally in your browser for convenience; API credentials are never saved.</p></div><div><h3 className="mb-1 font-bold text-white">Copy the result</h3><p>Pastefy gives you the live page, raw content URL, and complete <code className="rounded bg-slate-900 px-1.5 py-1 font-mono text-indigo-300">loadstring(game:HttpGet(...))()</code> snippet.</p></div><div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-amber-200/80"><ShieldCheck className="mt-1 shrink-0 text-amber-300" size={18}/><span><strong className="text-amber-200">Safety note:</strong> Only execute scripts you own or trust, and follow Roblox and provider terms of service.</span></div></div></section> }

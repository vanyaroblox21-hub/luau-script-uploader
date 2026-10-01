'use client'

import { useState } from 'react'
import { Check, Clipboard, Code2, ExternalLink, FileCode2, Info, KeyRound, Loader2, UploadCloud, X } from 'lucide-react'

type Platform = 'pastefy' | 'pastebin'
type Result = { url: string; rawUrl: string; platform: Platform }

const inputClass = 'w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400'

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

  const copy = async (value: string, name: string) => { await navigator.clipboard.writeText(value); setCopied(name); setTimeout(() => setCopied(''), 1800) }
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setResult(null)
    if (!code.trim()) return setError('Add some Luau code before publishing.')
    if (platform === 'pastebin' && !devKey.trim()) return setError('Pastebin requires an API developer key.')
    setLoading(true)
    try {
      let data: { url?: string; rawUrl?: string; error?: string }
      if (platform === 'pastefy') {
        const response = await fetch('https://pastefy.app/api/v2/paste', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ content: code, title }) })
        data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || 'Pastefy rejected the request.')
        const url = data.url || (data as any).paste?.url || (data as any).paste?.link
        const rawUrl = data.rawUrl || (data as any).paste?.raw_url || (url ? `${url}/raw` : '')
        if (!url || !rawUrl) throw new Error('Pastefy returned an unexpected response.')
        setResult({ url, rawUrl, platform })
      } else {
        const response = await fetch('/api/pastebin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ api_dev_key: devKey, api_user_key: userKey, api_paste_code: code, api_paste_name: title, api_paste_format: format, api_paste_private: visibility, api_paste_expire_date: expire }) })
        data = await response.json(); if (!response.ok) throw new Error(data.error || 'Pastebin rejected the request.')
        setResult({ url: data.url!, rawUrl: data.rawUrl!, platform })
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong while publishing.') } finally { setLoading(false) }
  }
  const loadstring = result ? `loadstring(game:HttpGet("${result.rawUrl}"))()` : ''

  return <main className="grid-bg min-h-screen overflow-hidden">
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <header className="mb-10 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
        <div><div className="mb-4 flex items-center gap-3"><div className="rounded-xl bg-indigo-500/15 p-2.5 text-indigo-400"><Code2 size={25}/></div><span className="font-mono text-sm font-bold tracking-widest text-indigo-300">LUAU HUB</span></div><h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl">Ship scripts.<br/><span className="text-indigo-400">Run anywhere.</span></h1><p className="mt-4 max-w-lg text-slate-400">A focused publishing tool for Roblox developers. Upload once, get a clean loadstring instantly.</p></div>
        <div className="flex rounded-xl border border-slate-800 bg-slate-900/70 p-1"><button onClick={() => setSection('upload')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${section === 'upload' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Upload Tool</button><button onClick={() => setSection('about')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${section === 'about' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>About / Instructions</button></div>
      </header>
      {section === 'about' ? <About/> : <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-glow sm:p-7"><div className="mb-7 flex items-center justify-between"><div><h2 className="text-lg font-bold text-white">Publish a script</h2><p className="mt-1 text-sm text-slate-500">Choose a platform and configure your paste.</p></div><UploadCloud className="text-indigo-400"/></div>
          <div className="mb-7 grid grid-cols-2 rounded-xl border border-slate-800 bg-slate-900/50 p-1"><button onClick={() => {setPlatform('pastefy');setError('')}} className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold ${platform === 'pastefy' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Pastefy</button><button onClick={() => {setPlatform('pastebin');setError('')}} className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold ${platform === 'pastebin' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>Pastebin</button></div>
          <form onSubmit={submit} className="space-y-5">
            {platform === 'pastefy' ? <div><label className={labelClass}>Pastefy API token <span className="normal-case tracking-normal text-slate-600">(optional)</span></label><div className="relative"><KeyRound className="absolute left-3 top-3.5 text-slate-600" size={17}/><input className={`${inputClass} pl-10`} type="password" value={token} onChange={e=>setToken(e.target.value)} placeholder="Bearer token"/></div></div> : <div className="grid gap-5 sm:grid-cols-2"><div><label className={labelClass}>API developer key</label><input className={inputClass} value={devKey} onChange={e=>setDevKey(e.target.value)} placeholder="Required" type="password"/></div><div><label className={labelClass}>API user key <span className="normal-case tracking-normal text-slate-600">(optional)</span></label><input className={inputClass} value={userKey} onChange={e=>setUserKey(e.target.value)} placeholder="Optional" type="password"/></div></div>}
            <div className="grid gap-5 sm:grid-cols-2"><div><label className={labelClass}>{platform === 'pastefy' ? 'Script title' : 'Paste title'}</label><input className={inputClass} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Script.lua"/></div>{platform === 'pastebin' && <div><label className={labelClass}>Format / syntax</label><select className={inputClass} value={format} onChange={e=>setFormat(e.target.value)}><option value="lua">Lua</option><option value="text">Plain text</option><option value="javascript">JavaScript</option><option value="python">Python</option></select></div>}</div>
            {platform === 'pastebin' && <div className="grid gap-5 sm:grid-cols-2"><div><label className={labelClass}>Visibility</label><select className={inputClass} value={visibility} onChange={e=>setVisibility(e.target.value)}><option value="0">Public</option><option value="1">Unlisted</option><option value="2">Private</option></select></div><div><label className={labelClass}>Expiration</label><select className={inputClass} value={expire} onChange={e=>setExpire(e.target.value)}><option value="N">Never</option><option value="10M">10 minutes</option><option value="1H">1 hour</option><option value="1D">1 day</option><option value="1W">1 week</option><option value="2W">2 weeks</option><option value="1M">1 month</option></select></div></div>}
            <div><div className="mb-2 flex items-center justify-between"><label className={labelClass}>Source code / Luau script</label><span className="font-mono text-xs text-slate-600">{code.length} chars</span></div><textarea className={`${inputClass} min-h-[280px] resize-y font-mono text-sm leading-6`} value={code} onChange={e=>setCode(e.target.value)} placeholder="-- paste your Luau script here\nprint('Hello from Luau Hub')" spellCheck={false}/></div>
            {error && <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"><X size={18} className="mt-0.5 shrink-0"/>{error}</div>}
            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">{loading ? <><Loader2 className="animate-spin" size={18}/> Publishing...</> : <><UploadCloud size={18}/> Publish to {platform === 'pastefy' ? 'Pastefy' : 'Pastebin'}</>}</button>
          </form>
        </section>
        <aside>{result ? <ResultCard result={result} loadstring={loadstring} copy={copy} copied={copied}/> : <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-6 lg:sticky lg:top-6"><div className="mb-5 inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400"><FileCode2/></div><h3 className="font-bold text-white">Your result lands here</h3><p className="mt-2 text-sm leading-6 text-slate-500">Publish a script to receive a raw URL and a ready-to-paste Roblox loadstring.</p><div className="mt-6 space-y-3 text-xs text-slate-600"><p>01 &nbsp; Code is sent directly to the selected platform.</p><p>02 &nbsp; We resolve the raw content URL.</p><p>03 &nbsp; Copy and execute in your environment.</p></div></div>}</aside>
      </div>}
      <footer className="mt-12 flex items-center justify-between border-t border-slate-900 pt-5 text-xs text-slate-600"><span>Built for Luau developers</span><span className="font-mono">v1.0.0</span></footer>
    </div>
    {copied && <div className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-500/30 bg-slate-900 px-4 py-2 text-sm text-emerald-300 shadow-xl"><Check size={16}/> Copied!</div>}
  </main>
}

function ResultCard({ result, loadstring, copy, copied }: { result: Result; loadstring: string; copy: (v:string,n:string)=>void; copied:string }) { return <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[.04] p-5 shadow-glow lg:sticky lg:top-6"><div className="mb-5 flex items-center gap-3"><div className="rounded-full bg-emerald-500/15 p-2 text-emerald-400"><Check size={18}/></div><div><h3 className="font-bold text-white">Published successfully</h3><p className="text-xs text-emerald-400">Live on {result.platform}</p></div></div><label className={labelClass}>Loadstring</label><div className="relative mb-5 rounded-xl border border-slate-700 bg-slate-950 p-3 pr-11"><code className="break-all font-mono text-xs leading-5 text-indigo-300">{loadstring}</code><button onClick={()=>copy(loadstring,'load')} className="absolute right-2 top-2 rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white" aria-label="Copy loadstring"><Clipboard size={16}/></button></div><label className={labelClass}>Raw URL</label><div className="relative mb-5 rounded-xl border border-slate-700 bg-slate-950 p-3 pr-11"><a href={result.rawUrl} target="_blank" rel="noreferrer" className="block truncate text-sm text-indigo-400 hover:underline">{result.rawUrl}</a><button onClick={()=>copy(result.rawUrl,'url')} className="absolute right-2 top-2 rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white" aria-label="Copy raw URL"><Clipboard size={16}/></button></div><a href={result.url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-sm font-bold text-slate-200 hover:border-indigo-500 hover:text-white"><ExternalLink size={16}/> Open live paste</a></div> }

function About() { return <section className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-glow sm:p-9"><div className="mb-8 flex items-center gap-3"><Info className="text-indigo-400"/><h2 className="text-xl font-bold text-white">How Luau Hub works</h2></div><div className="space-y-7 text-sm leading-7 text-slate-400"><div><h3 className="mb-1 font-bold text-white">Choose a destination</h3><p>Pastefy is quick and supports optional bearer authentication. Pastebin uses your developer key and is submitted through a secure Next.js server proxy to avoid browser CORS restrictions.</p></div><div><h3 className="mb-1 font-bold text-white">Publish your source</h3><p>Add a title, paste your Luau source, then select Publish. API credentials stay in your browser and are only sent to the service required for that upload.</p></div><div><h3 className="mb-1 font-bold text-white">Use the generated wrapper</h3><p>The result includes the platform page, its raw content URL, and a complete <code className="rounded bg-slate-900 px-1.5 py-1 font-mono text-indigo-300">loadstring(game:HttpGet(...))()</code> snippet ready to copy.</p></div><div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-amber-200/80"><strong className="text-amber-200">Safety note:</strong> Only execute scripts you own or trust, and follow Roblox and platform terms of service.</div></div></section> }

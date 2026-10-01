import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Luau Hub — Multi-platform script uploader',
  description: 'Publish Roblox Luau scripts to Pastefy or Pastebin and generate ready-to-run loadstrings.'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}

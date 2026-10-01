import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pastefy — Luau publishing made simple',
  description: 'Publish Roblox Luau scripts to Pastefy or Pastebin and generate ready-to-use loadstrings.',
  applicationName: 'Pastefy'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}

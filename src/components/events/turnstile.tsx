'use client'

import { useEffect, useRef } from 'react'

type TurnstileApi = {
  render: (el: HTMLElement, options: { sitekey: string }) => string
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

function loadScript() {
  return new Promise<void>((resolve) => {
    if (window.turnstile) return resolve()
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = SCRIPT_SRC
      script.async = true
      document.head.appendChild(script)
    }
    script.addEventListener('load', () => resolve(), { once: true })
  })
}

// Renders the widget inside the form, which adds the `cf-turnstile-response` input.
export function Turnstile({ siteKey }: { siteKey: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let id: string | undefined
    let cancelled = false
    loadScript().then(() => {
      if (!cancelled && ref.current && window.turnstile) id = window.turnstile.render(ref.current, { sitekey: siteKey })
    })
    return () => {
      cancelled = true
      if (id) window.turnstile?.remove(id)
    }
  }, [siteKey])

  return <div ref={ref} className="min-h-[65px]" />
}

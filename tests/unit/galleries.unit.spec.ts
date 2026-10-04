import { describe, expect, it } from 'vitest'

import { isVideoEmbedUrl, toVideoEmbed } from '@/lib/galleries'

const youtube = (id: string) => ({ provider: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}` })

describe('toVideoEmbed', () => {
  it('accepts youtu.be short links', () => {
    expect(toVideoEmbed('https://youtu.be/dQw4w9WgXcQ')).toEqual(youtube('dQw4w9WgXcQ'))
    expect(toVideoEmbed('https://youtu.be/dQw4w9WgXcQ?si=abc&t=42')).toEqual(youtube('dQw4w9WgXcQ'))
  })

  it('accepts watch?v= links on any YouTube host', () => {
    expect(toVideoEmbed('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toEqual(youtube('dQw4w9WgXcQ'))
    expect(toVideoEmbed('https://youtube.com/watch?v=dQw4w9WgXcQ&list=PL123')).toEqual(youtube('dQw4w9WgXcQ'))
    expect(toVideoEmbed('https://m.youtube.com/watch?v=dQw4w9WgXcQ')).toEqual(youtube('dQw4w9WgXcQ'))
  })

  it('accepts /shorts/, /embed/ and /live/ links', () => {
    expect(toVideoEmbed('https://www.youtube.com/shorts/abcDEF12345')).toEqual(youtube('abcDEF12345'))
    expect(toVideoEmbed('https://www.youtube.com/embed/abcDEF12345')).toEqual(youtube('abcDEF12345'))
    expect(toVideoEmbed('https://www.youtube.com/live/abcDEF12345?feature=share')).toEqual(youtube('abcDEF12345'))
  })

  it('rejects YouTube links without a video id', () => {
    expect(toVideoEmbed('https://www.youtube.com/')).toBeNull()
    expect(toVideoEmbed('https://www.youtube.com/@ChessSriLanka')).toBeNull()
    expect(toVideoEmbed('https://youtu.be/')).toBeNull()
    expect(toVideoEmbed('https://www.youtube.com/watch?v=<script>')).toBeNull()
  })

  it('wraps Facebook links in the video plugin', () => {
    const url = 'https://www.facebook.com/chessSL/videos/1234567890/'
    expect(toVideoEmbed(url)).toEqual({
      provider: 'facebook',
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`,
    })
    expect(toVideoEmbed('https://fb.watch/abc123/')?.provider).toBe('facebook')
    expect(toVideoEmbed('https://m.facebook.com/watch/?v=1234567890')?.provider).toBe('facebook')
  })

  it('rejects http links', () => {
    expect(toVideoEmbed('http://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBeNull()
    expect(toVideoEmbed('http://youtu.be/dQw4w9WgXcQ')).toBeNull()
    expect(toVideoEmbed('http://www.facebook.com/chessSL/videos/1234567890/')).toBeNull()
  })

  it('rejects other hosts and lookalikes', () => {
    expect(toVideoEmbed('https://vimeo.com/123456')).toBeNull()
    expect(toVideoEmbed('https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ')).toBeNull()
    expect(toVideoEmbed('https://notyoutube.com/watch?v=dQw4w9WgXcQ')).toBeNull()
    expect(toVideoEmbed('https://facebook.com@evil.example/video')).toBeNull()
  })

  it('rejects values that are not URLs', () => {
    expect(toVideoEmbed('')).toBeNull()
    expect(toVideoEmbed('dQw4w9WgXcQ')).toBeNull()
    expect(toVideoEmbed('javascript:alert(1)')).toBeNull()
  })

  it('backs the admin validator', () => {
    expect(isVideoEmbedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true)
    expect(isVideoEmbedUrl('https://example.com/video.mp4')).toBe(false)
  })
})

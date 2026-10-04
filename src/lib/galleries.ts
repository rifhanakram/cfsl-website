export const MAX_VIDEO_BYTES = 100 * 1024 * 1024

const YOUTUBE_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be']
const FACEBOOK_HOSTS = ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.watch']
const FACEBOOK_VIDEO_PATH = /\/(videos|watch|reel)(\/|$)/

export type VideoEmbed = { provider: 'youtube' | 'facebook'; src: string }

// Turns a YouTube or Facebook video link into an embeddable iframe src, or null if it isn't one.
export function toVideoEmbed(value: string): VideoEmbed | null {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return null
  }
  if (url.protocol !== 'https:') return null

  if (YOUTUBE_HOSTS.includes(url.hostname)) {
    const id =
      url.hostname === 'youtu.be'
        ? url.pathname.split('/')[1]
        : url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1]
    return id && /^[\w-]{6,}$/.test(id)
      ? { provider: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}` }
      : null
  }

  // Only video links: a page or profile link would embed as a broken player.
  if (FACEBOOK_HOSTS.includes(url.hostname) && (url.hostname === 'fb.watch' || FACEBOOK_VIDEO_PATH.test(url.pathname))) {
    return {
      provider: 'facebook',
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url.toString())}&show_text=false`,
    }
  }

  return null
}

export const isVideoEmbedUrl = (value: string) => toVideoEmbed(value) !== null

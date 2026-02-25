const DEFAULT_ALLOWED_TAGS = new Set([
  'p', 'br', 'hr', 'div', 'span',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'u', 's',
  'blockquote', 'pre', 'code',
  'ul', 'ol', 'li',
  'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td'
]);

const EMBED_ALLOWED_TAGS = new Set(['div', 'p', 'span', 'br', 'a', 'iframe']);

const ALLOWED_IFRAME_HOSTS = new Set([
  'open.spotify.com',
  'www.youtube.com',
  'youtube.com',
  'player.vimeo.com',
  'w.soundcloud.com'
]);

function isSafeUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) return true;

  try {
    const parsed = new URL(trimmed, window.location.origin);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function stripDangerousTextHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript:/gi, '');
}

function unwrapElement(el: Element) {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

function cleanNodeTree(root: Element, allowedTags: Set<string>, allowIframes: boolean) {
  const elements = Array.from(root.querySelectorAll('*'));

  for (const el of elements) {
    const tag = el.tagName.toLowerCase();
    const isIframe = tag === 'iframe';
    if (!allowedTags.has(tag) && !(allowIframes && isIframe)) {
      unwrapElement(el);
      continue;
    }

    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value || '';

      if (name.startsWith('on') || name === 'style') {
        el.removeAttribute(attr.name);
        continue;
      }

      if (name === 'href' || name === 'src') {
        if (!isSafeUrl(value)) {
          el.removeAttribute(attr.name);
          continue;
        }
      }

      if (tag === 'a') {
        if (!['href', 'title', 'target', 'rel', 'class'].includes(name)) {
          el.removeAttribute(attr.name);
        }
      } else if (tag === 'img') {
        if (!['src', 'alt', 'title', 'class', 'loading', 'decoding'].includes(name)) {
          el.removeAttribute(attr.name);
        }
      } else if (tag === 'iframe') {
        if (!['src', 'width', 'height', 'allow', 'allowfullscreen', 'title', 'class', 'loading', 'referrerpolicy', 'sandbox'].includes(name)) {
          el.removeAttribute(attr.name);
        }
      } else if (name !== 'class') {
        el.removeAttribute(attr.name);
      }
    }

    if (tag === 'a') {
      el.setAttribute('rel', 'noopener noreferrer');
    }

    if (tag === 'iframe') {
      const src = el.getAttribute('src') || '';
      try {
        const host = new URL(src, window.location.origin).hostname.toLowerCase();
        if (!ALLOWED_IFRAME_HOSTS.has(host)) {
          el.remove();
          continue;
        }
      } catch {
        el.remove();
        continue;
      }
      if (!el.getAttribute('sandbox')) {
        el.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups');
      }
      if (!el.getAttribute('referrerpolicy')) {
        el.setAttribute('referrerpolicy', 'no-referrer');
      }
      el.setAttribute('loading', 'lazy');
    }
  }
}

function toSafeString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

export function sanitizeHtmlContent(html: unknown): string {
  const raw = toSafeString(html);
  if (!raw) return '';
  const stripped = stripDangerousTextHtml(raw);

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return stripped;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(stripped, 'text/html');
  cleanNodeTree(doc.body, DEFAULT_ALLOWED_TAGS, false);
  return doc.body.innerHTML;
}

export function sanitizeEmbedCode(html: unknown): string {
  const raw = toSafeString(html);
  if (!raw) return '';
  const stripped = stripDangerousTextHtml(raw);

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return stripped;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(stripped, 'text/html');
  cleanNodeTree(doc.body, EMBED_ALLOWED_TAGS, true);
  return doc.body.innerHTML;
}

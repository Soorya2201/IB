import { Platform } from 'react-native';
import { ChatMessage, CartItem, UserProfile } from '../types';

const API_BASE = Platform.OS === 'web'
  ? 'http://localhost:3001'
  : 'http://100.64.155.208:3001';

export const fetchMenu = async () => {
  try {
    const res = await fetch(`${API_BASE}/menu`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (error) {
    console.error('Error fetching menu:', error);
    return null;
  }
};

// XHR instead of fetch: React Native's XMLHttpRequest is native and its
// onprogress callback handles SSE reliably on Android. fetch().body.getReader()
// returns null on Android Hermes and loses partial chunks on all platforms.
export const streamChat = (
  messages: ChatMessage[],
  cart: CartItem[],
  profile: UserProfile,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
): Promise<void> => {
  return new Promise((resolve) => {
    const xhr     = new XMLHttpRequest();
    let buffer    = '';
    let lastPos   = 0;
    let settled   = false;

    const settle = (fn: () => void) => {
      if (settled) return;
      settled = true;
      fn();
      resolve();
    };

    const flush = () => {
      // Split on SSE event boundary; keep any trailing incomplete chunk in buffer
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';

      for (const event of parts) {
        const line = event.trim();
        if (!line || line === ':keep-alive') continue;
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed.error) { settle(() => onError(parsed.error)); return; }
          if (parsed.done)  { settle(onDone); return; }
          if (parsed.text)  { onChunk(parsed.text); }
        } catch {
          console.warn('SSE parse — skipped partial chunk');
        }
      }
    };

    xhr.open('POST', `${API_BASE}/chat`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.timeout = 90_000;

    xhr.onprogress = () => {
      const fresh = xhr.responseText.slice(lastPos);
      lastPos     = xhr.responseText.length;
      buffer     += fresh;
      flush();
    };

    xhr.onload = () => {
      buffer += '\n\n'; // ensure trailing event gets flushed
      flush();
      settle(onDone);
    };

    xhr.onerror   = () => settle(() => onError('Cannot reach server — is the API running?'));
    xhr.ontimeout = () => settle(() => onError('Request timed out.'));

    xhr.send(JSON.stringify({
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      cart,
      profile,
    }));
  });
};

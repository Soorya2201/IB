import * as Speech from 'expo-speech';
import { useCallback } from 'react';
import { useStore } from '../store';

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(?!\s)([^*\n]+?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/>\s/g, '');
}

export function useTTS() {
  const setAiSpeaking = useStore(state => state.setAiSpeaking);

  const speak = useCallback((text: string) => {
    let cleaned = text.replace(/✦ACTION✦.*?✦END✦/gs, '');
    cleaned = stripMarkdown(cleaned);
    // Remove emoji (Unicode Emoji_Presentation + component ranges)
    cleaned = cleaned.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    if (!cleaned) return;

    Speech.stop();

    Speech.speak(cleaned, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.95,
      onStart: () => setAiSpeaking(true),
      onDone: () => setAiSpeaking(false),
      onError: () => setAiSpeaking(false),
      onStopped: () => setAiSpeaking(false),
    });
  }, [setAiSpeaking]);

  const stop = useCallback(() => {
    Speech.stop();
    setAiSpeaking(false);
  }, [setAiSpeaking]);

  return { speak, stop };
}

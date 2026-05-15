import { Router } from 'express';

const router = Router();

// Uses Groq's free Whisper API (open-source model, 2000 min/day free tier).
// Sign up at console.groq.com → API Keys → create key → add to .env as GROQ_API_KEY
router.post('/', async (req: any, res: any) => {
  const { audioBase64, mimeType = 'audio/m4a' } = req.body;

  if (!audioBase64) {
    return res.status(400).json({ error: 'No audio data provided' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Voice transcription not configured. Add GROQ_API_KEY to apps/api/.env (free at console.groq.com).',
    });
  }

  try {
    const buffer   = Buffer.from(audioBase64, 'base64');
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: mimeType }), 'recording.m4a');
    formData.append('model', 'whisper-large-v3-turbo'); // fastest free Groq model
    formData.append('language', 'en');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method:  'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body:    formData,
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('Groq Whisper error:', response.status, body);
      return res.status(502).json({ error: 'Transcription service error' });
    }

    const data: any = await response.json();
    res.json({ transcript: data.text ?? '' });
  } catch (e: any) {
    console.error('Transcribe route error:', e);
    res.status(500).json({ error: e.message ?? 'Internal server error' });
  }
});

export default router;

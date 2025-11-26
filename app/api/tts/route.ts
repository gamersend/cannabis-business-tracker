import { NextRequest, NextResponse } from 'next/server';
import { elevenLabsTTS } from '@/lib/elevenlabs-tts';

export async function POST(request: NextRequest) {
  try {
    const { text, type = 'general', data } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    let audioBuffer: ArrayBuffer;

    // Generate speech based on type
    switch (type) {
      case 'sale_confirmation':
        audioBuffer = await elevenLabsTTS.speakSaleConfirmation(data);
        break;
      case 'business_insight':
        audioBuffer = await elevenLabsTTS.speakBusinessInsight(text);
        break;
      case 'customer_alert':
        audioBuffer = await elevenLabsTTS.speakCustomerAlert(data.customerName, text);
        break;
      default:
        audioBuffer = await elevenLabsTTS.generateSpeech({ text });
    }

    // Return audio as response
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const voices = await elevenLabsTTS.getVoices();
    return NextResponse.json(voices);
  } catch (error) {
    console.error('Error fetching voices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voices' },
      { status: 500 }
    );
  }
}

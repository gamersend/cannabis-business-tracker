// ElevenLabs Text-to-Speech Integration
export interface TTSOptions {
  text: string;
  voice_id?: string;
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

export interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
}

class ElevenLabsTTS {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';
  public defaultVoiceId = 'j7KV53NgP8U4LRS2k2Gs'; // Your specified voice ID

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateSpeech(options: TTSOptions): Promise<ArrayBuffer> {
    const {
      text,
      voice_id = this.defaultVoiceId,
      model_id = 'eleven_monolingual_v1',
      voice_settings = {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.2,
        use_speaker_boost: true
      }
    } = options;

    const response = await fetch(`${this.baseUrl}/text-to-speech/${voice_id}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify({
        text,
        model_id,
        voice_settings
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    return response.arrayBuffer();
  }

  async generateSpeechStream(options: TTSOptions): Promise<ReadableStream> {
    const {
      text,
      voice_id = this.defaultVoiceId,
      model_id = 'eleven_monolingual_v1',
      voice_settings = {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.2,
        use_speaker_boost: true
      }
    } = options;

    const response = await fetch(`${this.baseUrl}/text-to-speech/${voice_id}/stream`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify({
        text,
        model_id,
        voice_settings
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    return response.body!;
  }

  async getVoices(): Promise<Voice[]> {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: {
        'xi-api-key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.voices;
  }

  async getVoiceDetails(voiceId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/voices/${voiceId}`, {
      headers: {
        'xi-api-key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Predefined voice messages for cannabis business
  async speakSaleConfirmation(saleData: any): Promise<ArrayBuffer> {
    const text = `Nice! Sale confirmed for ${saleData.customer_name}. ${saleData.quantity_grams} grams of ${saleData.strain_name} for ${saleData.sale_price} dollars. Profit of ${saleData.profit} dollars. Keep the good vibes flowing!`;
    
    return this.generateSpeech({
      text,
      voice_settings: {
        stability: 0.6,
        similarity_boost: 0.9,
        style: 0.3,
        use_speaker_boost: true
      }
    });
  }

  async speakBusinessInsight(insight: string): Promise<ArrayBuffer> {
    return this.generateSpeech({
      text: insight,
      voice_settings: {
        stability: 0.7,
        similarity_boost: 0.8,
        style: 0.1,
        use_speaker_boost: true
      }
    });
  }

  async speakCustomerAlert(customerName: string, message: string): Promise<ArrayBuffer> {
    const text = `Hey! Customer alert for ${customerName}. ${message}`;
    
    return this.generateSpeech({
      text,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.9,
        style: 0.4,
        use_speaker_boost: true
      }
    });
  }
}

export const elevenLabsTTS = new ElevenLabsTTS(process.env.ELEVENLABS_API_KEY || '');
export { ElevenLabsTTS };

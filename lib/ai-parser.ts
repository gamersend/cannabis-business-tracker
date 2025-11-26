// AI-powered data parsing for cannabis sales using OpenRouter
import { searchCustomers, getStrains, logAIParsing } from './database';

interface ParsedSale {
  customer_name: string;
  strain_name?: string;
  quantity_grams?: number;
  sale_price?: number;
  payment_method?: string;
  confidence: number;
  suggestions: string[];
}

interface OpenRouterModel {
  id: string;
  name: string;
  pricing: {
    prompt: number;
    completion: number;
  };
  context_length: number;
  description?: string;
}

// Available models with costs (per 1M tokens)
export const AVAILABLE_MODELS: OpenRouterModel[] = [
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    pricing: { prompt: 3.00, completion: 15.00 },
    context_length: 200000,
    description: 'Best for complex reasoning and analysis'
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    pricing: { prompt: 2.50, completion: 10.00 },
    context_length: 128000,
    description: 'Great balance of speed and intelligence'
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    pricing: { prompt: 0.15, completion: 0.60 },
    context_length: 128000,
    description: 'Fast and cost-effective'
  },
  {
    id: 'google/gemini-flash-1.5',
    name: 'Gemini Flash 1.5',
    pricing: { prompt: 0.075, completion: 0.30 },
    context_length: 1000000,
    description: 'Ultra-fast and cheap'
  },
  {
    id: 'meta-llama/llama-3.1-8b-instruct:free',
    name: 'Llama 3.1 8B (Free)',
    pricing: { prompt: 0, completion: 0 },
    context_length: 131072,
    description: 'Free model, good for basic tasks'
  }
];

// OpenRouter API client
class OpenRouterClient {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(messages: any[], model: string = 'openai/gpt-4o-mini') {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://cannabis-tracker.app',
        'X-Title': 'Cannabis Business Tracker'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.1,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    return response.json();
  }
}

const openRouter = new OpenRouterClient(process.env.OPENROUTER_API_KEY || '');

// Common weight conversions
const WEIGHT_CONVERSIONS = {
  'g': 1,
  'gram': 1,
  'grams': 1,
  'oz': 28,
  'ounce': 28,
  'ounces': 28,
  'eighth': 3.5,
  '8th': 3.5,
  'quarter': 7,
  'q': 7,
  'half': 14,
  'lb': 448,
  'pound': 448,
};

// Common strain name variations
const STRAIN_ALIASES = {
  'gsc': 'Girl Scout Cookies',
  'cookies': 'Girl Scout Cookies',
  'purple': 'Purple Chem',
  'candy': 'Candyland',
  'star': 'Stardust',
};

// Enhanced natural language parsing using OpenRouter AI
export async function parseNaturalLanguageSale(
  input: string,
  model: string = 'openai/gpt-4o-mini'
): Promise<ParsedSale> {
  const customers = await searchCustomers('');
  const strains = await getStrains();

  // Create context for AI
  const customerNames = customers.map(c => c.customer_name).join(', ');
  const strainNames = strains.map(s => s.name).join(', ');

  const systemPrompt = `You are an AI assistant for a cannabis business tracker. Parse sales input and extract structured data.

Available customers: ${customerNames}
Available strains: ${strainNames}

Weight conversions:
- 1 oz = 28g
- 1 eighth = 3.5g
- 1 quarter = 7g
- 1 half = 14g

Strain aliases:
- GSC = Girl Scout Cookies
- Cookies = Girl Scout Cookies
- Purple = Purple Chem
- Dust = Stardust

Return JSON with:
{
  "customer_name": "exact customer name or best match",
  "strain_name": "exact strain name or null",
  "quantity_grams": number or null,
  "sale_price": number or null,
  "payment_method": "cash|card|crypto|other",
  "confidence": 0.0-1.0,
  "suggestions": ["array of helpful suggestions"]
}`;

  try {
    const response = await openRouter.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Parse this sale: "${input}"` }
    ], model);

    const content = response.choices[0]?.message?.content;
    const parsed = JSON.parse(content);

    // Validate and enhance the result
    const result: ParsedSale = {
      customer_name: parsed.customer_name || '',
      strain_name: parsed.strain_name || undefined,
      quantity_grams: parsed.quantity_grams || undefined,
      sale_price: parsed.sale_price || undefined,
      payment_method: parsed.payment_method || 'cash',
      confidence: Math.min(Math.max(parsed.confidence || 0, 0), 1),
      suggestions: parsed.suggestions || []
    };

    // Log the parsing attempt
    await logAIParsing({
      input_text: input,
      parsed_data: result,
      confidence_score: result.confidence,
      status: result.confidence > 0.7 ? 'success' : 'manual_review',
      model_used: model
    });

    return result;
  } catch (error) {
    console.error('OpenRouter parsing error:', error);

    // Fallback to simple parsing
    const fallbackResult = parseQuickSale(input);
    await logAIParsing({
      input_text: input,
      parsed_data: fallbackResult,
      confidence_score: fallbackResult.confidence,
      status: 'fallback_used',
      error_message: error instanceof Error ? error.message : 'Unknown error'
    });

    return fallbackResult;
  }
}

function extractCustomerName(input: string): { name: string; confidence: number } {
  // Look for patterns like "sold to [name]", "[name] bought", or just "[name] [amount]"
  const patterns = [
    /(?:sold to|to)\s+([a-zA-Z\s]+?)(?:\s|$|\d)/i,
    /^([a-zA-Z\s]+?)\s+(?:bought|got|purchased)/i,
    /^([a-zA-Z\s]+?)\s+\$?\d/i,
    /^([a-zA-Z\s]+?)\s+\d/i,
    /^([a-zA-Z\s]+?)(?:\s|$)/i
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name.length > 1 && name.length < 50) {
        return { name: capitalizeWords(name), confidence: 0.3 };
      }
    }
  }
  
  return { name: '', confidence: 0 };
}

async function extractStrainName(input: string): Promise<{ name: string; confidence: number }> {
  const strains = await getStrains();
  const strainNames = strains.map(s => s.name.toLowerCase());
  
  // Check for exact strain matches
  for (const strain of strains) {
    if (input.includes(strain.name.toLowerCase())) {
      return { name: strain.name, confidence: 0.3 };
    }
  }
  
  // Check for aliases
  for (const [alias, fullName] of Object.entries(STRAIN_ALIASES)) {
    if (input.includes(alias)) {
      return { name: fullName, confidence: 0.2 };
    }
  }
  
  return { name: '', confidence: 0 };
}

function extractQuantity(input: string): { grams: number; confidence: number } {
  // Look for patterns like "1 oz", "3.5g", "quarter", etc.
  const patterns = [
    /(\d+(?:\.\d+)?)\s*(oz|ounce|ounces)/i,
    /(\d+(?:\.\d+)?)\s*(g|gram|grams)/i,
    /(eighth|8th)/i,
    /(quarter|q)/i,
    /(half)/i,
    /(\d+(?:\.\d+)?)\s*(lb|pound)/i
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      if (match[2]) {
        const amount = parseFloat(match[1]);
        const unit = match[2].toLowerCase();
        const multiplier = WEIGHT_CONVERSIONS[unit] || 1;
        return { grams: amount * multiplier, confidence: 0.3 };
      } else if (match[1]) {
        // Handle special cases like "eighth", "quarter"
        const unit = match[1].toLowerCase();
        const grams = WEIGHT_CONVERSIONS[unit] || 0;
        return { grams, confidence: 0.3 };
      }
    }
  }
  
  return { grams: 0, confidence: 0 };
}

function extractPrice(input: string): { price: number; confidence: number } {
  // Look for patterns like "$325", "325", "paid 325", etc.
  const patterns = [
    /\$(\d+(?:\.\d{2})?)/,
    /(?:paid|cost|price|for)\s*\$?(\d+(?:\.\d{2})?)/i,
    /(\d+(?:\.\d{2})?)\s*(?:dollars?|bucks?)/i,
    /(\d{2,4}(?:\.\d{2})?)/  // Generic number that looks like money
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      const price = parseFloat(match[1]);
      if (price > 10 && price < 10000) { // Reasonable price range
        return { price, confidence: 0.2 };
      }
    }
  }
  
  return { price: 0, confidence: 0 };
}

function extractPaymentMethod(input: string): { method: string; confidence: number } {
  if (input.includes('cash')) return { method: 'cash', confidence: 0.1 };
  if (input.includes('card') || input.includes('credit')) return { method: 'card', confidence: 0.1 };
  if (input.includes('crypto') || input.includes('bitcoin')) return { method: 'crypto', confidence: 0.1 };
  
  return { method: '', confidence: 0 };
}

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

// Quick sale parser for simple formats like "Jay 325" or "Karlo 690"
export function parseQuickSale(input: string): ParsedSale {
  const parts = input.trim().split(/\s+/);
  
  if (parts.length >= 2) {
    const customer_name = capitalizeWords(parts[0]);
    const price = parseFloat(parts[1]);
    
    if (!isNaN(price) && price > 0) {
      return {
        customer_name,
        sale_price: price,
        confidence: 0.8,
        suggestions: ['Quick sale format detected - please add strain and quantity details']
      };
    }
  }
  
  return {
    customer_name: '',
    confidence: 0,
    suggestions: ['Could not parse quick sale format']
  };
}

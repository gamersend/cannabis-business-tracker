// Advanced AI Business Advisor using OpenRouter
import { getTopCustomers, getDailyProfits, getStrains } from './server-db';

interface BusinessInsight {
  type: 'recommendation' | 'warning' | 'opportunity' | 'celebration';
  title: string;
  message: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
  emoji: string;
}

interface CustomerAnalysis {
  customer_name: string;
  status: 'whale' | 'vip' | 'regular' | 'at_risk' | 'new_opportunity';
  total_profit: number;
  last_purchase_days: number;
  recommendation: string;
  priority: number;
}

class AIBusinessAdvisor {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(messages: any[], model: string = 'openai/gpt-4o') {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://cannabis-tracker.app',
        'X-Title': 'Cannabis Business Tracker - AI Advisor'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    return response.json();
  }

  async generateBusinessInsights(): Promise<BusinessInsight[]> {
    try {
      const [customers, dailyProfits, strains] = await Promise.all([
        getTopCustomers(20),
        getDailyProfits(30),
        getStrains()
      ]);

      const totalProfit = dailyProfits.reduce((sum, day) => sum + parseFloat(day.total_profit), 0);
      const avgDailyProfit = totalProfit / Math.max(dailyProfits.length, 1);
      const recentProfit = dailyProfits.slice(0, 7).reduce((sum, day) => sum + parseFloat(day.total_profit), 0);

      const systemPrompt = `You are an AI business advisor for a cannabis business. Analyze the data and provide 3-5 actionable insights.

Business Data:
- Total customers: ${customers.length}
- Top customers: ${customers.slice(0, 5).map(c => `${c.customer_name} ($${c.total_profit})`).join(', ')}
- 30-day total profit: $${totalProfit.toFixed(2)}
- Average daily profit: $${avgDailyProfit.toFixed(2)}
- Last 7 days profit: $${recentProfit.toFixed(2)}
- Available strains: ${strains.map(s => s.name).join(', ')}

Return JSON array of insights:
[{
  "type": "recommendation|warning|opportunity|celebration",
  "title": "Short title",
  "message": "Detailed insight with specific numbers",
  "action": "Specific action to take",
  "priority": "low|medium|high",
  "emoji": "relevant emoji"
}]

Focus on:
- Customer retention and re-engagement
- Profit optimization opportunities
- Inventory management
- Sales trends and patterns
- Growth opportunities`;

      const response = await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Analyze my cannabis business and provide insights.' }
      ]);

      const content = response.choices[0]?.message?.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating business insights:', error);
      return [{
        type: 'warning',
        title: 'AI Analysis Unavailable',
        message: 'Unable to generate insights at this time. Please try again later.',
        priority: 'low',
        emoji: '⚠️'
      }];
    }
  }

  async analyzeCustomerBehavior(): Promise<CustomerAnalysis[]> {
    try {
      const customers = await getTopCustomers(50);
      
      const systemPrompt = `You are an AI customer behavior analyst for a cannabis business. Analyze customer data and classify each customer.

Customer Classifications:
- whale: $1000+ total profit, high value
- vip: $500-999 total profit, valuable
- regular: $100-499 total profit, steady
- at_risk: Haven't purchased recently, need re-engagement
- new_opportunity: Low profit but potential for growth

Return JSON array:
[{
  "customer_name": "name",
  "status": "classification",
  "total_profit": number,
  "last_purchase_days": estimated_days,
  "recommendation": "specific action to take",
  "priority": 1-10
}]`;

      const customerData = customers.map(c => 
        `${c.customer_name}: $${c.total_profit} profit, ${c.transaction_count} transactions`
      ).join('\n');

      const response = await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze these customers:\n${customerData}` }
      ]);

      const content = response.choices[0]?.message?.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Error analyzing customers:', error);
      return [];
    }
  }

  async generateSalesCelebration(saleData: any): Promise<string> {
    try {
      const systemPrompt = `You are a fun, enthusiastic AI assistant for a cannabis business. Generate a celebratory message for a successful sale.

Style: Stoner-casual, use emojis, keep it fun and positive. Mention specific details about the sale.

Sale details: Customer: ${saleData.customer_name}, Strain: ${saleData.strain_name}, Amount: ${saleData.quantity_grams}g, Price: $${saleData.sale_price}, Profit: $${saleData.profit}

Generate a short, fun celebration message (2-3 sentences max).`;

      const response = await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate a celebration message for this sale!' }
      ], 'openai/gpt-4o-mini');

      return response.choices[0]?.message?.content || '🎉 Nice sale! Keep the good vibes flowing! 🌿💚';
    } catch (error) {
      console.error('Error generating celebration:', error);
      return '🎉 Awesome sale! Your empire grows stronger! 🌿💚';
    }
  }
}

export const aiAdvisor = new AIBusinessAdvisor(process.env.OPENROUTER_API_KEY || '');
export type { BusinessInsight, CustomerAnalysis };

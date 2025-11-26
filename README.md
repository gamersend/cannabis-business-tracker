# 🌿 Cannabis Business Tracker

*Keep track of your green empire, one nug at a time* 💚

## Features

### 🤖 AI-Powered Data Entry
- **Natural Language Processing**: Just type "Sold 1 oz cookies to Leveny for $325" 
- **Quick Sale Format**: Simple "Jay 325" format for rapid entry
- **Smart Customer Recognition**: Automatically matches existing customers
- **Strain Detection**: Recognizes your inventory strains
- **Confidence Scoring**: Shows how sure the AI is about the parsing

### 📊 Real-Time Analytics
- **Live Dashboard**: See profits, sales, and top customers instantly
- **Customer Insights**: Whale/VIP/Regular customer classification
- **Profit Tracking**: Daily, weekly, and monthly profit analysis
- **Historic Data**: All your $15,500+ historic profits imported

### 💎 Customer Management
- **Smart Profiles**: Automatic customer categorization
- **Profit History**: Track total profits per customer
- **Transaction Patterns**: See buying habits and preferences
- **Re-engagement Alerts**: Identify customers to reach out to

### 📦 Inventory Management
- **Strain Tracking**: Purple Chem, Girl Scout Cookies, Stardust, Candyland
- **Cost Calculations**: Per gram and per pound pricing
- **Stock Alerts**: Low inventory warnings
- **Profit Margins**: Real-time cost vs sale price analysis

## Quick Start with Docker 🐳

### 1. Clone and Setup
```bash
git clone https://github.com/gamersend/cannabis-business-tracker.git
cd cannabis-business-tracker
cp .env.example .env.local
```

### 2. Configure Environment
Edit `.env.local` with your settings:
```env
OPENROUTER_API_KEY=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
DB_PASSWORD=Qzmpwxno1
```

### 3. Start Everything
```bash
npm run docker:start
```

That's it! 🚀 Your app will be running at `http://localhost:3000`

## Manual Setup (Alternative)

### 1. Database Setup
```bash
# Connect to PostgreSQL
psql -h 192.168.0.150 -U postgres

# Run the setup script
npm run db:setup

# Import historic data
npm run db:seed
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

## Database Schema

### Tables Created:
- **customers**: Customer profiles with profit totals
- **strains**: Inventory with costs and stock levels  
- **sales**: Individual sale transactions
- **historic_profits**: Imported historic data ($15,500+)
- **daily_summaries**: Aggregated daily statistics
- **ai_parsing_logs**: AI parsing attempts and confidence

### Your Historic Data Imported:
- **$15,500+ in historic profits** from July-September
- **Top customers**: Trife ($2,300), Online ($2,045), Ryan ($1,580)
- **100+ transactions** with customer names and profit amounts
- **Automatic customer classification** (Whale/VIP/Regular)

## AI Features

### Natural Language Examples:
- "Sold 1 oz Purple Chem to Ryan for $400 cash"
- "Karlo bought quarter cookies $180 card"  
- "Leveny 1oz stardust 325"
- "Jay 325" (quick format)

### Smart Recognition:
- **Customer Names**: Fuzzy matching with existing customers
- **Strain Names**: Recognizes your 4 strains + aliases
- **Quantities**: Handles oz, grams, eighths, quarters, etc.
- **Prices**: Extracts dollar amounts from natural text
- **Payment Methods**: Detects cash, card, crypto

## Mobile Optimized

- **Touch-friendly**: 44px minimum touch targets
- **Responsive Design**: Works on phones, tablets, desktop
- **Stoner-Casual UI**: Fun emojis and relaxed language
- **Quick Entry**: Optimized for fast mobile sales entry

## Docker Commands

```bash
# Start all services
npm run docker:start

# Stop all services
npm run docker:stop

# View logs
npm run docker:logs

# Rebuild containers
npm run docker:build

# Clean everything
npm run docker:clean
```

## Deployment

### Environment Variables:
```env
OPENROUTER_API_KEY=your-api-key
DATABASE_URL=postgresql://postgres:password@host:5432/cannabis_tracker
```

### Deploy to Vercel:
```bash
npm run build
vercel --prod
```

### Deploy with Docker:
```bash
docker-compose up -d
```

## Usage

### Quick Sale Entry:
1. Type naturally: "Jay bought 1oz cookies for $325"
2. AI parses and suggests details
3. Confirm or edit the parsed data
4. Sale is saved with automatic profit calculation

### View Analytics:
- **Dashboard**: Real-time stats and top customers
- **Customer List**: See your whales, VIPs, and regulars
- **Profit Chart**: Visual profit trends over time
- **Inventory**: Current stock and cost breakdowns

### Customer Insights:
- **🐋 Whales**: $1,000+ total profit (Trife, Online, Ryan)
- **💎 VIPs**: $500+ total profit (Jay, Raw, Shagi)
- **😎 Regulars**: Under $500 total profit

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL
- **Database**: PostgreSQL at 192.168.0.150
- **AI**: Custom natural language parsing
- **Deployment**: Vercel/Netlify ready

## Support

Built with love for the cannabis business community! 🌿💚

*"Quality over quantity, always"* ✨

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize cache with 5 minute TTL (300 seconds)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Enable CORS for all routes
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'], // React and Vite default ports
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Configuration
const API_KEY = process.env.TWELVE_DATA_API_KEY;
const BASE_URL = 'https://api.twelvedata.com';

// Enhanced Indian stock symbol mappings
const SYMBOL_MAPPINGS = {
  // Large Cap Stocks
  'RELIANCE': 'RELIANCE.NSE',
  'TCS': 'TCS.NSE',
  'HDFCBANK': 'HDFCBANK.NSE',
  'INFY': 'INFY.NSE',
  'ICICIBANK': 'ICICIBANK.NSE',
  'HINDUNILVR': 'HINDUNILVR.NSE',
  'SBIN': 'SBIN.NSE',
  'BHARTIARTL': 'BHARTIARTL.NSE',
  'KOTAKBANK': 'KOTAKBANK.NSE',
  'LT': 'LT.NSE',
  'ASIANPAINT': 'ASIANPAINT.NSE',
  'MARUTI': 'MARUTI.NSE',
  'BAJFINANCE': 'BAJFINANCE.NSE',
  'HCLTECH': 'HCLTECH.NSE',
  'WIPRO': 'WIPRO.NSE',
  'ULTRACEMCO': 'ULTRACEMCO.NSE',
  'TITAN': 'TITAN.NSE',
  'NESTLEIND': 'NESTLEIND.NSE',
  'POWERGRID': 'POWERGRID.NSE',
  'ONGC': 'ONGC.NSE',
  
  // Mutual Funds (using proxy stocks)
  'AXIS_BLUECHIP': 'AXISBANK.NSE',
  'MIRAE_EMERGING': 'HDFCBANK.NSE',
  'SBI_SMALL_CAP': 'SBIN.NSE',
  'ICICI_PRUDENTIAL': 'ICICIBANK.NSE',
  'HDFC_TOP100': 'HDFCBANK.NSE',
  'PARAG_PARIKH': 'TCS.NSE',
  'MOTILAL_MIDCAP': 'RELIANCE.NSE',
  'UTI_NIFTY': 'HINDUNILVR.NSE'
};

// Enhanced fallback data with more realistic prices
const FALLBACK_DATA = {
  'RELIANCE': { price: 2456.75, change: 45.30, changePercent: 1.88, volume: 12500000, high: 2480.50, low: 2420.30 },
  'TCS': { price: 3542.85, change: -28.15, changePercent: -0.79, volume: 8900000, high: 3580.20, low: 3530.45 },
  'HDFCBANK': { price: 1634.50, change: 23.75, changePercent: 1.47, volume: 15600000, high: 1645.80, low: 1620.30 },
  'INFY': { price: 1456.30, change: -12.45, changePercent: -0.85, volume: 11200000, high: 1470.80, low: 1445.20 },
  'ICICIBANK': { price: 1087.65, change: 15.30, changePercent: 1.43, volume: 18900000, high: 1095.20, low: 1075.40 },
  'HINDUNILVR': { price: 2678.90, change: 34.20, changePercent: 1.29, volume: 5400000, high: 2690.50, low: 2655.30 },
  'SBIN': { price: 542.30, change: -8.70, changePercent: -1.58, volume: 25600000, high: 555.80, low: 538.90 },
  'BHARTIARTL': { price: 876.45, change: 12.80, changePercent: 1.48, volume: 14300000, high: 885.20, low: 865.30 },
  'KOTAKBANK': { price: 1789.60, change: 22.40, changePercent: 1.27, volume: 9800000, high: 1798.70, low: 1775.20 },
  'LT': { price: 2456.30, change: -18.50, changePercent: -0.75, volume: 6700000, high: 2478.90, low: 2445.60 },
  
  // Mutual Fund proxies
  'AXIS_BLUECHIP': { price: 45.67, change: 0.34, changePercent: 0.75, volume: 0, high: 45.89, low: 45.23 },
  'MIRAE_EMERGING': { price: 78.23, change: -0.45, changePercent: -0.57, volume: 0, high: 78.78, low: 77.89 },
  'SBI_SMALL_CAP': { price: 156.89, change: 2.34, changePercent: 1.51, volume: 0, high: 158.20, low: 155.67 },
  'ICICI_PRUDENTIAL': { price: 234.56, change: 1.78, changePercent: 0.76, volume: 0, high: 236.20, low: 232.45 },
  'HDFC_TOP100': { price: 567.89, change: -3.45, changePercent: -0.60, volume: 0, high: 572.30, low: 565.20 },
  'PARAG_PARIKH': { price: 389.45, change: 4.67, changePercent: 1.21, volume: 0, high: 392.80, low: 386.90 },
  'MOTILAL_MIDCAP': { price: 123.78, change: -1.23, changePercent: -0.98, volume: 0, high: 125.45, low: 122.90 },
  'UTI_NIFTY': { price: 98.76, change: 0.87, changePercent: 0.89, volume: 0, high: 99.23, low: 98.34 }
};

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Enhanced function to fetch real-time stock price from Twelve Data API
 */
async function fetchStockPrice(symbol) {
  const cacheKey = `stock_${symbol}`;
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`📦 Cache hit for ${symbol}`);
    return cachedData;
  }

  try {
    const mappedSymbol = SYMBOL_MAPPINGS[symbol] || `${symbol}.NSE`;
    
    if (!API_KEY || API_KEY === 'your_twelve_data_api_key_here') {
      throw new Error('API key not configured');
    }

    console.log(`🔄 Fetching live data for ${symbol} (${mappedSymbol})`);

    // Fetch comprehensive quote data
    const quoteResponse = await axios.get(`${BASE_URL}/quote`, {
      params: {
        symbol: mappedSymbol,
        apikey: API_KEY,
        interval: '1min'
      },
      timeout: 10000
    });

    const quote = quoteResponse.data;

    if (quote && quote.close) {
      const currentPrice = parseFloat(quote.close);
      const previousClose = parseFloat(quote.previous_close) || currentPrice;
      const change = currentPrice - previousClose;
      const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

      const stockData = {
        symbol,
        price: currentPrice,
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        volume: parseInt(quote.volume) || 0,
        high: parseFloat(quote.high) || currentPrice,
        low: parseFloat(quote.low) || currentPrice,
        open: parseFloat(quote.open) || currentPrice,
        previousClose: previousClose,
        timestamp: new Date().toISOString(),
        source: 'twelvedata',
        marketStatus: quote.is_market_open ? 'OPEN' : 'CLOSED'
      };

      // Cache the result
      cache.set(cacheKey, stockData);
      console.log(`✅ API call successful for ${symbol} - Price: ₹${currentPrice}`);
      return stockData;
    } else {
      throw new Error('Invalid API response structure');
    }

  } catch (error) {
    console.error(`❌ Error fetching ${symbol}:`, error.message);
    
    // Return fallback data with slight randomization
    const fallback = FALLBACK_DATA[symbol];
    if (fallback) {
      const randomMultiplier = 0.995 + Math.random() * 0.01; // ±0.5% variation
      const stockData = {
        symbol,
        price: parseFloat((fallback.price * randomMultiplier).toFixed(2)),
        change: parseFloat((fallback.change * randomMultiplier).toFixed(2)),
        changePercent: parseFloat((fallback.changePercent * randomMultiplier).toFixed(2)),
        volume: fallback.volume,
        high: parseFloat((fallback.high * randomMultiplier).toFixed(2)),
        low: parseFloat((fallback.low * randomMultiplier).toFixed(2)),
        open: parseFloat((fallback.price * randomMultiplier).toFixed(2)),
        previousClose: fallback.price,
        timestamp: new Date().toISOString(),
        source: API_KEY ? 'fallback' : 'demo',
        marketStatus: 'UNKNOWN'
      };
      
      // Cache fallback data for shorter time (1 minute)
      cache.set(cacheKey, stockData, 60);
      return stockData;
    }
    
    throw error;
  }
}

/**
 * Get single stock price
 */
app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol || symbol.length === 0) {
      return res.status(400).json({
        error: 'Stock symbol is required',
        example: '/api/stock/RELIANCE'
      });
    }

    const stockData = await fetchStockPrice(symbol.toUpperCase());
    
    res.json({
      success: true,
      data: stockData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stock data',
      message: error.message,
      symbol: req.params.symbol
    });
  }
});

/**
 * Get multiple stock prices in batch
 */
app.post('/api/stocks/batch', async (req, res) => {
  try {
    const { symbols } = req.body;
    
    if (!Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Symbols array is required',
        example: { symbols: ['RELIANCE', 'TCS', 'INFY'] }
      });
    }

    if (symbols.length > 50) {
      return res.status(400).json({
        success: false,
        error: 'Too many symbols requested. Maximum 50 symbols allowed.',
        requested: symbols.length
      });
    }

    console.log(`🔄 Batch request for ${symbols.length} symbols:`, symbols.join(', '));

    // Fetch all stocks in parallel with individual error handling
    const stockPromises = symbols.map(async (symbol) => {
      try {
        return await fetchStockPrice(symbol.toUpperCase());
      } catch (error) {
        return {
          symbol: symbol.toUpperCase(),
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
    });

    const results = await Promise.allSettled(stockPromises);
    
    // Process results
    const stockData = [];
    const errors = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const data = result.value;
        if (data.error) {
          errors.push(data);
        } else {
          stockData.push(data);
        }
      } else {
        errors.push({
          symbol: symbols[index].toUpperCase(),
          error: result.reason.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    console.log(`✅ Batch completed: ${stockData.length} successful, ${errors.length} errors`);

    res.json({
      success: true,
      data: stockData,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        total: symbols.length,
        successful: stockData.length,
        failed: errors.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch batch stock data',
      message: error.message
    });
  }
});

/**
 * Get market summary with top gainers/losers
 */
app.get('/api/market/summary', async (req, res) => {
  try {
    const majorStocks = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'SBIN', 'BHARTIARTL'];
    
    const stockPromises = majorStocks.map(symbol => 
      fetchStockPrice(symbol).catch(error => ({
        symbol,
        error: error.message
      }))
    );

    const results = await Promise.all(stockPromises);
    const validStocks = results.filter(stock => !stock.error);
    
    if (validStocks.length === 0) {
      throw new Error('No market data available');
    }

    // Calculate market summary
    const gainers = validStocks.filter(stock => stock.changePercent > 0)
                               .sort((a, b) => b.changePercent - a.changePercent)
                               .slice(0, 3);
                               
    const losers = validStocks.filter(stock => stock.changePercent < 0)
                              .sort((a, b) => a.changePercent - b.changePercent)
                              .slice(0, 3);

    const totalChange = validStocks.reduce((sum, stock) => sum + stock.changePercent, 0);
    const avgChange = totalChange / validStocks.length;

    res.json({
      success: true,
      data: {
        summary: {
          totalStocks: validStocks.length,
          advancing: gainers.length,
          declining: losers.length,
          unchanged: validStocks.length - gainers.length - losers.length,
          averageChange: parseFloat(avgChange.toFixed(2))
        },
        topGainers: gainers,
        topLosers: losers,
        marketTrend: avgChange > 0 ? 'BULLISH' : avgChange < 0 ? 'BEARISH' : 'NEUTRAL'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market summary',
      message: error.message
    });
  }
});

/**
 * Search stocks by name or symbol
 */
app.get('/api/stocks/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters long'
      });
    }

    const searchTerm = query.toUpperCase();
    
    // Search through available symbols
    const matches = Object.keys(SYMBOL_MAPPINGS).filter(symbol => 
      symbol.includes(searchTerm) || 
      FALLBACK_DATA[symbol] && symbol.startsWith(searchTerm)
    ).slice(0, 10); // Limit to 10 results

    if (matches.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No matching stocks found'
      });
    }

    // Get stock data for matches
    const stockPromises = matches.map(symbol => 
      fetchStockPrice(symbol).catch(() => null)
    );

    const results = await Promise.all(stockPromises);
    const validResults = results.filter(result => result !== null);

    res.json({
      success: true,
      data: validResults,
      query: query,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
});

/**
 * Get API usage statistics and health
 */
app.get('/api/stats', (req, res) => {
  const cacheStats = cache.getStats();
  const memUsage = process.memoryUsage();
  
  res.json({
    success: true,
    data: {
      server: {
        uptime: process.uptime(),
        memory: {
          used: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
          total: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB'
        },
        nodeVersion: process.version,
        platform: process.platform
      },
      cache: {
        keys: cacheStats.keys,
        hits: cacheStats.hits,
        misses: cacheStats.misses,
        hitRate: cacheStats.hits > 0 ? ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(2) + '%' : '0%'
      },
      api: {
        keyConfigured: !!API_KEY && API_KEY !== 'your_twelve_data_api_key_here',
        availableSymbols: Object.keys(SYMBOL_MAPPINGS).length,
        fallbackDataPoints: Object.keys(FALLBACK_DATA).length
      }
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/health',
      'GET /api/stats', 
      'GET /api/stock/:symbol',
      'POST /api/stocks/batch',
      'GET /api/market/summary',
      'GET /api/stocks/search/:query'
    ]
  });
});

/**
 * Get all available symbols
 */
app.get('/api/symbols', (req, res) => {
  const symbols = Object.keys(SYMBOL_MAPPINGS).map(symbol => ({
    symbol,
    exchange: 'NSE',
    mapped: SYMBOL_MAPPINGS[symbol],
    hasData: !!FALLBACK_DATA[symbol]
  }));

  res.json({
    success: true,
    data: symbols,
    count: symbols.length,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Virtual Portfolio Stock API',
    version: '2.0.0',
    documentation: 'https://github.com/your-repo/api-docs',
    endpoints: {
      health: '/api/health',
      singleStock: '/api/stock/:symbol',
      batchStocks: '/api/stocks/batch',
      marketSummary: '/api/market/summary',
      searchStocks: '/api/stocks/search/:query',
      allSymbols: '/api/symbols',
      statistics: '/api/stats'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    requested: req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/stock/:symbol',
      'POST /api/stocks/batch',
      'GET /api/market/summary',
      'GET /api/stocks/search/:query',
      'GET /api/symbols',
      'GET /api/stats'
    ]
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('🔥 Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  cache.flushAll();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  cache.flushAll();
  process.exit(0);
});

// Start the server
app.listen(PORT, () => {
  console.log('🚀 Virtual Portfolio Stock API Server Started');
  console.log('='.repeat(50));
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🔗 Base URL: http://localhost:${PORT}`);
  console.log(`📊 Cache TTL: 5 minutes`);
  console.log(`🔑 API Key configured: ${API_KEY && API_KEY !== 'your_twelve_data_api_key_here' ? '✅ Yes' : '❌ No (using demo data)'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📈 Available symbols: ${Object.keys(SYMBOL_MAPPINGS).length}`);
  console.log('='.repeat(50));
  console.log('📍 Available endpoints:');
  console.log(`   GET    /                     - API information`);
  console.log(`   GET    /api/health           - Health check`);
  console.log(`   GET    /api/stock/:symbol    - Single stock data`);
  console.log(`   POST   /api/stocks/batch     - Multiple stocks data`);
  console.log(`   GET    /api/market/summary   - Market overview`);
  console.log(`   GET    /api/stocks/search/:q - Search stocks`);
  console.log(`   GET    /api/symbols          - All available symbols`);
  console.log(`   GET    /api/stats            - Server statistics`);
  console.log('='.repeat(50));
  
  if (!API_KEY || API_KEY === 'your_twelve_data_api_key_here') {
    console.log('⚠️  WARNING: No API key configured. Using demo data only.');
    console.log('   Set TWELVE_DATA_API_KEY in your .env file for live data.');
  }
});

module.exports = app;
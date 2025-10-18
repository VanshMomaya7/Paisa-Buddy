const express = require("express");
const cors = require("cors");
const axios = require("axios");
const NodeCache = require("node-cache");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize cache with 5 minute TTL (300 seconds)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Enable CORS for all routes
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-frontend-domain.com"]
        : ["http://localhost:3000", "http://localhost:5173"], // React and Vite default ports
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API Configuration
const API_KEY = process.env.TWELVE_DATA_API_KEY;
const BASE_URL = "https://api.twelvedata.com";

// Enhanced Indian stock symbol mappings
const SYMBOL_MAPPINGS = {
  RELIANCE: "RELIANCE.NS",
  TCS: "TCS.NS",
  HDFCBANK: "HDFCBANK.NS",
  INFY: "INFY.NS",
  ICICIBANK: "ICICIBANK.NS",
  HINDUNILVR: "HINDUNILVR.NS",
  SBIN: "SBIN.NS",
  BHARTIARTL: "BHARTIARTL.NS",
  KOTAKBANK: "KOTAKBANK.NS",
  LT: "LT.NS",
  ASIANPAINT: "ASIANPAINT.NS",
  MARUTI: "MARUTI.NS",
  BAJFINANCE: "BAJFINANCE.NS",
  HCLTECH: "HCLTECH.NS",
  WIPRO: "WIPRO.NS",
  ULTRACEMCO: "ULTRACEMCO.NS",
  TITAN: "TITAN.NS",
  NESTLEIND: "NESTLEIND.NS",
  POWERGRID: "POWERGRID.NS",
  ONGC: "ONGC.NS",
};

// Enhanced fallback data with more realistic prices
const FALLBACK_DATA = {
  RELIANCE: {
    price: 2456.75,
    change: 45.3,
    changePercent: 1.88,
    volume: 12500000,
    high: 2480.5,
    low: 2420.3,
  },
  TCS: {
    price: 3542.85,
    change: -28.15,
    changePercent: -0.79,
    volume: 8900000,
    high: 3580.2,
    low: 3530.45,
  },
  HDFCBANK: {
    price: 1634.5,
    change: 23.75,
    changePercent: 1.47,
    volume: 15600000,
    high: 1645.8,
    low: 1620.3,
  },
  INFY: {
    price: 1456.3,
    change: -12.45,
    changePercent: -0.85,
    volume: 11200000,
    high: 1470.8,
    low: 1445.2,
  },
  ICICIBANK: {
    price: 1087.65,
    change: 15.3,
    changePercent: 1.43,
    volume: 18900000,
    high: 1095.2,
    low: 1075.4,
  },
  HINDUNILVR: {
    price: 2678.9,
    change: 34.2,
    changePercent: 1.29,
    volume: 5400000,
    high: 2690.5,
    low: 2655.3,
  },
  SBIN: {
    price: 542.3,
    change: -8.7,
    changePercent: -1.58,
    volume: 25600000,
    high: 555.8,
    low: 538.9,
  },
  BHARTIARTL: {
    price: 876.45,
    change: 12.8,
    changePercent: 1.48,
    volume: 14300000,
    high: 885.2,
    low: 865.3,
  },
  KOTAKBANK: {
    price: 1789.6,
    change: 22.4,
    changePercent: 1.27,
    volume: 9800000,
    high: 1798.7,
    low: 1775.2,
  },
  LT: {
    price: 2456.3,
    change: -18.5,
    changePercent: -0.75,
    volume: 6700000,
    high: 2478.9,
    low: 2445.6,
  },

  // Mutual Fund proxies
  AXIS_BLUECHIP: {
    price: 45.67,
    change: 0.34,
    changePercent: 0.75,
    volume: 0,
    high: 45.89,
    low: 45.23,
  },
  MIRAE_EMERGING: {
    price: 78.23,
    change: -0.45,
    changePercent: -0.57,
    volume: 0,
    high: 78.78,
    low: 77.89,
  },
  SBI_SMALL_CAP: {
    price: 156.89,
    change: 2.34,
    changePercent: 1.51,
    volume: 0,
    high: 158.2,
    low: 155.67,
  },
  ICICI_PRUDENTIAL: {
    price: 234.56,
    change: 1.78,
    changePercent: 0.76,
    volume: 0,
    high: 236.2,
    low: 232.45,
  },
  HDFC_TOP100: {
    price: 567.89,
    change: -3.45,
    changePercent: -0.6,
    volume: 0,
    high: 572.3,
    low: 565.2,
  },
  PARAG_PARIKH: {
    price: 389.45,
    change: 4.67,
    changePercent: 1.21,
    volume: 0,
    high: 392.8,
    low: 386.9,
  },
  MOTILAL_MIDCAP: {
    price: 123.78,
    change: -1.23,
    changePercent: -0.98,
    volume: 0,
    high: 125.45,
    low: 122.9,
  },
  UTI_NIFTY: {
    price: 98.76,
    change: 0.87,
    changePercent: 0.89,
    volume: 0,
    high: 99.23,
    low: 98.34,
  },
};

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Enhanced function to fetch real-time stock price from Twelve Data API
 */
/**
 * Enhanced function to fetch real-time stock price from Twelve Data API
 * with rate-limit handling and fallback logic
 */
async function fetchStockPrice(symbol) {
  const cacheKey = `stock_${symbol}`;
  const cachedData = cache.get(cacheKey);

  // ✅ 1. Always serve cached data immediately (no blank screen)
  if (cachedData) {
    console.log(`📦 Cache hit for ${symbol}`);
    return cachedData;
  }

  try {
    const mappedSymbol = SYMBOL_MAPPINGS[symbol] || `${symbol}.NS`;
    console.log(`🔄 Fetching live data for ${symbol} (${mappedSymbol})`);

    const response = await axios.get(`${BASE_URL}/quote`, {
      params: { symbol: mappedSymbol, apikey: API_KEY },
      timeout: 10000,
    });

    const data = response.data;
    console.log(`🔍 Raw Twelve Data response for ${symbol}:`, data);

    // ✅ 2. Handle bad API responses gracefully
    if (!data || data.status === "error" || !data.close) {
      console.warn(`⚠️ Invalid or rate-limited API response for ${symbol}`);
      return useFallback(symbol, "api-error");
    }

    // ✅ 3. Parse valid data
    const currentPrice = parseFloat(data.close);
    const previousClose = parseFloat(data.previous_close) || currentPrice;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;

    const stockData = {
      symbol,
      price: currentPrice,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      high: parseFloat(data.high) || currentPrice,
      low: parseFloat(data.low) || currentPrice,
      open: parseFloat(data.open) || currentPrice,
      volume: parseInt(data.volume) || 0,
      timestamp: new Date().toISOString(),
      source: "twelvedata",
    };

    // ✅ 4. Cache valid result for 5 minutes
    cache.set(cacheKey, stockData, 300);
    console.log(`✅ Updated cache for ${symbol}: ₹${currentPrice}`);

    return stockData;
  } catch (error) {
    console.error(`❌ Error fetching ${symbol}:`, error.message);

    // ✅ 5. Use fallback when API fails or times out
    return useFallback(symbol, "network-failure");
  }
}
/**
 * Fallback handler — ensures we always return valid data
 */
function useFallback(symbol, reason = "unknown") {
  const fallback = FALLBACK_DATA[symbol];
  if (!fallback) {
    console.warn(`⚠️ No fallback available for ${symbol}`);
    return {
      symbol,
      price: 0,
      change: 0,
      changePercent: 0,
      volume: 0,
      source: "none",
      reason,
      timestamp: new Date().toISOString(),
    };
  }

  const randomMultiplier = 0.995 + Math.random() * 0.01; // ±0.5 % variance
  const fallbackData = {
    symbol,
    price: parseFloat((fallback.price * randomMultiplier).toFixed(2)),
    change: parseFloat((fallback.change * randomMultiplier).toFixed(2)),
    changePercent: parseFloat(
      (fallback.changePercent * randomMultiplier).toFixed(2)
    ),
    volume: fallback.volume,
    high: parseFloat((fallback.high * randomMultiplier).toFixed(2)),
    low: parseFloat((fallback.low * randomMultiplier).toFixed(2)),
    timestamp: new Date().toISOString(),
    source: "fallback",
    reason,
  };

  cache.set(`stock_${symbol}`, fallbackData, 300); // cache 5 min
  console.log(`💾 Using fallback for ${symbol} (${reason})`);
  return fallbackData;
}

/**
 * Get single stock price
 */
app.get("/api/stock/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol || symbol.length === 0) {
      return res.status(400).json({
        error: "Stock symbol is required",
        example: "/api/stock/RELIANCE",
      });
    }

    const stockData = await fetchStockPrice(symbol.toUpperCase());

    res.json({
      success: true,
      data: stockData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch stock data",
      message: error.message,
      symbol: req.params.symbol,
    });
  }
});

/**
 * Get multiple stock prices in batch with rate-limit protection
 */
/**
 * Optimized batch route — respects 8 calls/min rate limit, uses cache-first data
 */
app.post("/api/stocks/batch", async (req, res) => {
  try {
    const { symbols } = req.body;

    if (!Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Symbols array is required",
        example: { symbols: ["RELIANCE", "TCS", "INFY"] },
      });
    }

    console.log(`🔄 Batch request for ${symbols.length} symbols`);

    // ✅ 1. Try to serve from cache first — instant response
    const cachedResults = [];
    const symbolsToFetch = [];

    for (const symbol of symbols) {
      const upper = symbol.toUpperCase();
      const cached = cache.get(`stock_${upper}`);
      if (cached) cachedResults.push(cached);
      else symbolsToFetch.push(upper);
    }

    // ✅ 2. Immediately send cached results to frontend
    res.json({
      success: true,
      data: cachedResults,
      pendingFetches: symbolsToFetch,
      timestamp: new Date().toISOString(),
    });

    // ✅ 3. Fetch remaining symbols in the background (rate-limited)
    if (symbolsToFetch.length > 0) {
      console.log(
        `⏳ Background fetching ${symbolsToFetch.length} uncached stocks...`
      );
      const CHUNK_SIZE = 8; // 8 requests per minute max for free tier
      for (let i = 0; i < symbolsToFetch.length; i += CHUNK_SIZE) {
        const chunk = symbolsToFetch.slice(i, i + CHUNK_SIZE);
        await Promise.all(
          chunk.map(async (sym) => {
            try {
              const data = await fetchStockPrice(sym);
              cache.set(`stock_${sym}`, data, 300);
              console.log(`✅ Background updated ${sym}`);
            } catch (err) {
              console.warn(
                `⚠️ Failed background fetch for ${sym}: ${err.message}`
              );
            }
          })
        );
        if (i + CHUNK_SIZE < symbolsToFetch.length) {
          console.log("⏸️ Waiting 60s before next batch (rate limit)");
          await new Promise((r) => setTimeout(r, 60000));
        }
      }
    }
  } catch (error) {
    console.error("❌ Batch processing failed:", error.message);
    // respond safely
  }
});

/**
 * Get market summary with top gainers/losers
 */
app.get("/api/market/summary", async (req, res) => {
  try {
    const majorStocks = [
      "RELIANCE",
      "TCS",
      "HDFCBANK",
      "INFY",
      "ICICIBANK",
      "HINDUNILVR",
      "SBIN",
      "BHARTIARTL",
    ];

    const stockPromises = majorStocks.map((symbol) =>
      fetchStockPrice(symbol).catch((error) => ({
        symbol,
        error: error.message,
      }))
    );

    const results = await Promise.all(stockPromises);
    const validStocks = results.filter((stock) => !stock.error);

    if (validStocks.length === 0) {
      throw new Error("No market data available");
    }

    // Calculate market summary
    const gainers = validStocks
      .filter((stock) => stock.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 3);

    const losers = validStocks
      .filter((stock) => stock.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 3);

    const totalChange = validStocks.reduce(
      (sum, stock) => sum + stock.changePercent,
      0
    );
    const avgChange = totalChange / validStocks.length;

    res.json({
      success: true,
      data: {
        summary: {
          totalStocks: validStocks.length,
          advancing: gainers.length,
          declining: losers.length,
          unchanged: validStocks.length - gainers.length - losers.length,
          averageChange: parseFloat(avgChange.toFixed(2)),
        },
        topGainers: gainers,
        topLosers: losers,
        marketTrend:
          avgChange > 0 ? "BULLISH" : avgChange < 0 ? "BEARISH" : "NEUTRAL",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch market summary",
      message: error.message,
    });
  }
});

/**
 * Search stocks by name or symbol
 */
app.get("/api/stocks/search/:query", async (req, res) => {
  try {
    const { query } = req.params;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        error: "Search query must be at least 2 characters long",
      });
    }

    const searchTerm = query.toUpperCase();

    // Search through available symbols
    const matches = Object.keys(SYMBOL_MAPPINGS)
      .filter(
        (symbol) =>
          symbol.includes(searchTerm) ||
          (FALLBACK_DATA[symbol] && symbol.startsWith(searchTerm))
      )
      .slice(0, 10); // Limit to 10 results

    if (matches.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: "No matching stocks found",
      });
    }

    // Get stock data for matches
    const stockPromises = matches.map((symbol) =>
      fetchStockPrice(symbol).catch(() => null)
    );

    const results = await Promise.all(stockPromises);
    const validResults = results.filter((result) => result !== null);

    res.json({
      success: true,
      data: validResults,
      query: query,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Search failed",
      message: error.message,
    });
  }
});

/**
 * Get API usage statistics and health
 */
app.get("/api/stats", (req, res) => {
  const cacheStats = cache.getStats();
  const memUsage = process.memoryUsage();

  res.json({
    success: true,
    data: {
      server: {
        uptime: process.uptime(),
        memory: {
          used: Math.round(memUsage.heapUsed / 1024 / 1024) + " MB",
          total: Math.round(memUsage.heapTotal / 1024 / 1024) + " MB",
        },
        nodeVersion: process.version,
        platform: process.platform,
      },
      cache: {
        keys: cacheStats.keys,
        hits: cacheStats.hits,
        misses: cacheStats.misses,
        hitRate:
          cacheStats.hits > 0
            ? (
                (cacheStats.hits / (cacheStats.hits + cacheStats.misses)) *
                100
              ).toFixed(2) + "%"
            : "0%",
      },
      api: {
        keyConfigured: !!API_KEY && API_KEY !== "your_twelve_data_api_key_here",
        availableSymbols: Object.keys(SYMBOL_MAPPINGS).length,
        fallbackDataPoints: Object.keys(FALLBACK_DATA).length,
      },
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Health check endpoint
 */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    endpoints: [
      "GET /api/health",
      "GET /api/stats",
      "GET /api/stock/:symbol",
      "POST /api/stocks/batch",
      "GET /api/market/summary",
      "GET /api/stocks/search/:query",
    ],
  });
});

/**
 * Get all available symbols
 */
app.get("/api/symbols", (req, res) => {
  const symbols = Object.keys(SYMBOL_MAPPINGS).map((symbol) => ({
    symbol,
    exchange: "NSE",
    mapped: SYMBOL_MAPPINGS[symbol],
    hasData: !!FALLBACK_DATA[symbol],
  }));

  res.json({
    success: true,
    data: symbols,
    count: symbols.length,
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Virtual Portfolio Stock API",
    version: "2.0.0",
    documentation: "https://github.com/your-repo/api-docs",
    endpoints: {
      health: "/api/health",
      singleStock: "/api/stock/:symbol",
      batchStocks: "/api/stocks/batch",
      marketSummary: "/api/market/summary",
      searchStocks: "/api/stocks/search/:query",
      allSymbols: "/api/symbols",
      statistics: "/api/stats",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    requested: req.originalUrl,
    availableEndpoints: [
      "GET /",
      "GET /api/health",
      "GET /api/stock/:symbol",
      "POST /api/stocks/batch",
      "GET /api/market/summary",
      "GET /api/stocks/search/:query",
      "GET /api/symbols",
      "GET /api/stats",
    ],
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error("🔥 Unhandled error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  cache.flushAll();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  cache.flushAll();
  process.exit(0);
});

// Start the server
app.listen(PORT, () => {
  console.log("🚀 Virtual Portfolio Stock API Server Started");
  console.log("=".repeat(50));
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🔗 Base URL: http://localhost:${PORT}`);
  console.log(`📊 Cache TTL: 5 minutes`);
  console.log(
    `🔑 API Key configured: ${
      API_KEY && API_KEY !== "your_twelve_data_api_key_here"
        ? "✅ Yes"
        : "❌ No (using demo data)"
    }`
  );
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📈 Available symbols: ${Object.keys(SYMBOL_MAPPINGS).length}`);
  console.log("=".repeat(50));
  console.log("📍 Available endpoints:");
  console.log(`   GET    /                     - API information`);
  console.log(`   GET    /api/health           - Health check`);
  console.log(`   GET    /api/stock/:symbol    - Single stock data`);
  console.log(`   POST   /api/stocks/batch     - Multiple stocks data`);
  console.log(`   GET    /api/market/summary   - Market overview`);
  console.log(`   GET    /api/stocks/search/:q - Search stocks`);
  console.log(`   GET    /api/symbols          - All available symbols`);
  console.log(`   GET    /api/stats            - Server statistics`);
  console.log("=".repeat(50));

  if (!API_KEY || API_KEY === "your_twelve_data_api_key_here") {
    console.log("⚠️  WARNING: No API key configured. Using demo data only.");
    console.log("   Set TWELVE_DATA_API_KEY in your .env file for live data.");
  }
});

module.exports = app;

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  BarChart3,
  PieChart,
  Wallet,
  Target,
  AlertCircle,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Wifi,
  WifiOff,
  Search,
  RefreshCw,
  Activity,
  TrendingUpIcon,
  Home,
} from "lucide-react";
import Navbar from "../Navbar/Navbar";
import HomeButton from "../HomeButton/HomeButton";

const VirtualPortfolioSimulator = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [portfolio, setPortfolio] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [virtualCash, setVirtualCash] = useState(100000); // Starting with ₹1 Lakh
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [totalInvested, setTotalInvested] = useState(0);
  const [apiStatus, setApiStatus] = useState("connecting"); // 'connected', 'error', 'connecting'
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [marketSummary, setMarketSummary] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);

  // API Configuration - Update this URL to match your backend
  const API_BASE_URL =
    process.env.NODE_ENV === "production"
      ? " https://paisa-buddy.onrender.com/"
      : "http://localhost:5000/api";

  // Enhanced market data with more stocks
  const [marketData, setMarketData] = useState([
    {
      id: "RELIANCE",
      name: "Reliance Industries",
      symbol: "RELIANCE",
      type: "stock",
      sector: "Oil & Gas",
      price: 2456.75,
      change: 45.3,
      changePercent: 1.88,
      marketCap: "16.6L Cr",
      pe: 24.5,
      description: "Largest private sector company in India",
      source: "loading",
    },
    {
      id: "TCS",
      name: "Tata Consultancy Services",
      symbol: "TCS",
      type: "stock",
      sector: "IT Services",
      price: 3542.85,
      change: -28.15,
      changePercent: -0.79,
      marketCap: "12.9L Cr",
      pe: 28.3,
      description: "Leading IT services company",
      source: "loading",
    },
    {
      id: "HDFCBANK",
      name: "HDFC Bank",
      symbol: "HDFCBANK",
      type: "stock",
      sector: "Banking",
      price: 1634.5,
      change: 23.75,
      changePercent: 1.47,
      marketCap: "12.4L Cr",
      pe: 18.7,
      description: "Leading private sector bank",
      source: "loading",
    },
    {
      id: "INFY",
      name: "Infosys",
      symbol: "INFY",
      type: "stock",
      sector: "IT Services",
      price: 1456.3,
      change: -12.45,
      changePercent: -0.85,
      marketCap: "6.1L Cr",
      pe: 26.8,
      description: "Global IT consulting company",
      source: "loading",
    },
    {
      id: "ICICIBANK",
      name: "ICICI Bank",
      symbol: "ICICIBANK",
      type: "stock",
      sector: "Banking",
      price: 1087.65,
      change: 15.3,
      changePercent: 1.43,
      marketCap: "7.6L Cr",
      pe: 16.2,
      description: "Leading private sector bank",
      source: "loading",
    },
    {
      id: "HINDUNILVR",
      name: "Hindustan Unilever",
      symbol: "HINDUNILVR",
      type: "stock",
      sector: "FMCG",
      price: 2678.9,
      change: 34.2,
      changePercent: 1.29,
      marketCap: "6.3L Cr",
      pe: 58.4,
      description: "Leading FMCG company",
      source: "loading",
    },
    {
      id: "SBIN",
      name: "State Bank of India",
      symbol: "SBIN",
      type: "stock",
      sector: "Banking",
      price: 542.3,
      change: -8.7,
      changePercent: -1.58,
      marketCap: "4.8L Cr",
      pe: 10.2,
      description: "Largest public sector bank",
      source: "loading",
    },
    {
      id: "BHARTIARTL",
      name: "Bharti Airtel",
      symbol: "BHARTIARTL",
      type: "stock",
      sector: "Telecom",
      price: 876.45,
      change: 12.8,
      changePercent: 1.48,
      marketCap: "5.1L Cr",
      pe: 22.1,
      description: "Leading telecom operator",
      source: "loading",
    },
    // Mutual Funds
    {
      id: "AXIS_BLUECHIP",
      name: "Axis Bluechip Fund",
      symbol: "AXIS_BLUECHIP",
      type: "mutual_fund",
      category: "Large Cap",
      price: 45.67,
      change: 0.34,
      changePercent: 0.75,
      aum: "₹25,430 Cr",
      expenseRatio: 1.75,
      description: "Invests in large-cap stocks with strong fundamentals",
      source: "loading",
    },
    {
      id: "MIRAE_EMERGING",
      name: "Mirae Asset Emerging Bluechip",
      symbol: "MIRAE_EMERGING",
      type: "mutual_fund",
      category: "Large & Mid Cap",
      price: 78.23,
      change: -0.45,
      changePercent: -0.57,
      aum: "₹32,156 Cr",
      expenseRatio: 2.05,
      description: "Invests across large and mid-cap companies",
      source: "loading",
    },
  ]);

  /**
   * Fetch stock prices from backend API using batch endpoint
   */
  const fetchStockPrices = async () => {
    try {
      setIsRefreshing(true);
      setApiStatus("connecting");

      // Get all symbols
      const symbols = marketData.map((stock) => stock.symbol);

      const response = await fetch(`${API_BASE_URL}/stocks/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbols }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        // Update market data with real prices
        setMarketData((prevData) =>
          prevData.map((item) => {
            const apiData = result.data.find(
              (stock) => stock.symbol === item.symbol
            );
            if (apiData) {
              return {
                ...item,
                price: apiData.price,
                change: apiData.change,
                changePercent: apiData.changePercent,
                volume: apiData.volume,
                high: apiData.high,
                low: apiData.low,
                source: apiData.source,
                lastUpdated: apiData.timestamp,
                marketStatus: apiData.marketStatus,
              };
            }
            return item;
          })
        );

        setApiStatus("connected");
        setLastUpdated(new Date());
        console.log("✅ Stock prices updated successfully");

        // Log any errors for debugging
        if (result.errors && result.errors.length > 0) {
          console.warn("⚠️ Some stocks had errors:", result.errors);
        }
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("❌ Failed to fetch stock prices:", error);
      setApiStatus("error");

      // Fallback to simulated price updates when API is unavailable
      console.log("📊 Using simulated price updates as fallback");
      simulatePriceUpdates();
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * Fetch market summary from backend
   */
  const fetchMarketSummary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/market/summary`);

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMarketSummary(result.data);
        }
      }
    } catch (error) {
      console.warn("Failed to fetch market summary:", error);
    }
  };

  /**
   * Search stocks using the search endpoint
   */
  const searchStocks = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/stocks/search/${encodeURIComponent(query)}`
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSearchResults(result.data || []);
        }
      }
    } catch (error) {
      console.warn("Search failed:", error);
      setSearchResults([]);
    }
  };

  /**
   * Fallback function for simulated price updates when API is unavailable
   */
  const simulatePriceUpdates = () => {
    setMarketData((prevData) =>
      prevData.map((item) => {
        const randomChange = (Math.random() - 0.5) * 0.02; // ±1% max change
        const newPrice = Math.max(0.01, item.price * (1 + randomChange));
        const priceChange = newPrice - item.price;
        const percentChange = (priceChange / item.price) * 100;

        return {
          ...item,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(priceChange.toFixed(2)),
          changePercent: parseFloat(percentChange.toFixed(2)),
          source: "simulated",
        };
      })
    );
    setLastUpdated(new Date());
  };

  /**
   * Update portfolio values based on current market prices
   */
  const updatePortfolioValues = () => {
    setPortfolio((prevPortfolio) =>
      prevPortfolio.map((holding) => {
        const currentStock = marketData.find((item) => item.id === holding.id);
        const currentMarketPrice = currentStock
          ? currentStock.price
          : holding.currentPrice;
        return {
          ...holding,
          currentPrice: currentMarketPrice,
          currentValue: currentMarketPrice * holding.quantity,
          pnl: (currentMarketPrice - holding.avgPrice) * holding.quantity,
          pnlPercent:
            ((currentMarketPrice - holding.avgPrice) / holding.avgPrice) * 100,
        };
      })
    );
  };

  /**
   * Record a transaction
   */
  const recordTransaction = (type, stock, quantity, price) => {
    const transaction = {
      id: Date.now(),
      type, // 'BUY' or 'SELL'
      stock: stock.name,
      symbol: stock.symbol,
      quantity,
      price,
      total: quantity * price,
      timestamp: new Date(),
    };

    setTransactionHistory((prev) => [transaction, ...prev.slice(0, 99)]); // Keep last 100 transactions
  };

  // Initial API call and setup intervals
  useEffect(() => {
    // Fetch prices immediately
    fetchStockPrices();
    fetchMarketSummary();

    // Set up regular price updates every 30 seconds
    const priceUpdateInterval = setInterval(() => {
      fetchStockPrices();
    }, 30000);

    // Fetch market summary every 2 minutes
    const summaryUpdateInterval = setInterval(() => {
      fetchMarketSummary();
    }, 120000);

    return () => {
      clearInterval(priceUpdateInterval);
      clearInterval(summaryUpdateInterval);
    };
  }, []);

  // Update portfolio values when market data changes
  useEffect(() => {
    if (portfolio.length > 0) {
      updatePortfolioValues();
    }
  }, [marketData]);

  // Search debounce effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery) {
        searchStocks(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const handleBuy = () => {
    if (!selectedStock || buyQuantity <= 0) return;

    const totalCost = selectedStock.price * buyQuantity;
    if (totalCost > virtualCash) {
      alert("Insufficient funds!");
      return;
    }

    const existingHolding = portfolio.find((p) => p.id === selectedStock.id);

    if (existingHolding) {
      // Update existing holding
      const newQuantity = existingHolding.quantity + buyQuantity;
      const newTotalInvestment = existingHolding.totalInvested + totalCost;
      const newAvgPrice = newTotalInvestment / newQuantity;

      setPortfolio((prev) =>
        prev.map((p) =>
          p.id === selectedStock.id
            ? {
                ...p,
                quantity: newQuantity,
                avgPrice: newAvgPrice,
                totalInvested: newTotalInvestment,
                currentValue: selectedStock.price * newQuantity,
                pnl: (selectedStock.price - newAvgPrice) * newQuantity,
                pnlPercent:
                  ((selectedStock.price - newAvgPrice) / newAvgPrice) * 100,
              }
            : p
        )
      );
    } else {
      // Add new holding
      const newHolding = {
        id: selectedStock.id,
        name: selectedStock.name,
        symbol: selectedStock.symbol,
        type: selectedStock.type,
        quantity: buyQuantity,
        avgPrice: selectedStock.price,
        currentPrice: selectedStock.price,
        totalInvested: totalCost,
        currentValue: totalCost,
        pnl: 0,
        pnlPercent: 0,
        sector: selectedStock.sector || selectedStock.category,
      };
      setPortfolio((prev) => [...prev, newHolding]);
    }

    // Record transaction
    recordTransaction("BUY", selectedStock, buyQuantity, selectedStock.price);

    setVirtualCash((prev) => prev - totalCost);
    setTotalInvested((prev) => prev + totalCost);
    setShowBuyModal(false);
    setBuyQuantity(1);
    setSelectedStock(null);

    console.log(
      `✅ Bought ${buyQuantity} shares of ${
        selectedStock.name
      } for ₹${totalCost.toFixed(2)}`
    );
  };

  const handleSell = (holding, sellQuantity) => {
    if (sellQuantity <= 0 || sellQuantity > holding.quantity) return;

    const saleValue = holding.currentPrice * sellQuantity;
    const remainingQuantity = holding.quantity - sellQuantity;

    if (remainingQuantity === 0) {
      // Remove holding completely
      setPortfolio((prev) => prev.filter((p) => p.id !== holding.id));
    } else {
      // Update holding quantity
      const newTotalInvested = holding.avgPrice * remainingQuantity;
      setPortfolio((prev) =>
        prev.map((p) =>
          p.id === holding.id
            ? {
                ...p,
                quantity: remainingQuantity,
                totalInvested: newTotalInvested,
                currentValue: holding.currentPrice * remainingQuantity,
                pnl:
                  (holding.currentPrice - holding.avgPrice) * remainingQuantity,
                pnlPercent:
                  ((holding.currentPrice - holding.avgPrice) /
                    holding.avgPrice) *
                  100,
              }
            : p
        )
      );
    }

    // Record transaction
    recordTransaction("SELL", holding, sellQuantity, holding.currentPrice);

    setVirtualCash((prev) => prev + saleValue);
    const soldInvestment = holding.avgPrice * sellQuantity;
    setTotalInvested((prev) => prev - soldInvestment);

    console.log(
      `✅ Sold ${sellQuantity} shares of ${
        holding.name
      } for ₹${saleValue.toFixed(2)}`
    );
  };

  const addToWatchlist = (stock) => {
    if (!watchlist.find((w) => w.id === stock.id)) {
      setWatchlist((prev) => [...prev, stock]);
    }
  };

  const removeFromWatchlist = (stockId) => {
    setWatchlist((prev) => prev.filter((w) => w.id !== stockId));
  };

  const getTotalPortfolioValue = () => {
    return (
      portfolio.reduce((sum, holding) => sum + holding.currentValue, 0) +
      virtualCash
    );
  };

  const getTotalPnL = () => {
    return portfolio.reduce((sum, holding) => sum + holding.pnl, 0);
  };

  const getPortfolioPnLPercent = () => {
    if (totalInvested === 0) return 0;
    return (getTotalPnL() / totalInvested) * 100;
  };

  // Manual refresh function
  const handleManualRefresh = () => {
    fetchStockPrices();
    fetchMarketSummary();
  };

  // API Status Indicator Component
  const ApiStatusIndicator = () => (
    <div className="flex items-center space-x-2 text-sm">
      {apiStatus === "connected" && (
        <>
          <Wifi className="w-4 h-4 text-green-600" />
          <span className="text-green-600">Live Data</span>
        </>
      )}
      {apiStatus === "error" && (
        <>
          <WifiOff className="w-4 h-4 text-red-600" />
          <span className="text-red-600">Demo Data</span>
        </>
      )}
      {apiStatus === "connecting" && (
        <>
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-600">Connecting...</span>
        </>
      )}
      {lastUpdated && (
        <span className="text-gray-500">
          {lastUpdated.toLocaleTimeString()}
        </span>
      )}
      <button
        onClick={handleManualRefresh}
        disabled={isRefreshing}
        className={`p-1 rounded hover:bg-gray-100 ${
          isRefreshing ? "opacity-50" : ""
        }`}
      >
        <RefreshCw
          className={`w-4 h-4 text-gray-600 ${
            isRefreshing ? "animate-spin" : ""
          }`}
        />
      </button>
    </div>
  );

  // Market Summary Component
  const MarketSummaryWidget = () => {
    if (!marketSummary) return null;

    return (
      <div className="w-full bg-white rounded-xl shadow-lg border mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Market Summary</h3>
            <div
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                marketSummary.marketTrend === "BULLISH"
                  ? "bg-green-100 text-green-800"
                  : marketSummary.marketTrend === "BEARISH"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {marketSummary.marketTrend === "BULLISH" ? (
                <TrendingUpIcon className="w-4 h-4" />
              ) : marketSummary.marketTrend === "BEARISH" ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Activity className="w-4 h-4" />
              )}
              <span>{marketSummary.marketTrend}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {marketSummary.summary.advancing}
              </div>
              <div className="text-sm text-gray-600">Advancing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {marketSummary.summary.declining}
              </div>
              <div className="text-sm text-gray-600">Declining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {marketSummary.summary.unchanged}
              </div>
              <div className="text-sm text-gray-600">Unchanged</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  marketSummary.summary.averageChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {marketSummary.summary.averageChange.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">Avg Change</div>
            </div>
          </div>

          {marketSummary.topGainers?.length > 0 && (
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium text-green-600 mb-2">Top Gainers</h4>
                {marketSummary.topGainers.slice(0, 2).map((stock) => (
                  <div key={stock.symbol} className="text-sm">
                    {stock.symbol}: +{stock.changePercent.toFixed(2)}%
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-medium text-red-600 mb-2">Top Losers</h4>
                {marketSummary.topLosers.slice(0, 2).map((stock) => (
                  <div key={stock.symbol} className="text-sm">
                    {stock.symbol}: {stock.changePercent.toFixed(2)}%
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div className="space-y-6">
      {/* Market Summary Widget */}
      <MarketSummaryWidget />

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{getTotalPortfolioValue().toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Cash</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{virtualCash.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total P&L</p>
              <p
                className={`text-2xl font-bold ${
                  getTotalPnL() >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{getTotalPnL().toLocaleString("en-IN")}
              </p>
              <p
                className={`text-sm ${
                  getTotalPnL() >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ({getPortfolioPnLPercent().toFixed(2)}%)
              </p>
            </div>
            <div
              className={`${
                getTotalPnL() >= 0 ? "bg-green-100" : "bg-red-100"
              } p-3 rounded-full`}
            >
              {getTotalPnL() >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Holdings</p>
              <p className="text-2xl font-bold text-gray-900">
                {portfolio.length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Your Holdings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Instrument
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Avg Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Current Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  P&L
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {portfolio.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No holdings yet. Start investing to see your portfolio here!
                  </td>
                </tr>
              ) : (
                portfolio.map((holding) => (
                  <tr key={holding.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {holding.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {holding.symbol} • {holding.sector}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {holding.quantity}
                    </td>
                    <td className="px-6 py-4">
                      ₹{holding.avgPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      ₹{holding.currentPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`font-semibold ${
                          holding.pnl >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        ₹{holding.pnl.toFixed(2)}
                        <div className="text-sm">
                          ({holding.pnlPercent.toFixed(2)}%)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleSell(
                            holding,
                            Math.floor(holding.quantity / 2) || 1
                          )
                        }
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Sell 50%
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      {transactionHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactionHistory.slice(0, 10).map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {transaction.timestamp.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          transaction.type === "BUY"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {transaction.stock}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.symbol}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4">
                      ₹{transaction.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      ₹{transaction.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const Markets = () => (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search stocks (e.g., RELIANCE, TCS, INFY...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <ApiStatusIndicator />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Search Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.slice(0, 6).map((stock) => (
                <div
                  key={stock.symbol}
                  className="border rounded-lg p-3 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">
                        {stock.symbol}
                      </div>
                      <div className="text-sm text-gray-600">
                        ₹{stock.price.toFixed(2)}
                      </div>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        stock.changePercent >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stock.changePercent >= 0 ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => {
                        const fullStock = marketData.find(
                          (s) => s.symbol === stock.symbol
                        ) || {
                          ...stock,
                          id: stock.symbol,
                          name: stock.symbol,
                          type: "stock",
                          sector: "Unknown",
                        };
                        setSelectedStock(fullStock);
                        setShowBuyModal(true);
                      }}
                      className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() =>
                        addToWatchlist({
                          ...stock,
                          id: stock.symbol,
                          name: stock.symbol,
                          type: "stock",
                        })
                      }
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                    >
                      Watch
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Market Data Table */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">Available Instruments</h3>
            <p className="text-gray-600">
              Click on any instrument to buy or add to watchlist
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Instrument
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Volume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  High/Low
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {marketData.map((instrument) => (
                <tr key={instrument.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="font-semibold text-gray-900">
                          {instrument.name}
                        </div>
                        {instrument.source && (
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              instrument.source === "twelvedata"
                                ? "bg-green-100 text-green-800"
                                : instrument.source === "fallback"
                                ? "bg-yellow-100 text-yellow-800"
                                : instrument.source === "demo"
                                ? "bg-blue-100 text-blue-800"
                                : instrument.source === "simulated"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {instrument.source === "twelvedata"
                              ? "Live"
                              : instrument.source === "fallback"
                              ? "Cached"
                              : instrument.source === "demo"
                              ? "Demo"
                              : instrument.source === "simulated"
                              ? "Sim"
                              : "Loading"}
                          </span>
                        )}
                        {instrument.marketStatus && (
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              instrument.marketStatus === "OPEN"
                                ? "bg-green-100 text-green-800"
                                : instrument.marketStatus === "CLOSED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {instrument.marketStatus}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {instrument.symbol} •{" "}
                        {instrument.sector || instrument.category}
                        <span
                          className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            instrument.type === "stock"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {instrument.type === "stock"
                            ? "Stock"
                            : "Mutual Fund"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ₹{instrument.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center ${
                        instrument.changePercent >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {instrument.changePercent >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                      )}
                      <div>
                        <div className="font-semibold">
                          ₹{Math.abs(instrument.change).toFixed(2)}
                        </div>
                        <div className="text-sm">
                          ({Math.abs(instrument.changePercent).toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {instrument.volume
                      ? instrument.volume.toLocaleString("en-IN")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {instrument.high && instrument.low ? (
                      <div>
                        <div>H: ₹{instrument.high.toFixed(2)}</div>
                        <div>L: ₹{instrument.low.toFixed(2)}</div>
                      </div>
                    ) : (
                      <div>
                        {instrument.type === "stock" ? (
                          <div>
                            <div>MCap: {instrument.marketCap}</div>
                            <div>P/E: {instrument.pe}</div>
                          </div>
                        ) : (
                          <div>
                            <div>AUM: {instrument.aum}</div>
                            <div>ER: {instrument.expenseRatio}%</div>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedStock(instrument);
                          setShowBuyModal(true);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium"
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => addToWatchlist(instrument)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const Watchlist = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Your Watchlist</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Instrument
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  High/Low
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {watchlist.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No instruments in watchlist. Add some from the Markets tab
                    or use the search feature!
                  </td>
                </tr>
              ) : (
                watchlist.map((instrument) => {
                  // Find current price from marketData
                  const currentData = marketData.find(
                    (item) => item.id === instrument.id
                  );
                  const displayData = currentData || instrument;

                  return (
                    <tr key={instrument.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {displayData.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {displayData.symbol}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        ₹{displayData.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`flex items-center ${
                            displayData.changePercent >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {displayData.changePercent >= 0 ? (
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 mr-1" />
                          )}
                          <div>
                            <div className="font-semibold">
                              {Math.abs(displayData.changePercent).toFixed(2)}%
                            </div>
                            <div className="text-sm">
                              ₹{Math.abs(displayData.change).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {displayData.high && displayData.low ? (
                          <div>
                            <div>H: ₹{displayData.high.toFixed(2)}</div>
                            <div>L: ₹{displayData.low.toFixed(2)}</div>
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedStock(displayData);
                              setShowBuyModal(true);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium"
                          >
                            Buy
                          </button>
                          <button
                            onClick={() => removeFromWatchlist(instrument.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const BuyModal = () =>
    showBuyModal &&
    selectedStock && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-semibold mb-4">
            Buy {selectedStock.name}
          </h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Current Price:</span>
                  <div className="font-semibold">
                    ₹{selectedStock.price.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Change:</span>
                  <div
                    className={`font-semibold ${
                      selectedStock.changePercent >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedStock.changePercent >= 0 ? "+" : ""}
                    {selectedStock.changePercent.toFixed(2)}%
                  </div>
                </div>
                {selectedStock.high && selectedStock.low && (
                  <>
                    <div>
                      <span className="text-gray-600">Day High:</span>
                      <div className="font-semibold">
                        ₹{selectedStock.high.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Day Low:</span>
                      <div className="font-semibold">
                        ₹{selectedStock.low.toFixed(2)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <p className="text-gray-600">
                Available Cash:{" "}
                <span className="font-semibold">
                  ₹{virtualCash.toLocaleString("en-IN")}
                </span>
              </p>
              {selectedStock.source && (
                <p className="text-xs text-gray-500">
                  Data Source:{" "}
                  {selectedStock.source === "twelvedata"
                    ? "Live Market Data"
                    : selectedStock.source === "fallback"
                    ? "Cached Market Data"
                    : selectedStock.source === "demo"
                    ? "Demo Data"
                    : selectedStock.source === "simulated"
                    ? "Simulated Data"
                    : "Loading"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max={Math.floor(virtualCash / selectedStock.price)}
                value={buyQuantity}
                onChange={(e) => setBuyQuantity(parseInt(e.target.value) || 1)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Max affordable: {Math.floor(virtualCash / selectedStock.price)}{" "}
                shares
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Cost:</span>
                <span className="font-semibold text-lg">
                  ₹{(selectedStock.price * buyQuantity).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">Remaining Cash:</span>
                <span className="text-xs font-medium">
                  ₹
                  {(virtualCash - selectedStock.price * buyQuantity).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleBuy}
                disabled={
                  selectedStock.price * buyQuantity > virtualCash ||
                  buyQuantity <= 0
                }
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Buy {buyQuantity} Share{buyQuantity > 1 ? "s" : ""}
              </button>
              <button
                onClick={() => {
                  setShowBuyModal(false);
                  setSelectedStock(null);
                  setBuyQuantity(1);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen w-[99vw] bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Virtual Portfolio Simulator
                </h1>
                <p className="text-gray-600">
                  Learn investing with real Indian market data
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Virtual Cash</div>
              <div className="text-xl font-bold text-green-600">
                ₹{virtualCash.toLocaleString("en-IN")}
              </div>
              <div className="mt-1">
                <ApiStatusIndicator />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "markets", label: "Markets", icon: TrendingUp },
              { id: "watchlist", label: "Watchlist", icon: Eye },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "markets" && <Markets />}
        {activeTab === "watchlist" && <Watchlist />}
      </div>
      {/* Buy Modal */}
      <BuyModal />
      {/* Educational Tips */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Investment Learning Tips & Features
              </h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>
                  • <strong>Real Data:</strong> Now using live/delayed market
                  data from NSE/BSE via professional APIs
                </li>
                <li>
                  • <strong>Search:</strong> Use the search bar in Markets tab
                  to find specific stocks
                </li>
                <li>
                  • <strong>Market Summary:</strong> Check overall market
                  sentiment with top gainers/losers
                </li>
                <li>
                  • <strong>Transaction History:</strong> Track all your
                  buy/sell activities in the Dashboard
                </li>
                <li>
                  • <strong>Diversify:</strong> Don't put all money in one stock
                  or sector
                </li>
                <li>
                  • <strong>Research:</strong> Check P/E ratios, market cap, and
                  day high/low before investing
                </li>
                <li>
                  • <strong>Long-term:</strong> Markets fluctuate short-term but
                  tend to grow over the long term
                </li>
                <li>
                  • <strong>Risk Management:</strong> Never invest more than you
                  can afford to lose
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualPortfolioSimulator;

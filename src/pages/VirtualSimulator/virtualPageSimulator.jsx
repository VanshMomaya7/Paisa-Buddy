import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Plus, Eye, BarChart3, PieChart, Wallet, Target, AlertCircle, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const VirtualPortfolioSimulator = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [portfolio, setPortfolio] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [virtualCash, setVirtualCash] = useState(100000); // Starting with ₹1 Lakh
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [totalInvested, setTotalInvested] = useState(0);

  // Mock Indian stocks and mutual funds data
  const [marketData, setMarketData] = useState([
    {
      id: 'RELIANCE',
      name: 'Reliance Industries',
      symbol: 'RELIANCE',
      type: 'stock',
      sector: 'Oil & Gas',
      price: 2456.75,
      change: 45.30,
      changePercent: 1.88,
      marketCap: '16.6L Cr',
      pe: 24.5,
      description: 'Largest private sector company in India'
    },
    {
      id: 'TCS',
      name: 'Tata Consultancy Services',
      symbol: 'TCS',
      type: 'stock',
      sector: 'IT Services',
      price: 3542.85,
      change: -28.15,
      changePercent: -0.79,
      marketCap: '12.9L Cr',
      pe: 28.3,
      description: 'Leading IT services company'
    },
    {
      id: 'HDFCBANK',
      name: 'HDFC Bank',
      symbol: 'HDFCBANK',
      type: 'stock',
      sector: 'Banking',
      price: 1634.50,
      change: 23.75,
      changePercent: 1.47,
      marketCap: '12.4L Cr',
      pe: 18.7,
      description: 'Leading private sector bank'
    },
    {
      id: 'INFY',
      name: 'Infosys',
      symbol: 'INFY',
      type: 'stock',
      sector: 'IT Services',
      price: 1456.30,
      change: -12.45,
      changePercent: -0.85,
      marketCap: '6.1L Cr',
      pe: 26.8,
      description: 'Global IT consulting company'
    },
    {
      id: 'ICICIBANK',
      name: 'ICICI Bank',
      symbol: 'ICICIBANK',
      type: 'stock',
      sector: 'Banking',
      price: 1087.65,
      change: 15.30,
      changePercent: 1.43,
      marketCap: '7.6L Cr',
      pe: 16.2,
      description: 'Leading private sector bank'
    },
    {
      id: 'AXIS_BLUECHIP',
      name: 'Axis Bluechip Fund',
      symbol: 'AXIS_BLUECHIP',
      type: 'mutual_fund',
      category: 'Large Cap',
      price: 45.67,
      change: 0.34,
      changePercent: 0.75,
      aum: '₹25,430 Cr',
      expenseRatio: 1.75,
      description: 'Invests in large-cap stocks with strong fundamentals'
    },
    {
      id: 'MIRAE_EMERGING',
      name: 'Mirae Asset Emerging Bluechip',
      symbol: 'MIRAE_EMERGING',
      type: 'mutual_fund',
      category: 'Large & Mid Cap',
      price: 78.23,
      change: -0.45,
      changePercent: -0.57,
      aum: '₹32,156 Cr',
      expenseRatio: 2.05,
      description: 'Invests across large and mid-cap companies'
    },
    {
      id: 'SBI_SMALL_CAP',
      name: 'SBI Small Cap Fund',
      symbol: 'SBI_SMALL_CAP',
      type: 'mutual_fund',
      category: 'Small Cap',
      price: 156.89,
      change: 2.34,
      changePercent: 1.51,
      aum: '₹15,678 Cr',
      expenseRatio: 1.85,
      description: 'Focuses on small-cap stocks with high growth potential'
    }
  ]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData => 
        prevData.map(item => {
          const randomChange = (Math.random() - 0.5) * 0.02; // ±1% max change
          const newPrice = Math.max(0.01, item.price * (1 + randomChange));
          const priceChange = newPrice - item.price;
          const percentChange = (priceChange / item.price) * 100;
          
          return {
            ...item,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(priceChange.toFixed(2)),
            changePercent: parseFloat(percentChange.toFixed(2))
          };
        })
      );

      // Update portfolio values
      setPortfolio(prevPortfolio => 
        prevPortfolio.map(holding => {
          const currentStock = marketData.find(item => item.id === holding.id);
          const currentMarketPrice = currentStock ? currentStock.price : holding.currentPrice;
          return {
            ...holding,
            currentPrice: currentMarketPrice,
            currentValue: currentMarketPrice * holding.quantity,
            pnl: (currentMarketPrice - holding.avgPrice) * holding.quantity,
            pnlPercent: ((currentMarketPrice - holding.avgPrice) / holding.avgPrice) * 100
          };
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [marketData]);

  const handleBuy = () => {
    if (!selectedStock || buyQuantity <= 0) return;
    
    const totalCost = selectedStock.price * buyQuantity;
    if (totalCost > virtualCash) {
      alert('Insufficient funds!');
      return;
    }

    const existingHolding = portfolio.find(p => p.id === selectedStock.id);
    
    if (existingHolding) {
      // Update existing holding
      const newQuantity = existingHolding.quantity + buyQuantity;
      const newTotalInvestment = existingHolding.totalInvested + totalCost;
      const newAvgPrice = newTotalInvestment / newQuantity;
      
      setPortfolio(prev => prev.map(p => 
        p.id === selectedStock.id 
          ? {
              ...p,
              quantity: newQuantity,
              avgPrice: newAvgPrice,
              totalInvested: newTotalInvestment,
              currentValue: selectedStock.price * newQuantity,
              pnl: (selectedStock.price - newAvgPrice) * newQuantity,
              pnlPercent: ((selectedStock.price - newAvgPrice) / newAvgPrice) * 100
            }
          : p
      ));
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
        sector: selectedStock.sector || selectedStock.category
      };
      setPortfolio(prev => [...prev, newHolding]);
    }

    setVirtualCash(prev => prev - totalCost);
    setTotalInvested(prev => prev + totalCost);
    setShowBuyModal(false);
    setBuyQuantity(1);
    setSelectedStock(null);
  };

  const handleSell = (holding, sellQuantity) => {
    if (sellQuantity <= 0 || sellQuantity > holding.quantity) return;
    
    const saleValue = holding.currentPrice * sellQuantity;
    const remainingQuantity = holding.quantity - sellQuantity;
    
    if (remainingQuantity === 0) {
      // Remove holding completely
      setPortfolio(prev => prev.filter(p => p.id !== holding.id));
    } else {
      // Update holding quantity
      const newTotalInvested = holding.avgPrice * remainingQuantity;
      setPortfolio(prev => prev.map(p => 
        p.id === holding.id 
          ? {
              ...p,
              quantity: remainingQuantity,
              totalInvested: newTotalInvested,
              currentValue: holding.currentPrice * remainingQuantity,
              pnl: (holding.currentPrice - holding.avgPrice) * remainingQuantity,
              pnlPercent: ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100
            }
          : p
      ));
    }

    setVirtualCash(prev => prev + saleValue);
    const soldInvestment = holding.avgPrice * sellQuantity;
    setTotalInvested(prev => prev - soldInvestment);
  };

  const addToWatchlist = (stock) => {
    if (!watchlist.find(w => w.id === stock.id)) {
      setWatchlist(prev => [...prev, stock]);
    }
  };

  const removeFromWatchlist = (stockId) => {
    setWatchlist(prev => prev.filter(w => w.id !== stockId));
  };

  const getTotalPortfolioValue = () => {
    return portfolio.reduce((sum, holding) => sum + holding.currentValue, 0) + virtualCash;
  };

  const getTotalPnL = () => {
    return portfolio.reduce((sum, holding) => sum + holding.pnl, 0);
  };

  const getPortfolioPnLPercent = () => {
    if (totalInvested === 0) return 0;
    return (getTotalPnL() / totalInvested) * 100;
  };

  const Dashboard = () => (
    <div className="space-y-6">
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{getTotalPortfolioValue().toLocaleString('en-IN')}</p>
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
              <p className="text-2xl font-bold text-gray-900">₹{virtualCash.toLocaleString('en-IN')}</p>
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
              <p className={`text-2xl font-bold ${getTotalPnL() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{getTotalPnL().toLocaleString('en-IN')}
              </p>
              <p className={`text-sm ${getTotalPnL() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ({getPortfolioPnLPercent().toFixed(2)}%)
              </p>
            </div>
            <div className={`${getTotalPnL() >= 0 ? 'bg-green-100' : 'bg-red-100'} p-3 rounded-full`}>
              {getTotalPnL() >= 0 ? 
                <TrendingUp className="w-6 h-6 text-green-600" /> : 
                <TrendingDown className="w-6 h-6 text-red-600" />
              }
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Holdings</p>
              <p className="text-2xl font-bold text-gray-900">{portfolio.length}</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instrument</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">P&L</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {portfolio.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No holdings yet. Start investing to see your portfolio here!
                  </td>
                </tr>
              ) : (
                portfolio.map((holding) => (
                  <tr key={holding.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{holding.name}</div>
                        <div className="text-sm text-gray-500">{holding.symbol} • {holding.sector}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{holding.quantity}</td>
                    <td className="px-6 py-4">₹{holding.avgPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">₹{holding.currentPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className={`font-semibold ${holding.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{holding.pnl.toFixed(2)}
                        <div className="text-sm">({holding.pnlPercent.toFixed(2)}%)</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleSell(holding, Math.floor(holding.quantity / 2) || 1)}
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
    </div>
  );

  const Markets = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Available Instruments</h3>
          <p className="text-gray-600">Click on any instrument to buy or add to watchlist</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instrument</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {marketData.map((instrument) => (
                <tr key={instrument.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{instrument.name}</div>
                      <div className="text-sm text-gray-500">
                        {instrument.symbol} • {instrument.sector || instrument.category}
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          instrument.type === 'stock' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {instrument.type === 'stock' ? 'Stock' : 'Mutual Fund'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">₹{instrument.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center ${instrument.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {instrument.changePercent >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                      <span className="font-semibold">
                        ₹{Math.abs(instrument.change).toFixed(2)} ({Math.abs(instrument.changePercent).toFixed(2)}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {instrument.type === 'stock' ? (
                      <div>
                        <div>Market Cap: {instrument.marketCap}</div>
                        <div>P/E: {instrument.pe}</div>
                      </div>
                    ) : (
                      <div>
                        <div>AUM: {instrument.aum}</div>
                        <div>Expense Ratio: {instrument.expenseRatio}%</div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instrument</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {watchlist.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No instruments in watchlist. Add some from the Markets tab!
                  </td>
                </tr>
              ) : (
                watchlist.map((instrument) => (
                  <tr key={instrument.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{instrument.name}</div>
                        <div className="text-sm text-gray-500">{instrument.symbol}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">₹{instrument.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center ${instrument.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {instrument.changePercent >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                        <span className="font-semibold">
                          {Math.abs(instrument.changePercent).toFixed(2)}%
                        </span>
                      </div>
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
                          onClick={() => removeFromWatchlist(instrument.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const BuyModal = () => (
    showBuyModal && selectedStock && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-semibold mb-4">Buy {selectedStock.name}</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Current Price: <span className="font-semibold">₹{selectedStock.price.toFixed(2)}</span></p>
              <p className="text-gray-600">Available Cash: <span className="font-semibold">₹{virtualCash.toLocaleString('en-IN')}</span></p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                max={Math.floor(virtualCash / selectedStock.price)}
                value={buyQuantity}
                onChange={(e) => setBuyQuantity(parseInt(e.target.value) || 1)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Cost: <span className="font-semibold">₹{(selectedStock.price * buyQuantity).toFixed(2)}</span></p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleBuy}
                disabled={selectedStock.price * buyQuantity > virtualCash}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium"
              >
                Buy
              </button>
              <button
                onClick={() => {
                  setShowBuyModal(false);
                  setSelectedStock(null);
                  setBuyQuantity(1);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Virtual Portfolio Simulator</h1>
                <p className="text-gray-600">Learn investing with Indian stocks & mutual funds</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Virtual Cash</div>
              <div className="text-xl font-bold text-green-600">₹{virtualCash.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'markets', label: 'Markets', icon: TrendingUp },
              { id: 'watchlist', label: 'Watchlist', icon: Eye }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'markets' && <Markets />}
        {activeTab === 'watchlist' && <Watchlist />}
      </div>

      {/* Buy Modal */}
      <BuyModal />

      {/* Educational Tips */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Investment Learning Tips</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• <strong>Diversify:</strong> Don't put all money in one stock or sector</li>
                <li>• <strong>Research:</strong> Check P/E ratios, market cap, and company fundamentals</li>
                <li>• <strong>Long-term:</strong> Markets fluctuate short-term but grow long-term</li>
                <li>• <strong>SIP:</strong> Consider systematic investment plans for mutual funds</li>
                <li>• <strong>Risk Management:</strong> Never invest more than you can afford to lose</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualPortfolioSimulator;
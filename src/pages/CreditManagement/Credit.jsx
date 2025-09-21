import React, { useState, useEffect } from "react";
import {
  Award,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  User,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  DollarSign,
  BarChart3,
  Target,
  Shield,
} from "lucide-react";

const Credit = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [creditScore, setCreditScore] = useState(680);
  const [previousScore, setPreviousScore] = useState(680);
  const [creditHistory, setCreditHistory] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  // User Profile Data
  const [userProfile, setUserProfile] = useState({
    name: "Rahul Kumar",
    age: 28,
    location: "Mumbai, Maharashtra",
    employment: "Software Engineer",
    monthlyIncome: 75000,
    yearsEmployed: 3.5,
  });

  // Credit Factors
  const [creditFactors, setCreditFactors] = useState({
    paymentHistory: { score: 35, current: 78, status: "Good" },
    creditUtilization: { score: 30, current: 45, status: "Fair" },
    creditLength: { score: 15, current: 60, status: "Good" },
    creditMix: { score: 10, current: 85, status: "Excellent" },
    newCredit: { score: 10, current: 70, status: "Good" },
  });

  // Mock Credit Accounts
  useEffect(() => {
    setAccounts([
      {
        id: 1,
        type: "Credit Card",
        provider: "HDFC Bank",
        accountNumber: "****4567",
        creditLimit: 200000,
        currentBalance: 45000,
        minimumDue: 4500,
        dueDate: "2025-01-05",
        status: "Active",
        openDate: "2021-03-15",
        paymentStatus: "Current",
      },
      {
        id: 2,
        type: "Credit Card",
        provider: "ICICI Bank",
        accountNumber: "****8901",
        creditLimit: 150000,
        currentBalance: 28000,
        minimumDue: 2800,
        dueDate: "2025-01-10",
        status: "Active",
        openDate: "2020-08-22",
        paymentStatus: "Current",
      },
      {
        id: 3,
        type: "Personal Loan",
        provider: "SBI",
        accountNumber: "****2345",
        originalAmount: 500000,
        currentBalance: 180000,
        emiAmount: 12500,
        dueDate: "2025-01-01",
        status: "Active",
        openDate: "2023-06-10",
        paymentStatus: "Current",
      },
    ]);

    // Mock Payment History
    setPaymentHistory([
      {
        date: "2024-12-01",
        account: "HDFC Credit Card",
        amount: 5000,
        status: "On Time",
        impact: "+2",
      },
      {
        date: "2024-11-28",
        account: "SBI Personal Loan",
        amount: 12500,
        status: "On Time",
        impact: "+2",
      },
      {
        date: "2024-11-25",
        account: "ICICI Credit Card",
        amount: 3500,
        status: "On Time",
        impact: "+2",
      },
      {
        date: "2024-11-01",
        account: "HDFC Credit Card",
        amount: 4800,
        status: "2 Days Late",
        impact: "-8",
      },
      {
        date: "2024-10-28",
        account: "SBI Personal Loan",
        amount: 12500,
        status: "On Time",
        impact: "+2",
      },
    ]);

    // Mock Credit Inquiries
    setInquiries([
      {
        date: "2024-11-15",
        type: "Hard Inquiry",
        provider: "Axis Bank",
        product: "Home Loan",
        impact: "-3",
      },
      {
        date: "2024-09-22",
        type: "Soft Inquiry",
        provider: "Bajaj Finserv",
        product: "Personal Loan",
        impact: "0",
      },
      {
        date: "2024-07-10",
        type: "Hard Inquiry",
        provider: "HDFC Bank",
        product: "Credit Card",
        impact: "-5",
      },
    ]);
  }, []);

  // Utility Functions
  const getCreditScoreColor = (score) => {
    if (score >= 750) return "text-green-600";
    if (score >= 650) return "text-yellow-600";
    if (score >= 550) return "text-orange-600";
    return "text-red-600";
  };

  const getCreditScoreLabel = (score) => {
    if (score >= 750) return "Excellent";
    if (score >= 650) return "Good";
    if (score >= 550) return "Fair";
    return "Poor";
  };

  const getCreditScoreBg = (score) => {
    if (score >= 750) return "from-green-500 to-emerald-600";
    if (score >= 650) return "from-yellow-500 to-orange-500";
    if (score >= 550) return "from-orange-500 to-red-500";
    return "from-red-500 to-red-600";
  };

  const getTotalCreditUtilization = () => {
    const creditCards = accounts.filter((acc) => acc.type === "Credit Card");
    const totalLimit = creditCards.reduce(
      (sum, card) => sum + card.creditLimit,
      0
    );
    const totalBalance = creditCards.reduce(
      (sum, card) => sum + card.currentBalance,
      0
    );
    return totalLimit > 0 ? Math.round((totalBalance / totalLimit) * 100) : 0;
  };

  const addCreditActivity = (type, description, impact) => {
    const activity = {
      id: Date.now(),
      type,
      description,
      impact,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
    };
    setCreditHistory((prev) => [activity, ...prev].slice(0, 10));
  };

  // Simulation Functions
  const makePayment = (accountId, amount, onTime = true) => {
    const account = accounts.find((acc) => acc.id === accountId);
    if (!account) return;

    const payment = {
      date: new Date().toLocaleDateString(),
      account: `${account.provider} ${account.type}`,
      amount,
      status: onTime ? "On Time" : "15 Days Late",
      impact: onTime ? "+5" : "-15",
    };

    setPaymentHistory((prev) => [payment, ...prev].slice(0, 15));

    // Update account balance
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId
          ? { ...acc, currentBalance: Math.max(0, acc.currentBalance - amount) }
          : acc
      )
    );

    // Update credit score
    const scoreChange = onTime ? 5 : -15;
    setPreviousScore(creditScore);
    setCreditScore((prev) => Math.max(300, Math.min(850, prev + scoreChange)));

    addCreditActivity(
      onTime ? "On-time Payment" : "Late Payment",
      `${onTime ? "Paid" : "Late payment for"} ${account.provider} ${
        account.type
      } - ₹${amount.toLocaleString()}`,
      scoreChange
    );

    // Update payment history factor
    setCreditFactors((prev) => ({
      ...prev,
      paymentHistory: {
        ...prev.paymentHistory,
        current: onTime
          ? Math.min(100, prev.paymentHistory.current + 2)
          : Math.max(0, prev.paymentHistory.current - 5),
      },
    }));
  };

  const simulateNewCreditApplication = (provider, product, approved = true) => {
    const inquiry = {
      date: new Date().toLocaleDateString(),
      type: "Hard Inquiry",
      provider,
      product,
      impact: approved ? "-2" : "-5",
    };

    setInquiries((prev) => [inquiry, ...prev]);

    const scoreChange = approved ? -2 : -5;
    setPreviousScore(creditScore);
    setCreditScore((prev) => Math.max(300, prev + scoreChange));

    addCreditActivity(
      "Credit Application",
      `Applied for ${product} at ${provider} - ${
        approved ? "Approved" : "Rejected"
      }`,
      scoreChange
    );

    if (approved) {
      // Add new account
      const newAccount = {
        id: accounts.length + 1,
        type: product,
        provider,
        accountNumber: "****" + Math.floor(1000 + Math.random() * 9000),
        creditLimit: product.includes("Card") ? 100000 : 300000,
        currentBalance: 0,
        minimumDue: 0,
        dueDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        status: "Active",
        openDate: new Date().toLocaleDateString(),
        paymentStatus: "Current",
      };
      setAccounts((prev) => [...prev, newAccount]);
    }
  };

  const improveUtilization = () => {
    // Simulate paying down credit card balances
    const creditCards = accounts.filter((acc) => acc.type === "Credit Card");
    if (creditCards.length === 0) return;

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.type === "Credit Card"
          ? { ...acc, currentBalance: Math.max(0, acc.currentBalance * 0.7) }
          : acc
      )
    );

    setPreviousScore(creditScore);
    setCreditScore((prev) => Math.min(850, prev + 15));

    addCreditActivity(
      "Improved Credit Utilization",
      "Paid down credit card balances, reducing utilization ratio",
      15
    );

    setCreditFactors((prev) => ({
      ...prev,
      creditUtilization: {
        ...prev.creditUtilization,
        current: Math.min(100, prev.creditUtilization.current + 10),
      },
    }));
  };

  // Dashboard Component
  const Dashboard = () => (
    <div className="space-y-6">
      {/* Credit Score Overview */}
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <div
          className={`bg-gradient-to-r ${getCreditScoreBg(
            creditScore
          )} text-white p-8`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Credit Score</h2>
              <div className="flex items-center space-x-4">
                <div className="text-6xl font-bold">{creditScore}</div>
                <div>
                  <div className="text-xl font-semibold">
                    {getCreditScoreLabel(creditScore)}
                  </div>
                  <div className="flex items-center space-x-2 text-sm opacity-90">
                    {creditScore > previousScore ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : creditScore < previousScore ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : null}
                    <span>
                      {creditScore !== previousScore &&
                        `${creditScore > previousScore ? "+" : ""}${
                          creditScore - previousScore
                        } from last update`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Award className="w-16 h-16 opacity-80" />
            </div>
          </div>
        </div>

        {/* Score Range Indicator */}
        <div className="p-6">
          <div className="relative">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>300</span>
              <span>Poor</span>
              <span>Fair</span>
              <span>Good</span>
              <span>Excellent</span>
              <span>850</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="flex h-full">
                <div className="bg-red-500 flex-1"></div>
                <div className="bg-orange-500 flex-1"></div>
                <div className="bg-yellow-500 flex-1"></div>
                <div className="bg-green-500 flex-1"></div>
              </div>
            </div>
            <div
              className="absolute top-0 w-1 h-3 bg-white border-2 border-gray-800"
              style={{ left: `${((creditScore - 300) / 550) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Credit Utilization</p>
              <p
                className={`text-2xl font-bold ${
                  getTotalCreditUtilization() <= 30
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {getTotalCreditUtilization()}%
              </p>
              <p className="text-sm text-gray-500">Keep below 30%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Accounts</p>
              <p className="text-2xl font-bold text-gray-900">
                {accounts.length}
              </p>
              <p className="text-sm text-gray-500">Total accounts</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Payment History</p>
              <p className="text-2xl font-bold text-green-600">94%</p>
              <p className="text-sm text-gray-500">On-time payments</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hard Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">
                {inquiries.filter((inq) => inq.type === "Hard Inquiry").length}
              </p>
              <p className="text-sm text-gray-500">Last 12 months</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Credit Score Factors */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Credit Score Breakdown</h3>
          <p className="text-gray-600">Factors affecting your credit score</p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {Object.entries(creditFactors).map(([key, factor]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium capitalize">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        factor.status === "Excellent"
                          ? "bg-green-100 text-green-800"
                          : factor.status === "Good"
                          ? "bg-blue-100 text-blue-800"
                          : factor.status === "Fair"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {factor.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {factor.score}% of score
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      factor.current >= 80
                        ? "bg-green-500"
                        : factor.current >= 60
                        ? "bg-blue-500"
                        : factor.current >= 40
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${factor.current}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Score Improvement Actions</h3>
          <p className="text-gray-600">
            Simulate different scenarios to see their impact
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => makePayment(1, 5000, true)}
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-left transition-colors"
            >
              <div className="font-semibold">Make On-time Payment</div>
              <div className="text-sm opacity-90">
                Pay credit card bill (+5 points)
              </div>
            </button>

            <button
              onClick={improveUtilization}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-left transition-colors"
            >
              <div className="font-semibold">Reduce Utilization</div>
              <div className="text-sm opacity-90">
                Pay down balances (+15 points)
              </div>
            </button>

            <button
              onClick={() => makePayment(2, 3000, false)}
              className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg text-left transition-colors"
            >
              <div className="font-semibold">Make Late Payment</div>
              <div className="text-sm opacity-90">
                Pay bill 15 days late (-15 points)
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Recent Credit Activities</h3>
        </div>
        <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
          {creditHistory.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No recent activities</p>
              <p className="text-sm">
                Use the actions above to see how different behaviors affect your
                score
              </p>
            </div>
          ) : (
            creditHistory.map((activity) => (
              <div
                key={activity.id}
                className="p-6 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {activity.type}
                  </div>
                  <div className="text-sm text-gray-500">
                    {activity.description}
                  </div>
                  <div className="text-xs text-gray-400">{activity.date}</div>
                </div>
                <div
                  className={`font-bold text-lg ${
                    activity.impact >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {activity.impact >= 0 ? "+" : ""}
                  {activity.impact}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  // Accounts Component
  const Accounts = () => (
    <div className="space-y-6">
      {/* Account Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Credit Limit</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹
                {accounts
                  .filter((acc) => acc.type === "Credit Card")
                  .reduce((sum, acc) => sum + acc.creditLimit, 0)
                  .toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-red-600">
                ₹
                {accounts
                  .reduce((sum, acc) => sum + acc.currentBalance, 0)
                  .toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Credit</p>
              <p className="text-2xl font-bold text-green-600">
                ₹
                {accounts
                  .filter((acc) => acc.type === "Credit Card")
                  .reduce(
                    (sum, acc) => sum + (acc.creditLimit - acc.currentBalance),
                    0
                  )
                  .toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Your Credit Accounts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Limit/Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Utilization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {accounts.map((account) => {
                const utilization =
                  account.type === "Credit Card"
                    ? Math.round(
                        (account.currentBalance / account.creditLimit) * 100
                      )
                    : null;

                return (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {account.provider}
                        </div>
                        <div className="text-sm text-gray-500">
                          {account.type} • {account.accountNumber}
                        </div>
                        <div className="text-xs text-gray-400">
                          Opened: {account.openDate}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-red-600">
                        ₹{account.currentBalance.toLocaleString("en-IN")}
                      </div>
                      {account.minimumDue > 0 && (
                        <div className="text-sm text-gray-500">
                          Min Due: ₹{account.minimumDue.toLocaleString("en-IN")}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">
                        ₹
                        {(
                          account.creditLimit || account.originalAmount
                        ).toLocaleString("en-IN")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {utilization !== null ? (
                        <div>
                          <div
                            className={`font-semibold ${
                              utilization <= 30
                                ? "text-green-600"
                                : utilization <= 70
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {utilization}%
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                utilization <= 30
                                  ? "bg-green-500"
                                  : utilization <= 70
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${Math.min(utilization, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          account.paymentStatus === "Current"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {account.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {account.currentBalance > 0 && (
                        <button
                          onClick={() =>
                            makePayment(
                              account.id,
                              Math.min(
                                account.currentBalance,
                                account.minimumDue || 5000
                              ),
                              true
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Simulator */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Payment Simulator</h3>
          <p className="text-gray-600">
            See how different payment scenarios affect your credit score
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() =>
                simulateNewCreditApplication("HDFC Bank", "Credit Card", true)
              }
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-left transition-colors"
            >
              <div className="font-semibold">Apply for New Credit Card</div>
              <div className="text-sm opacity-90">
                Get approved for new card (-2 points)
              </div>
            </button>

            <button
              onClick={() =>
                simulateNewCreditApplication("SBI", "Personal Loan", false)
              }
              className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg text-left transition-colors"
            >
              <div className="font-semibold">Apply for Loan (Rejected)</div>
              <div className="text-sm opacity-90">
                Application gets rejected (-5 points)
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Tabs to switch */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "dashboard" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("accounts")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "accounts" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Accounts
        </button>
      </div>

      {/* Render the active section */}
      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "accounts" && <Accounts />}
    </div>
  );
};

export default Credit;

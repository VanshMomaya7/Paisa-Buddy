import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BudgetingTool = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [budgetData, setBudgetData] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);

  const getCurrentData = () => {
    const monthKey = selectedDate.slice(0, 7); // YYYY-MM format
    return (
      budgetData[monthKey] || {
        income: 0,
        expenses: [
          { id: 1, category: "Food", amount: 0, color: "#A8FBD3" },
          { id: 2, category: "Transportation", amount: 0, color: "#4FB7B3" },
          { id: 3, category: "Entertainment", amount: 0, color: "#637AB9" },
          { id: 4, category: "Utilities", amount: 0, color: "#31326F" },
          { id: 5, category: "Shopping", amount: 0, color: "#7C3AED" },
          { id: 6, category: "Healthcare", amount: 0, color: "#F59E0B" },
        ],
        goals: [
          { id: 1, name: "Emergency Fund", target: 10000, current: 0 },
          { id: 2, name: "New Phone", target: 1200, current: 0 },
          { id: 3, name: "Vacation", target: 5000, current: 0 },
        ],
      }
    );
  };

  const currentData = getCurrentData();
  const income = currentData.income;
  const expenses = currentData.expenses;
  const goals = currentData.goals;

  const updateBudgetData = (monthKey, newData) => {
    setBudgetData((prev) => ({
      ...prev,
      [monthKey]: newData,
    }));
  };

  useEffect(() => {
    const updatedMonthlyData = Object.keys(budgetData)
      .map((monthKey) => {
        const data = budgetData[monthKey];
        const totalExpenses = data.expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        return {
          month: monthKey,
          income: data.income,
          expenses: totalExpenses,
          savings: data.income - totalExpenses,
        };
      })
      .sort((a, b) => a.month.localeCompare(b.month));

    setMonthlyData(updatedMonthlyData);
  }, [budgetData]);

  const setIncome = (value) => {
    const monthKey = selectedDate.slice(0, 7);
    const currentMonthData = getCurrentData();
    updateBudgetData(monthKey, {
      ...currentMonthData,
      income: value,
    });
  };

  const handleExpenseChange = (id, amount) => {
    const monthKey = selectedDate.slice(0, 7);
    const currentMonthData = getCurrentData();
    const updatedExpenses = currentMonthData.expenses.map((expense) =>
      expense.id === id
        ? { ...expense, amount: parseFloat(amount) || 0 }
        : expense
    );
    updateBudgetData(monthKey, {
      ...currentMonthData,
      expenses: updatedExpenses,
    });
  };

  const handleGoalUpdate = (id, current) => {
    const monthKey = selectedDate.slice(0, 7);
    const currentMonthData = getCurrentData();
    const updatedGoals = currentMonthData.goals.map((goal) =>
      goal.id === id ? { ...goal, current: parseFloat(current) || 0 } : goal
    );
    updateBudgetData(monthKey, {
      ...currentMonthData,
      goals: updatedGoals,
    });
  };

  const addGoal = () => {
    const name = prompt("Enter goal name:");
    const target = prompt("Enter target amount:");
    if (name && target) {
      const monthKey = selectedDate.slice(0, 7);
      const currentMonthData = getCurrentData();
      const newGoal = {
        id: Date.now(),
        name,
        target: parseFloat(target),
        current: 0,
      };
      updateBudgetData(monthKey, {
        ...currentMonthData,
        goals: [...currentMonthData.goals, newGoal],
      });
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const remainingBudget = income - totalExpenses;
  const pieData = expenses.filter((expense) => expense.amount > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Budget Dashboard
          </h1>
          <p className="text-slate-600">
            Track your income, expenses, and financial goals
          </p>

          {/* Date Picker */}
          <div className="mt-6 flex justify-center">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 rounded-lg border-2 border-slate-200 focus:border-teal-500 focus:outline-none transition-colors text-slate-700"
              />
              <p className="text-xs text-slate-500 mt-1">
                Viewing data for{" "}
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Income & Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Monthly Income
              </label>
              <input
                type="number"
                value={income || ""}
                onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none transition-colors"
                placeholder="Enter your income"
              />
            </div>
            <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl p-4">
              <p className="text-sm font-medium text-slate-600">Total Income</p>
              <p className="text-2xl font-bold text-teal-700">
                ₹{income.toLocaleString()}
              </p>
            </div>
            <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-xl p-4">
              <p className="text-sm font-medium text-slate-600">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-red-600">
                ₹{totalExpenses.toLocaleString()}
              </p>
            </div>
            <div
              className={`rounded-xl p-4 ${
                remainingBudget >= 0
                  ? "bg-gradient-to-r from-blue-100 to-indigo-100"
                  : "bg-gradient-to-r from-orange-100 to-red-100"
              }`}
            >
              <p className="text-sm font-medium text-slate-600">Remaining</p>
              <p
                className={`text-2xl font-bold ${
                  remainingBudget >= 0 ? "text-blue-700" : "text-red-600"
                }`}
              >
                ₹{remainingBudget.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Expenses Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Expenses by Category
            </h2>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                >
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: expense.color }}
                    ></div>
                    <span className="font-medium text-slate-700">
                      {expense.category}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={expense.amount || ""}
                    onChange={(e) =>
                      handleExpenseChange(expense.id, e.target.value)
                    }
                    className="w-24 px-3 py-2 rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none text-right"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Expense Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ category, percent }) =>
                    `${category} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Trend */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Monthly Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, ""]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#4FB7B3"
                  strokeWidth={3}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#637AB9"
                  strokeWidth={3}
                  name="Expenses"
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="#A8FBD3"
                  strokeWidth={3}
                  name="Savings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Income vs Expenses Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Income vs Expenses
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, ""]} />
                <Legend />
                <Bar dataKey="income" fill="#4FB7B3" name="Income" />
                <Bar dataKey="expenses" fill="#637AB9" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Financial Goals
            </h2>
            <button
              onClick={addGoal}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Add Goal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <div
                  key={goal.id}
                  className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6"
                >
                  <h3 className="font-bold text-slate-800 mb-2">{goal.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    ₹{goal.current.toLocaleString()} / ₹
                    {goal.target.toLocaleString()}
                  </p>

                  <div className="mb-4">
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {progress.toFixed(1)}% complete
                    </p>
                  </div>

                  <input
                    type="number"
                    value={goal.current || ""}
                    onChange={(e) => handleGoalUpdate(goal.id, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                    placeholder="Current amount"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetingTool;

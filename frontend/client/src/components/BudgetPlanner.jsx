import React, { useState, useEffect } from 'react';
import api from '../api';

export default function BudgetPlanner({ events = [] }) {
  const [limit, setLimit] = useState(2000);
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Catering');
  const [selectedEvent, setSelectedEvent] = useState('');

  // Load from backend
  const loadBudget = async () => {
    try {
      const res = await api.get('/api/budget');
      setExpenses(res.data.expenses);
      setLimit(res.data.budgetLimit);
    } catch (err) {
      console.error('Failed to load budget', err);
    }
  };

  useEffect(() => {
    loadBudget();
  }, []);

  const saveLimit = async (newLimit) => {
    setLimit(newLimit);
    try {
      await api.put('/api/budget/limit', { limit: newLimit });
    } catch (err) {
      console.error('Failed to save budget limit', err);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!name.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    try {
      await api.post('/api/budget', {
        name: name.trim(),
        amount: parsedAmount,
        category,
        event: selectedEvent || null
      });
      setName('');
      setAmount('');
      setSelectedEvent('');
      loadBudget();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add expense');
    }
  };

  const removeExpense = async (id) => {
    if (!confirm('Remove this expense?')) return;
    try {
      await api.delete(`/api/budget/${id}`);
      loadBudget();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove expense');
    }
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const percent = limit > 0 ? (total / limit) * 100 : 0;

  // Determine progress bar color
  let progressColor = 'bg-emerald-500';
  if (percent >= 90) progressColor = 'bg-rose-500';
  else if (percent >= 70) progressColor = 'bg-amber-500';

  const categories = ['Catering', 'Venue', 'Music & DJ', 'Decorations', 'Transport', 'Invites & Favors'];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#e8faf7]">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <span>💰</span> Budget Planner
      </h2>

      {/* Tracker Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#f2fcfb] p-4 rounded-xl border border-[#daf2ef]">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Set Total Budget Limit</div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-bold text-lg">₹</span>
            <input
              type="number"
              value={limit}
              onChange={e => saveLimit(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full bg-white border border-gray-200 px-3 py-1 rounded-lg text-lg font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#61d6cc]"
            />
          </div>
        </div>
        <div className="bg-[#fcfcfc] p-4 rounded-xl border border-gray-100 flex flex-col justify-center">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Spent</div>
          <div className="text-2xl font-black text-gray-800">₹{total.toFixed(2)}</div>
        </div>
        <div className="bg-[#fcfcfc] p-4 rounded-xl border border-gray-100 flex flex-col justify-center">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Remaining Budget</div>
          <div className={`text-2xl font-black ${limit - total < 0 ? 'text-red-500 animate-pulse' : 'text-emerald-600'}`}>
            ₹{(limit - total).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
          <span>Budget Utilized: {percent.toFixed(1)}%</span>
          <span>Max Limit: ₹{limit.toFixed(2)}</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border">
          <div 
            className={`h-full ${progressColor} transition-all duration-300`} 
            style={{ width: `${Math.min(percent, 100)}%` }} 
          />
        </div>
      </div>

      {/* Add Expense Form */}
      <form onSubmit={addExpense} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-xl border mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Expense Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Wedding Cake"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61d6cc] text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cost Amount (₹)</label>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            placeholder="e.g. 350.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61d6cc] text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61d6cc] text-sm bg-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Link to Event</label>
          <select
            value={selectedEvent}
            onChange={e => setSelectedEvent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61d6cc] text-sm bg-white"
          >
            <option value="">No Event Linked</option>
            {events.map(ev => (
              <option key={ev._id} value={ev._id}>{ev.title}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-[#61d6cc] hover:bg-[#4bc7bd] text-white font-semibold py-2 rounded-lg text-sm shadow transition duration-150 cursor-pointer"
          >
            Add Expense
          </button>
        </div>
      </form>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead>
            <tr className="text-left text-gray-400 font-bold">
              <th className="py-2.5">Name</th>
              <th className="py-2.5">Category</th>
              <th className="py-2.5 text-right">Cost</th>
              <th className="py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-700">
            {expenses.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-400 py-8">No expenses logged yet.</td>
              </tr>
            )}
            {expenses.map(exp => (
              <tr key={exp._id} className="hover:bg-gray-50/50">
                <td className="py-3 font-semibold">
                  <div>{exp.name}</div>
                  {exp.event && (
                    <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 bg-indigo-50 text-indigo-600 border border-indigo-100/50 rounded-full">
                      🎟️ {exp.event.title || 'Linked Event'}
                    </span>
                  )}
                </td>
                <td className="py-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 bg-teal-50 text-teal-600 rounded-full border border-teal-100/50">
                    {exp.category}
                  </span>
                </td>
                <td className="py-3 text-right font-black">₹{exp.amount.toFixed(2)}</td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => removeExpense(exp._id)}
                    className="text-rose-500 hover:text-rose-700 cursor-pointer p-1 font-semibold text-xs"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import api from '../api';

export default function VendorList({ events = [] }) {
  const [vendors, setVendors] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('Catering');
  const [contact, setContact] = useState('');
  const [cost, setCost] = useState('');
  const [status, setStatus] = useState('Inquired');
  const [selectedEvent, setSelectedEvent] = useState('');

  // Load from backend
  const loadVendors = async () => {
    try {
      const res = await api.get('/api/vendors');
      setVendors(res.data);
    } catch (err) {
      console.error('Failed to load vendors', err);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const addVendor = async (e) => {
    e.preventDefault();
    const parsedCost = parseFloat(cost);
    if (!name.trim() || isNaN(parsedCost) || parsedCost < 0) return;

    try {
      await api.post('/api/vendors', {
        name: name.trim(),
        type,
        contact: contact.trim() || 'N/A',
        cost: parsedCost,
        status,
        event: selectedEvent || null
      });
      setName('');
      setContact('');
      setCost('');
      setStatus('Inquired');
      setSelectedEvent('');
      loadVendors();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add vendor');
    }
  };

  const removeVendor = async (id) => {
    if (!confirm('Remove this vendor?')) return;
    try {
      await api.delete(`/api/vendors/${id}`);
      loadVendors();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove vendor');
    }
  };

  const cycleStatus = async (id, currentStatus) => {
    const statuses = ['Inquired', 'Booked', 'Deposit Paid', 'Fully Paid'];
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];

    try {
      await api.put(`/api/vendors/${id}`, { status: nextStatus });
      loadVendors();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const vendorTypes = ['Catering', 'Venue', 'Photography', 'Decoration', 'DJ & Live Music', 'Cakes & Desserts'];

  const getStatusStyle = (s) => {
    switch (s) {
      case 'Fully Paid':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Deposit Paid':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Booked':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#fefbf0]">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <span>🏬</span> Vendor Directory
      </h2>

      {/* Add Vendor Form */}
      <form onSubmit={addVendor} className="bg-[#fffdf9] p-4 rounded-xl border border-[#fff6db] grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Company / Vendor Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Delicious Catering"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7b500] text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Service Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7b500] text-sm bg-white"
          >
            {vendorTypes.map(vt => (
              <option key={vt} value={vt}>{vt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contact Info</label>
          <input
            type="text"
            placeholder="Phone or Email"
            value={contact}
            onChange={e => setContact(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7b500] text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cost Quote (₹)</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="Quote price"
            value={cost}
            onChange={e => setCost(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7b500] text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Link to Event</label>
          <select
            value={selectedEvent}
            onChange={e => setSelectedEvent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7b500] text-sm bg-white"
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
            className="w-full bg-[#f7b500] hover:bg-[#db9d00] text-white font-semibold py-2 rounded-lg text-sm shadow transition duration-150 cursor-pointer"
          >
            Add Vendor
          </button>
        </div>
      </form>

      {/* Vendors Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead>
            <tr className="text-left text-gray-400 font-bold">
              <th className="py-2.5">Vendor Name</th>
              <th className="py-2.5">Service</th>
              <th className="py-2.5">Contact</th>
              <th className="py-2.5">Quote Cost</th>
              <th className="py-2.5">Status (Click to cycle)</th>
              <th className="py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-700">
            {vendors.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-400 py-8">No vendors listed yet. Add one above!</td>
              </tr>
            )}
            {vendors.map(v => (
              <tr key={v._id} className="hover:bg-gray-50/50">
                <td className="py-3 font-semibold">
                  <div>{v.name}</div>
                  {v.event && (
                    <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 bg-amber-50 text-amber-700 border border-amber-100/50 rounded-full">
                      🎟️ {v.event.title || 'Linked Event'}
                    </span>
                  )}
                </td>
                <td className="py-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100/50 rounded-full">
                    {v.type}
                  </span>
                </td>
                <td className="py-3 text-gray-500 font-mono text-xs">{v.contact}</td>
                <td className="py-3 font-bold">₹{v.cost.toFixed(2)}</td>
                <td className="py-3">
                  <button
                    onClick={() => cycleStatus(v._id, v.status)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border transition duration-150 cursor-pointer ${getStatusStyle(v.status)}`}
                  >
                    {v.status} 🔄
                  </button>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => removeVendor(v._id)}
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

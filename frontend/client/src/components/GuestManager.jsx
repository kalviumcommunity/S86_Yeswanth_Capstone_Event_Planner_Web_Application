import React, { useState, useEffect } from 'react';
import api from '../api';

export default function GuestManager({ events }) {
  const [guests, setGuests] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');

  // Editing State
  const [editingGuest, setEditingGuest] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editEvent, setEditEvent] = useState('');

  const loadGuests = async () => {
    try {
      const res = await api.get('/guests');
      setGuests(res.data);
    } catch (err) {
      console.error('Failed to load guests', err);
    }
  };

  useEffect(() => {
    loadGuests();
  }, []);

  const addGuest = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    try {
      await api.post('/guests', {
        name: name.trim(),
        email: email.trim(),
        event: selectedEvent || null
      });
      setName('');
      setEmail('');
      setSelectedEvent('');
      loadGuests();
      alert('Guest added successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add guest');
    }
  };

  const startEdit = (g) => {
    setEditingGuest(g);
    setEditName(g.name || '');
    setEditEmail(g.email || '');
    setEditEvent(g.event?._id || g.event || '');
  };

  const cancelEdit = () => {
    setEditingGuest(null);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) return;
    try {
      await api.put(`/guests/${editingGuest._id}`, {
        name: editName.trim(),
        email: editEmail.trim(),
        event: editEvent || null
      });
      setEditingGuest(null);
      loadGuests();
      alert('Guest updated successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update guest');
    }
  };

  const removeGuest = async (id) => {
    if (!confirm('Remove this guest?')) return;
    try {
      await api.delete(`/guests/${id}`);
      loadGuests();
      alert('Guest removed');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove guest');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#fdf0f4]">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <span>🧑‍🤝‍🧑</span> Guest Management
      </h2>

      {/* Add Guest Form */}
      <form onSubmit={addGuest} className="bg-[#fff9fa] p-4 rounded-xl border border-[#ffeef2] grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Guest Name</label>
          <input
            type="text"
            required
            placeholder="John Doe"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d7e] text-sm bg-white"
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
          <input
            type="email"
            required
            placeholder="johndoe@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d7e] text-sm bg-white"
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Assign to Event</label>
          <select
            value={selectedEvent}
            onChange={e => setSelectedEvent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d7e] text-sm bg-white"
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
            className="w-full bg-[#ff4d7e] hover:bg-[#eb3a6a] text-white font-semibold py-2 rounded-lg text-sm shadow transition duration-150 cursor-pointer"
          >
            Add Guest
          </button>
        </div>
      </form>

      {/* Guest List Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-700">Invited Guest List</h3>
        {guests.length === 0 && (
          <div className="text-gray-400 text-sm py-10 text-center border-2 border-dashed border-gray-100 rounded-xl">
            No guests invited yet. Fill out the form above to add a guest!
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guests.map(g => (
            <div key={g._id} className="bg-white p-4 rounded-xl border border-gray-100 hover:border-[#ff4d7e]/20 hover:shadow-sm transition duration-150 flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-800">{g.name}</div>
                <div className="text-xs text-gray-400">{g.email}</div>
                {g.event ? (
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 bg-pink-50 text-pink-600 border border-pink-100/50 rounded-full">
                    🎟️ Event: {g.event.title || 'Linked'}
                  </span>
                ) : (
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 bg-gray-50 text-gray-400 rounded-full">
                    Unlinked Guest
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => startEdit(g)}
                  className="p-2 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition duration-150 cursor-pointer text-xs font-bold"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeGuest(g._id)}
                  className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-lg transition duration-150 cursor-pointer text-xs font-bold"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Guest Modal */}
      {editingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn" onClick={cancelEdit}>
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-[#fdf0f4] transform transition duration-300"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>✏️</span> Edit Guest Details
            </h3>
            <form onSubmit={saveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Guest Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d7e] text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d7e] text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Assign to Event</label>
                <select
                  value={editEvent}
                  onChange={e => setEditEvent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d7e] text-sm bg-white"
                >
                  <option value="">No Event Linked</option>
                  {events.map(ev => (
                    <option key={ev._id} value={ev._id}>{ev.title}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-semibold text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ff4d7e] text-white rounded-lg hover:bg-[#eb3a6a] font-semibold text-sm shadow transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

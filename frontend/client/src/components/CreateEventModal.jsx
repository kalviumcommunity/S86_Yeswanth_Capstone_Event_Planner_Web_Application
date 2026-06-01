import React, { useState } from 'react';
import api from '../api';

export default function CreateEventModal({ isOpen, initialDate, onClose, onEventCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: initialDate || '',
    time: '',
    location: ''
  });
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('date', form.date);
      formData.append('time', form.time);
      formData.append('location', form.location);
      if (file) {
        formData.append('image', file);
      }

      await api.post('/api/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Event created successfully');
      onEventCreated();
      onClose();
      // Reset form
      setForm({ title: '', description: '', date: '', time: '', location: '' });
      setFile(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Create event failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-[#e2f0ed] transform transition duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>🎉</span> Create New Event
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-semibold leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61d6cc]"
              placeholder="e.g. Birthday Celebration"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61d6cc] h-16 resize-none"
              placeholder="Give a brief description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61d6cc]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61d6cc]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61d6cc]"
              placeholder="e.g. Community Center or Zoom link"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Banner Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files[0])}
              className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-semibold text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#61d6cc] text-white rounded-lg hover:bg-[#4bc7bd] font-semibold text-sm shadow transition"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

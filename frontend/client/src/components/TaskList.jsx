import React, { useState, useEffect } from 'react';
import api from '../api';

export default function TaskList({ events = [] }) {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('General');
  const [filter, setFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState('');

  // Load from backend
  const loadTasks = async () => {
    try {
      const res = await api.get('/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to load tasks', err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await api.post('/api/tasks', {
        text: text.trim(),
        category,
        event: selectedEvent || null
      });
      setText('');
      setSelectedEvent('');
      loadTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add task');
    }
  };

  const toggleTask = async (id, currentCompleted) => {
    try {
      await api.put(`/api/tasks/${id}`, { completed: !currentCompleted });
      loadTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      loadTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Pending') return !t.completed;
    if (filter === 'Completed') return t.completed;
    return true;
  });

  const categories = ['General', 'Catering', 'Invitations', 'Decorations', 'Venue'];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#e2f0ed]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span>📋</span> Task Checklist
        </h2>
        <div className="flex bg-gray-50 rounded-lg p-1 border">
          {['All', 'Pending', 'Completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition duration-150 cursor-pointer ${
                filter === f ? 'bg-[#7c5cff] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={addTask} className="flex flex-wrap gap-2 mb-6">
        <input
          type="text"
          required
          placeholder="Add a new task..."
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c5cff] text-sm"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c5cff] text-sm bg-white"
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={selectedEvent}
          onChange={e => setSelectedEvent(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c5cff] text-sm bg-white"
        >
          <option value="">No Event Linked</option>
          {events.map(ev => (
            <option key={ev._id} value={ev._id}>{ev.title}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-[#7c5cff] hover:bg-[#684be6] text-white font-semibold px-5 py-2 rounded-xl text-sm shadow transition duration-150 cursor-pointer"
        >
          Add Task
        </button>
      </form>

      <div className="space-y-3">
        {filteredTasks.length === 0 && (
          <div className="text-gray-400 text-sm py-10 text-center border-2 border-dashed border-gray-100 rounded-xl">
            No tasks found in this section.
          </div>
        )}
        {filteredTasks.map(t => (
          <div
            key={t._id}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition duration-150 ${
              t.completed ? 'bg-gray-50/50 border-gray-100 opacity-60' : 'bg-white border-[#f3f0ff] hover:border-[#7c5cff]/30'
            }`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleTask(t._id, t.completed)}
                className="w-5 h-5 rounded border-gray-300 text-[#7c5cff] focus:ring-[#7c5cff] cursor-pointer"
              />
              <span className={`text-sm font-medium ${t.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {t.text}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                {t.category}
              </span>
              {t.event && (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100/50 rounded-full">
                  🎟️ Event: {t.event.title || 'Linked'}
                </span>
              )}
            </div>
            <button
              onClick={() => deleteTask(t._id)}
              className="text-gray-400 hover:text-red-500 transition duration-150 text-sm cursor-pointer p-1"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

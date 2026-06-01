import React, { useState, useEffect, useContext, useMemo } from 'react'
import api from '../api'
import { AuthContext } from '../AuthContext'
import EventDetailsModal from './EventDetailsModal'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function EventList({ events, onEventChange }) {
  const { user } = useContext(AuthContext)
  const [editingEvent, setEditingEvent] = useState(null)
  const [detailsEvent, setDetailsEvent] = useState(null)
  const [editFile, setEditFile] = useState(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: ''
  })

  // Search & Filter State
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [rsvpFilter, setRsvpFilter] = useState('all')
  const [creatorFilter, setCreatorFilter] = useState('all')

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset pagination to first page when search filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, dateFilter, creatorFilter, rsvpFilter]);

  const formatDate = (dateValue) => {
    if (!dateValue) return '';
    const d = new Date(dateValue);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const startEdit = (event) => {
    setEditingEvent(event)
    setEditFile(null)
    setEditForm({
      title: event.title || '',
      description: event.description || '',
      date: formatDate(event.date),
      time: event.time || '',
      location: event.location || ''
    })
  }

  const cancelEdit = () => {
    setEditingEvent(null)
    setEditFile(null)
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('title', editForm.title)
      formData.append('description', editForm.description)
      formData.append('date', editForm.date)
      formData.append('time', editForm.time)
      formData.append('location', editForm.location)
      if (editFile) {
        formData.append('image', editFile)
      }

      await api.put(`/api/events/${editingEvent._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      await onEventChange()
      cancelEdit()
      alert('Event updated successfully')
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed')
    }
  }

  const rsvp = async (id, status) => {
    try {
      await api.post(`/api/events/${id}/rsvp`, { status })
      await onEventChange()
      alert('RSVP updated')
    } catch (err) {
      alert(err.response?.data?.message || 'RSVP failed')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this event?')) return
    try {
      await api.delete(`/api/events/${id}`)
      await onEventChange()
      alert('Event deleted')
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  // Filter Events Client-side
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      // 1. Text Search
      const matchesSearch = 
        e.title.toLowerCase().includes(search.toLowerCase()) || 
        (e.description && e.description.toLowerCase().includes(search.toLowerCase())) ||
        (e.location && e.location.toLowerCase().includes(search.toLowerCase()));
      if (!matchesSearch) return false;

      // 2. Date Filtering
      if (dateFilter !== 'all') {
        const eventDate = new Date(e.date);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        if (dateFilter === 'today') {
          if (eventDate < startOfToday || eventDate > endOfToday) return false;
        } else if (dateFilter === 'week') {
          const sevenDaysLater = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);
          if (eventDate < startOfToday || eventDate > sevenDaysLater) return false;
        } else if (dateFilter === 'month') {
          const thirtyDaysLater = new Date(startOfToday.getTime() + 30 * 24 * 60 * 60 * 1000);
          if (eventDate < startOfToday || eventDate > thirtyDaysLater) return false;
        }
      }

      // 3. Creator Filter
      if (creatorFilter === 'mine') {
        if (!user) return false;
        const creatorId = e.creator?._id || e.creator;
        if (creatorId !== user.id) return false;
      }

      // 4. RSVP Filter
      if (rsvpFilter !== 'all') {
        if (!user) return false;
        const myRsvp = e.attendees?.find(a => (a.user?._id || a.user) === user.id);
        if (!myRsvp || myRsvp.rsvp !== rsvpFilter) return false;
      }

      return true;
    });
  }, [events, search, dateFilter, creatorFilter, rsvpFilter, user]);

  // Paginated events
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, currentPage]);

  return (
    <div className="mt-2 animate-fadeIn">
      <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <span>📅</span> Upcoming Events
      </h3>

      {/* Search & Filter Bar */}
      <div className="space-y-3 mb-6 bg-gray-50/80 p-4 rounded-xl border border-gray-150 shadow-sm backdrop-blur">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="🔍 Search title, description, or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#61d6cc] bg-white"
            />
          </div>
          <div>
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#61d6cc] bg-white cursor-pointer font-medium"
            >
              <option value="all">📅 Any Date</option>
              <option value="today">Today</option>
              <option value="week">Next 7 Days</option>
              <option value="month">Next 30 Days</option>
            </select>
          </div>
          <div>
            <select
              value={creatorFilter}
              onChange={e => setCreatorFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#61d6cc] bg-white cursor-pointer font-medium"
            >
              <option value="all">🌐 All Hosts</option>
              <option value="mine">👤 Events I Host</option>
            </select>
          </div>
        </div>

        {user && (
          <div className="flex flex-wrap gap-2 items-center text-[11px] pt-1">
            <span className="text-gray-400 font-semibold">RSVP Filter:</span>
            {['all', 'Yes', 'Maybe', 'No'].map(status => (
              <button
                key={status}
                onClick={() => setRsvpFilter(status)}
                className={`px-3 py-1 rounded-full border transition cursor-pointer font-bold ${
                  rsvpFilter === status 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-white text-gray-500 hover:text-gray-700 border-gray-200'
                }`}
              >
                {status === 'all' ? 'All RSVPs' : status}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Event Cards Grid */}
      <div className="space-y-4">
        {filteredEvents.length === 0 && (
          <div className="text-gray-400 text-sm py-10 text-center border-2 border-dashed border-gray-100 rounded-xl">
            No events match the search/filters.
          </div>
        )}
        {paginatedEvents.map(e => {
          const isCreator = user && e.creator && (user.id === e.creator._id || user.id === e.creator);
          return (
            <div key={e._id} className="bg-[#fcfefe] border border-[#eafaf7] hover:border-[#61d6cc] p-4 rounded-xl shadow-sm hover:shadow transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div 
                onClick={() => setDetailsEvent(e)}
                className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition flex-1"
                title="Click to view event details & attendees"
              >
                {e.imageUrl && (
                  <img
                    src={`${baseUrl}${e.imageUrl}`}
                    alt={e.title}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                  />
                )}
                <div className="space-y-1">
                  <div className="font-bold text-gray-800 text-lg leading-tight hover:text-[#61d6cc] transition flex items-center gap-2">
                    {e.title} <span className="text-[10px] font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">🔍 Details</span>
                  </div>
                  {e.description && <div className="text-sm text-gray-500 line-clamp-1">{e.description}</div>}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                    <span>🕒 {new Date(e.date).toLocaleDateString()} {e.time || ''}</span>
                    {e.location && <span>📍 {e.location}</span>}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-lg overflow-hidden border border-gray-100">
                  <button onClick={() => rsvp(e._id, 'Yes')} className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition">Yes</button>
                  <button onClick={() => rsvp(e._id, 'Maybe')} className="px-2.5 py-1 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 transition border-x border-gray-100">Maybe</button>
                  <button onClick={() => rsvp(e._id, 'No')} className="px-2.5 py-1 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 transition">No</button>
                </div>
                {isCreator && (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => startEdit(e)}
                      className="p-1 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition text-xs font-semibold px-2 py-1 cursor-pointer"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => remove(e._id)}
                      className="p-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition text-xs font-semibold px-2 py-1 cursor-pointer"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm animate-fadeIn">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              type="button"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-gray-500 font-semibold">
                Showing <span className="font-bold text-gray-700">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-bold text-gray-700">
                  {Math.min(currentPage * itemsPerPage, filteredEvents.length)}
                </span>{' '}
                of <span className="font-bold text-gray-700">{filteredEvents.length}</span> events
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-lg gap-1" aria-label="Pagination">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-gray-400 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &larr; Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    type="button"
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                      currentPage === page
                        ? 'z-10 bg-teal-500 text-white'
                        : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-gray-400 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next &rarr;
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-[#e2f0ed] transform transition duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>✏️</span> Edit Event
            </h3>
            <form onSubmit={saveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61d6cc]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61d6cc] h-20 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={editForm.date}
                    onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61d6cc]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Time</label>
                  <input
                    type="time"
                    value={editForm.time}
                    onChange={e => setEditForm({ ...editForm, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61d6cc]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61d6cc]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Update Banner Image</label>
                {editingEvent.imageUrl && (
                  <div className="mb-2">
                    <img 
                      src={`${baseUrl}${editingEvent.imageUrl}`} 
                      alt="current banner" 
                      className="w-20 h-12 object-cover rounded border"
                    />
                    <span className="text-[10px] text-gray-400">Current Banner</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setEditFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                />
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
                  className="px-4 py-2 bg-[#61d6cc] text-white rounded-lg hover:bg-[#4bc7bd] font-semibold text-sm shadow transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <EventDetailsModal
        isOpen={!!detailsEvent}
        event={detailsEvent ? events.find(ev => ev._id === detailsEvent._id) : null}
        onClose={() => setDetailsEvent(null)}
        onRsvp={rsvp}
      />
    </div>
  )
}

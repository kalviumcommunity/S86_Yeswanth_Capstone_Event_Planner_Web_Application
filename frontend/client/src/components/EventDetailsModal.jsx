import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../AuthContext';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function EventDetailsModal({ isOpen, event, onClose, onRsvp }) {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Yes');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const loadComments = async () => {
    if (!event || !event._id) return;
    setLoadingComments(true);
    try {
      const res = await api.get(`/api/comments/event/${event._id}`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (isOpen && event?._id) {
      loadComments();
    }
  }, [isOpen, event?._id]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/api/comments/event/${event._id}`, { text: newComment });
      setNewComment('');
      loadComments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.delete(`/api/comments/${commentId}`);
      loadComments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  if (!isOpen || !event) return null;

  // Group attendees
  const attendees = event.attendees || [];
  const going = attendees.filter(a => a.rsvp === 'Yes');
  const maybe = attendees.filter(a => a.rsvp === 'Maybe');
  const no = attendees.filter(a => a.rsvp === 'No');

  const totalResponses = attendees.length;
  const goingPercent = totalResponses > 0 ? (going.length / totalResponses) * 100 : 0;
  const maybePercent = totalResponses > 0 ? (maybe.length / totalResponses) * 100 : 0;
  const noPercent = totalResponses > 0 ? (no.length / totalResponses) * 100 : 0;

  const currentTabAttendees = activeTab === 'Yes' ? going : activeTab === 'Maybe' ? maybe : no;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-[#e2f0ed] overflow-hidden transform transition-all duration-300 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Image */}
        <div className="relative h-48 sm:h-64 bg-[#daf2ef] flex-shrink-0">
          {event.imageUrl ? (
            <img 
              src={`${baseUrl}${event.imageUrl}`} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-teal-600/30 text-8xl select-none font-bold">
              🎉
            </div>
          )}
          {/* Close button overlay */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold cursor-pointer transition"
          >
            &times;
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 bg-teal-50 text-teal-600 rounded-full border border-teal-100/50">
              📅 Event Details
            </span>
            <h3 className="text-2xl font-black text-gray-800 mt-2 leading-tight">{event.title}</h3>
            
            {/* Meta info */}
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">🕒 {new Date(event.date).toLocaleDateString()} {event.time || ''}</span>
              {event.location && <span className="flex items-center gap-1.5">📍 {event.location}</span>}
              {event.creator && (
                <span className="flex items-center gap-1.5">👤 Hosted by: {event.creator.username || 'Organizer'}</span>
              )}
            </div>
          </div>

          {event.description && (
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">About Event</h4>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
          )}

          {/* Quick RSVP Update Inside Modal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-[#e2f0ed] bg-[#fcfefe] rounded-2xl">
            <div>
              <h4 className="text-sm font-bold text-gray-700">Update Your Response</h4>
              <p className="text-xs text-gray-400">Let the organizer know if you are coming.</p>
            </div>
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              <button 
                onClick={() => onRsvp(event._id, 'Yes')} 
                className="px-4 py-2 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition cursor-pointer"
              >
                Going
              </button>
              <button 
                onClick={() => onRsvp(event._id, 'Maybe')} 
                className="px-4 py-2 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 transition border-x border-gray-200 cursor-pointer"
              >
                Maybe
              </button>
              <button 
                onClick={() => onRsvp(event._id, 'No')} 
                className="px-4 py-2 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
              >
                No
              </button>
            </div>
          </div>

          {/* RSVP Statistics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">RSVP Statistics ({totalResponses} responses)</h4>
            <div className="flex h-3 rounded-full overflow-hidden border bg-gray-50">
              <div style={{ width: `${goingPercent}%` }} className="bg-emerald-500 transition-all duration-300" title={`Going: ${going.length}`} />
              <div style={{ width: `${maybePercent}%` }} className="bg-amber-500 transition-all duration-300" title={`Interested: ${maybe.length}`} />
              <div style={{ width: `${noPercent}%` }} className="bg-rose-500 transition-all duration-300" title={`Declined: ${no.length}`} />
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-500 px-1">
              <span className="text-emerald-600">Going: {going.length}</span>
              <span className="text-amber-600">Interested: {maybe.length}</span>
              <span className="text-rose-600">Declined: {no.length}</span>
            </div>
          </div>

          {/* Attendee Lists Tab System */}
          <div className="space-y-4">
            <div className="flex border-b border-gray-100">
              {['Yes', 'Maybe', 'No'].map(tab => {
                const count = tab === 'Yes' ? going.length : tab === 'Maybe' ? maybe.length : no.length;
                const label = tab === 'Yes' ? 'Going' : tab === 'Maybe' ? 'Interested' : 'Declined';
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 pb-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                      activeTab === tab 
                        ? 'border-teal-500 text-teal-700' 
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {currentTabAttendees.length === 0 ? (
                <div className="text-center text-gray-400 text-xs py-6">
                  No users in this list.
                </div>
              ) : (
                currentTabAttendees.map(att => (
                  <div key={att._id} className="flex items-center gap-3 p-2 bg-gray-50/50 rounded-xl border border-gray-100/50">
                    <span className="text-lg">👤</span>
                    <div>
                      <div className="text-sm font-bold text-gray-800">{att.user?.username || 'Attendee'}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{att.user?.email || 'N/A'}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Discussion Board Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">💬</span>
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Discussion Board</h4>
            </div>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handlePostComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Share your thoughts or ask a question..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition cursor-pointer"
                >
                  Post
                </button>
              </form>
            ) : (
              <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-xs font-semibold border border-amber-100">
                Please log in to join the discussion.
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {loadingComments ? (
                <div className="text-center text-gray-400 text-xs py-4">
                  Loading comments...
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center text-gray-400 text-xs py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-150">
                  No comments yet. Start the conversation!
                </div>
              ) : (
                comments.map((comment) => {
                  const isCommentAuthor = user && comment.user && (user.id === comment.user._id || user.id === comment.user);
                  const isEventHost = user && event.creator && (user.id === event.creator._id || user.id === event.creator);
                  
                  return (
                    <div 
                      key={comment._id} 
                      className="p-3 bg-gray-50/70 border border-gray-100 rounded-2xl flex items-start justify-between gap-4 group hover:bg-gray-50 hover:border-teal-100/50 transition duration-150"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-teal-700">
                            {comment.user?.username || 'User'}
                          </span>
                          <span className="text-[9px] text-gray-400 font-medium">
                            {new Date(comment.createdAt).toLocaleString(undefined, {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed font-medium">
                          {comment.text}
                        </p>
                      </div>
                      {(isCommentAuthor || isEventHost) && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition cursor-pointer text-[10px] p-1 rounded hover:bg-rose-50"
                          title="Delete comment"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

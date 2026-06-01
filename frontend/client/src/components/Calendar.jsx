import React, { useContext, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../api';
import { AuthContext } from '../AuthContext';
import CreateEventModal from './CreateEventModal';
import EventDetailsModal from './EventDetailsModal';

export default function Calendar({ events, onEventChange }) {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [detailsEvent, setDetailsEvent] = useState(null);

  const mappedEvents = useMemo(() => {
    return events.map(e => ({
      id: e._id,
      title: e.title,
      start: e.date,
      extendedProps: { description: e.description, location: e.location }
    }));
  }, [events]);

  const handleDateClick = (arg) => {
    if (!user) return alert('Please login to create events');
    if (user.role === 'attendee') return alert('Only organizers can create events');
    setSelectedDate(arg.dateStr);
    setIsModalOpen(true);
  };

  const handleEventClick = (arg) => {
    const matched = events.find(e => e._id === arg.event.id);
    if (matched) {
      setDetailsEvent(matched);
    }
  };

  const rsvp = async (id, status) => {
    try {
      await api.post(`/api/events/${id}/rsvp`, { status });
      await onEventChange();
      alert('RSVP updated');
    } catch (err) {
      alert(err.response?.data?.message || 'RSVP failed');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-[#2CB67D]">Calendar View</h2>
      <div className="bg-white rounded-xl shadow-md p-4 border border-[#e2f0ed]">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
          events={mappedEvents}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height={600}
        />
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        initialDate={selectedDate}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={onEventChange}
      />

      <EventDetailsModal
        isOpen={!!detailsEvent}
        event={detailsEvent ? events.find(ev => ev._id === detailsEvent._id) : null}
        onClose={() => setDetailsEvent(null)}
        onRsvp={rsvp}
      />
    </div>
  );
}

const Event = require('../models/Event');
const fs = require('fs');
const path = require('path');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location } = req.body;
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    const event = new Event({ title, description, date, time, location, imageUrl, creator: req.userId });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Create event error', error: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { page, limit } = req.query;
    if (page && limit) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 5;
      const skip = (pageNum - 1) * limitNum;

      const totalEvents = await Event.countDocuments();
      const events = await Event.find()
        .populate('creator', 'username email')
        .populate('attendees.user', 'username email')
        .skip(skip)
        .limit(limitNum);

      return res.json({
        events,
        totalPages: Math.ceil(totalEvents / limitNum),
        currentPage: pageNum,
        totalEvents
      });
    }

    const events = await Event.find().populate('creator', 'username email').populate('attendees.user', 'username email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Get events error', error: err.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('creator', 'username email').populate('attendees.user', 'username email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Get event error', error: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.creator.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' });
    
    // Update basic fields
    Object.assign(event, req.body);

    // Update image if new one uploaded
    if (req.file) {
      if (event.imageUrl) {
        const oldPath = path.join(__dirname, '..', event.imageUrl);
        fs.unlink(oldPath, err => {
          if (err) console.error('Failed to delete old image file:', err);
        });
      }
      event.imageUrl = `/uploads/${req.file.filename}`;
    }

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Update event error', error: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.creator.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' });
    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete event error', error: err.message });
  }
};

exports.rsvp = async (req, res) => {
  try {
    const { status } = req.body; // 'Yes'|'No'|'Maybe'
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const existing = event.attendees.find(a => a.user?.toString() === req.userId);
    if (existing) {
      existing.rsvp = status;
    } else {
      event.attendees.push({ user: req.userId, rsvp: status });
    }
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'RSVP error', error: err.message });
  }
};

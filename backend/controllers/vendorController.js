const Vendor = require('../models/Vendor');

exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ creator: req.userId }).populate('event', 'title date');
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve vendors', error: err.message });
  }
};

exports.createVendor = async (req, res) => {
  try {
    const { name, type, contact, cost, status, event } = req.body;
    const vendor = new Vendor({
      name,
      type,
      contact,
      cost,
      status,
      event: event || null,
      creator: req.userId
    });
    await vendor.save();
    res.status(201).json(vendor);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create vendor', error: err.message });
  }
};

exports.updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    if (vendor.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, type, contact, cost, status, event } = req.body;
    if (name !== undefined) vendor.name = name;
    if (type !== undefined) vendor.type = type;
    if (contact !== undefined) vendor.contact = contact;
    if (cost !== undefined) vendor.cost = cost;
    if (status !== undefined) vendor.status = status;
    if (event !== undefined) vendor.event = event || null;

    await vendor.save();
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update vendor', error: err.message });
  }
};

exports.deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    if (vendor.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await vendor.deleteOne();
    res.json({ message: 'Vendor deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete vendor', error: err.message });
  }
};

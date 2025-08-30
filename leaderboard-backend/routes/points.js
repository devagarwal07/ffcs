const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const PointRequest = require('../models/PointRequest');
const User = require('../models/User');

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({ role: 'student' })
      .sort({ points: -1 })
      .select('name points role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Submit point request (student)
router.post('/request', auth, async (req, res) => {
  try {
    const { title, description, pointsRequested } = req.body;

    const pointRequest = new PointRequest({
      student: req.user.id,
      title,
      description,
      pointsRequested
    });

    await pointRequest.save();
    res.status(201).json(pointRequest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// Get user's point requests (student)
router.get('/requests', auth, async (req, res) => {
  try {
    const requests = await PointRequest.find({ student: req.user.id })
      .populate('student', 'name')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Admin routes
router.use(auth);
router.use(admin);

// Get all point requests (admin)
router.get('/all-requests', async (req, res) => {
  try {
    const requests = await PointRequest.find()
      .populate('student', 'name')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all requests' });
  }
});

// Update point request status (admin)
router.patch('/request/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const pointRequest = await PointRequest.findById(req.params.id);

    if (!pointRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (status === 'approved') {
      const user = await User.findById(pointRequest.student);
      user.points += pointRequest.pointsRequested;
      await user.save();
    }

    pointRequest.status = status;
    await pointRequest.save();

    res.json(pointRequest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

module.exports = router;

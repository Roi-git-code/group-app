const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/join', async (req, res) => {
    console.log('Request Body:', req.body); // Debugging line
    res.setHeader('Content-Type', 'application/json');
    
    try {
        const { userId, number } = req.body;

        if (!userId || !number) {
            return res.status(400).json({ success: false, message: 'User ID and group number are required' });
        }

        // Check if user exists
        const [user] = await db.execute('SELECT id FROM users WHERE id = ?', [userId]);
        if (user.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if already in a group
        const [existing] = await db.execute('SELECT number FROM user_numbers WHERE user_id = ?', [userId]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: `You're already in group ${existing[0].number}` });
        }

        // Assign to group
        await db.execute('INSERT INTO user_numbers (user_id, number) VALUES (?, ?)', [userId, number]);
        
        return res.json({ success: true, message: `Joined group ${number} successfully` });
    } catch (error) {
        console.error('Group join error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;


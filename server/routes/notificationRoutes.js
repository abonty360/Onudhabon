import express from 'express';
import Notification from '../models/Notification.js';

import { auth } from '../middleware/auth.js'; 

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 }) 
            .populate('sender', 'name picture') 
            .populate('post', 'title'); 

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error while fetching notifications.' });
    }
});


router.get('/unread-count', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const count = await Notification.countDocuments({ user: userId, isRead: false });

        res.status(200).json({ count });
    } catch (error) {
        console.error('Error fetching unread notification count:', error);
        res.status(500).json({ message: 'Server error while fetching unread notification count.' });
    }
});


router.patch('/mark-as-read', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        await Notification.updateMany(
            { user: userId, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ message: 'Notifications marked as read.' });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ message: 'Server error while marking notifications as read.' });
    }
});

router.patch('/:id/read', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, user: userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found or you do not have permission to update it.' });
        }

        res.status(200).json(notification);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Server error while marking notification as read.' });
    }
});

export default router;
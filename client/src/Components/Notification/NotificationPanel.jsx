import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ListGroup, Spinner, Button } from 'react-bootstrap';
import axios from 'axios';
import './NotificationPanel.css';

const NotificationPanel = ({ notifications, isLoading, onNotificationRead, onClearAll }) => {
    const navigate = useNavigate();

    const handleClearAllClick = async () => {
        
        if (window.confirm("Are you sure you want to clear all notifications? This cannot be undone.")) {
            try {
                const token = localStorage.getItem("token");
               
                await axios.delete('http://localhost:5000/api/notifications/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                
                onClearAll();
            } catch (err) {
                console.error("Failed to clear notifications:", err);
                alert("Could not clear notifications. Please try again.");
            }
        }
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.post) {
            console.log("Cannot navigate to a deleted post.");
            return;
        }
        if (!notification.isRead) {
            try {
                const token = localStorage.getItem("token");
                await axios.patch(`http://localhost:5000/api/notifications/${notification._id}/read`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                onNotificationRead(notification._id);
            } catch (err) {
                console.error("Failed to mark notification as read:", err);
            }
        }

        if (notification.type === 'reply' && notification.reply) {
            navigate(`/forum/${notification.post._id}#${notification.reply}`);
        } else {
            navigate(`/forum/${notification.post._id}`);
        }
    };

    const renderNotificationText = (notification) => {
        if (!notification.sender || !notification.post) {
            return (
                <span className="text-muted">
                    This notification is related to a post or user that has been deleted.
                </span>
            );
        }
        const senderName = <strong>{notification.sender.name}</strong>;
        const postTitle = <em>"{notification.post.title}"</em>;

        switch (notification.type) {
            case 'like':
                return <>{senderName} liked your post: {postTitle}</>;
            case 'dislike':
                return <>{senderName} disliked your post: {postTitle}</>;
            case 'reply':
                return <>{senderName} replied to your post: {postTitle}</>;
            default:
                return 'You have a new notification.';
        }
    };

    if (isLoading) {
        return (
            <div className="notification-panel">
                <div className="d-flex justify-content-center p-3">
                    <Spinner animation="border" />
                </div>
            </div>
        );
    }

    return (
        <div className="notification-panel">
            <div className="notification-panel-header">
                <span>Notifications</span>
                {notifications.length > 0 && !isLoading && (
                    <Button
                        variant="link"
                        size="sm"
                        className="clear-all-btn"
                        onClick={handleClearAllClick}
                    >
                        Clear All
                    </Button>
                )}
            </div>
            <ListGroup variant="flush">
                {notifications.length > 0 ? (
                    notifications.map((item) => (
                        <ListGroup.Item
                            key={item._id}
                            action
                            onClick={() => handleNotificationClick(item)}
                            className={!item.isRead ? 'unread-notification' : ''}
                        >
                            {renderNotificationText(item)}
                            <div className="notification-timestamp">
                                {new Date(item.createdAt).toLocaleString()}
                            </div>
                        </ListGroup.Item>
                    ))
                ) : (
                    <ListGroup.Item className="text-center text-muted">
                        You have no notifications.
                    </ListGroup.Item>
                )}
            </ListGroup>
        </div>
    );
};

export default NotificationPanel;
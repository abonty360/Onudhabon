import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },

    
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },


    post: {
        type: Schema.Types.ObjectId,
        ref: 'Forum', 
        required: true,
    },

    reply: {
        type: Schema.Types.ObjectId,
        required: false, 
    },


    type: {
        type: String,
        enum: ['like', 'dislike', 'reply'],
        required: true,
    },

    isRead: {
        type: Boolean,
        default: false,
    },

}, {
    timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
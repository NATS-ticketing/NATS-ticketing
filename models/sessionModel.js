import mongoose from 'mongoose';
const sessionSchema = new mongoose.Schema({
    session_id: Number,
    session_name: String,
    areas: [
        {
            area_id: Number,
            area_name: String,
            price: Number,
            max_seats: Number
        }
    ]
});

export default mongoose.model("Session", sessionSchema);
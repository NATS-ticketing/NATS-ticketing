import mongoose from 'mongoose';
const seatSchema = new mongoose.Schema({
    session_id: Number,
    area_id: Number,
    seat: Number,
    seat_status: Number,
    token: String,
    expire: Date
});

export default mongoose.model("Seat", seatSchema);
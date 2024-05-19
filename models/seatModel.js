import mongoose from 'mongoose';
const seatSchema = new mongoose.Schema({
    status: Number,
    token: String,
    expire: Date
});

export default mongoose.model("Seat", seatSchema);
import Session from '../models/sessionModel.js';
import Seat from '../models/seatModel.js';

export const stateService = {
    getSeatState: async(sessionId) => {
        try {
            let session = await Session.findOne({ session_id: Number(sessionId) }).lean();
            if (!session) return { status: "error", message: "Session not found" };

            const seats = await Seat.find({ session_id: Number(sessionId) }).lean();

            const areas = session.areas.map(area => {
                const areaSeats = seats.filter(seat => seat.area_id === area.area_id);
                const emptySeats = areaSeats.filter(seat => seat.seat_status === 0).length;
                const pendingSeats = areaSeats.filter(seat => seat.seat_status === 1).length;

                return {
                    id: area.area_id,
                    name: area.area_name,
                    empty: emptySeats,
                    pending: pendingSeats,
                    total: area.max_seats,
                    price: area.price
                };
            });

            return {
                status: "success",
                session_id: session.session_id,
                session_name: session.session_name,
                start_time: session.start_time.toISOString(),
                areas
            };
        } catch (err) {
            console.log(err);
            return {
                status: "error",
                message: err.message
            };
        }
    }
};
import Session from '../models/sessionModel.js';
import Seat from '../models/seatModel.js';

export const stateService = {
    getSeatState: async(sessionId) => {
        try {
            let query_time = new Date();
            sessionId = Number(sessionId);

            let session = await Session.findOne({ session_id: sessionId }).lean();
            if (!session) return { status: "error", message: "Session not found" };

            const seatStatusCounts = await Seat.aggregate([
                { $match: { session_id: sessionId } },
                {
                    $group: {
                        _id: {
                            area_id: "$area_id",
                            seat_status: "$seat_status"
                        },
                        count: { $sum: 1 }
                    }
                }
            ]);


            const areas = session.areas.map(area => {
                const areaSeats = seatStatusCounts.filter(status => status._id.area_id === area.area_id);
                const emptySeats = areaSeats.find(status => status._id.seat_status === 0)?.count || 0;
                const pendingSeats = areaSeats.find(status => status._id.seat_status === 1)?.count || 0;
            
                return {
                    id: area.area_id,
                    name: area.area_name,
                    empty: emptySeats,
                    pending: pendingSeats,
                    total: area.max_seats,
                    price: area.price
                };
            });

            query_time = new Date() - query_time;
            console.log(`Query time: ${query_time}ms`);

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
    },
    getSession: async () => {
        try {
            let sessions = await Session.find({}).lean();
            return sessions.map(session => ({
                session_id: session.session_id,
                session_name: session.session_name,
                start_time: session.start_time.toISOString(),
                areas: session.areas
            }));
        } catch (err) {
            console.log(err);
            throw new Error("Failed to fetch sessions");
        }
    }
};
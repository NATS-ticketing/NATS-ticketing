import Seat from '../models/seatModel.js'
import { v4 as uuidv4 } from 'uuid';

const expireTime = 3 * 60 * 1000; // 3 minutes
export const snapUpService = {
    bookSeat: async (session, area, count) => {
        try {
            let seats = await Seat.find({
                "session_id": Number(session),
                "area_id": Number(area),
                "seat_status": 0,
            });

            if (seats.length < count) {
                return false;
            }

            const selectedSeats = seats.slice(0, count);
            const order_id = uuidv4();
            const expire_time = Date.now() + expireTime;
            await Seat.updateMany(
                {
                    "session_id": Number(session),
                    "area_id": Number(area),
                    "seat": { $in: selectedSeats.map(seat => seat.seat) },
                    "seat_status": 0
                },
                {
                    $set: {
                        "seat_status": 1,
                        "token": order_id,
                        "expire": expire_time
                    },
                }
            );

            let orderSeats = await Seat.find({
                "session_id": Number(session),
                "area_id": Number(area),
                "token": order_id,
                "seat_status": 1,
            });

            return orderSeats;

        } catch (err) {
            console.log(err);
            return null;
        }
    }
};

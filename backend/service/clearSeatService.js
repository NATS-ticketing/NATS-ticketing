import Seat from '../models/seatModel.js'

export const clearSeatService = {
    clear: async (session) => {
        try {

            // let seats = await Seat.find({
            //     "session_id": Number(session),
            //     "seat_status": 1
            // });

            // TODO
            // 確認每個座位的expire是否在有效期內 
            // 期效內的移除
            // updateMany -> seat_status: 0 & expire: null & token: null
            // return 各區張數
            // e.g. {1: 10, 2: 20, 3: 30}

            // Reset their status ($lte:<= , $lt:< , $in:in array)
            // let result = await Seat.updateMany(
            //     {
            //         session_id: Number(session),
            //         seat_status: 1,
            //         expire: { $lt: Date.now() }
            //     },
            //     {
            //         $set: { seat_status: 0, expire: null, order: null }
            //     }
            // );
            // console.log(result);

            let expiredSeats = await Seat.find({
                "session_id": Number(session),
                "seat_status": 1,
                "expire": { $lt: Date.now() },
            });

            console.log(expiredSeats);

            // No expired seats found within the session
            // if (expiredSeats.length === 0) {
            //     return {};  
            // }

            // Update expired seats to make them available again
            await Seat.updateMany(
                {
                    "seat": { $in: expiredSeats.map(seat => seat.seat) },
                },
                {
                    $set: { "seat_status": 0, "expire": null, "order": null },
                }
            );

            // Calculate and return available tickets per area
            let seatsAfterClear = await Seat.find({
                session_id: Number(session),
                seat_status: 0
            });

            let areaSeatCounts = {};
            seatsAfterClear.forEach(seat => {
                if (!areaSeatCounts[seat.area_id]) {
                    areaSeatCounts[seat.area_id] = 0;
                }
                areaSeatCounts[seat.area_id]++;
            });

            return areaSeatCounts;

        } catch (err) {
            console.log(err);
            return null;
        }
    },
};

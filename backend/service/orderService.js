import Seat from '../models/seatModel.js'

export const orderService = {
    confirmOrder: async (session, area, order, seats) => {
        try {
            let orderSeats = await Seat.find({
                "session_id": Number(session),
                "area_id": Number(area),
                "seat": { $in: seats },
            });
            
            // TODO
            // 1. 比對每個座位的order 如果不符合就err
            // 2. 確認每個座位的expire是否在有效期內 (expire > Date.now())
            //    可能會有型態轉換問題 因為db存的格式是Date
            //    如果有問題 return false
            // 3. 如果都沒問題 updateMany -> seat_status: 2 & return true

            return false;

        } catch (err) {
            console.log(err);
            return null;
        }
    },

    cancelOrder: async (session, area, order, seats) => {
        try {
            // TODO
            // 1. 比對每個座位的order 如果不符合就err
            // 2. 如果都沒問題 updateMany -> seat_status: 0 & expire: null
            return;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
};

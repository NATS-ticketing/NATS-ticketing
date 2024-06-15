import Seat from '../models/seatModel.js'
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const expireTime = 3 * 60 * 1000; // 3 minutes
// const expireTime = 3 * 60 * 1000 * 1000000; // 3 minutes
export const snapUpService = {
    bookSeat: async (session, area, count) => {
        const transaction = await mongoose.startSession();
        // 使用 transaction 是因為可能有多個座位被更新，其中一個失敗就要全部 rollback
        transaction.startTransaction();
        try {
            
            const order_id = uuidv4();
            const expire_time = Date.now() + expireTime;
            let seats = await Seat.find({
                "session_id": Number(session),
                "area_id": Number(area),
                "seat_status": 0,
            }).limit(count);
            
    
            if (seats.length < count) {
                return false;
            }
    
            seats.map(seat => {
                seat.order = order_id;
                seat.seat_status = 1;
                seat.expire = expire_time;
                return seat;
            })
    
            for (let i = 0; i < seats.length; i++) {
                // 這裏 save() 因為我們有設定 Seat schema 的 optimisticConcurrency = true
                // 因此他 save 時會檢查目前 seat 物件的版本與我們 find 時的版本一不一樣，
                // 如果不一樣就會 throw error
                await seats[i].save();
            }
    
            await transaction.commitTransaction();
            transaction.endSession();
    
            const seatsId = seats.map(seat => seat.seat);
    
            return {
                order_id: order_id,
                session_id: Number(session),
                area_id: Number(area),
                seats: seatsId,
                seat_status: 1
            }
        } catch (error) {
            await transaction.abortTransaction();
            transaction.endSession();
            throw new Error(500, error.message);
        }
    }
};

import Session from '../models/sessionModel.js'
import { formatTime } from '../util/formatTime.js'

export const stateService = {
    getSeatState: async (sessionId) => {
        try {
            let session = await Session.findOne({
                "session_id": Number(sessionId)
            });
            if (session) {
                session = session.toJSON();
                session.start_time = formatTime(session.start_time);
            }

            return session;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    getSession: async () => {
        try {
            let sessions = await Session.find();
            return sessions;
        } catch (err) {
            return null;
        }
    }
};

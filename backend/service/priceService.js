import Session from '../models/sessionModel.js';

/**
 * Store session static data 
 * so that we don't have to fetch it from the database every time
 * 
 * use: sessionAreaMap[sessionId][areaId] = area object
 */
const sessionAreaMap = new Map();


/**
 * A service to get price
 */
export const priceService = {  
  init: async () => {
    try {
      let sessions = await Session.find({}).lean();
      sessions.forEach(session => {
        sessionAreaMap[session.session_id] = new Map();
        session.areas.forEach(area => {
          sessionAreaMap[session.session_id].set(area.area_id.toString(), area);
        });
      });
    } catch (err) {
      console.log(err);
      throw new Error("Failed to init priceSerivce");
    }  
  },

  getPrice: (sessionId, areaId) => {
    return sessionAreaMap[sessionId].get(areaId).price;
  },
}
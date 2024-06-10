import Session from '../models/sessionModel.js';

let areaInfoServiceInstance = null;

/**
 * A service to get area info, such as price, name
 */
const areaInfoService = () => {  

  if(!areaInfoServiceInstance) {
    
    /**
     * Store session static data 
     * so that we don't have to fetch it from the database every time
     * 
     * use: sessionAreaMap[sessionId][areaId] = area object
     */
      const sessionAreaMap = new Map();


      areaInfoServiceInstance = {
        init: async () => {
          try {
            let sessions = await Session.find({}).lean();
            sessions.forEach(session => {
              sessionAreaMap[session.session_id] = new Map();
              session.areas.forEach(area => {
                sessionAreaMap[session.session_id].set(area.area_id.toString(), area);
              });
            });
            console.log("init in areaInfoService");
          } catch (err) {
            console.log(err);
            throw new Error("Failed to init priceSerivce");
          }  
        },
      
        getPrice: (sessionId, areaId) => {
          return sessionAreaMap[sessionId].get(areaId).price;
        },
      
        getAreaName: (sessionId, areaId) => {
          return sessionAreaMap[sessionId].get(areaId).area_name;
        }
      }
  }
  return areaInfoServiceInstance;
}

export const initAreaInfoService = async () => {
  areaInfoServiceInstance = areaInfoService();
  await areaInfoServiceInstance.init();
}

export const getAreaInfoService = () => {
  if(!areaInfoServiceInstance) {
    throw new Error("AreaInfoService not initialized");
  }

  return areaInfoServiceInstance;
}

export const errorMessage = {
    /**
     * Unified error reply
     * @param {NATS's msg} msg 
     */
    formatResponse: (errorMsg) => {
        return JSON.stringify({
            "status": "error",
            "message": errorMsg
        });
    }
};
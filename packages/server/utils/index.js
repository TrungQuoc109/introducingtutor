export class ResponseMessage {
    static instance;

    static getInstance() {
        if (!this.instance) {
            return this.instance;
        }
    }
    throwError(message, code) {
        const error = new Error(message);
        error.code = code;
        throw error;
    }

    getError(response, statusCode, errorMessage) {
        return response.status(statusCode).json({
            error: errorMessage,
        });
    }

    getSuccess(response, statusCode, successMessage, data) {
        return response.status(statusCode).json({
            message: successMessage,
            ...data,
        });
    }
}
export const responseMessageInstance = new ResponseMessage();

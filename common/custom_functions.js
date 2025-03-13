export default function (express) {
    global.HTTP_STATUS_CODES = {
        OK: 200, // FOR SEND DATA, MESSAGE
        CREATED: 201, // FOR CREATE DATA, MESSAGE
        ACCEPTED: 202, // UPDATE, EDIT, DELETE REQUEST ACCEPTED
        NO_CONTENT: 204, // FOR NOTHING TO SEND
        PARTIAL_SUCCESS: 206, // PARTIAL SUCCESS, REQUEST SUCCESS BUT SOME PART MIGHT FAILED
        NO_MODIFIED: 304, // NO DATA CHANGE
        BAD_REQUEST: 400, // BAD REQUEST, NOT VALID DATA
        UNAUTHORIZED: 401, // NOT AUTHORIZED, WRONG CREDENTIALS
        FORBIDDEN: 403, // NOT ALLOWED, NOT ENOUGH PERMISSION
        NOT_FOUND: 404, // DATA NOT FOUND
        METHOD_NOT_ALLOWED: 405, //HTTP METHOD NOT ALLOWED
        NOT_ACCEPTABLE: 406, // REQUEST ISN'T ACCEPTABLE AS SOMETHING IS MISSING 
        CONFLICT: 409, // CONFLICT, DATA ALREADY EXISTS
        UNSUPPORTED_TYPE: 415, // UNSUPPORTED MEDIA TYPE
        LOCKED: 423, // RESOURCE LOCKED 
        ILLEGAL_ACCESS: 451, // RESOURCE RESTRICTED BY ADMIN OR SYSTEM
        SERVER_ERROR: 500, // SERVER ERROR
        BAD_GATEWAY: 502, // NOT ABLE TO CONNECT THIRD PARTY SERVICE OR OTHER SERVICE
        SERVICE_UNAVAILABLE: 503, // SERVICE UNAVAILABLE
    };

    express.response.sendSuccess = function (data = {}, customMessage) {
        this.status(200).send({
            status: 200,
            data: data,
            message: customMessage || undefined,
        });
    };

    express.response.sendDuplicate = function (message) {
        this.status(409).send({
            status: 409,
            message: message,
        });
    };

    express.response.sendIsExists = function (response) {
        const code = response ? 200 : 404; // 200 = Resource exists, 404 = Resource does not exit
        this.status(code).send();
    };

    express.response.sendCreated = function (message, data = {}) {
        this.status(201).json({
            status: 201,
            message: message,
            data: data,
        });
    };

    express.response.sendUpdated = function (message, data = {}) {
        this.status(202).json({
            status: 202,
            data: data,
            message: message,
        });
    };

    express.response.sendDeleted = function (message) {
        this.status(202).json({
            status: 202,
            message: message,
        });
    };

    express.response.sendError = function (message) {
        this.status(500).json({
            status: 500,
            message: message,
        });
    };

    express.response.sendInvalidRequest = function (message) {
        this.status(400).json({
            status: 400,
            message: message,
        });
    };

    express.response.sendMessage = function (title, message) {
        // We've set code 200 to send response message in body
        this.status(200).json({
            status: 204,
            messageOnly: true,
            title: title,
            message: message,
        });
    };

    express.response.sendResourceNotFound = function (message) {
        this.status(404).json({
            status: 404,
            message: message,
        });
    };

    express.response.sendUnAuthorized = function (message) {
        this.status(401).json({
            status: 401,
            message: message,
        });
    };

    express.response.sendForbidden = function (message) {
        this.status(403).json({
            status: 403,
            message: message,
        });
    };

    express.response.sendNotAcceptable = function (data = {}, message) {
        this.status(406).send({
            status: 406,
            data: data,
            message: message || undefined,
        });
    };
}
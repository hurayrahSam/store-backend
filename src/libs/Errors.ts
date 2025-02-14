export enum HttpCode {
    OK = 200,
    CREATED = 201,
    NOT_MODIFIED = 304,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    N0_DATA_FOUND,
};

export enum Message {
    SOMETHING_WENT_WRONG = 'Something went wrong!',
    N0_DATA_FOUND = 'No data found!',
    CREATE_FAILED = 'Create failed!',
    UPDATE_FAILED = 'Update failed!',
    REMOVE_FAILED = 'Remove failed!',
    UPLOAD_FAILED = 'Upload failed!',
    BAD_REQUEST = 'Bad Request',
    USED_MEMBER_NICK_OR_PHONE = 'Already used member nick or phone!',

    NO_MEMBER_NICK = 'No member with that member nick!',
    BLOCKED_USER = 'You have been blocked!',
    WRONG_PASSWORD = 'Wrong password, try again!',
    NOT_AUTHENTICATED = 'You are not authenticated, please login first!',
    PROVIDE_ALLOWED_FORMAT = 'Please provide jpg, jpeg or png images!',
    TOKEN_CREATION_FAILED = "Token creation error!",
    USED_NICK_PHONE = "USED_NICK_PHONE",
};

class Errors extends Error {
    public code: HttpCode;
    public message: Message;

    static standard = {
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: Message.SOMETHING_WENT_WRONG,
    }

    constructor(statusCode: HttpCode, statusMessage: Message) {
        super();
        this.code = statusCode;
        this.message = statusMessage;
    }
}

export default Errors;
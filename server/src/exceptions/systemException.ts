import { CustomError } from "./custom_exception";

export class SystemException extends CustomError {
    constructor(msg: string) {
        super(new Error(msg));
    }
}

export class InvalidInput extends SystemException {
    constructor(msg: string) {
        super(msg);
    }
}

export class IllegalState extends SystemException {
    constructor(msg: string) {
        super(msg);
    }
}

export class IOException extends SystemException {
    constructor(msg: string) {
        super(msg);
    }
}

export class FileNotFound extends SystemException {
    constructor(msg: string) {
        super(msg);
    }
}
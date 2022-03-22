export class SystemException extends Error {
    constructor(msg: string) {
        super(msg);
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
export const getEnumKeyByStringValue = function <T extends { [index: string]: any; }>(myEnum: T, enumValue: string): keyof T | null {
    let keys = Object.keys(myEnum).filter(x => myEnum[x].toString() == enumValue);
    return keys.length > 0 ? keys[0] : null;
};

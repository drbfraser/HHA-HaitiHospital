import { InvalidInput } from 'exceptions/systemException';
import * as _ReportDefs from '../../models/report'

export const getEnumKeyByStringValue = function <T extends { [index: string]: any; }>(myEnum: T, enumValue: string): keyof T | null {
    let keys = Object.keys(myEnum).filter(x => myEnum[x].toString() == enumValue);
    return keys.length > 0 ? keys[0] : null;
};

export const getLengthOfEnum = function<T extends {[index: string]: any;}>(myEnum: T): number {
    let count = Object.keys(myEnum).filter((key) => isNaN(Number(key))).length;
    return count;
}

export const getItemTypeFromValue = (type: string): _ReportDefs.ItemTypeKeys=> {
    const key = getEnumKeyByStringValue(_ReportDefs.ItemType, type);
    if (!key) {
        throw new InvalidInput(`Item of type: ${type} is not supported`);
    }
    return key!;
};
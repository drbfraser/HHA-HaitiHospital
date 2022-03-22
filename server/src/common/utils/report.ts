import { BadRequestError } from 'exceptions/httpException';
import { DepartmentId, DepartmentIdKeys } from '../definitions/departments';
import { ItemType, ItemTypeKeys, ReportDescriptor, ReportItemMeta, ReportItems, ReportMeta } from '../definitions/report';
import { getEnumKeyByStringValue } from './common';


export const ReportMetaConstructor = (id: string, deptId: DepartmentIdKeys, date: Date, user: string) => {
    let meta: ReportMeta = {
        id: id,
        departmentId: deptId,
        submittedDate: date,
        submittedUserId: user
    };
    return meta;
};

export const ReportConstructor = (meta: ReportMeta, items: ReportItems): ReportDescriptor => {
    let report: ReportDescriptor = {meta: meta, items:items};
    return report;
}

export const getItemTypeFromValue = (type: string): ItemTypeKeys => {
    const key = getEnumKeyByStringValue(ItemType, type);
    if (!key) {
        throw new BadRequestError(`Provided item type is not valid ${type}`)
    }
    return key!;
}

export const ItemMetaConstructor = (type: ItemTypeKeys): ReportItemMeta => {
    let meta: ReportItemMeta = {
        type: type
    }
    return meta;
}
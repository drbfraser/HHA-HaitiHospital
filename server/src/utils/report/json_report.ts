import { JsonItemAnswer, JsonItemChildren, JsonReportDescriptor, JsonReportItem, JsonReportMeta } from '../../common/definitions/json_report';

export const hasChildren = (jsonItem: JsonReportItem): boolean => {
    if (jsonItem.items) {
        if (jsonItem.items!.length > 0)
            return true;
    }
    return false;
};

export const getChildren = (jsonItem: JsonReportItem): JsonItemChildren => {
    if (hasChildren(jsonItem)) {
        return jsonItem.items!;
    }
    else {
        return [];
    }
} 

export const getItemType = (jsonItem: JsonReportItem): string => {
    return jsonItem.type;
}

export const isInATable = (jsonItem: JsonReportItem): boolean => {
    return (jsonItem.answer.length > 1);
}

export const getItemAnswerLength = (jsonItem: JsonReportItem): number => {
    const count = jsonItem.answer[0].length;
    return count;
}

export const getAnswerList = (jsonItem: JsonReportItem): JsonItemAnswer => {
    return jsonItem.answer[0];
}

export const getReportItems = (report: JsonReportDescriptor): JsonReportItem[] => {
    return report.items;
}

export const getReportMeta = (report: JsonReportDescriptor): JsonReportMeta => {
    return report.meta;
}
import * as _ReportDefs from '../definitions/report';

export const isSumCorrect = (sum: Number, children: _ReportDefs.ReportNItem[]) => {
    let childrenSum = 0;
    children.forEach((child) => {
        const answerList = getAnswerList(child);
        childrenSum += Number(answerList[0]);
    });
    return sum === childrenSum;
};

export const isItemOfType = (item: _ReportDefs.ReportItem, type: _ReportDefs.ItemType): boolean => {
    const typeKey = item.type;
    if (_ReportDefs.ItemType[typeKey] === type)
        return true;
    return false;
}

const getAnswerList = (item: _ReportDefs.ReportItem): _ReportDefs.ItemAnswer => {
    return item.answer;
};
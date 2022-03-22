import * as _ReportDefs from '../../models/report';

export const isSumCorrect = (sum: Number, children: _ReportDefs.ReportNItem[]) => {
    let childrenSum = 0;
    children.forEach((child) => {
        const answerList = getAnswerList(child);
        childrenSum += Number(answerList[0]);
    });
    return sum === childrenSum;
};

const getAnswerList = (item: _ReportDefs.ReportItem): _ReportDefs.ItemAnswer => {
    return item.answer;
};

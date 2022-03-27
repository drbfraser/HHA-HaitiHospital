import { TemplateItem } from 'utils/definitions/template';
import * as _ReportDefs from '../definitions/report';

export const isSumCorrect = (sum: Number, children: _ReportDefs.ReportNItem[]) => {
    let childrenSum = 0;
    children.forEach((child) => {
        const answerList = getAnswerList(child);
        childrenSum += Number(answerList[0]);
    });
    return sum === childrenSum;
};

export const getTemplate = (item: _ReportDefs.ReportItem): TemplateItem => {
    const emptyItem: TemplateItem = {
        type: item.type,
        description: item.description
    }
    return emptyItem;
}


const getAnswerList = (item: _ReportDefs.ReportItem): _ReportDefs.ItemAnswer => {
    return item.answer;
};
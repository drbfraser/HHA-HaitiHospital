import { ItemType } from '../../common/json_report';
import * as _ReportDefs from '../definitions/report';

export const isSumCorrect = (sum: Number, children: _ReportDefs.ReportNumericItem[]) => {
    let childrenSum = 0;
    children.forEach((child) => {
        const answerList = getAnswerList(child);
        childrenSum += Number(answerList[0]);
    });
    return sum === childrenSum;
};

export const isItemOfType = (item: _ReportDefs.ReportItem, type: ItemType): boolean => {
  const typeKey = item.type;
  if (ItemType[typeKey] === type) return true;
  return false;
};

const getAnswerList = (item: _ReportDefs.ReportItem): _ReportDefs.ItemAnswer => {
  return item.answer;
};

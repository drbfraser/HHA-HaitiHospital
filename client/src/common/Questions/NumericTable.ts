import { serializable } from "common/Serializer/ObjectSerializer";
import { QuestionTable } from "./QuestionTable";
import { NumericQuestion } from "./SimpleQuestionTypes";

@serializable(undefined, [], [], () => undefined)
export class NumericTable<ID> extends QuestionTable<ID, number, NumericQuestion<ID>> {}
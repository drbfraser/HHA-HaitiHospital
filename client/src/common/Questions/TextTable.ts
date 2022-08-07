import { serializable } from "common/Serializer/ObjectSerializer";
import { QuestionTable } from "./QuestionTable";
import { TextQuestion } from "./SimpleQuestionTypes";

@serializable(undefined, [], [], () => undefined)
export class TextTable<ID> extends QuestionTable<ID, string, TextQuestion<ID>> {}
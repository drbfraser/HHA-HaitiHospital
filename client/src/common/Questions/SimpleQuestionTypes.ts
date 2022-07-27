import { serializable } from "common/Serializer/ObjectSerializer";
import { Question } from "./Question";

@serializable(undefined, "")
export class TestQuestion<ID> extends Question<ID, string> {}

@serializable(undefined, "")
export class NumericQuestion<ID> extends Question<ID, number> {}
import { serializable } from "common/Serializer/ObjectSerializer";

@serializable(undefined)
export abstract class QuestionItem<ID> {
    private readonly id: ID;

    constructor(id: ID) {
        this.id = id;
    }

    public readonly getId = (): ID => this.id;
}
import { serializable } from '../Serializer/ObjectSerializer';

export abstract class QuestionItem<ID, ErrorType> {
  private readonly id: ID;

  constructor(id: ID) {
    this.id = id;
  }

  public readonly getId = (): ID => this.id;
}

// Similar to QuestionGroup, but restricted to allowing just a single type of
// questions to be inserted
import { QuestionNode } from '.';
import { QuestionParent } from './QuestionParent';
import { serializable } from '../Serializer';

@serializable('SpecializedGroup', undefined, '')
export class SpecializedGroup<
  ID,
  ErrorType,
  QuestionType extends QuestionNode<ID, ErrorType>,
> extends QuestionParent<ID, ErrorType> {
  private readonly questions: Array<QuestionType>;

  constructor(id: ID, prompt: string, ...questions: Array<QuestionType>) {
    super(id, prompt);
    this.questions = questions;
  }

  public override getClassName(): string {
    return 'SpecializedGroup';
  }

  searchById(id: ID): QuestionNode<ID, ErrorType> | undefined {
    return this.questions.find((question) => question.getId() === id);
  }

  public forEach(handler: (question: QuestionType) => void): void {
    this.questions.forEach(handler);
  }

  public map<T>(mapper: (question: QuestionType) => T): T[] {
    return this.questions.map(mapper);
  }
}

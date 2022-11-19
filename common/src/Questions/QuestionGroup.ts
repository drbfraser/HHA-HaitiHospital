//  A parent node in the question tree that supports any question type as child.
import { serializable } from '../Serializer/ObjectSerializer';
import { QuestionParent } from './QuestionParent';
import { QuestionNode } from './QuestionNode';
import { MapperArgs, QuestionMapper } from './QuestionGroupMapper';

@serializable(undefined)
export class QuestionGroup<ID, ErrorType> extends QuestionParent<ID, ErrorType> {
  private readonly questionItems: Array<QuestionNode<ID, ErrorType>> = [];
  
  constructor(id: ID, prompt: string, ...questions: Array<QuestionNode<ID, ErrorType>>) {
    super(id, prompt);
    questions ? this.addAll(...questions) : undefined;
  }

  public add(questionItem: QuestionNode<ID, ErrorType>): QuestionGroup<ID, ErrorType> {
    this.questionItems.push(questionItem);
    return this;
  };

  public addAll(...questions: Array<QuestionNode<ID, ErrorType>>): QuestionGroup<ID, ErrorType> {
    questions.forEach((question) => this.add(question));
    return this;
  };

  public genericForEach(consumer: (question: QuestionNode<ID, ErrorType>) => void): void {
    QuestionMapper.buildGenericMapper(consumer).mapAll(this.questionItems);
  };

  public forEach(consumers: MapperArgs<ID, ErrorType, void>): void {
    QuestionMapper.buildMapper(consumers).mapAll(this.questionItems);
  };
  
  public map<T>(mappers: MapperArgs<ID, ErrorType, T>): T[] {
    return QuestionMapper.buildMapper(mappers).mapAll(this.questionItems);
  }

  public searchById(id: ID): QuestionNode<ID, ErrorType> | undefined {
    return this.questionItems.filter((questionItem) => questionItem.getId() == id)[0];
  };
}

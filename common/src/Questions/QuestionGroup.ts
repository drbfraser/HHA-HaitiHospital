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
  }

  public addAll(...questions: Array<QuestionNode<ID, ErrorType>>): QuestionGroup<ID, ErrorType> {
    questions.forEach((question) => this.add(question));
    return this;
  }

  /*  Use this function to operate on all questions from QuestionGroup if the subclasses of
      the questions do not need to be distinguished from each other. The arrow function
      passed as argument is meant to have side effects as nothing will be returned from them.
  */
  public genericForEach(consumer: (question: QuestionNode<ID, ErrorType>) => void): void {
    QuestionMapper.buildGenericMapper(consumer).mapAll(this.questionItems);
  }

  /*  Similar to genericForEach, but this time you must pass an arrow function for each question
      subclass so that the correct arrow function can be applied to the right question type.
  */
  public forEach(consumers: MapperArgs<ID, ErrorType, void>): void {
    QuestionMapper.buildMapper(consumers).mapAll(this.questionItems);
  }

  // Mapping in the below comments refer to a function that returns something and ideally,
  // but not necessarily, does not have side effects.

  /*  Use this function if you want something to be returned from each question in the
      QuestionGroup, but will apply the same mapping to each question without distinguishing
      among the question types. Beware of side-effects here.
  */
  public genericMap<T>(mapper: (question: QuestionNode<ID, ErrorType>) => T): T[] {
    return QuestionMapper.buildGenericMapper(mapper).mapAll(this.questionItems);
  }

  /*  Similar to genericMap, but must pass one map arrow function for each question
      subclass (similar to forEach, but mapping instead).
  */
  public map<T>(mappers: MapperArgs<ID, ErrorType, T>): T[] {
    return QuestionMapper.buildMapper(mappers).mapAll(this.questionItems);
  }

  public searchById(id: ID): QuestionNode<ID, ErrorType> | undefined {
    return this.questionItems.filter((questionItem) => questionItem.getId() == id)[0];
  }
}

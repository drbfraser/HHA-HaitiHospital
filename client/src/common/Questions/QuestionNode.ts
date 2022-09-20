/*  Represents a question node in the question tree. This class encapsulates
    all data and capabilities common to all nodes in the question tree.
    
    Its type is meant to be further specialized to determine the kind of node it 
    represents and what other capabilities it should support.
*/
export abstract class QuestionNode<ID, ErrorType> {
  private readonly id: ID;

  constructor(id: ID) {
    this.id = id;
  }

  public readonly getId = (): ID => this.id;
}

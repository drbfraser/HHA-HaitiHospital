/*  Represents a question node in the question tree. This class encapsulates
    all data and capabilities common to all nodes in the question tree.
    
    Its type is meant to be further specialized to determine the kind of node it 
    represents and what other capabilities it should support.
*/
console.log('common/src/Questions/QuestionNode.ts');

// interface Translation {
//   [lang: string]: string;
// }
type Translation = Record<string, string>;

export abstract class QuestionNode<ID, ErrorType> {
  private readonly id: ID;
  private readonly prompt: Translation;

  constructor(id: ID, prompt: Translation) {
    this.id = id;
    this.prompt = prompt;
  }

  public getPrompt(): Translation {
    return this.prompt;
  }

  public getId(): ID {
    return this.id;
  }
}

import { ObjectSerializer } from "../../../src/common/Serializer/ObjectSerializer";
import { expect } from 'sinon';
import { NumericQuestion, TextQuestion } from "../../../src/common/Questions/SimpleQuestionTypes";
import { QuestionItem } from "../../../src/common/Questions/QuestionItem";
import { QuestionGroup } from "../../../src/common/Questions/QuestionGroup";

describe('QuestionGroup', function () {
      it.skip('Should be able to Serialize and Deserialize QuestionGroup with nested Questions', function () {
        //Arrange
        let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
        let numericQuestion: NumericQuestion<number> = new NumericQuestion<number>(
          1,
          'What is age of patient',
        );
        let textQuestion: TextQuestion<number> = new TextQuestion<number>(
          1,
          'Which location s the Patient from?',
        );
        let questionArray: Array<QuestionItem<number>> = new Array<QuestionItem>
        let complexGroupQuestion: QuestionGroup<number> = new QuestionGroup<number>(1, new Array<QuestionItem<number>>(){

        } );
        //Act
        let json: string = objectSerializer.serialize(numericQuestion);
        let newNumericQuestion: NumericQuestion<number> = objectSerializer.deserialize(json);
        //Assert
        expect(newNumericQuestion).to.be.instanceof(NumericQuestion);
      });
});
import { ObjectSerializer, serializable } from '../../../src/common/Serializer/ObjectSerializer';
import { QuestionGroup } from '../../../src/common/Questions/QuestionGroup';
import { NumericQuestion, TextQuestion } from '../../../src/common/Questions/SimpleQuestionTypes';
import { should, expect } from 'chai';
import * as sinon from 'sinon';
import { object } from 'yup';
import { QuestionItem } from '../../../src/common/Questions/QuestionItem';
import '@types/jest';

@serializable()
class Serializable {
  public property1: number;
  public property2: string;

  constructor() {}
}

class NonSerializable {
  public property3: number;
  public property4: string;
}

@serializable()
class UndefinedProperty {
  definedProp: string;
  undefinedProp?: Object;

  constructor() {
    this.definedProp = 'A string';
    this.undefinedProp = undefined;
  }
}

@serializable()
class SemiRealisticObject {
  public serializables: Array<Serializable>;

  public constructor() {
    this.serializables = new Array<Serializable>();
  }

  public readonly addSerializable = (serializableObject: Serializable): void => {
    this.serializables.push(serializableObject);
  };

  public readonly getSerializable = (index: number): Serializable => {
    return this.serializables[index];
  };
}

@serializable()
class ASerializable extends Serializable {
  public subProperty1: boolean;

  constructor() {
    super();
  }
}

@serializable()
class BSerializable extends Serializable {
  public subProperty1: string;

  constructor() {
    super();
  }
}

@serializable()
class SkyrimGuard {
  hasArrowInTheKnee: boolean;

  constructor() {
    this.hasArrowInTheKnee = true;
  }
}

@serializable('Generic Band', false)
class IsBandLegendary {
  band: string;
  isLegendary: boolean;

  constructor(band: string, isLegendary: boolean) {
    this.band = band;
    this.isLegendary = isLegendary;
  }
}

// should();
// describe('Serializer', function () {
//   describe('Serializable decorator', function () {
//     it('Should be able to Serialize and Deserialize Numeric Questions', function () {
//       //Arrange
//       let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
//       let numericQuestion: NumericQuestion<number> = new NumericQuestion<number>(
//         1,
//         'What is Age of Patient?',
//       );

//       //Act
//       let json: string = objectSerializer.serialize(numericQuestion);
//       let newNumericQuestion: NumericQuestion<number> = objectSerializer.deserialize(json);

//       //Assert
//       expect(newNumericQuestion).to.be.instanceof(NumericQuestion);
//     });
//   });
// });

should();
describe('Serializer', function () {
  describe(`Serializable decorator `, function () {
    it('Should be able to serialize and deserialize classes with zero-args constructor', function () {
      // Arrange
      let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
      let skyrimGuard: SkyrimGuard = new SkyrimGuard();

      // Act
      let json: string = objectSerializer.serialize(skyrimGuard);
      let newSkyrimGuard: SkyrimGuard = objectSerializer.deserialize(json);

      // Assert
      expect(newSkyrimGuard).to.be.instanceof(SkyrimGuard);
    });

    it('Should be able to serialize and deserialize classes with multiple args constructors', function () {
      // Arrange
      let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
      let skyrimGuard: IsBandLegendary = new IsBandLegendary('Linkin Park', true);

      // Act
      let json: string = objectSerializer.serialize(skyrimGuard);
      let newSkyrimGuard: IsBandLegendary = objectSerializer.deserialize(json);

      // Assert
      expect(newSkyrimGuard).to.be.instanceof(IsBandLegendary);
    });
  });

  describe('ObjectSerializer', function () {
    describe('Serialization and Deserialization', function () {
      it('Serialized serializable objects should be deserialized', function () {
        // Arrange
        let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
        sinon.spy(objectSerializer, 'registerSerializable');

        // Act
        serializable(Serializable);

        let serializableObject: Serializable = new Serializable();
        serializableObject.property1 = 42;
        serializableObject.property2 = 'The cake is a lie.';

        let json: string = objectSerializer.serialize(serializableObject);
        let a2: Serializable = objectSerializer.deserialize(json);

        // Assert
        expect(
          Object.entries(a2).map(([key, value]) => {
            return serializableObject[key] == value;
          }).length,
        ).to.be.above(0);
      });

      it('Non-serializable serialized objects should lose type information', function () {
        // Arrange
        let nonSerializable: NonSerializable = new NonSerializable();
        nonSerializable.property3 = 7;
        nonSerializable.property4 = '2b || !2b, that is the question.';

        let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();

        // Act
        let json: string = objectSerializer.serialize(nonSerializable);
        let deserialized: NonSerializable = objectSerializer.deserialize(json);

        // Assert
        expect(deserialized).to.not.be.instanceof(NonSerializable);
      });

      it('Should properly deserialize serializable object and all its serializable members', function () {
        // Arrange
        let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();

        let aSerializable: ASerializable = new ASerializable();
        aSerializable.property1 = 5;
        aSerializable.property2 = "WHERE'S THE LAMB SAAAAAUCE?";
        aSerializable.subProperty1 = false;

        let bSerializable: BSerializable = new BSerializable();
        bSerializable.property1 = 6;
        bSerializable.property2 = 'I used to be an adventurer like you,';
        bSerializable.subProperty1 = 'then I took an arrow in the knee';

        let semiRealisticObject: SemiRealisticObject = new SemiRealisticObject();
        semiRealisticObject.addSerializable(aSerializable);
        semiRealisticObject.addSerializable(bSerializable);

        // Act
        let json: string = objectSerializer.serialize(semiRealisticObject);
        let deserializedObject: SemiRealisticObject = objectSerializer.deserialize(json);

        // Assert
        expect(deserializedObject.getSerializable(0)).to.be.instanceof(ASerializable);
        expect(deserializedObject.getSerializable(1)).to.be.instanceof(BSerializable);
      });

      it('Should serialize and deserialize classes with undefined properties', function () {
        // Arrange
        let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();

        // Act
        let objectWithUndefined: UndefinedProperty = new UndefinedProperty();
        let json: string = objectSerializer.serialize(objectWithUndefined);
        let newObject: UndefinedProperty = objectSerializer.deserialize(json);

        // Assert
        expect(newObject).to.be.instanceof(UndefinedProperty);
        expect(newObject).to.deep.equal(objectWithUndefined);
      });
    });
  });

  describe('SimpleQuestions', function () {
    describe('NumericQuestion', function () {
      it('Should be able to Serialize and Deserialize Numeric Questions', function () {
        //Arrange
        let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
        let numericQuestion: NumericQuestion<number> = new NumericQuestion<number>(
          1,
          'What is Age of Patient?',
        );
        //Act
        let json: string = objectSerializer.serialize(numericQuestion);
        let newNumericQuestion: NumericQuestion<number> = objectSerializer.deserialize(json);
        //Assert
        expect(newNumericQuestion).to.be.instanceof(NumericQuestion);
      });
    });

    describe('TextQuestion', function () {
      it('Should be able to Serialize and Deserialize Text Questions', function () {
        //Arrange
        let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
        let textQuestion: TextQuestion<number> = new TextQuestion<number>(
          1,
          'What is Age of Patient?',
        );
        //Act
        let json: string = objectSerializer.serialize(textQuestion);
        let newNumericQuestion: TextQuestion<number> = objectSerializer.deserialize(json);
        //Assert
        expect(newNumericQuestion).to.be.instanceof(TextQuestion);
      });
    });
  });

  describe('ComplexQuestions', function () {
    describe('QuestionGroup', function () {
      it('Should be able to Serialize and Deserialize QuestionGroup with nested Questions', function () {
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
  });
});

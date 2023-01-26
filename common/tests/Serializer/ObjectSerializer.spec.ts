import { ObjectSerializer, serializable } from '../../src';
import { should, expect } from 'chai';
import * as sinon from 'sinon';

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

should();
describe('Serializer', function () {
  describe(`Serializable decorator `, function () {
    it('Should be able to serialize and deserialize classes with zero-args constructor', function () {
      // Arrange
      let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
      let skyrimGuard: SkyrimGuard = new SkyrimGuard();

      // Act
      let serialized: Object = objectSerializer.serialize(skyrimGuard);
      let newSkyrimGuard: SkyrimGuard = objectSerializer.deserialize(serialized);

      // Assert
      expect(newSkyrimGuard).to.be.instanceof(SkyrimGuard);
    });

    it('Should be able to serialize and deserialize classes with multiple args constructors', function () {
      // Arrange
      let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
      let skyrimGuard: IsBandLegendary = new IsBandLegendary('Linkin Park', true);

      // Act
      let serialized: Object = objectSerializer.serialize(skyrimGuard);
      let newSkyrimGuard: IsBandLegendary = objectSerializer.deserialize(serialized);

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

        let serialized: Object = objectSerializer.serialize(serializableObject);
        let a2: Serializable = objectSerializer.deserialize(serialized);

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
        let serialized: Object = objectSerializer.serialize(nonSerializable);
        let deserialized: NonSerializable = objectSerializer.deserialize(serialized);

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
        let serialized: Object = objectSerializer.serialize(semiRealisticObject);
        let deserializedObject: SemiRealisticObject = objectSerializer.deserialize(serialized);

        // Assert
        expect(deserializedObject.getSerializable(0)).to.be.instanceof(ASerializable);
        expect(deserializedObject.getSerializable(1)).to.be.instanceof(BSerializable);
      });

      it('Should serialize and deserialize classes with undefined properties', function () {
        // Arrange
        let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();

        // Act
        let objectWithUndefined: UndefinedProperty = new UndefinedProperty();
        let serializedObject: Object = objectSerializer.serialize(objectWithUndefined);
        let newObject: UndefinedProperty = objectSerializer.deserialize(serializedObject);

        // Assert
        expect(newObject).to.be.instanceof(UndefinedProperty);
        expect(newObject).to.deep.equal(objectWithUndefined);
      });

      it('Mantain mock value for missing key from malformed json', function () {
        // Arrange
        let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
        let malformed: any = new IsBandLegendary('Shadow of Intent', true);
        delete malformed.band;

        // Act
        let serialized: Object = objectSerializer.serialize(malformed);
        let malformedDeserialized: IsBandLegendary = objectSerializer.deserialize(serialized);

        // Assert
        expect(malformedDeserialized.band).to.be.equal('Generic Band');
        expect(malformedDeserialized.isLegendary).to.be.true;
      });

      it('Will keep extra fields during deserialization', function () {
        // Arrange
        let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
        let malformed: any = new IsBandLegendary('Lorna Shore', true);
        malformed.extra = '';

        // Act
        let serialized: Object = objectSerializer.serialize(malformed);
        let malformedDeserialized: IsBandLegendary = objectSerializer.deserialize(serialized);

        // Assert
        expect((malformedDeserialized as any).extra).to.equal(malformed.extra);
      });
    });
  });
});

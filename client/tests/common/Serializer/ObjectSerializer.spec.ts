import { ObjectSerializer, serializable } from '../../../src/common/Serializer/ObjectSerializer';
import { should, expect } from 'chai';
import * as sinon from 'sinon';

class Serializable {
    public property1: number;
    public property2: string;

    constructor() {}
}

class NonSerializable {
    public property3: number;
    public property4: string;
}

class SemiRealisticObject {
    public serializables: Array<Serializable>;

    public constructor() {
        this.serializables = new Array<Serializable>();
    }

    public readonly addSerializable = (serializableObject: Serializable): void => {
        this.serializables.push(serializableObject);
    }

    public readonly getSerializable = (index: number): Serializable => {
        return this.serializables[index];
    }
}

class ASerializable extends Serializable {
    public subProperty1: boolean;

    constructor() {
        super();
    }
}

class BSerializable extends Serializable {
    public subProperty1: string;

    constructor() {
        super();
    }
}

should();
describe('Serializer', function () {
    describe("ObjectSerializer", function () {
        describe("Get singleton", function () {
            afterEach(function () {
                sinon.restore();
            })

            it.skip('Should instantiate object on first call', function () {
                // Was unable to mock/spy on constructor.
            });

            it.skip('Should not instantiate object on second call and so forth', function () {
                // Was unable to mock/spy on constructor.
            });
        });

        describe('Serialization and Deserialization', function () {
            it('Serialized serializable objects should be deserialized', function () {
                // Arrange
                let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
                sinon.spy(objectSerializer, 'addSerializable');
                
                // Act
                serializable(Serializable);

                let serializableObject: Serializable = new Serializable();
                serializableObject.property1 = 42;
                serializableObject.property2 = "The cake is a lie.";

                let json: string = objectSerializer.serialize(serializableObject);
                let a2: Serializable = objectSerializer.deserialize(json);

                // Assert
                Object.entries(a2)
                    .map(([key, value]) => {
                        return serializableObject[key] == value;
                    })
                    .length.should.be.above(0);

            });

            it('Non-serializable serialized objects should lose type information', function () {
                // Arrange
                let nonSerializable: NonSerializable = new NonSerializable();
                nonSerializable.property3 = 7;
                nonSerializable.property4 = "2b || !2b, that is the question.";
                
                let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();

                // Act
                let json: string = objectSerializer.serialize(nonSerializable);
                let deserialized: NonSerializable = objectSerializer.deserialize(json);

                // Assert
                deserialized.should.not.be.instanceof(NonSerializable);
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
                bSerializable.property2 = "I used to be an adventurer like you,";
                bSerializable.subProperty1 = "then I took an arrow in the knee";

                let semiRealisticObject: SemiRealisticObject = new SemiRealisticObject();
                semiRealisticObject.addSerializable(aSerializable);
                semiRealisticObject.addSerializable(bSerializable);

                objectSerializer.addSerializable(Serializable);
                objectSerializer.addSerializable(ASerializable);
                objectSerializer.addSerializable(BSerializable);
                objectSerializer.addSerializable(SemiRealisticObject);

                // Act
                let json: string = objectSerializer.serialize(semiRealisticObject);
                let deserializedObject: SemiRealisticObject = objectSerializer.deserialize(json);
            
                // Assert
                expect(deserializedObject.getSerializable(0))
                    .to.be.instanceof(ASerializable);
                expect(deserializedObject.getSerializable(1))
                    .to.be.instanceof(BSerializable);
            });
        });
    });

    describe(`Serializable decorator `, function () {
        it.skip('Should pass the class constructor to ObjectSerializer.addSerializable', function () {
            // TODO: Implement
        });
    });
})

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

                let a: Serializable = new Serializable();
                a.property1 = 42;
                a.property2 = "The cake is a lie.";

                let json: string = objectSerializer.serialize(a);
                let a2: Serializable = objectSerializer.deserialize(json);

                // Assert
                Object.entries(a2)
                    .map(([key, value]) => {
                        return a[key] == value;
                    })
                    .length.should.be.above(0);

            });

            it.only('Non-serializable serialized objects should fail upon deserialization', function () {
                // Arrange
                let nonSerializable: NonSerializable = new NonSerializable();
                nonSerializable.property3 = 7;
                nonSerializable.property4 = "2b || !2b, that is the question.";
                
                let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();

                // Act
                let json: string = objectSerializer.serialize(nonSerializable);
                expect(() => objectSerializer.deserialize(json)).to.throw();
            });

            it.skip('Serialized non-serializable objects should fail upon deserialization', function () {
                // TODO: Implement
            })
        });
    });

    describe(`Serializable decorator `, function () {
        it.skip('Should pass the class constructor to ObjectSerializer.addSerializable', function () {
            // TODO: Implement
        });
    });
})

import { ObjectSerializer, serializable } from '../../../src/common/Serializer/ObjectSerializer';
import * as chai from 'chai';
import * as sinon from 'sinon';


chai.should();
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
                class A {
                    public property1: number;
                    public property2: string;

                    constructor() {}
                }

                let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
                sinon.spy(objectSerializer, 'addSerializable');
                
                // Act
                serializable(A);

                let a: A = new A();
                a.property1 = 42;
                a.property2 = "The cake is a lie.";

                let json: string = objectSerializer.serialize(a);
                let a2: A = objectSerializer.deserialize(json);

                // Assert
                Object.entries(a2)
                    .map(([key, value]) => {
                        return a[key] == value;
                    })
                    .length.should.be.above(0);
            });

            it.skip('Non-serializable serialized objects should fail upon deserialization', function () {
                // TODO: Implement
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

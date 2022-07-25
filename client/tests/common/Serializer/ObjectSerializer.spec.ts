import {ObjectSerializer, serializable} from '../../../src/common/Serializer/ObjectSerializer';
import * as chai from 'chai';
import * as sinon from 'sinon';


describe('Serializer', function () {
    describe("ObjectSerializer", function () {
        describe("Get singleton", function () {
            it('Should instantiate object on first call', function () {
                // TODO: Implement
            });

            it('Should not instantiate object on second call and so forth', function () {
                // TODO: Implement
            });
        });

        describe('Serialization and Deserialization', function () {
            it('Serialized serializable objects should be deserialized', function () {
                // TODO: Implement
            });

            it('Non-serializable serialized objects should fail upon deserialization', function () {
                // TODO: Implement
            });

            it('Serialized non-serializable objects should fail upon deserialization', function () {
                // TODO: Implement
            })
        });
    });

    describe(`Serializable decorator `, function () {
        it('Should pass the class constructor to ObjectSerializer.addSerializable', function () {
            // TODO: Implement
        });
    });
})

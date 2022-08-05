import { expect } from 'chai';
import { object } from 'yup';
import { ObjectSerializer } from '../src/common/Serializer/ObjectSerializer';

interface TestSetAndGetHOFArgs<Property, Obj> {
  testName: string;
  setter: (prop: Property) => Obj;
  getter: (obj: Obj) => Property | undefined;
  mapping: (prop: Property) => Property;
  prop: Property;
}

export const testSetAndGetHOF = <Property, Obj>(
  args: TestSetAndGetHOFArgs<Property, Obj>,
): void => {
  it(args.testName, function () {
    // Arrange/Act
    let object: Obj = args.setter(args.prop);

    // Assert
    expect(args.getter(object)).to.be.equal(args.mapping(args.prop));
  });
};

interface SerializableTestArgs<Obj> {
  testName: string;
  getObj: () => Obj;
  expectations: Array<(deserialized: Obj) => void>;
}

export const serializableTest = <Obj>(args: SerializableTestArgs<Obj>): void => {
  it(args.testName, function () {
    // Arrange
    let obj: Obj = args.getObj();
    let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();

    // Act
    let json: string = objectSerializer.serialize(obj);
    let newObj: Obj = objectSerializer.deserialize(json);

    // Arrange
    args.expectations.forEach((expectation) => expectation(newObj));
  });
};

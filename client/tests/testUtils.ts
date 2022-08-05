import { expect } from 'chai';

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

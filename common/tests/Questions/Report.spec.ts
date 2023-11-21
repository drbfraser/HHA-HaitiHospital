import {
  buildRehabReport,
  buildNicuPaedsReport,
  buildMaternityReport,
  oneQuestionReport,
} from '../../src/Reports';
import { QuestionGroup } from '../../src/Questions';
import { ObjectSerializer } from '../../src/Serializer';
import { verifySerialized } from '../../tests/Utils';
import { expect } from 'chai';

describe('Mock Reports', function () {
  describe('One question mock report', function () {
    it('Should create one question mock report', function () {
      oneQuestionReport();
    });

    it('Should be able to serialize one question mock report', function () {
      const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
      const report: QuestionGroup<string, string> = oneQuestionReport();
      let serializedObject: Object = objectSerializer.serialize(report);
      let deserialized: QuestionGroup<string, string> =
        objectSerializer.deserialize(serializedObject);

      expect(verifySerialized(report, deserialized)).to.be.true;
    });
  });

  describe('Rehab mock report', function () {
    it('Should create a mock rehab report', function () {
      buildRehabReport();
    });

    it('Should be able to serialize rehab mock report', function () {
      const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
      const report: QuestionGroup<string, string> = buildRehabReport();
      const serializedObject: Object = objectSerializer.serialize(report);
      const deserialized: QuestionGroup<string, string> =
        objectSerializer.deserialize(serializedObject);

      expect(verifySerialized(report, deserialized)).to.be.true;
    });
  });

  describe('NICUPaeds mock report', function () {
    it('Should create a mock NICUPaeds report', function () {
      buildNicuPaedsReport();
    });

    it('Should be able to serialize NICUPaeds report', function () {
      const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
      const report: QuestionGroup<string, string> = buildNicuPaedsReport();
      const serializedObject: Object = objectSerializer.serialize(report);
      const deserialized: QuestionGroup<string, string> =
        objectSerializer.deserialize(serializedObject);

      expect(verifySerialized(report, deserialized)).to.be.true;
    });
  });

  describe('Maternity mock report', function () {
    console.warn('WARNING: Maternity mock report test is pending due to an issue');
    xit('Should create a mock Maternity report', function () {
      buildMaternityReport();
    });

    xit('Should be able to serialize maternity report', function () {
      const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
      const report: QuestionGroup<string, string> = buildMaternityReport();
      const serializedObject: Object = objectSerializer.serialize(report);
      console.log('Serialized Data:', JSON.stringify(serializedObject));
      const deserialized: QuestionGroup<string, string> =
        objectSerializer.deserialize(serializedObject);

      expect(verifySerialized(report, deserialized)).to.be.true;
    });
  });

  xit('verifySerialized should not return true for two different mock reports', function () {
    const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
    const NICUReport: QuestionGroup<string, string> = buildNicuPaedsReport();
    const maternityReport: QuestionGroup<string, string> = buildMaternityReport();
    const nicuSerialized: Object = objectSerializer.serialize(NICUReport);
    const maternitySerialized: Object = objectSerializer.serialize(maternityReport);
    const deserializedNICUReport = objectSerializer.deserialize(nicuSerialized);
    const deserializedMaternityReport = objectSerializer.deserialize(maternitySerialized);

    expect(verifySerialized(deserializedNICUReport, deserializedMaternityReport)).to.be.false;
  });
});

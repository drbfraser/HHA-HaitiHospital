import { buildRehabMockReport, buildNicuPaedsMockReport, buildMaternityMockReport, oneQuestionMockReport } from '../../src/MockReports';
import { QuestionGroup } from '../../src/Questions';
import { ObjectSerializer } from '../../src/Serializer';
import { verifySerialized } from '../../tests/Utils'
import { expect } from 'chai';

describe('Mock Reports', function () {
  describe('One question mock report', function () {
    it('Should create one question mock report', function() {
      oneQuestionMockReport();
    });
    
    it('Should be able to serialize one question mock report', function() {
      const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
      const report: QuestionGroup<string, string> = oneQuestionMockReport();
      let json: string = objectSerializer.serialize(report);
      let deserialized: QuestionGroup<string, string> = objectSerializer.deserialize(json);
      
      expect(verifySerialized(report, deserialized)).to.be.true;
    });
  });

  describe('Rehab mock report', function() {
    it('Should create a mock rehab report', function () {
      buildRehabMockReport();
    });
    
    it('Should be able to serialize rehab mock report', function () {
      const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
      const report: QuestionGroup<string, string> = buildRehabMockReport();
      const json: string = objectSerializer.serialize(report);
      const deserialized: QuestionGroup<string, string> = objectSerializer.deserialize(json);
      
      expect(verifySerialized(report, deserialized)).to.be.true;
    });
  });

  describe('NICUPaeds mock report', function() {
    it('Should create a mock NICUPaeds report', function () {
      buildNicuPaedsMockReport();
    });
    
    it('Should be able to serialize NICUPaeds report', function() {
      const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
      const report: QuestionGroup<string, string> = buildNicuPaedsMockReport();
      const json: string = objectSerializer.serialize(report);
      const deserialized: QuestionGroup<string, string> = objectSerializer.deserialize(json);
      
      expect(verifySerialized(report, deserialized)).to.be.true;
    });
  });

  describe('Maternity mock report', function () {
    it('Should create a mock Maternity report', function () {
      buildMaternityMockReport();
    });
    
    it('Should be able to serialize maternity report', function() {
      const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
      const report: QuestionGroup<string, string> = buildMaternityMockReport();
      const json: string = objectSerializer.serialize(report);
      const deserialized: QuestionGroup<string, string> = objectSerializer.deserialize(json);
      
      expect(verifySerialized(report, deserialized)).to.be.true;
    });
  });
  
  it('verifySerialized should not return true for two different mock reports', function() {
    const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
    const NICUReport: QuestionGroup<string, string> = buildNicuPaedsMockReport();
    const maternityReport: QuestionGroup<string, string> = buildMaternityMockReport();
    const nicuJson: string = objectSerializer.serialize(NICUReport);
    const maternityJson: string = objectSerializer.serialize(maternityReport);
    const deserializedNICUReport = objectSerializer.deserialize(nicuJson);
    const deserializedMaternityReport = objectSerializer.deserialize(maternityJson);
    
    expect(verifySerialized(deserializedNICUReport, deserializedMaternityReport))
    .to.be.false;
    
  });
});

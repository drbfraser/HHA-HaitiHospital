import { buildRehabMockReport, buildNicuPaedsMockReport, buildMaternityMockReport, oneQuestionMockReport } from '../../src/MockReports';
import { QuestionGroup } from '../../src/Questions';
import { ObjectSerializer } from '../../src/Serializer';
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
      
      expect(deserialized).to.deep.equal(report);
    });
  });

  describe('Rehab mock report', function() {
    it('Should create a mock rehab report', function () {
      buildRehabMockReport();
    });
  });

  describe('NICUPaeds mock report', function() {
    it('Should create a mock NICUPaeds report', function () {
      buildNicuPaedsMockReport();
    });
  });

  describe('Maternity mock report', function () {
    it('Should create a mock Maternity report', function () {
      buildMaternityMockReport();
    });
  });
});

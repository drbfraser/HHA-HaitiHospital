import { buildRehabMockReport, buildNicuPaedsMockReport, buildMaternityMockReport, oneQuestionMockReport } from '../../src/MockReports';

describe.only('Mock Reports', function () {
  
  describe('One question mock report', function () {
    it('Should create one question mock report', function() {
      oneQuestionMockReport();
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

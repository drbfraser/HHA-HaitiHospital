import { buildRehabMockReport, buildNicuPaedsMockReport, buildMaternityMockReport, oneQuestionMockReport } from '../../src/MockReports';

describe('Report', function () {
  it('Should create one question mock report', function() {
    oneQuestionMockReport();
  });
  
  describe('Mock report', function () {
    it('Should create a mock rehab report', function () {
      buildRehabMockReport();
    });

    it('Should create a mock NICUPaeds report', function () {
      buildNicuPaedsMockReport();
    });

    it('Should create a mock Maternity report', function () {
      buildMaternityMockReport();
    });
  });
});

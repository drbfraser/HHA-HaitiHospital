import { JsonReportDescriptor } from 'common/json_report';
import { InvalidInput } from 'exceptions/systemException';
import { ReportDescriptor } from 'utils/definitions/report';
import { jsonStringToReport, reportToJsonReport } from 'utils/parsers/parsers';
const chai = require('chai');

describe('Test parsing from a report to a json report', () => {
  it('should parse sucessfully for a report with numeric items', async (done) => {
    try {
      const demoJsonReport: JsonReportDescriptor = {
        meta: {
          id: '1234',
          department: { id: '2', name: 'NICU/Paeds' },
          submittedDate: 'March 3, 2022',
          submittedUserId: '123'
        },

        items: [
          {
            type: 'numeric',
            description: 'item 1',
            answer: [['12']]
          },
          {
            type: 'numeric',
            description: 'item 2',
            answer: [['25']]
          }
        ]
      };
      const stringJson = JSON.stringify(demoJsonReport);
      const report: ReportDescriptor = await jsonStringToReport(stringJson);

      const jsonReport: JsonReportDescriptor = await reportToJsonReport(report);
      chai.expect(stringJson).to.eql(JSON.stringify(jsonReport));
      done();
    } catch (e) {
      done(e);
    }
  });

  it('should parse sucessfully for a report with a sum, and a numeric items', async (done) => {
    try {
      const demoJsonReport: JsonReportDescriptor = {
        meta: {
          id: '1234',
          department: { id: '2', name: 'NICU/Paeds' },
          submittedDate: 'March 3, 2022',
          submittedUserId: '123'
        },

        items: [
          {
            type: 'sum',
            description: 'item 1',
            answer: [['12']],
            items: [
              { type: 'numeric', description: 'num item 1.1', answer: [['9']] },
              { type: 'numeric', description: 'num item 1.2', answer: [['3']] }
            ]
          },
          {
            type: 'numeric',
            description: 'item 2',
            answer: [['25']]
          }
        ]
      };
      const stringJson = JSON.stringify(demoJsonReport);
      const report: ReportDescriptor = await jsonStringToReport(stringJson);

      const jsonReport: JsonReportDescriptor = await reportToJsonReport(report);
      chai.expect(stringJson).to.eql(JSON.stringify(jsonReport));
      done();
    } catch (e) {
      done(e);
    }
  });

  it('should parse sucessfully for a report with a sum having a sum', async (done) => {
    try {
      const demoJsonReport: JsonReportDescriptor = {
        meta: {
          id: '1234',
          department: { id: '2', name: 'NICU/Paeds' },
          submittedDate: 'March 3, 2022',
          submittedUserId: '123'
        },

        items: [
          {
            type: 'sum',
            description: 'item 1',
            answer: [['12']],
            items: [
              {
                type: 'sum',
                description: 'sum item 1.1',
                answer: [['9']],
                items: [
                  {
                    type: 'numeric',
                    description: 'numeric item 1.1.1',
                    answer: [['1']]
                  },
                  {
                    type: 'numeric',
                    description: 'numeric item 1.1.1',
                    answer: [['8']]
                  }
                ]
              },
              { type: 'numeric', description: 'num item 1.2', answer: [['3']] }
            ]
          }
        ]
      };
      const stringJson = JSON.stringify(demoJsonReport);
      const report: ReportDescriptor = await jsonStringToReport(stringJson);

      const jsonReport: JsonReportDescriptor = await reportToJsonReport(report);
      chai.expect(stringJson).to.eql(JSON.stringify(jsonReport));
      done();
    } catch (e) {
      done(e);
    }
  });
});

describe('Test parsing json string to a report', () => {
  it('should parse sucessfully for numeric items', async (done) => {
    try {
      const jsonReport: JsonReportDescriptor = {
        meta: {
          id: '1234',
          department: { id: '2', name: 'NICU/Paeds' },
          submittedDate: 'March 3, 2022',
          submittedUserId: '123'
        },

        items: [
          {
            type: 'numeric',
            description: 'item 1',
            answer: [['12']]
          },
          {
            type: 'numeric',
            description: 'item 2',
            answer: [['25']]
          }
        ]
      };
      const stringJson = JSON.stringify(jsonReport);
      const report: ReportDescriptor = await jsonStringToReport(stringJson);
      chai.expect(report).to.not.be.empty;

      done();
    } catch (e) {
      done(e);
    }
  });

  it('should parse sucessfully for a sum, a numeric item', async (done) => {
    try {
      const jsonReport: JsonReportDescriptor = {
        meta: {
          id: '1234',
          department: { id: '2', name: 'NICU/Paeds' },
          submittedDate: 'March 3, 2022',
          submittedUserId: '123'
        },

        items: [
          {
            type: 'sum',
            description: 'sum item 1',
            answer: [['12']],
            items: [
              {
                type: 'numeric',
                description: 'child 1.1',
                answer: [['10']]
              },
              {
                type: 'numeric',
                description: 'child 1.2',
                answer: [['2']]
              }
            ]
          },
          {
            type: 'numeric',
            description: 'item 2',
            answer: [['25']]
          }
        ]
      };
      const stringJson = JSON.stringify(jsonReport);
      const report: ReportDescriptor = await jsonStringToReport(stringJson);
      chai.expect(report).to.not.be.empty;

      done();
    } catch (e) {
      done(e);
    }
  });

  it('should parse sucessfully for a sum that has one sum and one numeric child', async (done) => {
    try {
      const jsonReport: JsonReportDescriptor = {
        meta: {
          id: '1234',
          department: { id: '2', name: 'NICU/Paeds' },
          submittedDate: 'March 3, 2022',
          submittedUserId: '123'
        },

        items: [
          {
            type: 'sum',
            description: 'sum item 1',
            answer: [['12']],
            items: [
              {
                type: 'sum',
                description: 'sum child 1.1',
                answer: [['10']],
                items: [
                  {
                    type: 'numeric',
                    description: 'num child 1.1.1',
                    answer: [['3']]
                  },
                  {
                    type: 'numeric',
                    description: 'num child 1.1.2',
                    answer: [['5']]
                  },
                  {
                    type: 'numeric',
                    description: 'num child 1.1.3',
                    answer: [['2']]
                  }
                ]
              },
              {
                type: 'numeric',
                description: 'numeric child 1.2',
                answer: [['2']]
              }
            ]
          },
          {
            type: 'numeric',
            description: 'item 2',
            answer: [['25']]
          }
        ]
      };
      const stringJson = JSON.stringify(jsonReport);
      const report: ReportDescriptor = await jsonStringToReport(stringJson);
      chai.expect(report).to.not.be.empty;

      done();
    } catch (e) {
      done(e);
    }
  });

  it('should fail for invalid department id', (done) => {
    try {
      const jsonReport: JsonReportDescriptor = {
        meta: {
          id: '1234',
          department: { id: '123', name: 'NICU/Paeds' },
          submittedDate: 'March 3, 2022',
          submittedUserId: '123'
        },

        items: [
          {
            type: 'numeric',
            description: 'item 1',
            answer: [['12']]
          },
          {
            type: 'numeric',
            description: 'item 2',
            answer: [['25']]
          }
        ]
      };
      const stringJson = JSON.stringify(jsonReport);
      chai.expect(async () => await jsonStringToReport(stringJson)).to.throw('not valid');

      done();
    } catch (e) {
      done(e);
    }
  });

  it('should fail as a sum does not add up', (done) => {
    try {
      const jsonReport: JsonReportDescriptor = {
        meta: {
          id: '1234',
          department: { id: '2', name: 'NICU/Paeds' },
          submittedDate: 'March 3, 2022',
          submittedUserId: '123'
        },

        items: [
          {
            type: 'sum',
            description: 'sum item 1',
            answer: [['12']],
            items: [
              {
                type: 'numeric',
                description: 'child 1.1',
                answer: [['3']]
              },
              {
                type: 'numeric',
                description: 'child 1.2',
                answer: [['2']]
              }
            ]
          },
          {
            type: 'numeric',
            description: 'item 2',
            answer: [['25']]
          }
        ]
      };
      const stringJson = JSON.stringify(jsonReport);
      chai.expect(async () => await jsonStringToReport(stringJson)).to.throw('does not add up');
      done();
    } catch (e) {
      done(e);
    }
  });

  it('should fail as a sum has invalid numeric children', (done) => {
    try {
      const jsonReport: JsonReportDescriptor = {
        meta: {
          id: '1234',
          department: { id: '2', name: 'NICU/Paeds' },
          submittedDate: 'March 3, 2022',
          submittedUserId: '123'
        },

        items: [
          {
            type: 'sum',
            description: 'sum item 1',
            answer: [['12']],
            items: [
              {
                type: 'numeric',
                description: 'child 1.1',
                answer: [['abc']]
              },
              {
                type: 'numeric',
                description: 'child 1.2',
                answer: [['2']]
              }
            ]
          },
          {
            type: 'numeric',
            description: 'item 2',
            answer: [['25']]
          }
        ]
      };
      const stringJson = JSON.stringify(jsonReport);
      chai.expect(async () => await jsonStringToReport(stringJson)).to.throw('Item must have a numeric answer');
      done();
    } catch (e) {
      done(e);
    }
  });

  it('should throw a BadRequestError due to malform', (done) => {
    try {
      // a stringified json report meta
      const stringJson = '{"id":"123","departmentId":"1","submittedDate":"123","submittedUserId":"123"}';
      chai.expect(async () => await jsonStringToReport(stringJson)).to.throw('malformed');

      done();
    } catch (e) {
      done(e);
    }
  });
});

var assert = require('chai').assert

describe('Test Equal questions', () => {
  const correctSchema: JsonReportDescriptor = {
    meta: {
      id: '0',
      department: { id: '2', name: 'NICU/Paeds' }
    },
    items: [
      {
        type: 'equal',
        description: 'equal item',
        answer: [['10']],
        items: [
          {
            type: 'numeric',
            description: 'child 1',
            answer: [['10']]
          },
          {
            type: 'sum',
            description: 'child 2',
            answer: [['10']],
            items: [
              {
                type: 'numeric',
                description: 'child',
                answer: [['5']]
              },
              {
                type: 'numeric',
                description: 'child',
                answer: [['2']]
              },
              {
                type: 'numeric',
                description: 'child',
                answer: [['3']]
              }
            ]
          }
        ]
      }
    ]
  };

  const invalidChildrenAnswers: JsonReportDescriptor = {
    meta: {
      id: '0',
      department: { id: '2', name: 'NICU/Paeds' }
    },
    items: [
      {
        type: 'equal',
        description: 'equal item',
        answer: [['10']],
        items: [
          {
            type: 'numeric',
            description: 'child 1',
            answer: [['7']]
          },
          {
            type: 'sum',
            description: 'child 2',
            answer: [['7']],
            items: [
              {
                type: 'numeric',
                description: 'child',
                answer: [['5']]
              },
              {
                type: 'numeric',
                description: 'child',
                answer: [['2']]
              },
              {
                type: 'numeric',
                description: 'child',
                answer: [['3']]
              }
            ]
          }
        ]
      }
    ]
  };

  it('should parse json equal item', (done) => {
    try {
      const report = jsonStringToReport(JSON.stringify(correctSchema))
      chai.expect(report).to.not.be.empty;
      done()
    } catch (e) {
      done(e);
    }
  });

  it('should error parsing invalid children json equal item', (done) => {
    try {
      const report = jsonStringToReport(JSON.stringify(invalidChildrenAnswers))
      done("Expected exception thrown")
    } catch (e) {
      assert(e instanceof InvalidInput)
      done()
    }
  });
});


import { JsonReportDescriptor} from 'common/definitions/json_report';
import { ReportDescriptor } from 'models/report';
import { jsonStringToReport } from 'utils/json_report_parser/parsers';
const chai = require('chai');

describe("Test parsing json string to a report", () => {
  it('should parse sucessfully for numeric items', (done) => {
    try {
    
      const jsonReport: JsonReportDescriptor = {  
        meta: {
          id: '1234',
          departmentId: '1',
          submittedDate: 'March 3 2022',
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
      const report: ReportDescriptor = jsonStringToReport(stringJson);
      chai.expect(report).to.not.be.empty;

      done();
    } catch (e) {
      done(e);
    }
  });

  it('should parse sucessfully for a sum, a numeric item', (done) => {
    try {
      const jsonReport: JsonReportDescriptor = {  
        meta: {
          id: '1234',
          departmentId: '1',
          submittedDate: 'March 3 2022',
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
                    answer: [["10"]]
                }, {
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
      const report: ReportDescriptor = jsonStringToReport(stringJson);
      chai.expect(report).to.not.be.empty;

      done();
    } catch (e) {
      done(e);
    }
  });

  it('should parse sucessfully for a sum that has one sum and one numeric child', (done) => {
    try {
      const jsonReport: JsonReportDescriptor = {  
        meta: {
          id: '1234',
          departmentId: '1',
          submittedDate: 'March 3 2022',
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
                    answer: [["10"]],
                    items: [
                        {
                            type: 'numeric',
                            description: 'num child 1.1.1',
                            answer: [["3"]]
                        },
                        {
                            type: 'numeric',
                            description: 'num child 1.1.2',
                            answer: [["5"]]
                        },
                        {
                            type: 'numeric',
                            description: 'num child 1.1.3',
                            answer: [["2"]]
                        }
                    ]
                }, {
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
      const report: ReportDescriptor = jsonStringToReport(stringJson);
      chai.expect(report).to.not.be.empty;

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
          departmentId: '1',
          submittedDate: 'March 3 2022',
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
                    answer: [["3"]]
                }, {
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
      chai.expect(() => jsonStringToReport(stringJson)).to.throw("does not add up");
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
          departmentId: '1',
          submittedDate: 'March 3 2022',
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
                    answer: [["abc"]]
                }, {
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
      chai.expect(() => jsonStringToReport(stringJson)).to.throw("Item must have a numeric answer");
      done();
    } catch (e) {
      done(e);
    }
  });

    it('should throw a BadRequestError due to malform', (done) => {
        try {
            // a stringified json report meta
            const stringJson = '{"id":"123","departmentId":"1","submittedDate":"123","submittedUserId":"123"}';
            chai.expect(() => jsonStringToReport(stringJson)).to.throw("malformed");

      done();
    } catch (e) {
      done(e);
    }
  });
});

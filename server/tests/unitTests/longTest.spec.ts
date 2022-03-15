
import { JsonReportDescriptor, JSON_REPORT_DESCRIPTOR_NAME} from 'common/definitions/json_report';
import { jsonStringToJsonReport } from 'utils/parsers';
const chai = require('chai');


describe("Test parsing json string to a jsonReportDescriptor", () => {
    it('should parse sucessfully', (done) => {
        try {
            const stringJson = `{"meta":{"id":"1234","departmentId":"1234","submittedDate":"1234","submittedUserId":"123"},"items":[{"meta":{"type":"something"},"description":"item 1","answer":[["answer 1 - item 1","answer 2 - item 1"]]},{"meta":{"type":"table"},"description":"a table","answer":[["answer 1 - col 1","answer 2 - col 1"],["answer 1 - col 2"]]}]}`;
            const name = JSON_REPORT_DESCRIPTOR_NAME;

            const actual = jsonStringToJsonReport(stringJson);
            const expected: JsonReportDescriptor = {
                meta: {
                    id: "1234",
                    departmentId: "1234",
                    submittedDate: "1234",
                    submittedUserId: "123"
                },

                items: [
                    {
                        meta: {
                            type: "something"
                        },
                        description: "item 1",
                        answer: [['answer 1 - item 1', 'answer 2 - item 1']]
                    },
                    {
                        meta: {
                            type: "table"
                        },
                        description: "a table",
                        answer: [['answer 1 - col 1', 'answer 2 - col 1'], ['answer 1 - col 2']]
                    }

                ]
            }

            chai.expect(JSON.stringify(actual) == JSON.stringify(expected)).to.be.true;

            done();
        } catch (e) {
            done(e);
        }
    });

    it('should return empty object due to malformat', (done) => {
        try {
            // a stringified json report meta
            const stringJson = '{"id":"123","departmentId":"1","submittedDate":"123","submittedUserId":"123"}';
            chai.expect(jsonStringToJsonReport(stringJson)).to.be.an('object').that.is.empty;

            done();
        }
        catch (e) {
            done(e);
        }
    });
});
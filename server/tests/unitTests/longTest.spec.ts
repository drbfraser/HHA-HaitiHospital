
import { jsonToJsonReport } from 'common/utils/parsers';
const expect = require('chai').expect;


describe("Get Json Schema Generator", () => {
    it('should sucessfully generate a json schema generator', (done) => {
        try {
            jsonToJsonReport("");
            done();
        } 
        catch (e) {
            done(e);
        }
    
    })
});
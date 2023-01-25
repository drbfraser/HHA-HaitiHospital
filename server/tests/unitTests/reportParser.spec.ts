import { JsonReportDescriptor } from '@hha/common';
import { InvalidInput } from '../../src/exceptions/systemException';
import { ReportDescriptor } from '../../src/utils/definitions/report';
import { jsonStringToReport, reportToJsonReport } from '../../src/utils/parsers/parsers';
import * as ItemParsers from '../../src/utils/parsers/item';
const chai = require('chai');

var assert = require('chai').assert;

describe('Test Equal questions', () => {
  const correctSchema: JsonReportDescriptor = {
    meta: {
      id: '0',
      department: { id: '2', name: 'NICU/Paeds' },
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
            answer: [['10']],
          },
          {
            type: 'sum',
            description: 'child 2',
            answer: [['10']],
            items: [
              {
                type: 'numeric',
                description: 'child',
                answer: [['5']],
              },
              {
                type: 'numeric',
                description: 'child',
                answer: [['2']],
              },
              {
                type: 'numeric',
                description: 'child',
                answer: [['3']],
              },
            ],
          },
          {
            type: 'group',
            description: 'child 3',
            answer: [[]],
            items: [
              {
                type: 'numeric',
                description: 'child',
                answer: [['5']],
              },
              {
                type: 'numeric',
                description: 'child',
                answer: [['2']],
              },
              {
                type: 'numeric',
                description: 'child',
                answer: [['3']],
              },
            ],
          },
        ],
      },
    ],
  };

  const invalidChildrenAnswers: JsonReportDescriptor = {
    meta: {
      id: '0',
      department: { id: '2', name: 'NICU/Paeds' },
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
            answer: [['7']],
          },
          {
            type: 'sum',
            description: 'child 2',
            answer: [['7']],
            items: [
              {
                type: 'numeric',
                description: 'child',
                answer: [['5']],
              },
              {
                type: 'numeric',
                description: 'child',
                answer: [['2']],
              },
            ],
          },
          {
            type: 'group',
            description: 'child 3',
            answer: [[]],
            items: [
              {
                type: 'numeric',
                description: 'child',
                answer: [['100']],
              },
              {
                type: 'numeric',
                description: 'child',
                answer: [['100']],
              },
              {
                type: 'numeric',
                description: 'child',
                answer: [['100']],
              },
            ],
          },
        ],
      },
    ],
  };

  it('should parse json equal item', (done) => {
    try {
      const parser = ItemParsers.getParserJsonToItem(correctSchema.items[0].type);
      const item = parser(correctSchema.items[0]);
      chai.expect(item).to.not.be.empty;
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });

  it('should error parsing invalid children json equal item', (done) => {
    try {
      const parser = ItemParsers.getParserJsonToItem(invalidChildrenAnswers.items[0].type);
      const item = parser(invalidChildrenAnswers.items[0]);
      done('Expected exception thrown');
    } catch (e) {
      console.log(e.message);
      assert(e instanceof InvalidInput);
      done();
    }
  });
});

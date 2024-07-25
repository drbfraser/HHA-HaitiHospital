import { validateReports } from 'models/template';

import { expect } from 'chai';
import sinon from 'sinon';

// Mocking the reports object and the report-building functions
const reports = {
  nicupaeds: {
    questionItems: [{ id: '1', prompt: { en: 'Prompt 1', fr: 'Prompt 1 en Francais' } }],
    prompt: { en: 'NICU/Paeds Report', fr: 'Rapport de NICU/Paeds' },
  },
  maternity: {
    questionItems: [{ id: '1', prompt: { en: 'Prompt 1', fr: 'Prompt 1 en Francais' } }],
    prompt: { en: 'Maternity Report', fr: 'Rapport de maternité' },
  },
  rehab: {
    questionItems: [{ id: '1', prompt: { en: 'Prompt 1', fr: 'Prompt 1 en Francais' } }],
    prompt: { en: 'Rehab Report', fr: 'Rapport de Rehab' },
  },
  communityHealth: {
    questionItems: [{ id: '1', prompt: { en: 'Prompt 1', fr: 'Prompt 1 en Francais' } }],
    prompt: { en: 'Community Health Report', fr: 'Rapport sur la santé communautaire' },
  },
};

let dummyValue = { en: 'Prompt 1', fr: 'Prompt 1 en Francais' };

const buildNicuPaedsReport = sinon.stub().returns({
  getQuestionItems: () => [{ getId: () => '1', getPrompt: () => dummyValue }],
});

const buildMaternityReport = sinon.stub().returns({
  getQuestionItems: () => [{ getId: () => '1', getPrompt: () => dummyValue }],
});

const buildRehabReport = sinon.stub().returns({
  getQuestionItems: () => [{ getId: () => '1', getPrompt: () => dummyValue }],
});

const buildCommunityHealthReport = sinon.stub().returns({
  getQuestionItems: () => [{ getId: () => '1', getPrompt: () => dummyValue }],
});

describe('validateReports', () => {
  let consoleSpy = sinon.spy(console, 'log');
  consoleSpy.restore();

  beforeEach(() => {
    consoleSpy = sinon.spy(console, 'log');
  });

  afterEach(() => {
    consoleSpy.restore();
  });

  it('should not log any warnings when data matches', () => {
    validateReports(reports, [
      () => buildNicuPaedsReport(),
      () => buildMaternityReport(),
      () => buildRehabReport(),
      () => buildCommunityHealthReport(),
    ]);

    expect(consoleSpy.called).to.be.false;
  });

  it('should log warnings when data does not match', () => {
    // Modify one of the templates to create a mismatch
    let dummyValue2 = { en: 'Prompt 1', fr: 'Prompt 1 en Espanol >:]' };
    const buildNicuPaedsReport = sinon.stub().returns({
      getQuestionItems: () => [{ getId: () => '1', getPrompt: () => dummyValue2 }],
    });

    validateReports(reports, [
      () => buildNicuPaedsReport(),
      () => buildMaternityReport(),
      () => buildRehabReport(),
      () => buildCommunityHealthReport(),
    ]);

    expect(consoleSpy.called).to.be.true;
  });
});

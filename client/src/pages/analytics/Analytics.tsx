import { DropDown, DropDownMenus } from 'components/dropdown/DropdownMenu';
import Layout from 'components/layout';
import { ChangeEvent, FormEventHandler, useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Button, Col, Container, Form, InputGroup, Modal, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ListGroupItem } from 'react-bootstrap';
import { getAllDepartments } from 'api/department';
import { useHistory } from 'react-router-dom';
import { AnalyticsQuery, DepartmentJson, QuestionPrompt } from '@hha/common';
import { getAllQuestionPrompts, getAnaytics } from 'api/analytics';
import { refornatQuestionPrompt } from 'utils/string';
import moment from 'moment';
import { AnalyticsQuestionModal } from 'components/popup_modal/AnalyticQuestions';
import { TimeOptionModal } from 'components/popup_modal/TimeOptionModal';
import { findDepartmentIdByName, getAllDepartmentNames } from 'utils/analytics';
import { Spinner } from 'components/spinner/Spinner';

export type TimeOptions = {
  from: string;
  to: string;
  timeStep: string;
};

const defaultFromDate = () => {
  const now = new Date();

  now.setFullYear(now.getFullYear() - 1);

  return now.toISOString().split('T')[0];
};

const defaultToDate = () => {
  const now = new Date();

  now.setFullYear(now.getFullYear() + 1);

  return now.toISOString().split('T')[0];
};

const Analytics = () => {
  const { t } = useTranslation();

  const history = useHistory<History>();

  const [departments, setDepartments] = useState<DepartmentJson[]>([]);
  const [isDepartmentsLoading, setDepartmentLoading] = useState(true);

  const [questionPrompts, setQuestionPrompts] = useState<QuestionPrompt[]>([]);

  const [selectedQuestion, setSelectedQuestion] = useState('1');
  const [selectedDepartmentName, setSelectedDepartmentName] = useState('Rehab');
  const [timeOptions, setTimeOptions] = useState<TimeOptions>({
    from: defaultFromDate(),
    to: defaultToDate(),
    timeStep: 'month',
  });
  const [selectedAggregateBy, setSelectedAggregateBy] = useState('month');

  const [showModalQuestions, setShowModalQuestions] = useState(false);
  const [showModalTimeOptions, setShowModalTimeOptions] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      const departments = await getAllDepartments(history);

      setDepartments(departments);
      setDepartmentLoading(false);
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchQuestionPrompts = async () => {
      if (isDepartmentsLoading) {
        return;
      }

      const selectedDepartmentId = findDepartmentIdByName(departments, selectedDepartmentName)!;

      const questionPrompts = await getAllQuestionPrompts(history, selectedDepartmentId);

      console.log('prompts:', questionPrompts);

      setQuestionPrompts(questionPrompts!);
    };

    fetchQuestionPrompts();
  }, [isDepartmentsLoading, selectedDepartmentName]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (isDepartmentsLoading) {
        return;
      }

      const selectedDepartmentId = findDepartmentIdByName(departments, selectedDepartmentName)!;

      const startDate = moment(timeOptions.from, 'YYYY-MM-DD').toISOString();
      const endDate = moment(timeOptions.to, 'YYYY-MM-DD').toISOString();

      const analyticsQuery: AnalyticsQuery = {
        departmentIds: selectedDepartmentId,
        questionId: selectedQuestion,
        startDate: startDate,
        endDate: endDate,
        aggregateBy: selectedAggregateBy.toLowerCase(),
        timeStep: timeOptions.timeStep.toLowerCase(),
      };

      const analytics = await getAnaytics(history, analyticsQuery);
      console.log(analytics);
    };
    fetchAnalytics();
  }, [selectedDepartmentName, selectedQuestion, timeOptions, selectedAggregateBy]);

  const handleCloseQuestionsModal = () => setShowModalQuestions(false);
  const handleShowQuestionsModal = () => setShowModalQuestions(true);

  const handleCloseTimeOptionsModal = () => setShowModalTimeOptions(false);
  const handleShowTimeOptionsModal = () => setShowModalTimeOptions(true);

  const onDepartmentSelected = (department: string) => {
    setSelectedDepartmentName(department);
  };

  const onFromDateChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setTimeOptions({ ...timeOptions, from: event.target.value });
  };

  const onToDateChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setTimeOptions({ ...timeOptions, to: event.target.value });
  };

  const onTimeStepChanged = (timeStep: string) => {
    setTimeOptions({ ...timeOptions, timeStep });
  };

  const onAggregateBySelected = (aggregateBy: string) => {
    setSelectedAggregateBy(aggregateBy);
  };

  return (
    <Layout title={t('Analytics')}>
      {isDepartmentsLoading ? (
        <Spinner text="Loading..." size="30px" />
      ) : (
        <div className="w-100 d-flex flex-col mr-auto">
          <div className="w-100 d-flex flex-row justify-content-between">
            <div className="d-flex flex-row gap-3">
              <DropDown
                menus={getAllDepartmentNames(departments!)}
                title={'Department'}
                selectedMenu={selectedDepartmentName}
                setDropDownMenu={onDepartmentSelected}
              />
              <Button variant="outline-dark" onClick={handleShowQuestionsModal}>
                Questions
              </Button>

              <AnalyticsQuestionModal
                showModal={showModalQuestions}
                questionPrompts={questionPrompts}
                handleCloseModal={handleCloseQuestionsModal}
                setQuestionSelected={setSelectedQuestion}
              />
            </div>

            <div className="d-flex flex-row gap-3">
              <Button variant="outline-dark" onClick={handleShowTimeOptionsModal}>
                Time
              </Button>
              <TimeOptionModal
                showModal={showModalTimeOptions}
                timeOptions={timeOptions}
                handleCloseModal={handleCloseTimeOptionsModal}
                onFromDateChanged={onFromDateChanged}
                onToDateChanged={onToDateChanged}
                onTimeStepChanged={onTimeStepChanged}
              />

              <DropDown
                menus={DropDownMenus.aggregateBy}
                title="Aggregate By"
                selectedMenu={selectedAggregateBy}
                setDropDownMenu={onAggregateBySelected}
              />
              <DropDown
                menus={DropDownMenus.charts}
                title="Charts"
                selectedMenu=""
                setDropDownMenu={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Analytics;

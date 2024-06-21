import { DropDown, DropDownMenus } from 'components/dropdown/DropdownMenu';
import Layout from 'components/layout';
import { ChangeEvent, FormEventHandler, useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Button, Col, Container, Form, InputGroup, Modal, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ListGroupItem } from 'react-bootstrap';
import { getAllDepartments } from 'api/department';
import { useHistory } from 'react-router-dom';
import { AnalyticsQuery, AnalyticsResponse, DepartmentJson, QuestionPrompt } from '@hha/common';
import { getAllQuestionPrompts, getAnalyticsData } from 'api/analytics';
import { refornatQuestionPrompt } from 'utils/string';
import moment from 'moment';
import { AnalyticsQuestionModal } from 'components/popup_modal/AnalyticQuestions';
import { TimeOptionModal } from 'components/popup_modal/TimeOptionModal';
import {
  findDepartmentIdsByNames,
  getAllDepartmentNames,
  getQuestionFromId,
  sumUpAnalyticsData,
} from 'utils/analytics';
import { Spinner } from 'components/spinner/Spinner';
import LineChart from 'components/charts/Line';
import PieChart from 'components/charts/Pie';
import ChartSelector from 'components/charts/ChartSelector';
import { DropDownMultiSelect } from 'components/dropdown/DropDownMultiSelect';

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
  const [isLoading, setIsLoading] = useState(true);

  const [questionPrompts, setQuestionPrompts] = useState<QuestionPrompt[]>([]);

  const [selectedQuestionId, setSelectedQuestionId] = useState('1');
  const [selectedDepartmentNames, setSelectedDepartmentNames] = useState(['Rehab']);
  const [timeOptions, setTimeOptions] = useState<TimeOptions>({
    from: defaultFromDate(),
    to: defaultToDate(),
    timeStep: 'month',
  });
  const [selectedAggregateBy, setSelectedAggregateBy] = useState('month');

  const [selectedChart, setSelectedChart] = useState('Bar');

  const [showModalQuestions, setShowModalQuestions] = useState(false);
  const [showModalTimeOptions, setShowModalTimeOptions] = useState(false);

  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const departments = await getAllDepartments(history);

      setDepartments(departments);
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchQuestionPrompts = async () => {
      if (departments.length == 0) {
        return;
      }

      const selectedDepartmentIds = findDepartmentIdsByNames(departments, selectedDepartmentNames)!;

      const questionPrompts = await getAllQuestionPrompts(history, selectedDepartmentIds.join(','));

      setQuestionPrompts(questionPrompts!);
    };

    fetchQuestionPrompts();
  }, [departments, selectedDepartmentNames]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (departments.length == 0) {
        return;
      }

      const selectedDepartmentIds = findDepartmentIdsByNames(departments, selectedDepartmentNames)!;

      const startDate = moment(timeOptions.from, 'YYYY-MM-DD').toISOString();
      const endDate = moment(timeOptions.to, 'YYYY-MM-DD').toISOString();

      const analyticsQuery: AnalyticsQuery = {
        departmentIds: selectedDepartmentIds.join(','),
        questionId: selectedQuestionId,
        startDate: startDate,
        endDate: endDate,
        aggregateBy: selectedAggregateBy.toLowerCase() as 'month',
        timeStep: timeOptions.timeStep.toLowerCase() as 'year',
      };

      const analyticsData = await getAnalyticsData(history, analyticsQuery);

      setAnalyticsData(analyticsData!);
      setIsLoading(false);
    };
    fetchAnalytics();
  }, [selectedDepartmentNames, selectedQuestionId, timeOptions, selectedAggregateBy, departments]);

  const handleCloseQuestionsModal = () => setShowModalQuestions(false);
  const handleShowQuestionsModal = () => setShowModalQuestions(true);

  const handleCloseTimeOptionsModal = () => setShowModalTimeOptions(false);
  const handleShowTimeOptionsModal = () => setShowModalTimeOptions(true);

  const onDepartmentSelected = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDepartmentNames([...selectedDepartmentNames, event.target.id]);
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

  const onChartSelected = (chart: string) => {
    setSelectedChart(chart);
  };

  return (
    <Layout title={t('Analytics')}>
      {isLoading ? (
        <Spinner text="Loading..." size="30px" />
      ) : (
        <div className="w-100 d-flex flex-column mr-auto">
          <div className="w-100 d-flex flex-row justify-content-between">
            <div className="d-flex flex-row gap-3">
              {/* <DropDown
                menus={getAllDepartmentNames(departments!)}
                title={'Department'}
                selectedMenu={selectedDepartmentName}
                setDropDownMenu={onDepartmentSelected}
              /> */}

              <DropDownMultiSelect
                title="Department"
                dropDowns={getAllDepartmentNames(departments)}
                selectedDropDowns={selectedDepartmentNames}
                setSelectedDropDowns={onDepartmentSelected}
              />
              <Button variant="outline-dark" onClick={handleShowQuestionsModal}>
                Questions
              </Button>

              <AnalyticsQuestionModal
                showModal={showModalQuestions}
                questionPrompts={questionPrompts}
                handleCloseModal={handleCloseQuestionsModal}
                setQuestionSelected={setSelectedQuestionId}
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
                selectedMenu={selectedChart}
                setDropDownMenu={onChartSelected}
              />
            </div>
          </div>
          <Col className="mt-5">
            <h4>{`Total ${getQuestionFromId(questionPrompts, selectedQuestionId)}: ${sumUpAnalyticsData(analyticsData)}`}</h4>
            <ChartSelector
              type={selectedChart}
              analyticsData={analyticsData}
              questionPrompt={getQuestionFromId(questionPrompts, selectedQuestionId)}
            />
          </Col>
        </div>
      )}
    </Layout>
  );
};

export default Analytics;

import { DropDown, DropDownMenus } from 'components/dropdown/DropdownMenu';
import Layout from 'components/layout';
import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { getAllDepartments } from 'api/department';
import { useHistory } from 'react-router-dom';
import {
  AnalyticsQuery,
  AnalyticsResponse,
  DepartmentJson,
  MonthOrYearOption,
  QuestionPrompt,
} from '@hha/common';
import { getAllQuestionPrompts, getAnalyticsData } from 'api/analytics';
import moment from 'moment';
import { AnalyticsQuestionModal } from 'components/popup_modal/AnalyticQuestions';
import { TimeOptionModal } from 'components/popup_modal/TimeOptionModal';
import {
  displayTotal,
  filterDepartmentsByReport,
  findDepartmentIdByName,
  getAllDepartmentsByName,
  getQuestionFromId,
} from 'utils/analytics';
import { Spinner } from 'components/spinner/Spinner';
import ChartSelector, { ChartType } from 'components/charts/ChartSelector';
import { MONTH_LITERAL, YEAR_DASH_MONTH_FORMAT } from 'constants/date';

export type TimeOptions = {
  from: string;
  to: string;
  timeStep: MonthOrYearOption;
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

type DepartmentQuestion = {
  questionId: string;
  departmentName: string;
};

const Analytics = () => {
  const { t } = useTranslation();

  const history = useHistory<History>();

  const [departments, setDepartments] = useState<DepartmentJson[]>([]);

  //state to keep track of ongoing API requests in fetching departments or questions
  //it controls the loading spinner

  const [isLoading, setIsLoading] = useState(true);

  const [questionPrompts, setQuestionPrompts] = useState<QuestionPrompt[]>([]);

  // state is an object rather than a string because we would like to rerender components even if  question id is the same
  // An example will be to rerender components when the department selection changes but questiond id is the same

  const [selectedDepartmentQuestion, setSelectedDepartmentQuestion] = useState<DepartmentQuestion>({
    questionId: '',
    departmentName: '',
  });

  const [selectedDepartmentName, setSelectedDepartmentName] = useState('');

  const [timeOptions, setTimeOptions] = useState<TimeOptions>({
    from: defaultFromDate(),
    to: defaultToDate(),
    timeStep: MONTH_LITERAL,
  });

  const [selectedAggregateBy, setSelectedAggregateBy] = useState<MonthOrYearOption>(MONTH_LITERAL);

  const [selectedChart, setSelectedChart] = useState<ChartType>('Bar');

  const [showModalQuestions, setShowModalQuestions] = useState(false);
  const [showModalTimeOptions, setShowModalTimeOptions] = useState(false);

  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const departments = await getAllDepartments(history);
      const departmentsWithReport = filterDepartmentsByReport(departments);

      setDepartments(departmentsWithReport);

      if (departmentsWithReport.length === 0) {
        return;
      }

      setSelectedDepartmentName(departmentsWithReport[0].name);
    };

    fetchDepartments();
  }, [history]);

  //fetch questions only when a new department is selected
  // technical debt: A new fetch will happen when there is a change in department selection

  useEffect(() => {
    const fetchQuestionPrompts = async () => {
      if (departments.length === 0) {
        return;
      }

      // this prevents the fetched questions and analytics data from being in an inconsistent state
      // if questions are fetched before analytics are fetched, the fetched questions are updated but the analytics data is not updated yet
      //So, the analytics data will be showing inconsistent result
      // Solution, only display UI after analytics data have been updated

      setIsLoading(true);

      const selectedDepartmentId = findDepartmentIdByName(departments, selectedDepartmentName)!;

      const questionPrompts = await getAllQuestionPrompts(history, selectedDepartmentId);

      setQuestionPrompts(questionPrompts);

      // Let the default question be the first question in the list

      setSelectedDepartmentQuestion({
        departmentName: selectedDepartmentName,
        questionId: questionPrompts[0].id,
      });
    };

    fetchQuestionPrompts();
  }, [selectedDepartmentName, history]);

  // fetch analytics when a new question, time option or aggregate by field is selected

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (departments.length === 0) {
        return;
      }

      const selectedDepartmentId = findDepartmentIdByName(departments, selectedDepartmentName)!;

      // date in API calls have to be in ISO format as defined by backend

      const startDate = moment(timeOptions.from, YEAR_DASH_MONTH_FORMAT).toISOString();
      const endDate = moment(timeOptions.to, YEAR_DASH_MONTH_FORMAT).toISOString();

      const analyticsQuery: AnalyticsQuery = {
        departmentIds: selectedDepartmentId,
        questionId: selectedDepartmentQuestion.questionId,
        startDate: startDate,
        endDate: endDate,
        aggregateBy: selectedAggregateBy,
        timeStep: timeOptions.timeStep,
      };

      const analyticsData = await getAnalyticsData(history, analyticsQuery);

      setAnalyticsData(analyticsData!);
      setIsLoading(false);
    };
    fetchAnalytics();
  }, [selectedDepartmentQuestion, timeOptions, selectedAggregateBy, history]);

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

  const onTimeStepChanged = (timeStep: MonthOrYearOption) => {
    setTimeOptions({ ...timeOptions, timeStep });
  };

  const onAggregateBySelected = (aggregateBy: MonthOrYearOption) => {
    setSelectedAggregateBy(aggregateBy);
  };

  const onChartSelected = (chart: ChartType) => {
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
              <DropDown
                menus={getAllDepartmentsByName(departments!)}
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
                setQuestionSelected={(questionId) =>
                  setSelectedDepartmentQuestion({ ...selectedDepartmentQuestion, questionId })
                }
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
                onTimeStepChanged={(timeStep) => onTimeStepChanged(timeStep as MonthOrYearOption)}
              />

              <DropDown
                menus={DropDownMenus.aggregateBy}
                title="Aggregate By"
                selectedMenu={selectedAggregateBy}
                setDropDownMenu={(aggregateBy) =>
                  onAggregateBySelected(aggregateBy as MonthOrYearOption)
                }
              />
              <DropDown
                menus={DropDownMenus.charts}
                title="Charts"
                selectedMenu={selectedChart}
                setDropDownMenu={(chart) => onChartSelected(chart as ChartType)}
              />
            </div>
          </div>
          <Col className="mt-5">
            <h4>
              {displayTotal(questionPrompts, selectedDepartmentQuestion.questionId, analyticsData)}
            </h4>
            <ChartSelector
              type={selectedChart}
              analyticsData={analyticsData}
              questionPrompt={getQuestionFromId(
                questionPrompts,
                selectedDepartmentQuestion.questionId,
              )}
            />
          </Col>
        </div>
      )}
    </Layout>
  );
};

export default Analytics;

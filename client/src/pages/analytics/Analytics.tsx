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
  createAnalyticsMap,
  displayTotal,
  filterDepartmentsByReport,
  filterQuestionsSelected,
  findDepartmentIdByName,
  getAllDepartmentsByName,
  getQuestionFromId,
} from 'utils/analytics';
import { Spinner } from 'components/spinner/Spinner';
import ChartSelector, { ChartType } from 'components/charts/ChartSelector';
import { MONTH_LITERAL, YEAR_DASH_MONTH_FORMAT } from 'constants/date';
import { DropDownMultiSelect } from 'components/dropdown/DropDownMultiSelect';
import { createAnalyticsKey, reformatQuestionPrompt } from 'utils/string';
import AnalyticsOverview from 'components/analytics/Overview';

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

export type QuestionPromptUI = QuestionPrompt & {
  checked: boolean;
};

export type QuestionMap = {
  [key: string]: QuestionPromptUI[];
};

export type AnalyticsMap = {
  [key: string]: AnalyticsResponse[];
};

const Analytics = () => {
  const { t } = useTranslation();

  const history = useHistory<History>();

  const [departments, setDepartments] = useState<DepartmentJson[]>([]);

  //state to keep track of ongoing API requests in fetching departments or questions
  //it controls the loading spinner

  const [isLoading, setIsLoading] = useState(true);

  const [questionPrompts, setQuestionPrompts] = useState<QuestionPrompt[]>([]);
  const [questionMap, setQuestionMap] = useState<QuestionMap>({});

  // state is an object rather than a string because we would like to rerender components even if  question id is the same
  // An example will be to rerender components when the department selection changes but questiond id is the same

  const [selectedDepartmentQuestion, setSelectedDepartmentQuestion] = useState<DepartmentQuestion>({
    questionId: '',
    departmentName: '',
  });

  const [selectedDepartmentNames, setSelectedDepartmentNames] = useState<string[]>([]);

  const [timeOptions, setTimeOptions] = useState<TimeOptions>({
    from: defaultFromDate(),
    to: defaultToDate(),
    timeStep: MONTH_LITERAL,
  });

  const [selectedAggregateBy, setSelectedAggregateBy] = useState<MonthOrYearOption>(MONTH_LITERAL);

  const [selectedChart, setSelectedChart] = useState<ChartType>('Bar');

  const [showModalQuestions, setShowModalQuestions] = useState(false);
  const [showModalTimeOptions, setShowModalTimeOptions] = useState(false);

  const [analyticsMap, setAnalyticsMap] = useState<AnalyticsMap>({});

  useEffect(() => {
    const fetchDepartments = async () => {
      const departments = await getAllDepartments(history);
      const departmentsWithReport = filterDepartmentsByReport(departments);

      setDepartments(departmentsWithReport);

      if (departmentsWithReport.length === 0) {
        return;
      }

      setSelectedDepartmentNames([departmentsWithReport[0].name]);
    };

    fetchDepartments();
  }, [history]);

  //fetch questions only when a new department is selected
  // technical debt: A new fetch will happen when there is a change in department selection

  const fetchQuestionPrompts = async (departmentName: string, firstQuestionByDefault: boolean) => {
    // this prevents the fetched questions and analytics data from being in an inconsistent state
    // if questions are fetched before analytics are fetched, the fetched questions are updated but the analytics data is not updated yet
    //So, the analytics data will be showing inconsistent result
    // Solution, only display UI after analytics data have been updated

    setIsLoading(true);

    const selectedDepartmentId = findDepartmentIdByName(departments, departmentName)!;

    const questionPrompts = await getAllQuestionPrompts(history, selectedDepartmentId);

    const questionPromptsUI: QuestionPromptUI[] = questionPrompts.map((questionPrompt, index) => {
      let checked = false;

      if (index === 0 && firstQuestionByDefault) {
        checked = true;
      }

      return { ...questionPrompt, checked };
    });

    setQuestionMap({ ...questionMap, [departmentName]: questionPromptsUI });

    setIsLoading(false);
  };

  useEffect(() => {
    if (departments.length === 0) {
      return;
    }
    fetchQuestionPrompts(departments[0].name, true);
  }, [departments, history]);

  // fetch analytics when a new question, time option or aggregate by field is selected

  const fetchAnalytics = async () => {
    const departmentDashQuestionKeys: string[] = [];
    const fetchAnalyticsRequests: Promise<AnalyticsResponse[]>[] = [];

    Object.keys(questionMap).forEach((department) => {
      const selectedQuestions = filterQuestionsSelected(questionMap[department]);

      selectedQuestions.forEach((selectedQuestion) => {
        departmentDashQuestionKeys.push(
          createAnalyticsKey(
            department,
            reformatQuestionPrompt(selectedQuestion.id, selectedQuestion.en),
          ),
        );

        const departmentId = findDepartmentIdByName(departments, department)!;

        // date in API calls have to be in ISO format as defined by backend

        const startDate = moment(timeOptions.from, YEAR_DASH_MONTH_FORMAT).toISOString();
        const endDate = moment(timeOptions.to, YEAR_DASH_MONTH_FORMAT).toISOString();

        const analyticsQuery: AnalyticsQuery = {
          departmentId: departmentId,
          questionId: selectedQuestion.id,
          startDate: startDate,
          endDate: endDate,
          aggregateBy: selectedAggregateBy,
          timeStep: timeOptions.timeStep,
        };

        fetchAnalyticsRequests.push(getAnalyticsData(history, analyticsQuery));
      });
    });

    const analyticsresponses = await Promise.all(fetchAnalyticsRequests);

    const analyticsMap = createAnalyticsMap(analyticsresponses, departmentDashQuestionKeys);

    setAnalyticsMap(analyticsMap);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [questionMap, timeOptions, selectedAggregateBy, history]);

  const handleCloseQuestionsModal = () => setShowModalQuestions(false);
  const handleShowQuestionsModal = () => {
    setShowModalQuestions(true);
  };

  const handleCloseTimeOptionsModal = () => setShowModalTimeOptions(false);
  const handleShowTimeOptionsModal = () => setShowModalTimeOptions(true);

  const onDepartmentSelected = (event: ChangeEvent<HTMLInputElement>) => {
    let updateDepartmentsSelected: string[] = [];

    const departmentSelected = event.target.id;

    if (!selectedDepartmentNames.includes(departmentSelected)) {
      updateDepartmentsSelected = [...selectedDepartmentNames, departmentSelected];

      fetchQuestionPrompts(departmentSelected, false);
    } else {
      updateDepartmentsSelected = selectedDepartmentNames.filter(
        (department) => department !== departmentSelected,
      );

      delete questionMap[departmentSelected];
      setQuestionMap({ ...questionMap });
    }

    setSelectedDepartmentNames(updateDepartmentsSelected);
  };

  const onQuestionsSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const departmentDashQuestion = event.target.id;

    const [department, questionId] = departmentDashQuestion.split('-');

    const questions = questionMap[department];

    const index = questions.findIndex((question) => question.id === questionId);

    questions[index] = { ...questions[index], checked: !questions[index].checked };

    setQuestionMap({ ...questionMap, [department]: questions });
  };

  const onFromDateChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setTimeOptions({ ...timeOptions, from: event.target.value });

    fetchAnalytics();
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
    // /console.log('ana2:', analyticsMap);
  };

  return (
    <Layout title={t('Analytics')}>
      {isLoading ? (
        <Spinner text="Loading..." size="30px" />
      ) : (
        <div className="w-100 d-flex flex-column mr-auto">
          <div className="w-100 d-flex flex-row justify-content-between">
            <div className="d-flex flex-row gap-3">
              <DropDownMultiSelect
                dropDowns={getAllDepartmentsByName(departments!)}
                title={'Department'}
                selectedDropDowns={selectedDepartmentNames}
                setSelectedDropDowns={onDepartmentSelected}
              />
              <Button variant="outline-dark" onClick={handleShowQuestionsModal}>
                Questions
              </Button>

              <AnalyticsQuestionModal
                showModal={showModalQuestions}
                questionMap={questionMap}
                handleCloseModal={handleCloseQuestionsModal}
                setQuestionSelected={onQuestionsSelected}
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
            <AnalyticsOverview analyticsData={analyticsMap} />
            <ChartSelector type={selectedChart} analyticsData={analyticsMap} />
          </Col>
        </div>
      )}
    </Layout>
  );
};

export default Analytics;

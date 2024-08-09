import { DropDown, DropDownMenus } from 'components/dropdown/DropdownMenu';
import Layout from 'components/layout';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { getAllDepartments } from 'api/department';
import { useHistory } from 'react-router-dom';
import { AnalyticsResponse, DepartmentJson, MonthOrYearOption, QuestionPrompt } from '@hha/common';
import { getAllQuestionPrompts, getAnalyticsData } from 'api/analytics';
import { AnalyticsQuestionModal } from 'components/popup_modal/AnalyticsQuestions';
import { TimeOptionModal } from 'components/popup_modal/TimeOptionModal';
import {
  createAnalyticsMap,
  filterDepartmentsByReport,
  filterQuestionsSelected,
  findDepartmentIdByName,
  getAllDepartmentsByName,
  prepareAnalyticsQuery,
} from 'utils/analytics';
import { Spinner } from 'components/spinner/Spinner';
import ChartSelector, { ChartType } from 'components/charts/ChartSelector';
import { MONTH_LITERAL } from 'constants/date';
import { createAnalyticsKey } from 'utils/string';
import AnalyticsTotal from 'components/analytics/Total';
import { defaultFromDate, defaultToDate } from 'utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export type TimeOptions = {
  from: string;
  to: string;
  timeStep: MonthOrYearOption;
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

  const [questionMap, setQuestionMap] = useState<QuestionMap>({});

  const [timeOptions, setTimeOptions] = useState<TimeOptions>({
    from: defaultFromDate(),
    to: defaultToDate(),
    timeStep: MONTH_LITERAL,
  });

  const [selectedAggregateBy, setSelectedAggregateBy] = useState<MonthOrYearOption>(MONTH_LITERAL);

  const [selectedChart, setSelectedChart] = useState<ChartType>('bar');

  const [showModalQuestions, setShowModalQuestions] = useState(false);
  const [showModalTimeOptions, setShowModalTimeOptions] = useState(false);

  const [analyticsMap, setAnalyticsMap] = useState<AnalyticsMap>({});

  const pdfRef = useRef<HTMLDivElement>(null);

  const fetchDepartments = async () => {
    const departments = await getAllDepartments(history);
    const departmentsWithReport = filterDepartmentsByReport(departments);

    setDepartments(departmentsWithReport);

    // should show a pop up communicating that there is no department with report
    //As of current, this line of code is a technical debt and maybe changed in the future

    if (departmentsWithReport.length === 0) {
      return;
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [history]);

  const fetchQuestionPrompts = async (
    departmentName: string,
    shouldCheckFirstQuestion: boolean,
  ) => {
    const selectedDepartmentId = findDepartmentIdByName(departments, departmentName)!;

    const questionPrompts = await getAllQuestionPrompts(history, selectedDepartmentId);

    const questionPromptsUI: QuestionPromptUI[] = questionPrompts.map((questionPrompt, index) => {
      let checked = false;

      // when the user visits the analytics page, the first question's analytic data in the first department is displayed in the chart
      //first is defined as the first department or question returned by the API
      //this ensures the analytics page at the beginning does not have blank data
      //A checked state is maintained to keep track of user selected questions

      if (index === 0 && shouldCheckFirstQuestion) {
        checked = true;
      }

      return { ...questionPrompt, checked };
    });

    return questionPromptsUI;
  };

  const updateQuestionMap = async () => {
    const fetchQuestionPromises: Promise<QuestionPromptUI[]>[] = [];

    departments.forEach((department, index) => {
      //When the page is loaded, the first department's question is analyzed
      //This is an intentional design choice because we want the user to view an analytic data before selecting filters

      const shouldCheckFirstQuestion = index === 0;
      const questionPromise = fetchQuestionPrompts(department.name, shouldCheckFirstQuestion);
      fetchQuestionPromises.push(questionPromise);
    });

    const allQuestionPromptsUI = await Promise.all(fetchQuestionPromises);

    const updatedQuestionMap: QuestionMap = {};

    allQuestionPromptsUI.forEach((questionPrompstUI, index) => {
      updatedQuestionMap[departments[index].name] = questionPrompstUI;
    });

    setQuestionMap(updatedQuestionMap);
  };

  useEffect(() => {
    updateQuestionMap();
  }, [departments, history]);

  const fetchAnalytics = async () => {
    // department name + question (question id - question text) is used as an identifier (key) for a question
    // this quarantees uniqueness of the same question in different department
    // this list keeps track of all the identifier for the questions to be used later in creating a map

    const departmentPlusQuestionKeys: string[] = [];
    const fetchAnalyticsRequests: Promise<AnalyticsResponse[]>[] = [];

    Object.keys(questionMap).forEach((department) => {
      // fetch analytics for only questions selected by checkbox

      const selectedQuestions = filterQuestionsSelected(questionMap[department]);

      selectedQuestions.forEach((selectedQuestion) => {
        const departmentPlusQuestionKey = createAnalyticsKey(department, selectedQuestion.id);

        departmentPlusQuestionKeys.push(departmentPlusQuestionKey);

        const departmentId = findDepartmentIdByName(departments, department)!;

        const analyticsQuery = prepareAnalyticsQuery(
          departmentId,
          selectedQuestion.id,
          selectedAggregateBy,
          timeOptions,
        );

        const analyticsData = getAnalyticsData(history, analyticsQuery);

        fetchAnalyticsRequests.push(analyticsData);
      });
    });

    const analyticsresponses = await Promise.all(fetchAnalyticsRequests);

    const analyticsMap = createAnalyticsMap(analyticsresponses, departmentPlusQuestionKeys);

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

  const handleExportWithComponent = () => {
    console.log('starting export...');
    const capturedComponent = pdfRef.current;

    const chartFilenames = {
      bar: t('analyticsBarChart'),
      line: t('analyticsLineChart'),
      pie: '',
    };

    if (!capturedComponent) {
      console.error("PDF reference is invalid or the component hasn't been rendered.");
      console.log(pdfRef);
      return;
    }

    html2canvas(capturedComponent!).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      // ratio is used to scale the image so that it fits into the more restrictive dimension, to avoid visual cutoff at the edges
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      // find points to center image horizontally and vertically
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(
        `${timeOptions.from} - ${timeOptions.to} - ${chartFilenames[selectedChart]} ${t('analyticsExportFilename')}.pdf`,
      );
    });
    console.log('finished export!');
  };

  const onQuestionsSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const departmentDashQuestion = event.target.id;

    // the <department name> - <question prompt> is used to identify a question (key)
    // this differentiates the same questions but in different departments

    const [department, questionId] = departmentDashQuestion.split('-');

    const questions = questionMap[department];

    const index = questions.findIndex((question) => question.id === questionId);

    //flips the checked state of the selected question, but does not update other question properties
    // only updates the selected question, does not update other questions in the department

    questions[index] = { ...questions[index], checked: !questions[index].checked };

    //only updates the questions in the department that the selected question belongs to

    setQuestionMap({ ...questionMap, [department]: questions });
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
    <Layout title={t('headerAnalytics')}>
      {isLoading ? (
        <Spinner text="Loading..." size="30px" />
      ) : (
        <div className="w-100 d-flex flex-column mr-auto">
          <div className="w-100 d-flex flex-row justify-content-between">
            <div className="d-flex flex-row gap-3" data-testid="select-department-question-button">
              <Button variant="outline-dark" onClick={handleShowQuestionsModal}>
                {t('analyticsQuestion')}
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
                {t('analyticsTime')}
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
                title={t('analyticsAggregateBy')}
                selectedMenu={selectedAggregateBy}
                setDropDownMenu={(aggregateBy) =>
                  onAggregateBySelected(aggregateBy as MonthOrYearOption)
                }
              />
              <DropDown
                menus={DropDownMenus.charts}
                title={t('analyticsCharts')}
                selectedMenu={selectedChart}
                setDropDownMenu={(chart) => onChartSelected(chart as ChartType)}
              />
            </div>
          </div>
          <Col className="mt-5">
            <AnalyticsTotal analyticsData={analyticsMap} questionMap={questionMap} />
            <div ref={pdfRef}>
              <ChartSelector
                type={selectedChart}
                analyticsData={analyticsMap}
                questionMap={questionMap}
              />
            </div>
            <button className="btn btn-outline-dark mr-3" onClick={handleExportWithComponent}>
              {t('analysisDisplayGeneratePDF')}
            </button>
          </Col>
        </div>
      )}
    </Layout>
  );
};

export default Analytics;

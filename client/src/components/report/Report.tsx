import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import React, { EffectCallback, useState } from 'react';
import SideBar from '../side_bar/side_bar';
import Header from 'components/header/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
// import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import {
  JsonReportDescriptor,
  JsonReportItem,
  JsonReportMeta,
} from 'common/json_report';
import * as MockApi from './MockApi';
import * as ReportApiUtils from './ReportUtils';
import {ItemGroup } from './ReportItems';
import { Spinner } from 'components/spinner/Spinner';
import { toast } from 'react-toastify';
import { setConstantValue } from 'typescript';
import { stat } from 'fs';

// Data structure containing additional properties pertinent to the front-end
export interface ReportForm {
  readonly jsonDescriptor: JsonReportDescriptor;
  readonly itemFields : Array<ItemField>
}

export interface ItemField {
  readonly reportItem: JsonReportItem;
  readonly id: string;
  readonly validated: boolean;
  readonly valid: boolean;
  readonly errorMessage?: string;
  readonly items?: Array<ItemField>;
}

export const itemFieldToReportItem = (itemField: ItemField): JsonReportItem => {
  return itemField.reportItem;
};

export function Report() {
  return (
    <div className='bg-light' style={{ paddingBottom: '8%' }}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-1">
            <SideBar />
          </div>
          <div className="col-11">
            <Header />
            <main className="container">
              <FormContents path="/nicu" />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

enum StateType {
  loading,
  ready,
  error,
}

export type ErrorData = {
  code: string;
  message: string;
};

type State = {
  value: StateType;
  data: ReportForm;
  errorData?: ErrorData;
};

function Loading(): State {
  return { value: StateType.loading, data: null };
}
function Ready(data: ReportForm): State {
  return { value: StateType.ready, data: data };
}
function Error(errorData: ErrorData): State {
  return { value: StateType.error, data: null, errorData: errorData };
}

const fetchMockReportData = async (): Promise<ReportForm> => {
    const data = await MockApi.getDataDelay(1500, true);
    return ReportApiUtils.toReportData(data);
}


function FormContents(props: { path: string }) {
  const formHook = useForm();
// Commented out to avoid unused variable warning. May put it back once translation is supported.
//   const { t, i18n } = useTranslation();

  const [sectionIdx, setSectionIdx] = useState(0);
  const [readOnly, setReadOnly] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [state, setState] = useState<State>(Loading());
  const pageTop = React.useRef(null);

  const reportDataFetchingEffectGenerator:
    (fetcher: () => Promise<ReportForm>) => EffectCallback = (fetcher) =>
    () => {
      (async () => {
        try {
          const reportData: ReportForm = await fetcher();
          setState({ value: StateType.ready, data: reportData });
        } catch (err) {
          setState(Error(err));
        }
      })();
    };

  const errorHandlerEffectGenerator: <T extends unknown>(
    condition: (item: ItemField) => boolean,
    handler: (item: ItemField) => void
  ) => EffectCallback = (condition, handler) => () => {
    if (state.value !== StateType.ready) return;
    console.assert(state.data, "Invalid state: in error handler with null data.");
    state.data.itemFields
      .filter(condition)
      .forEach(handler);
  };

  // Give error messages to react hook
  const mockErrorHandling: (invalidItem: ItemField) => void = (invalidItem) => {
    const id = invalidItem.id;
    const error = {
      type: 'invlaid-input',
      message: invalidItem.errorMessage,
    };
    //  This changes the analogous to a setState call, thus must be called here.
    formHook.setError(id, error);
  }
  
  const fetchReportDataEfect: EffectCallback =
    reportDataFetchingEffectGenerator(fetchMockReportData);
  const errorHandlingEffect: EffectCallback =
    errorHandlerEffectGenerator(item => !item.valid, mockErrorHandling);

  React.useEffect(fetchReportDataEfect);
  // Whenever data changed, check for errors messages to give to react form hook
  React.useEffect(errorHandlingEffect);

  const editButtonHandler = () => setReadOnly(false);

  const submitHandler = async (answers) => {
    const submittingData : ReportForm = state.data as ReportForm;
    setSubmitting(true);
    try {
      const data = await ReportApiUtils.submitData(answers, submittingData);
      const ReportFormWithAnswers: ReportForm = {
        jsonDescriptor: data,
        itemFields: submittingData.itemFields
      };
      const nextState = Ready(ReportFormWithAnswers);
      setReadOnly(true);
      toast.success('Data submitted');
      setState(nextState);
    } catch (err) {
      const nextState = err.code < 500 ? Ready(err.data) : Error({ code: err.code, message: err.message });
      toast.error(`Error ${err.code}: ${err.message}`);
      setState(nextState);
    }
    setSubmitting(false);
  };

  const renderLoading = () => {
    return (
      <div className="row justify-content-center" style={{ marginTop: '25%' }}>
        <Spinner size="3rem" />
      </div>
    );
  };

  const renderError = () => {
    console.assert(
      state.errorData,
      `Invalid state: Calling renderError() with errorData set to ${state.errorData}.`)
    const errorData = state.errorData;
    return (
      <div className="row justify-content-center text-center" style={{ marginTop: '25%' }}>
        <h1 className="text-danger">{`Error code: ${errorData.code}`}</h1>
        <strong>{`${errorData.message}`}</strong>
        <button
          type="button"
          className="btn btn-primary col-2 mt-3"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    );
  };

  const renderContent = () => {
    const data = state.data as ReportForm;
    const [labels, sections] = extractGroupings(data);
    const totalSections = labels.length;
    const navButtonClickHandler: NavButtonClickedHandler = (name: string, section: number) => {
      switch (name) {
        case 'next':
          setSectionIdx((section + 1) % totalSections);
          break;
        case 'prev':
          setSectionIdx((section - 1) % totalSections);
          break;
        case 'section-clicked':
          setSectionIdx(section);
          break;
        default:
      }
      pageTop.current.scrollIntoView();
    };

    return (
      <>
        <FormHeader reportMetadata={data.jsonDescriptor.meta} />
        <NavBar
          labels={labels}
          activeLabel={sectionIdx}
          onNavClick={navButtonClickHandler}
          hideEditButton={!readOnly}
          onEditClick={editButtonHandler}
        />
        <div ref={pageTop} />
        <FormProvider {...formHook}>
          <form
            className="row p-3 needs-validation"
            onSubmit={formHook.handleSubmit(submitHandler)}
          >
            <Sections
              readOnly={readOnly}
              itemGroups={sections}
              activeGroup={sectionIdx}
              onClick={navButtonClickHandler}
              loading={submitting}
            />
          </form>
        </FormProvider>
      </>
    );
  };

  switch (state.value) {
    case StateType.loading:
      return renderLoading();
    case StateType.error:
      return renderError();
    default:
      return renderContent();
  }
}

function extractGroupings(data: ReportForm): [ItemField[], ItemField[][]] {
  // parse the items into groups marked by the first label found.
  const sections : ItemField[][] = [];
  data.itemFields 
    .forEach((item) => {
    if (item.reportItem.type === 'label') {
      sections.push([item]);
    } else {
      const headSection = sections[sections.length - 1];
      headSection.push(item);
    }
  });

  // get labels from the groupings found
  const labels: ItemField[] = sections.map((section, idx) => {
    return section[0];
  });
  return [labels, sections];
}

function FormHeader(props: { reportMetadata: JsonReportMeta }) {
  const date = new Date();
  const locale = 'default';
  const formName = props.reportMetadata.department.name
    .concat(' ')
    .concat(date.toLocaleDateString(locale, { month: 'long' }))
    .concat(' Report');

  return (
    <div className="row justify-content-center bg-light rounded ">
      <div className="col-sm-12">
        <div className="jumbotron m-3">
          <h2 className="display-4">{formName}</h2>
          <p className="lead">
            Last updated on: {props.reportMetadata.submittedDate}
            <br />
            By user {props.reportMetadata.submittedUserId}
            <br />
            <i>Due on: {date.toLocaleDateString()}</i>
          </p>
        </div>
      </div>
    </div>
  );
}

function Sections(props: {
  activeGroup: number;
  itemGroups: ItemField[][];
  onClick?: NavButtonClickedHandler;
  readOnly: boolean;
  loading: boolean;
}) {
  const { formState } = useFormContext();
  const errorsCount = Object.keys(formState.errors).length;
  const activeGroup = props.activeGroup,
    totalGroups = props.itemGroups.length,
    submitButtonHidden = activeGroup !== totalGroups - 1 || props.readOnly,
    disableButton = errorsCount !== 0 || props.loading,
    prevBtnDisabled = activeGroup <= 0,
    nextBtnDisabled = activeGroup >= totalGroups - 1;

  return (
    <>
      {props.itemGroups.map((item, idx) => {
        return (
          <ItemGroup
            key={'ig-' + idx}
            items={item}
            readOnly={props.readOnly}
            active={props.activeGroup === idx}
          />
        );
      })}
      <div className="row justify-content-center mt-3">
        <div className="col-8 dropdown-divider" />
      </div>
      <div className="btn-group justify-content-center mt-3">
        <button
          className="btn btn-primary col-3"
          type="button"
          disabled={prevBtnDisabled}
          onClick={() => props.onClick('prev', activeGroup)}
          key={uuid()}
        >
          Previous
        </button>
        <button
          className="btn btn-primary col-3"
          type="button"
          disabled={nextBtnDisabled}
          onClick={() => props.onClick('next', activeGroup)}
          key={uuid()}
        >
          Next
        </button>
      </div>
      <div className="btn-group justify-content-center mt-3">
        <button
          className="btn btn-success col-6"
          type="submit"
          hidden={submitButtonHidden}
          disabled={disableButton}
          key={uuid()}
        >
          {props.loading ? <span className="spinner-border spinner-border-sm" /> : 'Submit'}
        </button>
      </div>
    </>
  );
}

type NavButtonClickedHandler = (name: string, section: number) => void;

function NavBar(props: {
  labels: ItemField[];
  activeLabel?: number;
  onNavClick: NavButtonClickedHandler;
  hideEditButton: boolean;
  onEditClick: () => void;
}) {
  return (
    <div className="list-group list-group-horizontal sticky-top justify-content-between bg-white p-2 ps-4 mt-3 shadow-sm">
      <div className="list-group list-group-horizontal">
        <div className="me-2 fs-4 ">Steps: </div>
        {props.labels.map((label, idx) => {
          const id = (label as ItemField).id;
          const text = idx + 1 + '. ' + label.reportItem.description;
          return (
            <button
              key={id}
              className={
                'list-group-item nav nav-pills ' + (idx === props.activeLabel ? 'active' : '')
              }
              onClick={() => props.onNavClick('section-clicked', idx)}
            >
              {text}
            </button>
          );
        })}
      </div>
      <div className="list-group list-group-horizontal justify-content-end align-middle">
        <button
          key={uuid()}
          type="button"
          className="btn btn-primary bi bi-pencil-square"
          hidden={props.hideEditButton}
          onClick={() => props.onEditClick()}
        >
          &nbsp;&nbsp;Edit
        </button>
      </div>
    </div>
  );
}

export default Report;

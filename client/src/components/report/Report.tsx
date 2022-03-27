import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import React, { useState } from 'react';
import SideBar from '../side_bar/side_bar';
import Header from 'components/header/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import {
  JsonReportDescriptor,
  JsonReportItem,
  JsonReportMeta,
} from 'common/definitions/json_report';
import * as MockApi from './MockApi';
import * as ReportApiUtils from './ReportUtils';
import * as JsonInterfaceUtitls from 'common/definitions/departments';
import { InputGroup } from './ReportItems';
import { Spinner } from 'components/spinner/Spinner';
import { toast } from 'react-toastify';

export interface ReportData extends JsonReportDescriptor {
  reportItems: ReportItem[];
  validated?: string;
}
export interface ReportItem extends JsonReportItem {
  id: string;
  validated: boolean;
  valid: boolean;
  errorMessage?: string;
}
export function Report() {
  return (
    <div style={{ paddingBottom: '8%' }}>
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

type None = {} | undefined | null;

type FormState = {
  type: number;
  data: any;
};

enum StateType {
  loading,
  ready,
  invalid,
  error,
}

type State = {
  value: StateType;
  data: ReportData;
};

type LoadingState = { data: None } & State;

function FormContents(props: { path: string }) {
  const formHook = useForm();
  const { t, i18n } = useTranslation();
  const [sectionIdx, setSectionIdx] = useState(0);
  const [readOnly, setReadOnly] = useState(false);
  // const [data, setData] = useState<JsonReportDescriptor>();
  const [submitting, setSubmitting] = useState(false);
  const [state, setState] = useState<State>({ value: StateType.loading, data: null });
  const pageTop = React.useRef(null);
  React.useEffect(() => {
    MockApi.getDataDelay(1500).then((data) => {
      setState({ value: StateType.ready, data: data as ReportData });
    });
  }, []);

  // Whenever data changed, check for errors messages to give to react form hook
  React.useEffect(() => {
    if (state.value == StateType.loading || state.value == StateType.error) return;
    state.data.items
      .filter((item) => !(item as ReportItem).valid)
      .forEach((invalidItem) => {
        const id = (invalidItem as ReportItem).id;
        const message = (invalidItem as ReportItem).errorMessage;
        const error = {
          type: 'invalid-input',
          message: message,
        };
        //  This changes the analogous to a setState call, thus must be called here.
        formHook.setError(id, error);
      });
  }, [state]);

  const editButtonHandler = (name: string) => {
    switch (name) {
      case 'edit':
        setReadOnly(false);
        break;
      default:
    }
  };

  const renderLoading = () => {
    return (
      <div className="row justify-content-center">
        <Spinner size="3rem" style={{ marginTop: '25%' }} />
      </div>
    );
  };

  const submitHandler = async (answers) => {
    setSubmitting(true);
    let result
    try{
      result = await ReportApiUtils.submitData(answers, state.data);
      toast.success("Data submitted")
    }catch(err){
      result = err.data
      toast.error(`Error ${err.code}: ${err.message}`)
    }
    setSubmitting(false);
    setState({value: StateType.ready, data: result})
  };

  const renderContent = () => {
    const data = state.data
    const [labels, sections] = extractGroupings(state.data);
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
        <div ref={pageTop} />
        <FormHeader reportMetadata={data.meta} />
        <NavBar
          labels={labels}
          activeLabel={sectionIdx}
          onNavClick={navButtonClickHandler}
          hideEditButton={!readOnly}
          onEditClick={editButtonHandler}
        />
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
    default:
      return renderContent();
  }
}

function extractGroupings(data: ReportData): [ReportItem[], ReportItem[]] {
  // parse the items into groups marked by the first label found.
  const sections = [];
  data.items.forEach((item) => {
    if (item.type == 'label') {
      sections.push([item]);
    } else {
      const headSection = sections[sections.length - 1];
      headSection.push(item);
    }
  });

  // get labels from the groupings found
  const labels: ReportItem[] = sections.map((section, idx) => {
    return section[0];
  });
  return [labels, sections];
}

function FormHeader(props: { reportMetadata: JsonReportMeta }) {
  const date = new Date();
  const locale = 'default';
  const formName =
    JsonInterfaceUtitls.getDepartmentName(parseInt(props.reportMetadata.departmentId)) +
    ' ' +
    date.toLocaleDateString(locale, { month: 'long' }) +
    ' Report';

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

type NavButtonClickedHandler = (name: string, section: number) => void;
type ButtonClickedHandler = (name: string) => void;

function Sections(props: {
  activeGroup: number;
  itemGroups: any[];
  onClick?: NavButtonClickedHandler;
  readOnly: boolean;
  loading: boolean;
}) {
  const { formState } = useFormContext();
  const errorsCount = Object.keys(formState.errors).length;
  const activeGroup = props.activeGroup,
    totalGroups = props.itemGroups.length,
    submitButtonHidden = activeGroup != totalGroups - 1 || props.readOnly,
    disableButton = errorsCount != 0 || props.loading,
    prevBtnDisabled = activeGroup <= 0,
    nextBtnDisabled = activeGroup >= totalGroups - 1;

  return (
    <>
      {props.itemGroups.map((item, idx) => {
        return (
          <InputGroup
            key={'ig-' + idx}
            items={item}
            readOnly={props.readOnly}
            active={props.activeGroup == idx}
          />
        );
      })}
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

function NavBar(props: {
  labels: ReportItem[];
  activeLabel?: number;
  onNavClick: NavButtonClickedHandler;
  hideEditButton: boolean;
  onEditClick: ButtonClickedHandler;
}) {
  return (
    <div className="list-group list-group-horizontal sticky-top justify-content-between bg-white p-2 ps-4 mt-3 shadow-sm">
      <div className="list-group list-group-horizontal">
        <div className="me-2 fs-4 ">Steps: </div>
        {props.labels.map((label, idx) => {
          const id = (label as ReportItem).id;
          const text = idx + 1 + '. ' + label.description;
          return (
            <button
              key={id}
              className={
                'list-group-item nav nav-pills ' + (idx == props.activeLabel ? 'active' : '')
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
          onClick={() => props.onEditClick('edit')}
        >
          &nbsp;&nbsp;Edit
        </button>
      </div>
    </div>
  );
}

export default Report;

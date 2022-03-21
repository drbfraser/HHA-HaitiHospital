import { FormProvider, useForm, useFormContext, UseFormReturn } from 'react-hook-form';
import React, { useState, useEffect, Fragment } from 'react';
import SideBar from '../side_bar/side_bar';
import Header from 'components/header/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import {
  JsonReportDescriptor,
  JsonReportItem,
  JsonReportItemMeta,
  JsonItemAnswer,
  JsonReportMeta,
} from 'common/definitions/json_report';
import * as MockApi from './MockApi';
import { ItemType } from 'common/definitions/report';
import * as ReportApiUtils from './ReportApiUtils';
import * as JsonInterfaceUtitls from 'common/utils/departments';
export interface ReportData extends JsonReportDescriptor {
  reportItems: ReportItem[];
  validated?: string;
}

export interface ReportItem extends JsonReportItem {
  validated: boolean;
  valid: boolean;
  errorMessage?: string;
}
export function Report() {
  console.log('Render Report');
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

function FormContents(props: { path: string }) {
  const methods = useForm();
  const { t, i18n } = useTranslation();
  const [sectionIdx, setSectionIdx] = useState(0);
  const [readOnly, setReadOnly] = useState(false);
  const [data, setData] = useState<JsonReportDescriptor>(() => {
    const data = MockApi.getData();
    console.log('API');
    console.log(data);
    return data;
  });

  // Setting errors from data using react-hook-form. Note the dependency
  React.useEffect(() => {
    data.items
      .filter((item) => !(item as ReportItem).valid)
      .forEach((invalidItem) => {
        const id = invalidItem.meta.id;
        const message = (invalidItem as ReportItem).errorMessage;
        const error = {
          type: 'invalid-input',
          message: message,
        };
        methods.setError(id, error);
      });
  }, [data]);

  // parse the items and group them into sections.
  const sections = [];
  data.items.forEach((item) => {
    if (item.meta.type == 'label') {
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
  };

  const editButtonHandler = (name: string) => {
    switch (name) {
      case 'edit':
        setReadOnly(false);
        break;
      default:
    }
  };

  const submitHandler = (answers) => {
    ReportApiUtils.submitHandler(answers, data, setData, setReadOnly);
  };

  console.log('Content render');
  return (
    <>
      <FormHeader reportMetadata={data.meta} />
      <NavBar
        labels={labels}
        activeLabel={sectionIdx}
        onNavClick={navButtonClickHandler}
        hideEditButton={!readOnly}
        onEditClick={editButtonHandler}
      />
      <FormProvider {...methods}>
        <form className="row p-3 needs-validation" onSubmit={methods.handleSubmit(submitHandler)}>
          <Sections
            readOnly={readOnly}
            itemGroups={sections}
            activeGroup={sectionIdx}
            onClick={navButtonClickHandler}
          />
        </form>
      </FormProvider>
    </>
  );
}

function FormHeader(props: { reportMetadata: JsonReportMeta }) {
  const date = new Date();
  const locale = 'default';
  const formName =
    JsonInterfaceUtitls.getDepartmentName(parseInt(props.reportMetadata.departmentId)) + ' ' +
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
}) {
  const { formState } = useFormContext();
  const errorsCount = Object.keys(formState.errors).length;
  const activeGroup = props.activeGroup,
    totalGroups = props.itemGroups.length,
    submitButtonHidden = activeGroup != totalGroups - 1 || props.readOnly,
    errorsPresent = errorsCount != 0,
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
          disabled={errorsPresent}
          key={uuid()}
        >
          Submit
        </button>
      </div>
    </>
  );
}

type Label = {
  id: string;
  text?: string;
};

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
          const id = label.meta.id;
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

function InputGroup(props: { items: ReportItem[]; readOnly: boolean; active: boolean }) {
  return (
    <div hidden={!props.active}>
      {props.items.map((element, idx) => {
        switch (element.meta.type) {
          case 'label':
            const label: Label = { id: 'section' + idx, text: element.description };
            return <SectionLabel key={label.id} id={label.id} text={label.text} />;
          case ItemType.N:
            let value = element.answer[0][0];
            return (
              <NumberInputField
                key={element.meta.id}
                id={element.meta.id}
                text={idx + '. ' + element.description}
                valid={element.valid}
                errorMessage={element.errorMessage}
                value={value}
                readOnly={props.readOnly}
              />
            );
          default:
            <Fragment />;
        }
      })}
      <div className="row justify-content-center mt-3">
        <div className="col-8 dropdown-divider" />
      </div>
    </div>
  );
}

type NumberInputFieldProps = {
  id: string;
  text?: string;
  value: string;
  weight?: string;
  indent?: boolean;
  isHeader?: boolean;
  valid: boolean;
  errorMessage?: string;
  readOnly?: boolean;
};

function NumberInputField(props: NumberInputFieldProps): JSX.Element {
  const { register, formState, clearErrors } = useFormContext();
  const { t, i18n } = useTranslation();
  const text = props.text ?? 'N/A';
  const getWeightCss = (w: string) => {
    switch (w) {
      case 'light':
        return ' font-weight-light';
      case 'bold':
        return ' font-weight-bold';
      default:
        return ' ';
    }
  };
  const invalid: boolean = formState.errors[props.id];
  const errorMessage = formState.errors[props.id]?.message;
  return (
    <div className="row justify-content-center ">
      <div className="form-group row col-sm-12 col-lg-6 col-xl-6 p-1 m-1">
        <label
          className={
            'col-sm-8 col-form-label align-middle' +
            getWeightCss(props.weight) +
            (props.indent ? ' ps-5' : '')
          }
          htmlFor={props.id}
        >
          {props.isHeader ? <h5>{text}</h5> : text}
        </label>

        <div className="col-sm-4">
          <input
            id={props.id}
            type={'number'}
            className={'form-control' + (invalid ? ' is-invalid' : '')}
            readOnly={props.readOnly}
            defaultValue={props.value}
            {...register(props.id, {
              required: true,
              onChange: () => {
                clearErrors(props.id);
              },
            })}
          />
          <small className="invalid-feedback">{errorMessage}</small>
        </div>
      </div>
    </div>
  );
}

function SectionLabel(props: { id?: string; text?: string }) {
  return (
    <div id={props.id} className="row justify-content-center">
      <div className="col-8 mt-5">
        <h1 style={{ paddingTop: '' }}>{props.text ?? 'Empty Label'}</h1>
        <div className="dropdown-divider pb-4" />
      </div>
    </div>
  );
}

export default Report;

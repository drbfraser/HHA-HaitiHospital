import { FormProvider, useForm, useFormContext, UseFormReturn } from 'react-hook-form';
import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import SideBar from '../side_bar/side_bar';
import Header from 'components/header/header';
import nicuJSON from '../../pages/form/models/nicuModel.json';
import nicuJSONFr from '../../pages/form/models/nicuModelFr.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { useTranslation } from 'react-i18next';
import { FieldInputProps } from 'formik';
import * as TestData from '../../pages/form/models/TestModels';
import { identity, toInteger } from 'lodash';
import { v4 as uuid } from 'uuid';
import {
  JsonReportDescriptor,
  JsonReportItem,
  JsonReportItemMeta,
  JsonItemAnswer,
} from 'common/definitions/json_report';
import * as MockApi from './MockApi';
import { useSelector } from 'react-redux';
import { read } from 'fs';
import { invalid } from 'moment';

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
  const [data, setData] = useState<JsonReportDescriptor>(() => {
    const data = MockApi.getData();
    console.log('API');
    console.log(data);
    return data
  });
  const { t, i18n } = useTranslation();

  // React.useEffect(() => {
  //   const data = MockApi.getData();
  //   console.log('API');
  //   console.log(data);
  //   setData(data);
  // }, []);

  const handleSubmit = async (data) => {
    const report = assembleData(data);
    console.log('Submit');
    console.log(report);
    /*
     * Ideally, here we make a request to server and handle the responses.
     * Because it is async, the caller will handle either cases.
     * Todo: refactor
     */
    try{
      const result = await MockApi.submitData(report, 1000, true);
      setData(result)
      return result
    }catch(errorData){
      setData(errorData)
      throw errorData
    }
  };

  const assembleData = (answers): JsonReportDescriptor => {
    const copy = { ...data };
    copy.items = copy.items.map((item) => {
      const answer = answers[item.meta.id];
      const itemCopy = { ...item };
      itemCopy.answer = [[answer]];
      return itemCopy;
    });
    return copy;
  };

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
            {data == undefined ? (
              <Fragment />
            ) : (
              <main className="container">
                <FormHeader />
                <FormContents items={data.items as ReportItem[]} onSubmit={handleSubmit} />
              </main>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FormHeader(props: any) {
  const date = new Date();
  const user = 'User';
  const locale = 'default';
  const formName = 'NICU/Paeds ' + date.toLocaleDateString(locale, { month: 'long' }) + ' Report';

  return (
    <div className="row justify-content-center bg-light rounded ">
      <div className="col-sm-12">
        <div className="jumbotron m-3">
          <h2 className="display-4">{formName}</h2>
          <p className="lead">
            Last updated on: {date.toLocaleDateString()}
            <br />
            By {user}
            <br />
            <i>Due on: {date.toLocaleDateString()}</i>
          </p>
        </div>
      </div>
    </div>
  );
}

function FormContents(props: { items: ReportItem[]; onSubmit: (data) => Promise<any> }) {
  const methods = useForm();
  const [section, setSection] = useState(0);
  const [readOnly, setReadOnly] = useState(false);
  const labels: Label[] = props.items
    .filter((item) => item.meta.type == 'label')
    .map((item, idx) => {
      return { id: item.meta.id, text: idx + '. ' + item.description };
    });

  const sections = [];
  props.items.forEach((item) => {
    if (item.meta.type == 'label') {
      sections.push([item]);
    } else {
      const headSection = sections[sections.length - 1];
      headSection.push(item);
    }
  });

  React.useEffect(() => {
    props.items
      .filter((item) => !(item as ReportItem).valid)
      .forEach((invalidItem) => {
        const id = invalidItem.meta.id;
        const message = invalidItem.errorMessage;
        const error = {
          type: 'invalid-input',
          message: message,
        };
        methods.setError(id, error);
      });
  }, [props.items]);

  const totalSections = labels.length;
  const navButtonClickHandler: NavButtonClickedHandler = (name: string, section: number) => {
    switch (name) {
      case 'next':
        setSection((section + 1) % totalSections);
        break;
      case 'prev':
        setSection((section - 1) % totalSections);
        break;
      case 'section-clicked':
        setSection(section);
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

  const submitHandler = (data) => {
    props
      .onSubmit(data)
      .then((data) => {
        setReadOnly(true);
      })
      .catch((data) => {
        console.log('caught');
        setReadOnly(false);
      });
  };

  console.log('Content render');

  return (
    <>
      <NavBar
        labels={labels}
        activeLabel={section}
        onNavClick={navButtonClickHandler}
        hideEditButton={!readOnly}
        onEditClick={editButtonHandler}
      />
      <FormProvider {...methods}>
        <form className="row p-3 needs-validation" onSubmit={methods.handleSubmit(submitHandler)}>
          <Sections
            readOnly={readOnly}
            itemGroups={sections}
            activeGroup={section}
            onClick={navButtonClickHandler}
          />
        </form>
      </FormProvider>
    </>
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
  // We count the properties of formState.errors
  const errorsCount = Object.keys(formState.errors).length;
  const activeGroup = props.activeGroup,
    totalGroups = props.itemGroups.length,
    submitButtonHidden = activeGroup != totalGroups - 1 || props.readOnly,
    errorsPresent = errorsCount != 0,
    prevBtnDisabled = activeGroup <= 0,
    nextBtnDisabled = activeGroup >= totalGroups - 1;
  console.log('Errors count ' + errorsCount);
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
          onClick={() => props.onClick('next', activeGroup)}
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
  labels: Label[];
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
          return (
            <button
              key={label.id}
              className={
                'list-group-item nav nav-pills ' + (idx == props.activeLabel ? 'active' : '')
              }
              onClick={() => props.onNavClick('section-clicked', idx)}
            >
              {label.text}
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
          case 'number':
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

import { FormProvider, useForm, useFormContext } from 'react-hook-form';
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
import { toInteger } from 'lodash';
import { v4 as uuid } from 'uuid';
import {
  JsonReportDescriptor,
  JsonReportItem,
  JsonReportItemMeta,
} from 'common/definitions/json_report';

interface ReportData extends JsonReportDescriptor {
  validated?: string;
}

interface ReportItem extends JsonReportItem {
  validated: boolean;
  invalid: boolean;
}

function Report() {
  const [data, setData] = useState<ReportData>(undefined);
  const form = useForm();
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const testData = nicuJSON;

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  useEffect(() => {
    sleep(1000).then(() => {
      const data: JsonReportDescriptor = apiGetData();
      setData(data);
      $('body').scrollspy({ target: '#navbar' });
    });
  }, []);

  const onSubmit = async () => {
    //get filled values
    const data = form.getValues();

    //trigger validation on fields
    const result = await form.trigger();
    if (!result) {
      console.log('validation failed');
    }
    console.log(data);
    assembleData(data);
  };

  const assembleData = (data: any) => {
    // Todo: prepare data for send.
  };
  return (
    <div id="top" style={{ paddingBottom: '8%' }}>
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
                <FormProvider {...form}>
                  <FormContents items={data.items} onSubmit={onSubmit} />
                </FormProvider>
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

function FormContents(props: { items: JsonReportItem[]; onSubmit?: () => any }) {
  const labels: Label[] = [];
  const formElements = (
    <form className="row p-3 needs-validation" noValidate>
      {props.items.map((element, idx) => {
        switch (element.meta.type) {
          case 'label':
            const label: Label = { id: 'section' + idx, text: element.description };
            labels.push(label);
            return <SectionLabel key={label.id} id={label.id} text={label.text} />;
          case 'number':
            return (
              <NumberInputField
                key={uuid()}
                id={idx.toString()}
                text={idx + '. ' + element.description}
              />
            );
          default:
            return (
              <NumberInputField
                key={uuid()}
                id={idx.toString()}
                text={idx + '. ' + element.description}
              />
            );
        }
      })}
      <div id="bottom" />
      <div className="row justify-content-center p-5">
        <button className="btn btn-primary col-4" type="button" onClick={props.onSubmit}>
          Submit
        </button>
      </div>
      {/* DEMO ONLY */}
      <div className="row justify-content-center">
        <button className="btn btn-success col-4" type="button" onClick={props.onSubmit}>
          Test Success
        </button>
        <button className="btn btn-danger col-4" type="button" onClick={props.onSubmit}>
          Test Failed
        </button>
      </div>
    </form>
  );

  return (
    <Fragment>
      <NavBar labels={labels} />
      {formElements}
    </Fragment>
  );
}

type LabelProps = {
  id?: string;
  text: string;
  size?: number;
};

function Label(props: LabelProps) {
  return <h5 id={props.id ?? ''}>{props.text}</h5>;
}

type NumberInputFieldProps = {
  id: string;
  text?: string;
  value?: number;
  weight?: string;
  indent?: boolean;
  isHeader?: boolean;
  invalid?: boolean;
  invalidMsg?: string;
};

function NumberInputField(props: NumberInputFieldProps): JSX.Element {
  const { register } = useFormContext();
  const [invalid] = useState(props.invalid);
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
            className={'form-control ' + (invalid ? 'is-invalid' : '')}
            {...register(props.id)}
          />
          <small></small>
        </div>
      </div>
    </div>
  );
}

function SectionLabel(props: { id?: string; text?: string }) {
  return (
    <div id={props.id} className="row justify-content-center">
      <div className="col-8">
        <h1 style={{ paddingTop: '80px' }}>{props.text ?? 'Empty Label'}</h1>
        <div className="dropdown-divider pb-4" />
      </div>
    </div>
  );
}

type Label = {
  id: string;
  text?: string;
};

function NavBar(props: { labels: Label[] }) {
  return (
    <div
      id="navbar"
      className="list-group list-group-horizontal sticky-top justify-content-between bg-white p-2 ps-4 mt-3 shadow-sm"
      style={{ top: '10px' }}
    >
      <div className="list-group list-group-horizontal">
        <div className="me-2 fs-4 ">Steps: </div>
        {props.labels.map((label, idx) => {
          return (
            <a key={label.id} className={'list-group-item'} href={'#' + label.id}>
              {label.text}
            </a>
          );
        })}
      </div>
      <div className="list-group list-group-horizontal justify-content-end">
        <a className="list-group-item d-flex justify-content-between" href="#top">
          Top
        </a>
        <a className="list-group-item d-flex justify-content-between" href="#bottom">
          Bottom
        </a>
      </div>
    </div>
  );
}

function apiGetData(): JsonReportDescriptor {
  const items: ReportItem[] = nicuJSON.flatMap((section, idx) => {
    const fields: ReportItem[] = [];
    fields.push({
      meta: { type: 'label' },
      description: section.section_label,
      answer: [],
      validated: true,
      invalid: false,
    });
    return fields.concat(
      section.section_fields.map((field): ReportItem => {
        if ((field.field_type = 'number'))
          return {
            meta: { type: 'number' },
            description: field.field_label,
            answer: [[field.field_value == undefined ? '' : field.field_value.toString()]],
            validated: true,
            invalid: false
          };
      }),
    );
  });
  return {
    meta: {
      id: uuid(),
      departmentId: '0',
      submittedDate: 'NA',
      submittedUserId: '0',
    },
    items: items,
  };
}

export default Report;

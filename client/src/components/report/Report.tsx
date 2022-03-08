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

function Report() {
  const [dataState, setDataState] = useState({});
  const form = useForm();
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const testData = nicuJSON;
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    $('body').scrollspy({ target: '#navbar' });
  });

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

  let data: JsonReportDescriptor = getData();
  console.log(data)

  const buildForm = (elements: [JsonReportItem]) => {
    const labels: Label[] = [];
    return [
      <FormProvider {...form}>
        <form className="row p-3 needs-validation" noValidate>
          {elements.map((element, idx) => {
            switch (element.meta.type) {
              case 'label':
                const label: Label = { id: uuid(), text: element.description };
                labels.push(label);
                return <Label id={label.id} text={label.text} />;
              case 'number':
                return (
                  <NumberInputField
                    key={uuid()}
                    id={uuid()}
                    text={idx + '. ' + element.description}
                  />
                );
              default:
                return (
                  <NumberInputField
                    key={uuid()}
                    id={uuid()}
                    text={idx + '. ' + element.description}
                  />
                );
            }
          })}
          <div id="bottom" />
          <button className="btn btn-primary" type="button" onClick={onSubmit}>
            Submit
          </button>
        </form>
      </FormProvider>,
      labels,
    ];
  };

  const user = 'User';
  const locale = 'default';
  const formName = 'NICU/Paeds ' + date.toLocaleDateString(locale, { month: 'long' }) + ' Report';

  return (
    <div id="top">
      <div className="container-fluid">
        <div className="row">
          <div className="col-1">
            <SideBar />
          </div>
          <div className="col-11">
            <Header />
            <main className="container">
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

              <div className="row justify-content-center bg-light rounded mt-5 ">
                <div className="col-sm-12">
                  <div
                    id="navbar"
                    className="list-group list-group-horizontal sticky-top justify-content-between bg-white p-2 ps-4 mt-3 shadow-sm"
                    style={{ top: '10px' }}
                  >
                    <div className="list-group list-group-horizontal">
                      <div className="me-2 fs-4 ">Steps: </div>
                      <a className="list-group-item rounded-left" href="#section1">
                        Label 1
                      </a>
                      <a className="list-group-item " href="#section2">
                        Label 2
                      </a>
                      <a className="list-group-item " href="#section3">
                        Label 3
                      </a>
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

                  <FormProvider {...form}>
                    <form className="row p-3 needs-validation" noValidate>
                      <SectionLabel id="section1" text={testData[0].section_label} />
                      <NumberInputField id={uuid()} weight="bold" text="1. How many admitted ?" />

                      {testData[0].section_fields.map((field, idx) => {
                        return (
                          <NumberInputField
                            key={uuid()}
                            id={uuid()}
                            text={idx + '. ' + field.field_label}
                          />
                        );
                      })}
                      <div id="bottom" />
                      <button className="btn btn-primary" type="button" onClick={onSubmit}>
                        Submit
                      </button>
                    </form>
                  </FormProvider>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function getData(): JsonReportDescriptor {
  const items: JsonReportItem[] = nicuJSON.flatMap((section, idx) => {
    const fields: JsonReportItem[] = section.section_fields.map((field): JsonReportItem => {
      if ((field.field_type = 'number'))
        return {
          meta: { type: 'number' },
          description: field.field_label,
          answer: [[field.field_value == undefined ? '' : field.field_value.toString()]],
        };
    });
    fields.push({ meta: { type: 'label' }, description: section.section_label, answer: [] });
    return fields;
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

type SectionProps = {
  name: string;
  items?: any[];
};

function Section(props: SectionProps): JSX.Element {
  return (
    <div>
      <div id={''} style={{ paddingTop: '80px' }}>
        <div className="row justify-content-center">
          <h1>{props.name}</h1>
        </div>
        {props.items.map((i) => (
          <NumberInputField key={uuid()} id={uuid()} />
        ))}
      </div>
    </div>
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
    <div className="row justify-content-center">
      <div className="col-8">
        <h1 id="section1" style={{ paddingTop: '80px' }}>
          {props.text ?? 'Empty Label'}
        </h1>
        <div className="dropdown-divider pb-4" />
      </div>
    </div>
  );
}

type Label = {
  id: string;
  text?: string;
};

type NavBarProps = {
  labels?: [Label];
};

function NavBar(props: { labels?: [any] }) {
  return (
    <div
      id="navbar"
      className="list-group list-group-horizontal sticky-top justify-content-between bg-white p-2 ps-4 mt-3 shadow-sm"
      style={{ top: '10px' }}
    >
      <div className="list-group list-group-horizontal">
        <div className="me-2 fs-4 ">Steps: </div>
        {props.labels.map((label) => {
          <a className="list-group-item rounded-left" href={'#' + label.id}>
            {label.text}
          </a>;
        })}

        <a className="list-group-item " href="#section2">
          Label 2
        </a>
        <a className="list-group-item " href="#section3">
          Label 3
        </a>
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

export default Report;

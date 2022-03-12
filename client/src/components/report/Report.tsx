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
  JsonItemAnswer,
} from 'common/definitions/json_report';
import * as MockApi from './MockApi';

export interface ReportData extends JsonReportDescriptor {
  reportItems: ReportItem[];
  validated?: string;
}

export interface ReportItem extends JsonReportItem {
  validated: boolean;
  valid: boolean;
  errorMessage?: string;
}

type Validation = {
  isValidated: boolean;
  isValid: boolean;
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function Report() {
  const [data, setData] = useState<JsonReportDescriptor>(undefined);
  const [readonly, setReadonly] = useState(false);
  const form = useForm();
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const testData = nicuJSON;

  useEffect(() => {
    const data = MockApi.getData();
    console.log('API');
    console.log(data);
    setData(data);
  }, []);

  const submitData = async (formData: { [key: string]: any }) => {
    const updatedItems = data.items.map((item) => {
      const newItem = { ...item };
      newItem.answer = [formData[item.meta.id]];
      return newItem;
    });
    const newData = { ...data };
    newData.items = updatedItems;
    await MockApi.sendData(newData, 1000).then((data) => {
      setData(data);
      setReadonly(true);
    });
  };

  const onSubmit = async () => {
    //get filled values
    const data = form.getValues();

    //trigger validation on fields
    const result = await form.trigger();
    // if (!result) setValid(false);
    // assemble data to send.
    submitData(data);
  };

  // Demo behavior to show input error messages from server
  const onFailure = async () => {
    //get filled values
    const formData = form.getValues();

    //trigger validation on fields
    const result = await form.trigger();
    // if (!result) setValid(false);
    // assemble data to send.
    const updatedItems = data.items.map((item) => {
      const newItem = { ...item };
      newItem.answer = [formData[item.meta.id]];
      return newItem;
    });
    const newData = { ...data };
    newData.items = updatedItems;
    console.log(newData);
    await MockApi.sendFaultyData(newData, 1000).then((data) => {
      setData(data);
    });
  };

  const handleEditBtnClicked = () => {
    setReadonly(false);
  };

  if (data != undefined) {
    if (data.items != undefined) console.log('B4 render: \n');
    console.log(data.items);
  }

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
                  <FormContents
                    items={data.items as ReportItem[]}
                    onFailure={onFailure}
                    onSubmit={onSubmit}
                    readOnly={readonly}
                    navbarButtons={[
                      <button
                        type="button"
                        className="btn btn-primary bi bi-pencil-square"
                        hidden={!readonly}
                        onClick={() => {
                          setReadonly(false);
                        }}
                      >
                        Edit
                      </button>,
                    ]}
                  />
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

function FormContents(props: {
  items: ReportItem[];
  readOnly: boolean;
  onSubmit?: () => any;
  onFailure?: () => void;
  navbarButtons?: JSX.Element[];
}) {
  const labels: Label[] = [];
  console.log('FORM CONTENT: ');
  console.log(props.items);
  const formElements = (
    <form className="row p-3 needs-validation" noValidate>
      {props.items.map((element, idx) => {
        let value = '0';
        if (element.answer.length > 0) value = element.answer[0];
        switch (element.meta.type) {
          case 'label':
            const label: Label = { id: 'section' + idx, text: element.description };
            labels.push(label);
            return <SectionLabel key={label.id} id={label.id} text={label.text} />;
          case 'number':
            return (
              <NumberInputField
                key={element.meta.id}
                id={element.meta.id}
                text={idx + '. ' + element.description}
                valid={element.valid}
                errorMessage={element.errorMessage}
                value={parseInt(value)}
                readOnly={props.readOnly}
              />
            );
          default:
            <Fragment />;
        }
      })}
      <div id="bottom" />
      <div className="row justify-content-center p-5">
        <button
          className="btn btn-primary col-4"
          type="button"
          onClick={props.onSubmit}
          hidden={props.readOnly}
        >
          Submit
        </button>
      </div>
      {/* DEMO ONLY */}
      <div className="row justify-content-center">
        <button
          className="btn btn-danger col-4"
          type="button"
          onClick={props.onFailure}
          hidden={props.readOnly}
        >
          Test Failed
        </button>
      </div>
    </form>
  );

  return (
    <Fragment>
      <NavBar labels={labels} buttons={props.navbarButtons ?? []} />
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
  valid?: boolean;
  errorMessage?: string;
  readOnly?: boolean;
};

function NumberInputField(props: NumberInputFieldProps): JSX.Element {
  const { register } = useFormContext();
  const { t, i18n } = useTranslation();
  const [dirty, setDirty] = useState(false);
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
  const isInvalid = !props.valid && !dirty;
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
            className={
              (false ? 'form-control-plaintext' : 'form-control') + (isInvalid ? ' is-invalid' : '')
            }
            readOnly={props.readOnly}
            defaultValue={props.value ?? -1}
            {...register(props.id, {
              onChange: (e) => {
                setDirty(true);
              },
            })}
          />
          {isInvalid ? (
            <small className="invalid-feedback">{props.errorMessage ?? 'Error'}</small>
          ) : (
            ''
          )}
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

type NavBarProps = {
  labels: Label[];
  buttons: JSX.Element[];
};

function NavBar(props: NavBarProps) {
  return (
    <div
      id="navbar"
      className="list-group list-group-horizontal sticky-top justify-content-between bg-white p-2 ps-4 mt-3 shadow-sm"
    >
      <div className="list-group list-group-horizontal">
        <div className="me-2 fs-4 ">Steps: </div>
        <a className="list-group-item d-flex justify-content-between" href="#top">
          Start
        </a>
        {props.labels.map((label, idx) => {
          return (
            <a key={label.id} className={'list-group-item'} href={'#' + label.id}>
              {label.text}
            </a>
          );
        })}
        <a className="list-group-item d-flex justify-content-between" href="#bottom">
          Ends
        </a>
      </div>
      <div className="list-group list-group-horizontal justify-content-end align-middle">
        {props.buttons}
      </div>
    </div>
  );
}

export default Report;

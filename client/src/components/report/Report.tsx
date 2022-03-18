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
                <FormProvider {...form}>
                  <FormContents
                    items={data.items as ReportItem[]}
                    onFailure={onFailure}
                    onSubmit={onSubmit}
                    readOnly={readonly}
                    navbarButtons={[,]}
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
  const [section, setSection] = useState(0);
  const labels: Label[] = props.items
    .filter((item) => item.meta.type == 'label')
    .map((item) => {
      return { id: item.meta.id, text: item.description };
    });
  labels.push({ id: '#submit', text: 'Submit' });

  const sections = [];
  props.items.forEach((item) => {
    if (item.meta.type == 'label') {
      sections.push([item]);
    } else {
      const headSection = sections[sections.length - 1];
      headSection.push(item);
    }
  });

  const totalSections = labels.length;
  const onButtonClickHandler: ReportNavButtonClickedHandler = (name: string, section: number) => {
    switch (name) {
      case 'next':
        setSection((section + 1) % totalSections);
        break;
      case 'prev':
        setSection((section - 1) % totalSections);
        break;
      case 'section-clicked':
        setSection(section);
    }
  };

  return (
    <Fragment>
      <NavBar labels={labels} activeLabel={section} onClick={onButtonClickHandler} />
      <Sections itemGroups={sections} activeGroup={section} onClick={onButtonClickHandler} />
    </Fragment>
  );
}

type ReportNavButtonClickedHandler = (name: string, section: number) => void;

function Sections(props: {
  activeGroup: number;
  itemGroups: any[];
  onClick?: ReportNavButtonClickedHandler;
}) {
  const activeGroup = props.activeGroup,
    totalGroups = props.itemGroups.length,
    navButtons = [];

  if (activeGroup > 0) {
    navButtons.push(
      <button
        className="btn btn-primary col-3"
        type="button"
        hidden={false}
        onClick={() => props.onClick('prev', activeGroup)}
        key={uuid()}
      >
        Previous
      </button>,
    );
  }

  if (activeGroup < totalGroups) {
    navButtons.push(
      <button
        className="btn btn-primary col-3"
        type="button"
        hidden={false}
        onClick={() => props.onClick('next', activeGroup)}
        key={uuid()}
      >
        Next
      </button>,
    );
  }

  return (
    <form className="row p-3 needs-validation" noValidate>
      {props.itemGroups.map((item, idx) => {
        return <InputGroup items={item} readOnly={true} active={props.activeGroup == idx} />;
      })}
      <div className="btn-group justify-content-center mt-3">{navButtons}</div>
    </form>
  );
}

type Label = {
  id: string;
  text?: string;
};

function NavBar(props: {
  labels: Label[];
  activeLabel?: number;
  onClick: ReportNavButtonClickedHandler;
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
              onClick={() => props.onClick('section-clicked', idx)}
            >
              {label.text}
            </button>
          );
        })}
      </div>
      <div className="list-group list-group-horizontal justify-content-end align-middle">
        <button key={uuid()} type="button" className="btn btn-primary bi bi-pencil-square">
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
        let value = '0';
        switch (element.meta.type) {
          case 'label':
            const label: Label = { id: 'section' + idx, text: element.description };
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
      <div className="row justify-content-center mt-3">
        <div className="col-8 dropdown-divider" />
      </div>
    </div>
  );
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

export default Report;

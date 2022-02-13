import { useForm } from 'react-hook-form';
import React, { useState, useEffect, Fragment as div } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import SideBar from '../../components/side_bar/side_bar';
import Header from 'components/header/header';
import nicuJSON from './models/nicuModel.json';
import nicuJSONFr from './models/nicuModelFr.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { useTranslation } from 'react-i18next';
import { FieldInputProps } from 'formik';
import * as TestModels from './models/TestModels';
import { toInteger } from 'lodash';

type Item = {
  id: string;
  text?: string;
  indent?: string;
  type?: string;
  value?: string;
};

type Section = {
  title?: string;
  items?: Item[];
};

function Report() {
  const history = useHistory();
  const { t, i18n } = useTranslation();

  useEffect(() => {});

  const sections: Section[] = TestModels.NICU_MODEL.map((section, idx): Section => {
    return {
      title: section.section_label,
      items: section.section_fields.map((item, idx): Item => {
        return {
          id: item.field_id,
          text: item.field_label ?? 'N/A',
          type: item.field_type,
          value: item.field_value ? item.field_value.toString() : '',
          indent: item.field_level ? item.field_level.toString() : '0',
        };
      }),
    };
  });

  const [formState, setFormState] = useState(sections);

  const handleInputChange = (sectionIdx:number, itemIdx:number, value:string) =>{
    formState[sectionIdx].items[itemIdx].value = value
    setFormState(formState)
  }

  const handleSubmit:React.MouseEventHandler<HTMLButtonElement> = ()=>{

  }

  return (
    <div>
      <SideBar />
      <Header />
      <main className="container">
        {/* Render back Button */}
        <div className="d-flex justify-content-start">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              history.goBack();
            }}
          >
            {t('departmentAddBack')}
          </button>
        </div>

        {/* TODO: Render report title */}

        {/* Render date selection. TODO: Relaced with a calendar selection from General report*/}
        <div className="py-3 text-start">
          <span className="lead">{t('departmentAddDate')} </span>
          {/* TODO: Add calendar selection here */}
        </div>

        {/* Render step buttons (sections) */}
        <div className="mb-3 text-start sticky-top bg-light">
          <h4 className="text-primary">{t('departmentFormSteps')} </h4>
          <ul className="list-group list-group-horizontal"></ul>
        </div>

        {/* Render questions and their sections */}
        <div className="row">
          <div className="col-8 mx-auto">
            <div className="row g-2">
              {sections.map((section, idx) => (
                // Key should not be idx
                <Section id={idx} title={section.title ?? 'CYBER CUM'} items={section.items} onChange={handleInputChange} key={idx}/>
              ))}
            </div>

            {/* Render bottom buttons */}
            <div className="btn-group d-flex mb-2">
              <button className="w-100 btn btn-secondary btn-sm">
                {t('departmentFormPrevious')}
              </button>
              <button className="w-100 btn btn-secondary btn-sm">{t('departmentFormNext')}</button>
            </div>

            <button className="w-100 btn btn-primary btn-lg" type="submit" onClick={handleSubmit}>
              {t('departmentFormSubmit')}
            </button>
          </div>
        </div>

        <footer className="my-5 pt-5 text-muted text-center text-small"></footer>
      </main>
    </div>
  );
}

type LabelProps = TextProps;

// Refactor to use BootStrap CSS instead of h6
function Label(props: LabelProps): JSX.Element {
  return <h6 className={'fw-bold ' + props.indent}>{props.text}</h6>;
}

type SectionProps = {
  id:number
  title?: string;
  items?: any[];
  onChange?: (sectionIdx: number, itemIdx: number, value:string) => void;
};

function Section(props: SectionProps): JSX.Element {
  const onChange = props.onChange
  const onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputId = e.currentTarget.id;
    console.log('input changed: id ' + inputId);
    onChange(props.id, toInteger(inputId), e.currentTarget.value)
  };

  return (
    <form>
      <h4 className="mb-3 text-primary"> {props.title} </h4>
      {props.items.map((item:Item, index:number) => {
        switch (item.type) {
          case 'label':
            return <Label text={item.text} indent={item.indent} />;
          default:
            return (
              <InputField
                id={index}
                key={item.id}
                value={item.value}
                type={item.type}
                text={item.text}
                indent={item.indent}
                onChange={onInputChange}
              />
            );
        }
      })}
    </form>
  );
}

enum Indent {
  None = '',
  ONE = 'ps-5',
}

enum FieldTypes {
  Text = 'text',
  Number = 'number',
}

type TextProps = {
  text?: string;
  indent?: string;
};

type InputProps = { type?: string };

type InputFieldProps = TextProps &
  InputProps & {
    id: number;
    value: string;
    onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  };

function InputField(props: InputFieldProps): JSX.Element {
  const defaultState = { valid: true };
  const [state, setState] = useState({});
  const { t, i18n } = useTranslation();
  const inputId = props.id.toString();
  return (
    <div className="form-group row m-3">
      <label className="col-sm-10 col-form-label" htmlFor={inputId}>
        {props.text ?? 'Hello'}
      </label>
      <div className="col-sm-2">
        <input
          id={inputId}
          type={props.type}
          // value={props.value}
          onChange={props.onChange}
          className="form-control"
        />
      </div>
    </div>
  );
}

export default Report;

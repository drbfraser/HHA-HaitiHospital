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
import * as TestModels from './models/TestModels'

function Report() {
  const { register, handleSubmit, reset } = useForm({});
  const [formModel, setFormModel] = useState({});
  const [formValuesComeFrom, setFormValuesComeFrom] = useState<{ name: any; value: any }[]>([]);
  const [formValuesAdCondition, setFormValuesAdCondition] = useState<{ name: any; value: any }[]>(
    [],
  );
  const [formValuesOutCondition, setFormValuesOutCondition] = useState<{ name: any; value: any }[]>(
    [],
  );
  const [sectionState, setSectionState] = useState(0);

  const history = useHistory();
  const { t, i18n } = useTranslation();

  useEffect(() => {});

  const sections: any = Object.values(formModel);
  const fields = [];
  for (var i = 0; i < sections.length; i++) {
    for (var j = 0; j < sections[i].section_fields.length; j++) {
      fields.push(sections[i].section_fields[j]);
    }
  }

  return (
    <div className="form">
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
          <ul className="list-group list-group-horizontal">
            {sections
              ? sections.map((section: any, idx: any) => {
                  var isActive = idx === 0 ? true : false;
                  return (
                    <>
                      <li
                        className={
                          isActive
                            ? 'list-group-item d-flex justify-content-between active'
                            : 'list-group-item d-flex justify-content-between'
                        }
                      >
                        <span>
                          {idx + 1}. {section.section_label}
                        </span>
                      </li>
                    </>
                  );
                })
              : null}
          </ul>
        </div>

        {/* Render questions and their sections */}
        <div className="row g-3">
          <div className="col-sm-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
            <form className="needs-validation">
              <div className="row g-2">
                <Section title='CYBER CUM' items={TestModels.NICU_MODEL}/>
              </div>
            </form>

            {/* Render bottom buttons */}
            <div className="btn-group d-flex mb-2">
              <button
                className="w-100 btn btn-secondary btn-sm"
                disabled={sectionState === 0 ? true : false}
              >
                {t('departmentFormPrevious')}
              </button>
              <button
                className="w-100 btn btn-secondary btn-sm"
                disabled={sectionState === 2 ? true : false}
              >
                {t('departmentFormNext')}
              </button>
            </div>

            <button
              className="w-100 btn btn-primary btn-lg"
              type="submit"
              style={{ display: sectionState === 2 ? '' : 'none' }}
            >
              {t('departmentFormSubmit')}
            </button>
          </div>
        </div>
      </main>

      <footer className="my-5 pt-5 text-muted text-center text-small"></footer>
    </div>
  );
}

enum Indent {
  None = '',
  ONE = 'ps-5',
}

enum FieldTypes {
  Text = 'text',
  Numeric = 'number',
}

type TextProps = {
  text?: string;
  indent?: string;
};

type InputProps = { type?: string };

type InputFieldProps = TextProps &
  InputProps & {
    id: string;
    value: string;
    onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  };

function InputField(props: InputFieldProps): JSX.Element {
  const defaultState = { valid: true };
  const [state, setState] = useState({});
  const { t, i18n } = useTranslation();

  return (
    <div>
      <div className={'col-sm-10 ' + props.indent}>
        <span className="align-middle">{props.text ?? 'Hello'}</span>
      </div>
      <div className="col-sm-2">
        <input id={props.id} type={props.type} value={props.value} className="form-control" />
      </div>
    </div>
  );
}

type LabelProps = TextProps;

// Refactor to use BootStrap CSS instead of h6
function Label(props: LabelProps): JSX.Element {
  return <h6 className={'fw-bold ' + props.indent}>{props.text}</h6>;
}

type SectionProps = { title?: string; items?: any[] };

function Section(props: SectionProps): JSX.Element {

  const onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputId = e.currentTarget.id;
    console.log('input changed: id ' + inputId);
  };

  return (
    <div>
      <h4 className="mb-3 text-primary"> {props.title} </h4>
      {props.items.map((item, index) => {
        switch (item.type) {
          case 'label':
            return <Label text={item.text} indent={item.indent} />;
          case 'input':
            return (
              <InputField
                id={index.toString()}
                value={item.value}
                type={item.type}
                text={item.text}
                indent={item.indent}
                onChange={onInputChange}
              />
            );
        }
      })}
    </div>
  );
}

export default Report;

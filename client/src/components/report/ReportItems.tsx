import { FormProvider, useForm, useFormContext, UseFormReturn } from 'react-hook-form';
import React, { useState, useEffect, Fragment } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { useTranslation } from 'react-i18next';
import { ItemType } from 'common/definitions/json_report';
import { ReportItem } from './Report';

export type NumberInputFieldProps = {
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

type Label = {
    id: string;
    text?: string;
};

export function InputGroup(props: { items: ReportItem[]; readOnly: boolean; active: boolean }) {
  return (
    <div hidden={!props.active}>
      {props.items.map((element, idx) => {
        switch (element.type) {
          case 'label':
            const label: Label = { id: 'section' + idx, text: element.description };
            return <SectionLabel key={label.id} id={label.id} text={label.text} />;
          case ItemType.N:
            let value = element.answer[0][0];
            return (
              <NumberInputField
                key={(element as ReportItem).id}
                id={(element as ReportItem).id}
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

export function NumberInputField(props: NumberInputFieldProps): JSX.Element {
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

export function SectionLabel(props: { id?: string; text?: string }) {
  return (
    <div id={props.id} className="row justify-content-center">
      <div className="col-8 mt-5">
        <h1 style={{ paddingTop: '' }}>{props.text ?? 'Empty Label'}</h1>
        <div className="dropdown-divider pb-4" />
      </div>
    </div>
  );
}

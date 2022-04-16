import { FormProvider, useForm, useFormContext, UseFormReturn } from 'react-hook-form';
import React, { useState, useEffect, Fragment } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { useTranslation } from 'react-i18next';
import { ItemType } from 'common/json_report';
import { ReportItem } from './Report';

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
          case ItemType.NUMERIC:
            let value = element.answer[0][0];
            return (
              <NumberInputField
                key={(element as ReportItem).id}
                item={element as ReportItem}
                readonly={props.readOnly}
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

export function NumberInputField(props: {item: ReportItem, readonly: boolean}): JSX.Element {
  const { register, formState, clearErrors } = useFormContext();
  const { t, i18n } = useTranslation();
  const item = props.item
  const text = item.description ?? 'N/A';
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
  const invalid: boolean = formState.errors[item.id];
  const errorMessage = formState.errors[item.id]?.message;
  const weight = ''
  const indent = false
  const isHeader = ''
  const defaultValue = item.answer[0][0]
  return (
    <div className="row justify-content-center ">
      <div className="form-group row col-sm-12 col-lg-6 col-xl-6 p-1 m-1">
        <label
          className={
            'col-sm-8 col-form-label align-middle' +
            getWeightCss(weight) +
            (indent ? ' ps-5' : '')
          }
          htmlFor={item.id}
        >
          {isHeader ? <h5>{text}</h5> : text}
        </label>

        <div className="col-sm-4">
          <input
            id={item.id}
            type={'number'}
            className={'form-control' + (invalid ? ' is-invalid' : '')}
            readOnly={props.readonly}
            defaultValue={defaultValue}
            {...register(item.id, {
              required: true,
              onChange: () => {
                clearErrors(item.id);
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

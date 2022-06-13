import { useFormContext } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
// import { useTranslation } from 'react-i18next';
import { ItemType } from 'common/json_report';
import { ReportItem } from './Report';

type Label = {
  id: string;
  text?: string;
};

export function ItemGroup(props: { items: ReportItem[]; readOnly: boolean; active: boolean }) {
  return (
    <div className="row justify-content-center " hidden={!props.active}>
      {makeItems(props.items, props.readOnly, false)}
    </div>
  );
}

function makeItems(items: ReportItem[], readonly: boolean, indent: boolean): JSX.Element[] {
  return items.map((element, idx) => {
    switch (element.type) {
      case 'label':
        const label: Label = { id: 'section' + idx, text: element.description };
        return <SectionLabel key={label.id} id={label.id} text={label.text} />;
      case ItemType.NUMERIC:
        return (
          <Field
            key={(element as ReportItem).id}
            item={element as ReportItem}
            readonly={readonly}
            indent={indent}
            prefix={idx.toString()}
          />
        );
      case ItemType.SUM:
        return (
          <Field
            key={(element as ReportItem).id}
            item={element as ReportItem}
            readonly={readonly}
            indent={indent}
            prefix={idx.toString()}
          />
        );
      case ItemType.EQUAL:
        return (
          <Field
            key={(element as ReportItem).id}
            item={element as ReportItem}
            readonly={readonly}
            indent={indent}
            header={true}
            prefix={''}
          />
        );
      case ItemType.GROUP:
        return (
          <Group
            key={(element as ReportItem).id}
            item={element as ReportItem}
            readonly={readonly}
          />
        );
      default:
        throw new Error('Item is not supported');
    }
  });
}

export function Field(props: {
  item: ReportItem;
  readonly: boolean;
  prefix?: string;
  indent?: boolean;
  header?: boolean;
}): JSX.Element {
  const { register, formState, clearErrors } = useFormContext();
  //   Put back when translation is available
  //   const { t, i18n } = useTranslation();
  const item = props.item;
  const prefix = props.prefix + (props.prefix !== undefined && props.prefix !== '' ? '. ' : '');
  const text = prefix + item.description ?? 'N/A';
  const defaultValue = item.answer[0][0];
  let children = [];
  if (props.item.items !== undefined) children = props.item.items;

  const invalid: boolean = formState.errors[item.id];
  const errorMessage = formState.errors[item.id]?.message;

  const indent = props.indent ? 'ps-5' : '';
  const font = props.header ? 'font-weight-bold' : 'font-weight-normal';
  const labelFormatting = ['col-xl-9 col-form-label align-middle', font, indent].join(' ');
  return (
    <>
      <div className="form-group row col-sm-12 col-lg-6 col-xl-7 p-1 m-1">
        <label className={labelFormatting} htmlFor={item.id}>
          {text}
        </label>

        <div className="col-xl-3">
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
      {makeItems(children, props.readonly, true)}
    </>
  );
}

function Group(props: { item: ReportItem; readonly: boolean; indent?: boolean }) {
  const indent = props.indent ?? 'ps-5 fw-bold';
  const formatting = [indent].join(' ');
  return (
    <>
      <div className="col-sm-12 col-lg-6 col-xl-7 p-1 m-1">
        <h6 className={formatting}>{props.item.description}</h6>
      </div>
      {makeItems(props.item.items as ReportItem[], props.readonly, true)}
    </>
  );
}

export function SectionLabel(props: { id?: string; text?: string }) {
  return (
    <div className="col-8 mt-5">
      <h1 style={{ paddingTop: '' }}>{props.text ?? 'Empty Label'}</h1>
      <div className="dropdown-divider pb-4" />
    </div>
  );
}

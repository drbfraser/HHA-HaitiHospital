import { ClearFilterButton, FILTER_DEFAULT_VALUE, FilterProps } from './Filter';
import { Form, InputGroup } from 'react-bootstrap';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '@tanstack/react-table';

export const FILTER_FUNCTIONS = {
  contains: (row: Row<any>, columnId: string, value: any) => {
    const cellValue = getNestedCellValue(row, columnId);
    console.log('contains', cellValue.toLowerCase(), value.toLowerCase());
    return cellValue.toLowerCase().includes(value.toLowerCase());
  },

  equal: (row: Row<any>, columnId: string, value: any) => {
    const cellValue = getNestedCellValue(row, columnId);
    return cellValue.toLowerCase() === value.toLowerCase();
  },

  startsWith: (row: Row<any>, columnId: string, value: any) => {
    const cellValue = getNestedCellValue(row, columnId);
    return cellValue.toLowerCase().startsWith(value.toLowerCase());
  },

  endsWith: (row: Row<any>, columnId: string, value: any) => {
    const cellValue = getNestedCellValue(row, columnId);
    return cellValue.toLowerCase().endsWith(value.toLowerCase());
  },
};

interface CellObject {
  name: string;
}

function getNestedCellValue(row: Row<any>, columnId: string) {
  const cellValue = row.getValue(columnId);

  // object consists of a display name and a value
  if (cellValue && typeof cellValue === 'object' && 'name' in cellValue) {
    return (cellValue as CellObject).name.toLowerCase();
  }

  if (typeof cellValue === 'string') {
    return cellValue.toLowerCase();
  }

  return JSON.stringify(cellValue as any)?.toString() || '';
}

export const StringFilter = ({
  placeholder,
  setFilterFn = (_) => {},
  allowFilterFnChange = false,
  setFilterValue,
  filterValue = FILTER_DEFAULT_VALUE.STRING,
  inputProps,
}: FilterProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    setFilterFn(FILTER_FUNCTIONS.contains);
  }, [setFilterFn]);

  const value: string = (filterValue as string) ?? FILTER_DEFAULT_VALUE.STRING;

  return (
    <>
      <InputGroup className="my-2" {...inputProps}>
        <Form.Control
          type="text"
          onChange={(e) => {
            setFilterValue(e.target.value);
          }}
          value={value}
          placeholder={placeholder}
        />
        <ClearFilterButton
          setFilterValue={setFilterValue}
          filterValue={filterValue}
          initialValue={FILTER_DEFAULT_VALUE.STRING}
        />
      </InputGroup>
      {allowFilterFnChange && (
        <Form.Select
          onChange={(e) => {
            switch (e.target.value) {
              case '1':
                setFilterFn(FILTER_FUNCTIONS.equal);
                break;
              case '2':
                setFilterFn(FILTER_FUNCTIONS.startsWith);
                break;
              case '3':
                setFilterFn(FILTER_FUNCTIONS.endsWith);
                break;
              default:
                setFilterFn(FILTER_FUNCTIONS.contains);
                break;
            }
            setFilterValue(filterValue);
          }}
          {...inputProps}
        >
          <option>{t('StringFilter.Contains')}</option>
          <option value="1">{t('StringFilter.Equals')}</option>
          <option value="2">{t('StringFilter.StartsWith')}</option>
          <option value="3">{t('StringFilter.EndsWith')}</option>
        </Form.Select>
      )}
    </>
  );
};

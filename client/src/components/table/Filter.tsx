import { Button, Form, InputGroup } from 'react-bootstrap';

import { Row } from '@tanstack/react-table';

export const stringFilterFn = {
  contains: (row, columnId, value) =>
    row.getValue(columnId).toLowerCase().includes(value.toLowerCase()),

  equal: (row, columnId, value) => row.getValue(columnId).toLowerCase() === value.toLowerCase(),

  startsWith: (row, columnId, value) =>
    row.getValue(columnId).toLowerCase().startsWith(value.toLowerCase()),

  endsWith: (row, columnId, value) =>
    row.getValue(columnId).toLowerCase().endsWith(value.toLowerCase()),
};

interface FilterProps {
  placeholder: string;
  setFilterFn?: (fn: (row: Row<any>, columnId: string, value: string) => boolean) => void;
  allowFilterFnChange?: boolean;
  setFilterValue: (value: string) => void;
  filterValue: string;
  inputProps?: any;
}

const Filter = ({
  placeholder,
  setFilterFn = (_) => {},
  allowFilterFnChange = false,
  setFilterValue,
  filterValue,
  inputProps,
}: FilterProps) => (
  <>
    <InputGroup className="my-2" {...inputProps}>
      <Form.Control
        type="text"
        onChange={(e) => {
          setFilterValue(e.target.value);
        }}
        value={filterValue}
        placeholder={placeholder}
      />
      {filterValue && (
        <Button
          size="sm"
          variant="light text-danger"
          onClick={() => setFilterValue('')}
          title="clear"
        >
          &#x2715;
        </Button>
      )}
    </InputGroup>
    {allowFilterFnChange && (
      <Form.Select
        onChange={(e) => {
          switch (e.target.value) {
            case '1':
              setFilterFn(stringFilterFn.equal);
              break;
            case '2':
              setFilterFn(stringFilterFn.startsWith);
              break;
            case '3':
              setFilterFn(stringFilterFn.endsWith);
              break;
            default:
              setFilterFn(stringFilterFn.contains);
              break;
          }
          setFilterValue(filterValue);
        }}
        {...inputProps}
      >
        <option>Contains</option>
        <option value="1">Equals</option>
        <option value="2">Starts With</option>
        <option value="3">Ends With</option>
      </Form.Select>
    )}
  </>
);

export default Filter;

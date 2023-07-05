import { Button, Form, InputGroup } from 'react-bootstrap';

import { FilterProps } from './Filter';

export const numberFilterFn = {
  equal: (row, columnId, value) => row.getValue(columnId) === value,

  greaterThan: (row, columnId, value) => row.getValue(columnId) > value,

  lessThan: (row, columnId, value) => row.getValue(columnId) < value,
};

export const NumberFilter = ({
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
        type="number"
        onChange={(e) => {
          setFilterValue(e.target.value);
        }}
        value={filterValue as number}
        placeholder={placeholder}
      />
      {filterValue && (
        <Button
          size="sm"
          variant="light text-danger border border-right border-top border-bottom"
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
              setFilterFn(numberFilterFn.greaterThan);
              break;
            case '2':
              setFilterFn(numberFilterFn.lessThan);
              break;
            default:
              setFilterFn(numberFilterFn.equal);
              break;
          }
          setFilterValue(filterValue);
        }}
        {...inputProps}
      >
        <option>Equals</option>
        <option value="1">Greater Than</option>
        <option value="2">Less Than</option>
      </Form.Select>
    )}
  </>
);

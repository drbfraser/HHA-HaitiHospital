import { Dropdown, DropdownButton, DropdownItemText, Form, Row } from 'react-bootstrap';
import { DropDown } from './DropdownMenu';
import { InputGroup } from 'react-bootstrap';
import { ChangeEvent } from 'react';

type DropDownMultiSelectProps = {
  dropDowns: string[];
  title: string;
  selectedDropDowns: string[];
  setSelectedDropDowns: (event: ChangeEvent<HTMLInputElement>) => void;
};
export const DropDownMultiSelect = ({
  dropDowns,
  title,
  selectedDropDowns,
  setSelectedDropDowns,
}: DropDownMultiSelectProps) => {
  return (
    <DropdownButton title={title} variant="outline-dark" autoClose="outside">
      {dropDowns.map((dropDown) => {
        return (
          <Dropdown.Item key={dropDown}>
            <div
              className="d-flex flex-row align-items-center"
              // this enables the checkbox input (direct child) to be checked by preventing this parent element from bubbling down on click events to input checkbox
              onClick={(e) => e.stopPropagation()}
            >
              <input
                id={dropDown}
                type="checkbox"
                className="mr-2"
                style={{ width: '15px', height: '15px' }}
                checked={selectedDropDowns.includes(dropDown)}
                onChange={setSelectedDropDowns}
              />
              <span>{dropDown}</span>
            </div>
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
};

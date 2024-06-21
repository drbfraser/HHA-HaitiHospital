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
      {dropDowns.map((dropDown, index) => {
        return (
          <Dropdown.Item key={index}>
            <div className="d-flex flex-row align-items-center">
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

import { Dropdown, DropdownButton, DropdownItemText, Form, Row } from 'react-bootstrap';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

type DepartmentDropDownProps = {
  dropDowns: string[];
  title: string;
  selectedDropDowns: string[];
  setSelectedDropDowns: (event: ChangeEvent<HTMLInputElement>) => void;
};
export const DepartmentDropDown = ({
  dropDowns,
  title,
  selectedDropDowns,
  setSelectedDropDowns,
}: DepartmentDropDownProps) => {
  const { t } = useTranslation();
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

              <span>
                {
                  //technical debt, the translation for departments should come from the backend
                  t(`departments.${dropDown}`)
                }
              </span>
            </div>
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
};

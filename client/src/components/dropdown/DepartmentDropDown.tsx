import { Dropdown, DropdownButton, DropdownItemText, Form, Row } from 'react-bootstrap';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

type DepartmentDropDownProps = {
  dropDowns: string[];
  title: string;
  selectedDropDowns: string[];
  setSelectedDropDowns: (event: React.MouseEvent<HTMLElement>) => void;
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
              id={dropDown}
              className="d-flex flex-row align-items-center"
              onClick={setSelectedDropDowns}
            >
              <input
                type="checkbox"
                className="mr-2"
                style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                checked={selectedDropDowns.includes(dropDown)}
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

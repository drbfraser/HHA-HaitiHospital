import { useState } from 'react';
import { Dropdown, DropdownButton, DropdownItemText } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const DropDownMenus = {
  timeStep: ['month', 'year'],
  aggregateBy: ['month', 'year'],
  charts: ['bar', 'line'],
};

type DropDownProps = {
  menus: string[];
  title: string;
  selectedMenu: string;
  setDropDownMenu: (menu: string) => void;
};
export const DropDown = ({ menus, title, selectedMenu, setDropDownMenu }: DropDownProps) => {
  const { t } = useTranslation();

  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={t(`dropdown.${selectedMenu}`)}
      variant="outline-dark"
      onSelect={(menuSelected) => setDropDownMenu(menuSelected!)}
    >
      <DropdownItemText>{title}</DropdownItemText>
      {menus.map((dropDownMenu, index) => {
        return (
          <Dropdown.Item key={index} eventKey={dropDownMenu}>
            {t(`dropdown.${dropDownMenu}`)}
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
};

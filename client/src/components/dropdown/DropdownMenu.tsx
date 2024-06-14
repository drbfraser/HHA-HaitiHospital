import { useState } from 'react';
import { Dropdown, DropdownButton, DropdownItemText } from 'react-bootstrap';

export const DropDownMenus = {
  timeStep: ['month', 'year'],
  aggregateBy: ['month', 'year'],
  charts: ['Bar', 'Line', 'Pie', 'Stacked Bar'],
};

type DropDownProps = {
  menus: string[];
  title: string;
  selectedMenu: string;
  setDropDownMenu: (menu: string) => void;
};
export const DropDown = ({ menus, title, selectedMenu, setDropDownMenu }: DropDownProps) => {
  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={selectedMenu}
      variant="outline-dark"
      onSelect={(menuSelected) => setDropDownMenu(menuSelected!)}
    >
      <DropdownItemText>{title}</DropdownItemText>
      {menus.map((dropDownMenu, index) => {
        return (
          <Dropdown.Item key={index} eventKey={dropDownMenu}>
            {dropDownMenu}
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
};

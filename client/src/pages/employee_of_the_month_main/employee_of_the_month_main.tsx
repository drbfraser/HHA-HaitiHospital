import { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps, Link, useHistory } from 'react-router-dom';
import { Role } from 'constants/interfaces';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import ModalDelete from 'components/popup_modal/popup_modal_delete';
import axios from 'axios';
import { toast } from 'react-toastify';
import './employee_of_the_month.css';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'Context';
import { renderBasedOnRole } from 'actions/roleActions';
import i18n from 'i18next';

interface EmployeeOfTheMonthMainProps extends RouteComponentProps {}

export const EmployeeOfTheMonthMain = (props: EmployeeOfTheMonthMainProps) => {
  const { t: translateText } = useTranslation();

  return (
    <div className={'employee-of-the-month-main'}>
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
      </main>
    </div>
  );
};

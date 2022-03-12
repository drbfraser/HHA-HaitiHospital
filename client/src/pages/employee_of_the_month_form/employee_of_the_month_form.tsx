import { useState } from 'react';
import { RouteComponentProps, Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { EmployeeOfTheMonth as EmployeeOfTheMonthModel } from './EmployeeOfTheMonthModel';
import axios from 'axios';
import './employee_of_the_month_form.css';
import { useTranslation } from 'react-i18next';
import DbErrorHandler from 'actions/http_error_handler';
import { toast } from 'react-toastify';

interface EmployeeOfTheMonthFormProps extends RouteComponentProps {}

export const EmployeeOfTheMonthForm = (props: EmployeeOfTheMonthFormProps) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const { register, handleSubmit, reset } = useForm<EmployeeOfTheMonthModel>({});
  const history = useHistory();

  const onSubmit = async (data: any) => {
    let formData = new FormData();
    let postData = JSON.stringify(data);
    formData.append('document', postData);
    formData.append('file', selectedFile);

    await axios
      .post('/api/employee-of-the-month', formData)
      .then(() => {
        toast.success('Employee of the month successfully updated!');
        reset({});
        setSelectedFile(null);
        props.history.push('/employee-of-the-month');
      })
      .catch((error: any) => {
        DbErrorHandler(error, history);
      });
  };

  return (
    <div className="employee-of-the-month-form">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <div className="ml-3 mb-3 d-flex justify-content-start">
          <Link to="/employee-of-the-month">
            <button type="button" className="btn btn-outline-dark">
              {t('employeeOfTheMonthBack')}
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

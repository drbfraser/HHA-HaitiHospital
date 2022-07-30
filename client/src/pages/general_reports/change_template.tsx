import { useEffect, useState } from 'react';
import { RouteComponentProps, Link, useHistory } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from 'actions/Api';
import './general_reports_styles.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { TOAST_TEMPLATE_PUT } from 'constants/toast_messages';
import { Department, GeneralDepartment } from 'constants/interfaces';
import { ENDPOINT_DEPARTMENT_GET } from 'constants/endpoints';
import { createDepartmentMap } from 'utils/departmentMapper';
import { ResponseMessage } from 'utils/response_message';
import { History } from 'history';

interface ChangeTemplateProps extends RouteComponentProps {}

export const ChangeTemplate = (props: ChangeTemplateProps) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File>(null);
  const history: History = useHistory<History>();
  const [department, setDepartment] = useState(null);
  const [departments, setDepartments] = useState<Map<string, Department>>(undefined);

  useEffect(() => {
    const getDepartments = async () => {
      setDepartments(
        createDepartmentMap(
          await Api.Get(
            ENDPOINT_DEPARTMENT_GET,
            ResponseMessage.getMsgFetchDepartmentsFailed(),
            history,
          ),
        ),
      );
    };
    getDepartments();
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData : FormData = new FormData();
    let body : Object = { "department" : department }
    let data = JSON.stringify(body);
    formData.append('document', data);
    formData.append('file', selectedFile);

    // TODO: to connect to the backend after we figure out how the backend should work
    // await Api.Put(
    //   ENDPOINT_TEMPLATE_PUT,
    //   formData,
    //   onSubmitActions,
    //   TOAST_TEMPLATE_PUT,
    //   props.history,
    // );
  };

  const onSubmitActions = () => {
    toast.success('Template successfully updated!');
    setSelectedFile(null);
    props.history.push('/general-reports');
  };

  return (
    <div className={'general-reports'}>
      <SideBar />

      <main className="container-fluid main-region">
        <Header />
        <div className="ml-3 mb-3 d-flex justify-content-start">
          <Link to="/general-reports">
            <button type="button" className="btn btn-outline-dark">
              {t('Back')}
            </button>
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={`form-group col-md-6`}>
            <div className="mb-3">
              <label htmlFor="department" className="form-label">
                {t('Department')}
              </label>
              <select
                className="form-select"
                id="department"
                defaultValue={null}
                required
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="" hidden>
                  {"Select Department"}
                </option>
                {departments && Array.from(departments.values()).map((dept: Department, index: number) => {
                  return dept.name !== GeneralDepartment && (
                    <option key={index} value={dept.name}>
                      {dept.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <label className="form-label">{t('Upload New Template')}</label>
            <input
              type="file"
              accept=".json"
              className="form-control"
              id="customFile"
              required
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <div className="mt-3 mb-5">
              <button className="btn btn-primary" type="submit">
                {t('Submit Template')}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

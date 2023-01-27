import { FormEvent, useState } from 'react';
import { RouteComponentProps, Link, useHistory } from 'react-router-dom';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import './general_reports_styles.css';
import { useTranslation } from 'react-i18next';
import { Department, GeneralDepartment } from 'constants/interfaces';
import { History } from 'history';
import { useDepartmentMap } from 'hooks';

interface ChangeTemplateProps extends RouteComponentProps {}

export const ChangeTemplate = (props: ChangeTemplateProps) => {
  const { t } = useTranslation();
  const [templateFile, setTemplateFile] = useState<File>(null);
  const history: History = useHistory<History>();
  const [department, setDepartment] = useState<Department>(null);
  const departments = useDepartmentMap();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const fileContent: string = await templateFile.text();
    // const fileContentObject: object = JSON.parse(fileContent);

    // not connected to the backend API at the moment as we haven't figured out
    // the API implementation and what to do with the old implementation
    // TODO: to connect to the backend after we figure out how the backend should work
    // await Api.Put(
    //   ENDPOINT_TEMPLATE_PUT,
    //   data,
    //   onSubmitActions,
    //   TOAST_TEMPLATE_PUT,
    //   props.history,
    // );
  };

  // const onSubmitActions = () => {
  //   toast.success('Template successfully updated!');
  //   setTemplateFile(null);
  //   props.history.push('/general-reports');
  // };

  return (
    <div className={'general-reports'}>
      <SideBar />

      <main className="container-fluid main-region">
        <Header />
        <div className="ml-3 mb-3 d-flex justify-content-start">
          <Link to="/general-reports">
            <button type="button" className="btn btn-outline-dark">
              {t('button.back')}
            </button>
          </Link>
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className={`form-group col-md-6`}>
            <div className="mb-3">
              <label htmlFor="department" className="form-label">
                {t('template.department')}
              </label>
              <select
                className="form-select"
                id="department"
                defaultValue={null}
                required
                onChange={(e) => setDepartment(departments.get(e.target.value))}
              >
                <option value="" hidden>
                  {t('template.select_department')}
                </option>
                {departments &&
                  Array.from(departments.values()).map((dept: Department, index: number) => {
                    return (
                      dept.name !== GeneralDepartment && (
                        <option key={index} value={dept.name}>
                          {dept.name}
                        </option>
                      )
                    );
                  })}
              </select>
            </div>
            <label className="form-label">{t('template.upload_template')}</label>
            <input
              type="file"
              accept=".json"
              className="form-control"
              id="customFile"
              required
              onChange={(e) => setTemplateFile(e.target.files[0])}
            />
            <div className="mt-3 mb-5">
              <button className="btn btn-primary" type="submit">
                {t('button.submit')}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

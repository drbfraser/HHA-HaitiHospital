import { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps, Link, useHistory } from 'react-router-dom';
import { Role } from 'constants/interfaces';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import axios from 'axios';
import { toast } from 'react-toastify';
import { renderBasedOnRole } from 'actions/roleActions';
import './biomechanical.css';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'Context';
import i18n from 'i18next';

interface BiomechanicalPageProps extends RouteComponentProps {}

export const BiomechanicalPage = (props: BiomechanicalPageProps) => {
  const { t } = useTranslation();
  const [BioReport, setBioReport] = useState([]);
  const authState = useAuthState();
  const history = useHistory();
  const BioReportUrl = `/api/biomech/`;

  const getBioReport = useCallback(async () => {
    const res = await axios.get(BioReportUrl);
    setBioReport(res.data);
  }, [BioReportUrl]);

  const deleteBioMech = async (id: string) => {
    try {
      if (!window.confirm(i18n.t('bioSupportAlertDeleteAlert'))) {
        throw new Error('Deletion cancelled');
      }
      toast.success('Bio Mech request deleted!');
      await axios.delete(BioReportUrl.concat(`/${id}`));
      getBioReport();
    } catch (err) {
      toast.error('Unable to delete Bio Mech Request!');
    }
  };

  useEffect(() => {
    getBioReport();
  }, [getBioReport]);

  return (
    <div className="biomechanical_page">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />

        <section>
          <div className="row my-2 justify-items-center">
            <div className="col-sm-6 col-md-6 col-lg-6">
              <Link to={'/biomechanic/report_broken_kit'}>
                <button type="button" className="btn btn-outline-dark">
                  {t('bioSupportReportBrokenKit')}
                </button>
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mt-3">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">{t('bioSupportReportPriority')}</th>
                    <th scope="col">{t('bioSupportReportAuthor')}</th>
                    <th scope="col">{t('bioSupportReportCreated')}</th>
                    <th scope="col">{t('bioSupportReportOptions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {BioReport.map((item, index) => {
                    return (
                      <tr key={item._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.equipmentPriority}</td>
                        <td>{item.user ? item.user.name : '[deleted]'}</td>
                        <td>
                          {new Date(item.createdAt).toLocaleString('en-US', {
                            timeZone: 'America/Cancun',
                          })}
                        </td>
                        <td>
                          <button
                            className="btn btn-link text-decoration-none d-inline"
                            onClick={() => history.push(`/biomechanic/view/${item._id}`)}
                          >
                            {t('brokenKitReportView')}
                          </button>
                          {renderBasedOnRole(authState.userDetails.role, [
                            Role.Admin,
                            Role.MedicalDirector,
                          ]) ? (
                            <button
                              className="btn btn-link text-decoration-none d-inline"
                              onClick={() => deleteBioMech(item._id)}
                            >
                              {t('brokenKitReportDelete')}
                            </button>
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

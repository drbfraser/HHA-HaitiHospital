import { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps, Link, useHistory } from 'react-router-dom';
import { Role } from 'constants/interfaces';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import axios from 'axios';
import { toast } from 'react-toastify';
import './case_study_main_styles.css';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'Context';
import { renderBasedOnRole } from 'actions/roleActions';
import i18n from 'i18next';

interface CaseStudyMainProps extends RouteComponentProps {}

export const CaseStudyMain = (props: CaseStudyMainProps) => {
  const [caseStudies, setCaseStudies] = useState([]);
  const authState = useAuthState();
  const history = useHistory();
  const caseStudiesUrl = '/api/case-studies';

  const getCaseStudies = useCallback(async () => {
    const res = await axios.get(caseStudiesUrl);
    setCaseStudies(res.data);
  }, [caseStudiesUrl]);

  const deleteCaseStudy = async (id: string) => {
    try {
      if (!window.confirm('Are you sure you want to delete this case study?')) {
        throw new Error('Deletion cancelled');
      }
      toast.success('Case Study deleted!');
      await axios.delete(caseStudiesUrl.concat(`/${id}`));
      getCaseStudies();
    } catch (err) {
      toast.error('Error: Unable to delete Case Study!');
    }
  };

  useEffect(() => {
    getCaseStudies();
  }, [getCaseStudies]);

  const { t: translateText } = useTranslation();

  return (
    <div className={'case-study-main'}>
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <div className="d-flex justify-content-start">
          <Link to="/case-study/form">
            <button type="button" className="btn btn-outline-dark">
              {translateText('caseStudyMainAddCaseStudy')}
            </button>
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mt-3">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{translateText('caseStudyMainCaseStudyType')}</th>
                <th scope="col">{translateText('caseStudyMainAuthor')}</th>
                <th scope="col">{translateText('caseStudyMainCreated')}</th>
                <th scope="col">{translateText('caseStudyMainLink')}</th>
              </tr>
            </thead>
            <tbody>
              {caseStudies.map((item, index) => {
                return (
                  <tr key={item._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{i18n.t(item.caseStudyType)}</td>
                    <td>{item.user ? item.user.name : '[deleted]'}</td>
                    <td>
                      {new Date(item.createdAt).toLocaleString('en-US', {
                        timeZone: 'America/Los_Angeles',
                      })}
                    </td>
                    <td>
                      <button
                        className="btn btn-link text-decoration-none"
                        onClick={() => history.push(`/case-study/view/${item._id}`)}
                      >
                        {translateText('caseStudyMainViewCaseStudy') + ' '}
                      </button>

                      {renderBasedOnRole(authState.userDetails.role, [
                        Role.Admin,
                        Role.MedicalDirector,
                      ]) ? (
                        <button
                          className="btn btn-link text-decoration-none"
                          onClick={() => deleteCaseStudy(item._id)}
                        >
                          {translateText('caseStudyMainDelete') + ' '}
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

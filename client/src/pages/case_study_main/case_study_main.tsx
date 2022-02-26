import { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps, Link, useHistory } from 'react-router-dom';
import { Role } from 'constants/interfaces';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import ModalDelete from 'components/popup_modal/popup_modal_delete';
import axios from 'axios';
import { toast } from 'react-toastify';
import './case_study_main_styles.css';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'Context';
import { renderBasedOnRole } from 'actions/roleActions';
import i18n from 'i18next';

interface CaseStudyMainProps extends RouteComponentProps {}

export const CaseStudyMain = (props: CaseStudyMainProps) => {
  const DEFAULT_INDEX: string = '';
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>(DEFAULT_INDEX);
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
      toast.success('Case Study deleted!');
      await axios.delete(caseStudiesUrl.concat(`/${id}`));
      getCaseStudies();
    } catch (err) {
      toast.error('Error: Unable to delete Case Study!');
    }
  };

  const featureCaseStudy = async (id: string) => {
    try {
      toast.success('Featured case study has now changed!');
      await axios.patch(caseStudiesUrl.concat(`/${id}`));
      getCaseStudies();
    } catch (err) {
      toast.error('Error: Unable to set new featured Case Study!');
    }
  };

  const onDeleteCaseStudy = (event: any, id: string) => {
    event.stopPropagation();
    event.preventDefault();
    setCurrentIndex(id);
    setDeleteModal(true);
  };

  const onModalClose = () => {
    setCurrentIndex(DEFAULT_INDEX);
    setDeleteModal(false);
  };

  const onModalDelete = (id: string) => {
    deleteCaseStudy(id);
    setDeleteModal(false);
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
        <ModalDelete
          currentItem={currentIndex}
          show={deleteModal}
          item={'case study'}
          onModalClose={onModalClose}
          onModalDelete={onModalDelete}
        ></ModalDelete>
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
                        timeZone: 'America/Cancun',
                      })}
                    </td>
                    <td>
                      <button
                        className="btn btn-link text-decoration-none"
                        onClick={() => history.push(`/case-study/view/${item._id}`)}
                      >
                        {translateText('caseStudyMainViewCaseStudy').concat(' ')}
                      </button>

                      {renderBasedOnRole(authState.userDetails.role, [
                        Role.Admin,
                        Role.MedicalDirector,
                      ]) ? (
                        <button
                          className="btn btn-link text-decoration-none"
                          onClick={(event) => {
                            onDeleteCaseStudy(event, item._id);
                          }}
                        >
                          {translateText('caseStudyMainDelete').concat(' ')}
                        </button>
                      ) : null}

                      {renderBasedOnRole(authState.userDetails.role, [
                        Role.Admin,
                        Role.MedicalDirector,
                      ]) ? (
                        <button
                          className="btn btn-link text-decoration-none"
                          disabled={item.featured}
                          style={item.featured ? { fontStyle: 'italic' } : {}}
                          onClick={() => (item.featured ? undefined : featureCaseStudy(item._id))}
                        >
                          {item.featured
                            ? translateText('caseStudyMainUnFeatured')
                            : translateText('caseStudyMainFeatured')}
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

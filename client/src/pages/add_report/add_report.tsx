import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import NICUForm from 'pages/form/nicu_form';
import MaternityForm from 'pages/form/maternity_form';
import RehabForm from 'pages/form/rehab_form';
import CommunityForm from 'pages/form/community_form';
import MockDepartmentApi from 'actions/MockDepartmentApi';
import initialDepartments from 'utils/json/departments.json';
import { Department } from 'constants/interfaces';
import { History } from 'history';

const AddReport = () => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments.departments);
  const history: History = useHistory<History>();
  const { deptId } = useParams<{ deptId: string }>();

  useEffect(() => {
    // For Future Devs: Replace MockDepartmentApi with Api
    setDepartments(MockDepartmentApi.getDepartments());
  }, []);

  try {
    switch (deptId) {
      case departments[0].id:
        return <RehabForm></RehabForm>;
      case departments[1].id:
        return <NICUForm></NICUForm>;
      case departments[2].id:
        return <MaternityForm></MaternityForm>;
      case departments[3].id:
        return <CommunityForm></CommunityForm>;
    }
  } catch (e) {
    history.push('/notFound');
  }
};

export default AddReport;

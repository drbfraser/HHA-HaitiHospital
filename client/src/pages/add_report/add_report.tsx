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
  const [department, setDepartment] = useState<Department>(initialDepartments.departments[0]);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments.departments);
  const history: History = useHistory<History>();
  const { deptId } = useParams<{ deptId: string }>();

  useEffect(() => {
    // For Future Devs: Replace MockDepartmentApi with Api
    setDepartment(MockDepartmentApi.getDepartmentById(deptId) as Department);
    setDepartments(MockDepartmentApi.getDepartments());
  }, []);

  try {
    switch (department) {
      case departments[0]:
        return <RehabForm></RehabForm>;
      case departments[1]:
        return <NICUForm></NICUForm>;
      case departments[2]:
        return <MaternityForm></MaternityForm>;
      case departments[3]:
        return <CommunityForm></CommunityForm>;
    }
  } catch (e) {
    history.push('/notFound');
  }
};

export default AddReport;

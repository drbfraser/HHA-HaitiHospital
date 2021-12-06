import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

import NICUForm from 'pages/form/nicu_form';
import { DepartmentName, getDepartmentName } from 'constants/interfaces';
import MaternityForm from 'pages/form/maternity_form';
import RehabForm from 'pages/form/rehab_form';
import CommunityForm from 'pages/form/community_form';

const AddReport = () => {
    const history = useHistory();
    const {deptId} = useParams<{deptId: string}>();

try {
    const deptName: DepartmentName = getDepartmentName(parseInt(deptId));

    switch (deptName) {
        case DepartmentName.Rehab:
            return <RehabForm></RehabForm>;
        case DepartmentName.NicuPaeds:
            return <NICUForm></NICUForm>;
        case DepartmentName.Maternity:
            return <MaternityForm></MaternityForm>;
        case DepartmentName.CommunityHealth:
            return <CommunityForm></CommunityForm>;
    }
}
catch (e) {
    history.push('/notFound');
}
}

export default AddReport;
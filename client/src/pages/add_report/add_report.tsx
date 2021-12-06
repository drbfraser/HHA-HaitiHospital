import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

import NICUForm from 'pages/form/nicu_form';
import { DepartmentName, getDepartmentName } from 'constants/interfaces';
import MaternityForm from 'pages/form/maternity_form';

const AddReport = () => {
    const history = useHistory();
    const {deptId} = useParams<{deptId: string}>();

try {
    const deptName: DepartmentName = getDepartmentName(parseInt(deptId));

    switch (deptName) {
        case DepartmentName.Rehab:
            return <p>No form</p>;
        case DepartmentName.NicuPaeds:
            return <NICUForm></NICUForm>;
        case DepartmentName.Maternity:
            return <MaternityForm></MaternityForm>;
        case DepartmentName.CommunityHealth:
            return <>No form</>;
    }
}
catch (e) {
    history.push('/notFound');
}
}

export default AddReport;
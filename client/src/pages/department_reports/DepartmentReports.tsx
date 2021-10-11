import React, {useState, useEffect} from 'react';
import Axios from 'axios';

import IProps from 'components/IProps/IProps';
import NavBar from 'components/NavBar/NavBar';
import TextHolder from 'components/TextHolder/TextHolder';
import ReportTable from 'components/ReportTable/ReportTable';
import {Report} from 'constants/index';

import './styles.css';

interface DepartmentReportsProps extends IProps {
  department: string;
};


const DepartmentReports = (props: DepartmentReportsProps) => {
  const [submittedReports, setSubbmitedReports] = useState<Report[]>([]);
//   const dbUrlForNICUReports = "https://localhost:5000/api/NicuPaeds/";

//   // Fetch submitted reports when page loaded
//   useEffect(() => {
//     const getReports = async() => {
//       const reportsFromServer = await fetchReports();
//       setSubbmitedReports(reportsFromServer);
//     }
//     getReports();
//   });

//   const fetchReports = async () => {
//     const res = await fetch(dbUrlForNICUReports);
//     const data = await res.json();
//     return data;
//   }

  

  return (
    <>
      <NavBar/>
      <div className='container'>
        <TextHolder text={props.department}></TextHolder>
        <div> Search Bar Here</div>
        <div className='report-board'>
          {
            submittedReports.length > 0 ? 
              <ReportTable reports={submittedReports}/>: 
              <div>No submitted reports</div>
          }
        </div>
      </div> 
    </>
  );
}
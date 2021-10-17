import React, {useState, useEffect} from 'react';
import Axios from 'axios';

import { ElementStyleProps } from 'constants/interfaces';
import NavBar from 'components/nav_bar/nav_bar';
import TextHolder from 'components/text-holder/text_holder';
import ReportTable from 'components/report_table/report_table';

import {ReportProps} from 'constants/interfaces';

import './styles.css';

interface DepartmentReportsProps extends ElementStyleProps {
  department: string;
};


const DepartmentReports = (props: DepartmentReportsProps) => {
  const [submittedReports, setSubbmitedReports] = useState<[]>([]);
  const dbUrlForNICUReports = "https://localhost:5000/api/NicuPaeds/";

//   // Fetch submitted reports when page loaded
  useEffect(() => {
    const getReports = async() => {
      const reportsFromServer = await fetchReports();
      setSubbmitedReports(reportsFromServer);
    }
    getReports();
  });

  const fetchReports = async () => {
    // const res1 = await fetch(dbUrlForNICUReports);
    // const data1 = await res1.json();
    // return data1;
    try {
    const res = await Axios.get(dbUrlForNICUReports)
    return res.data;
    }
    catch (err) {
      console.log(err);
    }


      // .then((response) => {
      //   console.log(response.data);
      //   console.log(response.status);
      //   console.log(response.statusText);
      //   console.log(response.headers);
      //   console.log(response.config);
      // })
      // .catch((abc) => {console.log(abc)});
    
    // console.log(res.data);

    // console.log(data);
    // return [];   
  }

  return (
    <>
      <NavBar/>
      <div className='container'>
        <TextHolder text={props.department}></TextHolder>
        <div> Search Bar Here</div>
        <div className='report-board'>
          {
            (submittedReports === undefined || submittedReports.length === 0) ? 
              <div>No submitted reports</div> : 
              <ReportTable reports={submittedReports as ReportProps[]}/>
          }
        </div>
      </div> 
    </>
  );
}

export default DepartmentReports;
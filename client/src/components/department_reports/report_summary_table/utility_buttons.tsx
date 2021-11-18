import React from 'react';

import {ElementStyleProps, ReportProps} from 'constants/interfaces';
import Axios from 'axios'
import {useTranslation} from "react-i18next";

interface UtilityButtonsProps extends ElementStyleProps {
    tickTracker : {[rid: string]: boolean},
    notifyTable() : void,
}

function isShown(tickTracker: {[rid: string]: boolean}) : boolean{
    const values = Object.values(tickTracker);
    return values.includes(true);
}


async function delTickedReportFromDb(rid: string) {
    let dbApiToDelRid = `/api/report/delete/${rid}`;
    const res = await Axios.delete(dbApiToDelRid);
}


const UtilityButtons = (props: UtilityButtonsProps) => {

    function deleteReports(tickTracker: {[rid: string]: boolean}) {
        // console.log("Delete ", tickTracker);
        Object.keys(tickTracker).forEach((rid) => {
            try {
                if (tickTracker[rid] === true)
                    delTickedReportFromDb(rid);
            }
            catch (err) {
                console.log("Something wrong when delete report");
            }
        })
        props.notifyTable();
    }

    const {t, i18n} = useTranslation();

    return (
    <div>
      {(isShown(props.tickTracker))?
        <div className="row justify-content-end">
            <div className="col-auto">
                <button
                    className=""
                    onClick = {() => {
                        deleteReports(props.tickTracker);
                    }}
                >
                    Delete
                </button>
            </div>

            <div className="col-auto">
            <button className="">{t("departmentPageAccumulate")}</button>
            </div>
        </div>
        :
        <div></div>
      }
    </div>
  );
}

export default UtilityButtons;
import ReportSummary from 'components/report_summary/report_summary';
import Header from 'components/header/header';
import Sidebar from 'components/side_bar/side_bar';

// Reference :
//https://kiarash-z.github.io/react-modern-calendar-datepicker/docs/typescript
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker, {DayRange} from 'react-modern-calendar-datepicker';

import React from 'react';

import "./general_reports_styles.css";

const GeneralReports = () => {
    const [dayRange, setDayRange] = React.useState<DayRange>({
        from: null,
        to: null
    });

    return (<>
        <div className="general-reports">
            <Sidebar/>
            <main>
                <Header/>

                <section>
                    <DatePicker
                        value = {dayRange}
                        onChange={setDayRange}
                    />
                    <ReportSummary
                        dateRange={dayRange}
                    />
                   
                </section>
            </main>

        </div>
    </>)
}

export default GeneralReports
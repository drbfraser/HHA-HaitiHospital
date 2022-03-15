import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { currMonth, currYear } from 'utils/dateFormatting';
import { EmployeeOfTheMonth } from 'pages/employee_of_the_month_form/EmployeeOfTheMonthModel';
import API from '../../actions/apiActions';

interface EmployeeOfTheMonthSummaryProps extends RouteComponentProps {
  employeeOfTheMonth: EmployeeOfTheMonth;
}

export const EmployeeOfTheMonthSummary = (props: EmployeeOfTheMonthSummaryProps) => {
  const { t: translateText } = useTranslation();
  const [employeeOfTheMonthImage, setEmployeeOfTheMonthImage] = useState<string>('');

  const getEmployeeOfTheMonthImage = async (url: string) => {
    setEmployeeOfTheMonthImage(await API.Image(url));
  };

  const translateMonth = (monthIndicator: number): string => {
    switch (monthIndicator) {
      case 0:
        return translateText('monthJanuary');
      case 1:
        return translateText('monthFebruary');
      case 2:
        return translateText('monthMarch');
      case 3:
        return translateText('monthApril');
      case 4:
        return translateText('monthMay');
      case 5:
        return translateText('monthJune');
      case 6:
        return translateText('monthJuly');
      case 7:
        return translateText('monthAugust');
      case 8:
        return translateText('monthSeptember');
      case 9:
        return translateText('monthOctober');
      case 10:
        return translateText('monthNovember');
      case 11:
        return translateText('monthDecember');
    }
  };

  useEffect(() => {
    // Only execute once employee of the month data has been successfully passed to this component
    if (props.employeeOfTheMonth !== null) {
      const IMAGE_URL: string = `/api/image/${props.employeeOfTheMonth.imgPath.split('/')[2]}`;
      getEmployeeOfTheMonthImage(IMAGE_URL);
    }
  }, [props.employeeOfTheMonth]);

  return (
    <div className="mb-5">
      <div style={{ display: 'flex', flex: '1 1 auto' }}>
        <div className="w-100">
          <h4 className="mt-3 mb-3 fw-bold">
            {translateText('employeeOfTheMonthTitle').concat(
              translateMonth(currMonth).concat(' ').concat(currYear.toString()),
            )}
          </h4>
          <h6 className="fs-6 lh-base fw-bold">{translateText('employeeOfTheMonthDate')}</h6>
          <p className="fs-6 lh-base text-break">
            {new Date(props.employeeOfTheMonth.updatedAt).toLocaleDateString('en-US', {
              timeZone: 'America/Cancun',
            })}
          </p>
          <h6 className="fs-6 fw-bold lh-base">{translateText('employeeOfTheMonthName')}</h6>
          <p className="fs-6 lh-base text-break">{props.employeeOfTheMonth.name}</p>
          <h6 className="fs-6 fw-bold lh-base">{translateText('employeeOfTheMonthDepartment')}</h6>
          <p className="fs-6 lh-base text-break">{props.employeeOfTheMonth.department}</p>
          <h6 className="fs-6 fw-bold lh-base">{translateText('employeeOfTheMonthDescription')}</h6>
          <p className="fs-6 lh-base text-break">{props.employeeOfTheMonth.description}</p>
        </div>
        <div>
          <img
            src={employeeOfTheMonthImage}
            className={`img-thumbnail img-fluid mt-3 mb-3 ${
              props.employeeOfTheMonth.imgPath ? 'd-block' : 'd-none'
            }`}
            alt="Employee Of The Month..."
          />
        </div>
      </div>
    </div>
  );
};

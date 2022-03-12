import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { currMonth, currYear } from 'utils/dateFormatting';

export const EmployeeOfTheMonthSummary = ({ employeeOfTheMonth }) => {
  const { t: translateText } = useTranslation();
  const [employeeOfTheMonthImage, setEmployeeOfTheMonthImage] = useState<string>('');

  const getEmployeeOfTheMonthImage = async () => {
    await axios
      .get(`/api/image/${employeeOfTheMonth.imgPath.split('/')[2]}`, {
        responseType: 'blob',
      })
      .then((response: any) => {
        setEmployeeOfTheMonthImage(URL.createObjectURL(response.data));
      })
      .catch(() => {
        toast.error('Unable to fetch image');
      });
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
    if (employeeOfTheMonth.imgPath !== undefined) getEmployeeOfTheMonthImage();
  }, [employeeOfTheMonth]);

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
            {new Date(employeeOfTheMonth.updatedAt).toLocaleDateString('en-US', {
              timeZone: 'America/Cancun',
            })}
          </p>
          <h6 className="fs-6 fw-bold lh-base">{translateText('employeeOfTheMonthName')}</h6>
          <p className="fs-6 lh-base text-break">{employeeOfTheMonth.name}</p>
          <h6 className="fs-6 fw-bold lh-base">{translateText('employeeOfTheMonthDepartment')}</h6>
          <p className="fs-6 lh-base text-break">{employeeOfTheMonth.department}</p>
          <h6 className="fs-6 fw-bold lh-base">{translateText('employeeOfTheMonthDescription')}</h6>
          <p className="fs-6 lh-base text-break">{employeeOfTheMonth.description}</p>
        </div>
        <div>
          <img
            src={employeeOfTheMonthImage}
            className={`img-thumbnail img-fluid mt-3 mb-3 ${
              employeeOfTheMonth.imgPath ? 'd-block' : 'd-none'
            }`}
            alt="Employee Of The Month..."
          />
        </div>
      </div>
    </div>
  );
};

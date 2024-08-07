import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { currMonth, currYear } from 'utils';
import { useTranslation } from 'react-i18next';

interface monthInfo {
  value: number;
  label: string;
}

const maxYear = currYear;
const minYear = 1900;
interface MonthFieldProps {
  setReportMonth: Dispatch<SetStateAction<Date | undefined>>;
  previousReportMonth?: Date;
  canSelectFuture?: boolean;
}
export const MonthField = ({
  setReportMonth,
  previousReportMonth,
  canSelectFuture = false,
}: MonthFieldProps) => {
  const [month, setMonth] = useState<number | undefined>(
    previousReportMonth?.getMonth() ?? undefined,
  );
  const [year, setYear] = useState<number | undefined>(
    previousReportMonth?.getUTCFullYear() ?? currYear,
  );

  const { t } = useTranslation();

  const getMonthOptions = () => {
    let months: monthInfo[] = [
      { value: -1, label: t('monthSelect') },
      { value: 0, label: t('monthJanuary') },
      { value: 1, label: t('monthFebruary') },
      { value: 2, label: t('monthMarch') },
      { value: 3, label: t('monthApril') },
      { value: 4, label: t('monthMay') },
      { value: 5, label: t('monthJune') },
      { value: 6, label: t('monthJuly') },
      { value: 7, label: t('monthAugust') },
      { value: 8, label: t('monthSeptember') },
      { value: 9, label: t('monthOctober') },
      { value: 10, label: t('monthNovember') },
      { value: 11, label: t('monthDecember') },
    ];

    if (!canSelectFuture && year === currYear) {
      // it's 2 to account for month starting at 0 + the sentinel value
      months = months.slice(0, currMonth + 2);
    }

    return months.map((month: monthInfo) => <option value={month.value}>{month.label}</option>);
  };

  const visibleMonths = useMemo(() => {
    return getMonthOptions();
  }, [year]);

  useEffect(() => {
    if (
      month !== undefined &&
      month > -1 &&
      year !== undefined &&
      year >= minYear &&
      year <= currYear
    ) {
      setReportMonth(new Date(year, month));
    } else {
      setReportMonth(undefined);
    }
  }, [month, setReportMonth, year]);

  return (
    <div className="mt-3">
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="month">{t('month')}</Form.Label>
            <Form.Select
              id="month"
              name="month"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              {visibleMonths}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="year">{t('year')}</Form.Label>
            <Form.Control
              type="number"
              id="year"
              name="year"
              min="1900"
              max={currYear}
              value={year ?? currYear}
              onChange={(e) => setYear(parseInt(e.target.value))}
              step="1"
              isInvalid={year !== undefined && (year < minYear || year > maxYear)}
              placeholder={t('yearPlaceholder')}
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

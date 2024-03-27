import { Dispatch, SetStateAction } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Department } from 'constants/interfaces';
import { useTranslation } from 'react-i18next';

interface ReportAndTemplateFormProps {
  departmentLabel: string;
  monthLabel: string;
  departments: Department[];
  currentDepartment: Department | undefined;
  setCurrentDepartment: Dispatch<SetStateAction<Department | undefined>>;
  reportMonth: Date | undefined;
  setReportMonth: Dispatch<SetStateAction<Date | undefined>>;
}

export const ReportAndTemplateForm = ({
  departmentLabel,
  monthLabel,
  departments,
  currentDepartment,
  setCurrentDepartment,
  reportMonth,
  setReportMonth,
}: ReportAndTemplateFormProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="col-md-6 mb-2">
      <fieldset>
        <label htmlFor="Report-Department-Type">{departmentLabel}</label>
        <select
          className="form-select"
          id="Report-Department-Type"
          onChange={(e) =>
            setCurrentDepartment(departments.find(({ id }) => e.target.value === id))
          }
          value={currentDepartment?.id || ''}
          required
        >
          <option value="">{t('headerReportChooseDepartment')}</option>
          {departments &&
            departments.map(({ id, name }) => (
              <option key={id} value={id}>
                {t(`departments.${name}`)}
              </option>
            ))}
        </select>
        <label htmlFor="Report-Month" className="mt-2">
          {monthLabel}
        </label>
        <input
          type="month"
          className="form-control"
          id="Report-Month"
          onChange={(e) => setReportMonth(new Date(e.target.value))}
          value={reportMonth?.toISOString().slice(0, 7)}
          max={new Date().toISOString().slice(0, 7)}
          required
        />
        <div className="reactBootstrap mt-2">
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="month">
                <Form.Label htmlFor="month">Month:</Form.Label>
                <Form.Select id="month" name="month" defaultValue={new Date().getMonth()}>
                  <option value={1}>January</option>
                  <option value={2}>February</option>
                  <option value={3}>March</option>
                  <option value={4}>April</option>
                  <option value={5}>May</option>
                  <option value={6}>June</option>
                  <option value={7}>July</option>
                  <option value={8}>August</option>
                  <option value={9}>September</option>
                  <option value={10}>October</option>
                  <option value={11}>November</option>
                  <option value={12}>December</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="year">
                <Form.Label htmlFor="year">Year:</Form.Label>
                <Form.Control
                  type="number"
                  id="year"
                  name="year"
                  min="1900"
                  max={new Date().getFullYear()}
                  defaultValue={new Date().getFullYear()}
                  step="1"
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      </fieldset>
    </div>
  );
};

import { DropDown, DropDownMenus } from 'components/dropdown/DropdownMenu';
import { TimeOptions } from 'pages/analytics/Analytics';
import { ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

type TimeOptionModalProp = {
  showModal: boolean;
  timeOptions: TimeOptions;
  handleCloseModal: () => void;
  onFromDateChanged: (event: ChangeEvent<HTMLInputElement>) => void;
  onToDateChanged: (event: ChangeEvent<HTMLInputElement>) => void;
  onTimeStepChanged: (timeStep: string) => void;
};

export const TimeOptionModal = ({
  showModal,
  timeOptions,
  handleCloseModal,
  onFromDateChanged,
  onToDateChanged,
  onTimeStepChanged,
}: TimeOptionModalProp) => {
  const { t } = useTranslation();
  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('analyticsTimeRange')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId="from" className="mb-3">
            <Form.Label>{t('analyticsFrom')}</Form.Label>
            <Form.Control
              type="date"
              placeholder="Select Date"
              onChange={onFromDateChanged}
              value={timeOptions.from}
            />
          </Form.Group>
          <Form.Group controlId="to" className="mb-3">
            <Form.Label>{t('analyticsTo')}</Form.Label>
            <Form.Control
              type="date"
              placeholder="Select Date"
              onChange={onToDateChanged}
              value={timeOptions.to}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <DropDown
              menus={DropDownMenus.timeStep}
              title={t('analyticsTimeStep')}
              selectedMenu={timeOptions.timeStep}
              setDropDownMenu={onTimeStepChanged}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleCloseModal}>
          {t('analyticsDone')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

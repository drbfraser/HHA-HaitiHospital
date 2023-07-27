import { Button, Modal } from 'react-bootstrap';

import { History } from 'history';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ModalDeleteProps extends RouteComponentProps {
  dataTestId: string;
  onModalClose: () => void;
  onModalDelete: () => void;
  show: boolean;
  item: string;
  history: History;
}

const DeleteModal = (props: ModalDeleteProps) => {
  const { t } = useTranslation();
  return (
    <Modal show={props.show} onHide={props.onModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('modal.delete_msg', { item: props.itemName })}</Modal.Body>
      <Modal.Footer>
        <Button className="mr-3" variant="outline-dark" onClick={() => props.onModalClose()}>
          {t('button.cancel')}
        </Button>
        <Button
          data-testid={props.dataTestId}
          variant="danger"
          onClick={() => props.onModalDelete()}
        >
          {t('button.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;

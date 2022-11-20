import { Button, Modal } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { History } from 'history';
import { useTranslation } from 'react-i18next';

interface ModalDeleteProps extends RouteComponentProps {
  onModalClose: any;
  onModalDelete: any;
  currentItem: string;
  show: boolean;
  item: string;
  history: History;
}

const ModalDelete = (props: ModalDeleteProps) => {

    const { t } = useTranslation();
  return (
    <Modal show={props.show} onHide={props.onModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('modal.delete_msg', {item: props.item})}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-dark" onClick={() => props.onModalClose()}>
          {t('button.cancel')}
        </Button>
        <Button data-testid="confirm-delete-message-button" variant="outline-danger" onClick={() => props.onModalDelete(props.currentItem)}>
          {t('button.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDelete;

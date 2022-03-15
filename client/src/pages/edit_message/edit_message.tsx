import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { emptyMessage, Message } from 'constants/interfaces';
import Sidebar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import MessageForm from 'components/message_form/message_form';
import './edit_message_styles.css';
import DbErrorHandler from 'actions/http_error_handler';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { toast } from 'react-toastify';

const EditMessage = () => {
  const { id } = useParams<{ id?: string }>();
  const [msg, setMsg] = useState<Message>(emptyMessage);
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMsgFromDb = async (id: string) => {
      const api = `/api/message-board/${id}`;
      try {
        const response = await Axios.get(api);
        return response.data;
      } catch (err) {
        DbErrorHandler(err, history, 'Unable to get message');
        return {};
      }
    };

    const fetchMsg = async (id: string) => {
      const msgData = await fetchMsgFromDb(id);
      const msg: Message = {
        messageBody: msgData['messageBody'],
        messageHeader: msgData['messageHeader'],
        departmentId: msgData['departmentId'],
        departmentName: msgData['departmentName'],
        user: msgData['userId'],
        date: msgData['date'],
      };

      setMsg(msg);
    };

    fetchMsg(id);
  }, [id, history]);

  const updateMessage = async (data) => {
    const api = `/api/message-board/${id}`;
    try {
      await Axios.put(api, data);
      history.push('/message-board');
      toast.success(i18n.t('addMessageAlertSuccess'));
    } catch (e) {
      DbErrorHandler(e, history, 'Unable to update message');
    }
  };

  return (
    <>
      <div className="edit-message">
        <Sidebar />

        <main>
          <Header />
          <div className="container">
            <h1 className="">{t('editMessage')}</h1>
            <MessageForm optionalMsg={msg} submitAction={updateMessage} />

            <br />

            <button className="btn btn-md btn-outline-secondary" onClick={history.goBack}>
              {' '}
              {t('addMessageBack')}{' '}
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default EditMessage;

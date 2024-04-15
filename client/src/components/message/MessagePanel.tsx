import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { Link, useHistory } from 'react-router-dom';
import { Message, Role } from 'constants/interfaces';
import { useEffect, useState } from 'react';

import Api from 'actions/Api';
import { CellContext } from '@tanstack/react-table';
import { ENDPOINT_MESSAGEBOARD_GET } from 'constants/endpoints';
import { TOAST_MESSAGEBOARD_GET_ERROR } from 'constants/toastErrorMessages';
import { History } from 'history';
import MessageDisplay from './MessageDisplay';
import { renderBasedOnRole } from 'actions/roleActions';
import { useAuthState } from 'contexts';
import { useTranslation } from 'react-i18next';

const MessagePanel = () => {
  const { t } = useTranslation();
  const history: History = useHistory<History>();
  const authState = useAuthState();
  const [messages, setMessages] = useState<Message[]>([]);

  const onMessageDelete = async (message: Message) => {
    setMessages(messages.filter((m) => m.id !== message.id));
  };

  useEffect(() => {
    const getMessages = async (controller: AbortController) => {
      const messages = await Api.Get(
        ENDPOINT_MESSAGEBOARD_GET,
        TOAST_MESSAGEBOARD_GET_ERROR,
        history,
        controller.signal,
      );
      setMessages(messages);
    };

    const controller = new AbortController();
    getMessages(controller);
    return () => {
      controller.abort();
      setMessages([]);
    };
  }, [history, authState]);

  const columns: FilterableColumnDef[] = [
    {
      header: t('messageBoardRecentUpdates'),
      id: 'messageHeader',
      accessorFn: (row) => row.messageHeader + row.messageBody,
      cell: ({ row }: CellContext<any, any>) => (
        <MessageDisplay message={row.original} onDelete={onMessageDelete} />
      ),
    },
  ];
  return (
    <>
      <div className="d-flex justify-content-start">
        {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) ? (
          <Link to="/message-board/add-message">
            <button data-testid="add-message-button" className="btn btn-md btn-outline-secondary">
              {t('messageBoardAddMessage')}
            </button>
          </Link>
        ) : null}
      </div>
      {messages && (
        <FilterableTable data={messages} columns={columns} enableGlobalFilter enableFilters />
      )}
    </>
  );
};

export default MessagePanel;

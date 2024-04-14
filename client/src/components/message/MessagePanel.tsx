import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { Link, useHistory } from 'react-router-dom';
import { MessageJson as Message, Role } from '@hha/common';
import { useCallback, useEffect, useState } from 'react';
import { CellContext } from '@tanstack/react-table';
import { History } from 'history';
import MessageDisplay from './MessageDisplay';
import { renderBasedOnRole } from 'actions/roleActions';
import { useAuthState } from 'contexts';
import { useTranslation } from 'react-i18next';
import { getAllMessageBoards } from 'api/messageBoard';

const MessagePanel = () => {
  const { t } = useTranslation();
  const history: History = useHistory<History>();
  const authState = useAuthState();
  const [messages, setMessages] = useState<Message[]>([]);

  const onMessageDelete = async (message: Message) => {
    setMessages(messages.filter((m) => m.id !== message.id));
  };

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

  const fetchData = useCallback(async () => {
    const messages = await getAllMessageBoards(history);
    setMessages(messages);
  }, [history]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

import Layout from 'components/layout';
import MessagePanel from 'components/message_panel/message_panel';
import './message_board_main.css';

interface MessageBoardMainProps {}

export const MessageBoardMain = (props: MessageBoardMainProps) => {
  return (
    <div className={'message-board-main'}>
      <Layout>
        <MessagePanel />
      </Layout>
    </div>
  );
};

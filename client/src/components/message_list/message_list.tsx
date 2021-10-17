import React, { useEffect } from 'react';
import { connect } from 'react-redux';


import Message from 'components/message/message';
import Loader from 'components/loader/loader';
// import { getMessages } from '../../store/actions/messageActions';
import { ElementStyleProps } from 'constants/interfaces';

import './styles.css';

interface MessageListProps extends ElementStyleProps {

};

const MessageList = (props : MessageListProps) => {
  return (
    <div className={'message-list '+props.classes}></div>
  );
};

export default MessageList;

// const MessageList = ({ getMessages, message: { messages, isLoading, error } }) => {
//   useEffect(() => {
//     getMessages();
//   }, []);

//   return (
//     <div className="message-list">
//       <h2>Messages:</h2>
//       {error && <div className="error-center">{error}</div>}
//       <div className="list">
//         {isLoading ? (
//           <Loader />
//         ) : (
//           <>
//             {messages.map((message, index) => {
//               return <Message key={index} message={message} />;
//             })}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// const mapStateToProps = (state) => ({
//   message: state.message,
// });

// export default connect(mapStateToProps, { getMessages })(MessageList);

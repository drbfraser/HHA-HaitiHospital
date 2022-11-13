import MessageCollection from 'models/messageBoard';

const validateMessageId = async (messageId: string): Promise<boolean> => {
  const message = await MessageCollection.findById(messageId);
  return message !== null;
};

const MessageBoard = { validateMessageId };

export default MessageBoard;

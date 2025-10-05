import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';
import { type ChatMessage as ChatMessageType } from '@/actions/chatWithAI';

interface MessageListProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  // Filter messages to only show user and assistant messages
  const chatMessages = messages.filter(message => 
    message.role === 'user' || message.role === 'assistant'
  );

  return (
    <div>
      {chatMessages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      
      {isLoading && <LoadingIndicator />}
    </div>
  );
}
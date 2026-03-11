import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';
import { type ChatMessage as ChatMessageType } from '@/hooks/useClientChat';

interface MessageListProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const chatMessages = messages.filter(message =>
    message.role === 'user' || message.role === 'assistant'
  );

  // The last assistant message is "streaming" if we're currently loading
  const lastAssistantIndex = chatMessages.reduce((last, msg, i) =>
    msg.role === 'assistant' ? i : last, -1
  );

  return (
    <div>
      {chatMessages.map((message, index) => (
        <ChatMessage
          key={message.id}
          message={message}
          isStreaming={isLoading && index === lastAssistantIndex}
        />
      ))}

      {/* Show DeepSeek-style loading only when there's no assistant message yet */}
      {isLoading && lastAssistantIndex === -1 && <LoadingIndicator />}
    </div>
  );
}
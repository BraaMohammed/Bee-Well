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
      {chatMessages.map((message, index) => {
        const isStreamingThis = isLoading && index === lastAssistantIndex;
        
        // If it's an assistant message with absolutely no content and no tools yet,
        // it's just been initiated. Show the dedicated LoadingIndicator instead of a blank avatar.
        const isEmptyAssistant =
          message.role === 'assistant' &&
          !message.content &&
          (!message.toolInvocations || message.toolInvocations.length === 0);

        if (isEmptyAssistant && isStreamingThis) {
          return <LoadingIndicator key={message.id} />;
        }

        return (
          <ChatMessage
            key={message.id}
            message={message}
            isStreaming={isStreamingThis}
          />
        );
      })}
    </div>
  );
}
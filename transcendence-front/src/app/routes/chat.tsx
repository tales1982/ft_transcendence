import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  setActiveConversation,
} from "../../store/slices/chat.slice";
import { Avatar } from "../../components/ui/Avatar";
import { Spinner } from "../../components/ui/Loading";
import { useState } from "react";
import type { ConversationResponse } from "../../types";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
});

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space(3)};
`;

const ChatContainer = styled.div`
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  display: flex;
  height: 600px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const ConversationList = styled.div`
  width: 33.333%;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    max-height: 200px;
  }
`;

const ConversationHeader = styled.div`
  padding: ${({ theme }) => theme.space(2)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ConversationHeaderTitle = styled.h3`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
`;

const ConversationsScroll = styled.div`
  overflow-y: auto;
  flex: 1;
`;

const ConversationItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.space(2)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: background 150ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.card};
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      background: ${theme.colors.card};
    `}
`;

const ConvInfo = styled.div`
  margin-left: ${({ theme }) => theme.space(1.5)};
  flex: 1;
  overflow: hidden;
`;

const ConvName = styled.h4`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
`;

const ConvPreview = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChatWindow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    min-height: 400px;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1.5)};
  padding: ${({ theme }) => theme.space(2)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ChatUserName = styled.h3`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.space(2)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`;

const MessageRow = styled.div<{ $sent: boolean }>`
  display: flex;
  justify-content: ${({ $sent }) => ($sent ? "flex-end" : "flex-start")};
`;

const MessageBubble = styled.div<{ $sent: boolean }>`
  max-width: 70%;
  padding: ${({ theme }) => theme.space(1.5)};
  border-radius: ${({ theme }) => theme.radius.lg};

  ${({ $sent, theme }) =>
    $sent
      ? css`
          background: rgba(74, 183, 96, 0.15);
          border: 1px solid rgba(74, 183, 96, 0.3);
          border-top-right-radius: 4px;
        `
      : css`
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid ${theme.colors.border};
          border-top-left-radius: 4px;
        `}
`;

const MessageText = styled.p`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

const MessageTime = styled.span`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.muted};
  display: block;
  margin-top: 4px;
`;

const InputArea = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.space(2)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const MessageInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.space(1.5)};
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md} 0 0 ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SendBtn = styled.button`
  padding: ${({ theme }) => `${theme.space(1.5)} ${theme.space(2.5)}`};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.bg};
  border: none;
  border-radius: 0 ${({ theme }) => theme.radius.md} ${({ theme }) => theme.radius.md} 0;
  cursor: pointer;
  font-weight: 600;
  transition: background 150ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const EmptyChat = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;
`;

const CenterLoader = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.space(6)};
`;

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChatPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { conversations, activeConversation, messages, loading } = useAppSelector((s) => s.chat);
  const authUser = useAppSelector((s) => s.auth.user);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function selectConversation(conv: ConversationResponse) {
    dispatch(setActiveConversation(conv));
    dispatch(fetchMessages({ conversationId: conv.id }));
  }

  function handleSend() {
    if (!inputValue.trim() || !activeConversation) return;
    dispatch(sendMessage({ conversationId: activeConversation.id, content: inputValue.trim() }));
    setInputValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <>
      <Title>{t("nav.chat")}</Title>

      {loading && conversations.length === 0 ? (
        <CenterLoader><Spinner $size="lg" /></CenterLoader>
      ) : (
        <ChatContainer>
          <ConversationList>
            <ConversationHeader>
              <ConversationHeaderTitle>{t("chat.conversations")}</ConversationHeaderTitle>
            </ConversationHeader>
            <ConversationsScroll>
              {conversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  $active={activeConversation?.id === conv.id}
                  onClick={() => selectConversation(conv)}
                >
                  <Avatar $size="sm">
                    {conv.participantIds[0]?.toString().charAt(0) || "?"}
                  </Avatar>
                  <ConvInfo>
                    <ConvName>{t("chat.conversation")} #{conv.id}</ConvName>
                    <ConvPreview>{conv.taskId ? `Task #${conv.taskId}` : t("chat.directMessage")}</ConvPreview>
                  </ConvInfo>
                </ConversationItem>
              ))}
              {conversations.length === 0 && (
                <EmptyChat style={{ padding: 24 }}>{t("chat.noConversations")}</EmptyChat>
              )}
            </ConversationsScroll>
          </ConversationList>

          <ChatWindow>
            {activeConversation ? (
              <>
                <ChatHeader>
                  <Avatar $size="sm">?</Avatar>
                  <ChatUserName>{t("chat.conversation")} #{activeConversation.id}</ChatUserName>
                </ChatHeader>

                <MessagesArea>
                  {messages.map((msg) => {
                    const isSent = msg.senderEmail === authUser?.email;
                    return (
                      <MessageRow key={msg.id} $sent={isSent}>
                        <MessageBubble $sent={isSent}>
                          <MessageText>{msg.content}</MessageText>
                          <MessageTime>{formatTime(msg.sentAt)}</MessageTime>
                        </MessageBubble>
                      </MessageRow>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </MessagesArea>

                <InputArea>
                  <MessageInput
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("chat.typePlaceholder")}
                  />
                  <SendBtn onClick={handleSend}>{t("chat.send")}</SendBtn>
                </InputArea>
              </>
            ) : (
              <EmptyChat>{t("chat.selectConversation")}</EmptyChat>
            )}
          </ChatWindow>
        </ChatContainer>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";

const slideIn = keyframes`
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(100px); opacity: 0; }
`;

const Container = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: ${({ theme }) => theme.space(4)};
  right: ${({ theme }) => theme.space(4)};
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(3)}`};
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1.5)};
  max-width: 400px;

  ${({ $visible }) =>
    $visible
      ? css`animation: ${slideIn} 300ms ease forwards;`
      : css`animation: ${slideOut} 300ms ease forwards;`}
`;

const Icon = styled.span<{ $type: ToastType }>`
  font-size: 1.1rem;
  color: ${({ theme, $type }) => {
    switch ($type) {
      case "success": return theme.colors.success;
      case "error": return theme.colors.danger;
      case "warning": return theme.colors.warning;
      default: return theme.colors.info;
    }
  }};
`;

const Message = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
`;

type ToastType = "success" | "error" | "warning" | "info";

interface ToastData {
  message: string;
  type?: ToastType;
  duration?: number;
}

let showToastFn: ((data: ToastData) => void) | null = null;

export function showToast(message: string, type: ToastType = "success", duration = 3000) {
  showToastFn?.({ message, type, duration });
}

export function ToastProvider() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    showToastFn = (data) => {
      setToast(data);
      setVisible(true);
    };
    return () => { showToastFn = null; };
  }, []);

  useEffect(() => {
    if (!visible || !toast) return;
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setToast(null), 300);
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [visible, toast]);

  if (!toast) return null;

  const iconMap: Record<ToastType, string> = {
    success: "\u2713",
    error: "\u2717",
    warning: "\u26A0",
    info: "\u2139",
  };

  return (
    <Container $visible={visible}>
      <Icon $type={toast.type || "success"}>{iconMap[toast.type || "success"]}</Icon>
      <Message>{toast.message}</Message>
    </Container>
  );
}

import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
`;

export const Trigger = styled.button`

  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 6px 10px;
  cursor: pointer;


  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Flag = styled.img`
  width: 20px;
  height: auto;
  display: block;
`;

export const Label = styled.span`
  font-size: 1rem;
  font-weight: 500;
`;

export const Chevron = styled.span<{ open: boolean }>`
  width: 1em;
  height: 1em;
  margin-left: 4px;
  transition: transform 0.2s ease;
  transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0)")};

  background-color: ${({ theme }) => theme.colors.text};
  mask: url("/icons/chevron-down.svg") no-repeat center / contain;
  -webkit-mask: url("/icons/chevron-down.svg") no-repeat center / contain;
`;

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;

  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  z-index: 100;
`;

export const Item = styled.button`
  width: 100%;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

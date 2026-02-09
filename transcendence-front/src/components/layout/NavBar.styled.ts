import { Link } from "@tanstack/react-router";
import styled from "styled-components";

export const Bar = styled.header`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.space(2)};
`;

export const Row = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  gap: ${({ theme }) => theme.space(2)};
  align-items: center;
  justify-content: space-between;
`;

export const Left = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space(2)};
  align-items: center;
`;

export const Right = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space(1)};
  align-items: center;
`;



export const NavLink = styled(Link)`
  opacity: 0.9;
    transition: opacity 0.2s ease; /* smooth transition */
  &:hover {
    opacity: 0.7; /* slightly transparent on hover */
  }
`;
export const NavBtn = styled(NavLink)`
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
export const RegisterBtn = styled(NavBtn)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.panel};
`;

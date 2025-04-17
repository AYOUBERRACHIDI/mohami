import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, DocumentTextIcon, UserIcon, ChartBarIcon, CalendarIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import styled, { keyframes, css } from 'styled-components';
import logo from '../assets/logo1.jpeg';

// Keyframes for Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(46, 125, 50, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(46, 125, 50, 0);
  }
`;

// Styled Components
const SidebarContainer = styled.div`
  position: fixed;
  top: 60px; /* Start below the NavDash (height: 60px) */
  bottom: 0;
  right: 0;
  height: calc(100vh - 60px); /* Adjust height to account for NavDash */
  width: 70px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 0;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: ${css`${fadeIn} 0.8s ease-in-out forwards`};
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: 2rem;
  border: 2px solid #2e7d32;
  box-shadow: 0 0 10px rgba(46, 125, 50, 0.3);
`;

const NavLink = styled(Link)`
  position: relative;
  padding: 0.5rem;
  color: ${props => (props.isActive ? '#2e7d32' : '#6b7280')};
  transition: all 0.3s ease-in-out;

  &:hover {
    color: #facc15;
    transform: scale(1.2);
  }

  ${props =>
    props.isActive &&
    css`
      animation: ${pulse} 2s infinite;
      background: rgba(46, 125, 50, 0.1);
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(46, 125, 50, 0.3);
    `}

  & > svg {
    width: 24px;
    height: 24px;
  }

  &:hover > div {
    visibility: visible;
    opacity: 1;
    transform: translateX(-10px);
  }
`;

const Tooltip = styled.div`
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%) translateX(0);
  background: rgba(46, 125, 50, 0.9);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s ease-in-out;
  z-index: 1000;
`;

const LogoutLink = styled(NavLink)`
  margin-top: auto; /* Push logout icon to the bottom */
`;

function Sidebar() {
  const location = useLocation();

  const isActive = path => location.pathname === path;

  const handleLogout = () => {
    // Add logout logic here (e.g., clear token, redirect to home)
    console.log('User logged out');
    // Clear token (example)
    localStorage.removeItem('token');
    // Redirect to home (handled by Link to="/")
  };

  return (
    <SidebarContainer dir="rtl">
      <Logo src={logo} alt="Logo" />
      <NavLink to="/dashboard" isActive={isActive('/dashboard')}>
        <HomeIcon />
        <Tooltip>الرئيسية</Tooltip>
      </NavLink>
      <NavLink to="/legal-case-management" isActive={isActive('/legal-case-management')}>
        <DocumentTextIcon />
        <Tooltip>إدارة القضايا</Tooltip>
      </NavLink>
      <NavLink to="/client-management" isActive={isActive('/client-management')}>
        <UserIcon />
        <Tooltip>إدارة العملاء</Tooltip>
      </NavLink>
      <NavLink to="/analytics" isActive={isActive('/analytics')}>
        <ChartBarIcon />
        <Tooltip>التحليلات</Tooltip>
      </NavLink>
      <NavLink to="/calendar" isActive={isActive('/calendar')}>
        <CalendarIcon />
        <Tooltip>التقويم</Tooltip>
      </NavLink>
      <LogoutLink to="/" onClick={handleLogout}>
        <ArrowRightOnRectangleIcon />
        <Tooltip>تسجيل الخروج</Tooltip>
      </LogoutLink>
    </SidebarContainer>
  );
}

export default Sidebar;
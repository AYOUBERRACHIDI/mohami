import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Keyframes for Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ring = keyframes`
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(15deg);
  }
  20% {
    transform: rotate(-15deg);
  }
  30% {
    transform: rotate(15deg);
  }
  40% {
    transform: rotate(-15deg);
  }
  50% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

const dropdownFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const NavbarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to left, #2e7d32, #4ade80);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  margin-right: 70px; /* Shift left to avoid overlapping Sidebar */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 1001; /* Higher z-index than Sidebar */
  direction: rtl;
  animation: ${css`${fadeIn} 0.8s ease-in-out forwards`};
`;

const NavbarTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

const NavbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NotificationIcon = styled.div`
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.2);
    animation: ${css`${ring} 1s ease-in-out`};
  }

  & > svg {
    width: 24px;
    height: 24px;
  }
`;

const UserProfile = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: white;

  & > svg {
    width: 28px;
    height: 28px;
  }

  &:hover > div {
    display: block;
  }
`;

const UserName = styled.span`
  font-size: 1rem;
  font-weight: 500;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: ${props => (props.isOpen ? 'block' : 'none')};
  animation: ${css`${dropdownFade} 0.3s ease-in-out forwards`};
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1.5rem;
  color: #2e7d32;
  font-size: 0.9rem;
  transition: background 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background: rgba(46, 125, 50, 0.1);
  }
`;

function NavDash() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('جارٍ التحميل...');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUserName('غير معروف');
          toast.error('يرجى تسجيل الدخول أولاً');
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/avocats/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Fetch error: Status ${response.status}, Message: ${errorData.error || 'No error message'}`);
          throw new Error(errorData.error || 'Failed to fetch user');
        }

        const data = await response.json();
        setUserName(`${data.nom} ${data.prenom}`);
      } catch (error) {
        console.error('Error fetching user name:', error);
        setUserName('غير معروف');
        toast.error('خطأ في جلب بيانات المستخدم: ' + error.message);
        if (error.message.includes('Invalid token') || error.message.includes('No token provided') || error.message.includes('Avocat not found')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchUserName();
  }, [navigate]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
    navigate('/settings');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <NavbarContainer>
      <NavbarTitle>لوحة التحكم</NavbarTitle>
      <NavbarActions>
        <NotificationIcon>
          <BellIcon />
        </NotificationIcon>
        <UserProfile onClick={handleDropdownToggle}>
          <UserCircleIcon />
          <UserName>{userName}</UserName>
          <DropdownMenu isOpen={isDropdownOpen}>
            <DropdownItem onClick={handleProfileClick}>الملف الشخصي</DropdownItem>
            {/* <DropdownItem onClick={handleSettingsClick}>الإعدادات</DropdownItem> */}
            <DropdownItem onClick={handleLogout}>تسجيل الخروج</DropdownItem>
          </DropdownMenu>
        </UserProfile>
      </NavbarActions>
    </NavbarContainer>
  );
}

export default NavDash;
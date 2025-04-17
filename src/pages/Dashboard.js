import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Sidebar from '../components/Sidebar';
import NavDash from '../components/NavDash';
import { FaUserPlus, FaFileAlt, FaClock, FaCheckCircle } from 'react-icons/fa';

// Keyframes for Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #e6f0fa 0%, #f5f7fa 100%);
  direction: rtl;
`;

const MainContent = styled.div`
  flex: 1;
  margin-right: 70px;
  margin-top: 60px;
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

// Stat Cards Section
const StatCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCardWrapper = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-align: center;
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2e7d32;
  margin-bottom: 0.25rem;
`;

const StatPercentage = styled.div`
  font-size: 0.75rem;
  color: ${props => (props.isPositive ? '#2e7d32' : '#ef4444')};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`;

// Main Sections (Cases, Schedule, Quick Actions, Notifications, Activity Log)
const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: ${css`${fadeIn} 0.8s ease-in-out forwards`};
`;

const SubHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  text-align: right;
  margin-bottom: 1rem;
  color: #2e7d32;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -0.25rem;
    right: 0;
    width: 2.5rem;
    height: 2px;
    background: linear-gradient(to right, #2e7d32, #facc15);
    border-radius: 2px;
  }
`;

// Cases Table Styling
const CasesTable = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const TableWrapper = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const TableHeader = styled.th`
  padding: 0.75rem;
  background: rgba(46, 125, 50, 0.1);
  color: #2e7d32;
  font-weight: 600;
  text-align: right;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const TableRow = styled.tr`
  &:hover {
    background: rgba(46, 125, 50, 0.05);
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  color: #4b5563;
  text-align: right;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  margin-left: 0.25rem;
  background: ${props => props.color || 'transparent'};
  color: #ffffff;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: ${props => props.hoverColor || 'transparent'};
  }
`;

// Calendar Styling
const CalendarWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  text-align: center;
  font-size: 0.75rem;
  margin-bottom: 1rem;
`;

const CalendarHeader = styled.div`
  font-weight: 600;
  color: #2e7d32;
  padding: 0.5rem;
  background: rgba(46, 125, 50, 0.1);
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
`;

const CalendarDayHeader = styled.div`
  font-weight: 500;
  color: #4b5563;
  padding: 0.25rem;
`;

const CalendarDay = styled.div`
  padding: 0.5rem;
  border-radius: 0.25rem;
  background: ${props => (props.isSelected ? '#2e7d32' : 'transparent')};
  color: ${props => (props.isSelected ? '#ffffff' : '#4b5563')};
  transition: background 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background: ${props => (props.isSelected ? '#2e7d32' : 'rgba(46, 125, 50, 0.1)')};
  }
`;

// Weekly Schedule Styling
const ScheduleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  text-align: center;
  font-size: 0.75rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DayHeader = styled.h3`
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const ScheduleBox = styled.div`
  background: ${props => props.bgColor || 'rgba(0, 0, 0, 0.05)'};
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: ${props => props.textColor || '#4b5563'};
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(46, 125, 50, 0.2);
  }
`;

// Quick Actions Styling
const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
`;

const ActionButtonStyled = styled.button`
  padding: 0.75rem;
  background: linear-gradient(to right, #2e7d32, #1a4d1e);
  color: #ffffff;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(46, 125, 50, 0.5);
  transition: all 0.3s ease-in-out;

  &:hover {
    background: linear-gradient(to right, #1a4d1e, #2e7d32);
    box-shadow: 0 0 15px rgba(46, 125, 50, 0.7);
    transform: translateY(-2px);
  }
`;

// Notifications Styling
const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  background: rgba(255, 255, 255, 0.5);
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: background 0.3s ease-in-out;

  &:hover {
    background: rgba(46, 125, 50, 0.1);
  }
`;

const DismissButton = styled.button`
  padding: 0.25rem 0.5rem;
  background: #ef4444;
  color: #ffffff;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: #dc2626;
  }
`;

// Recent Activity Log Styling
const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 300px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-left: 3px solid #2e7d32;
  background: rgba(255, 255,CHIP, 0.5);
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #4b5563;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: rgba(46, 125, 50, 0.1);
  }
`;

const ActivityIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: #2e7d32;
  border-radius: 50%;
  color: #ffffff;
  font-size: 1rem;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTimestamp = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

function Dashboard() {
  // State to track the selected date
  const [selectedDate, setSelectedDate] = useState(16); // Default to April 16, 2025

  // Static Data for April 16, 2025
  const dataApril16 = {
    stats: {
      totalClients: 85,
      totalSessions: 720,
      totalCases: 150,
      totalConsultations: 45,
    },
    latestCases: [
      { id: 1, clientName: "أحمد قبالي", classification: "مدنية", court: "محكمة الدار البيضاء" },
      { id: 2, clientName: "مصطفى لاريك", classification: "تجارية", court: "محكمة الرباط" },
      { id: 3, clientName: "محمد شراف", classification: "جنائية", court: "محكمة مراكش" },
      { id: 4, clientName: "فاطمة الزهراء", classification: "أسرية", court: "محكمة فاس" },
      { id: 5, clientName: "يوسف بنعيسى", classification: "إدارية", court: "محكمة طنجة" },
      { id: 6, clientName: "خديجة العلوي", classification: "عمالية", court: "محكمة أكادير" },
      { id: 7, clientName: "عبد الله السعدي", classification: "مدنية", court: "محكمة وجدة" },
      { id: 8, clientName: "نور الدين المريني", classification: "تجارية", court: "محكمة مكناس" },
      { id: 9, clientName: "رشيد الصغير", classification: "جنائية", court: "محكمة تطوان" },
      { id: 10, clientName: "سلمى بنت محمد", classification: "أسرية", court: "محكمة الجديدة" },
    ],
    schedule: {
      lundi: [
        { time: "08:00", client: "حميد المرضي - جلسة", color: { bg: "#3b82f6", text: "#ffffff" } },
        { time: "14:00", client: "سعاد العمراني - استشارة", color: { bg: "#22c55e", text: "#ffffff" } },
        { time: "16:00", client: "كريم الزياني - جلسة", color: { bg: "#f97316", text: "#ffffff" } },
      ],
      mardi: [
        { time: "09:00", client: "خالد الراشدي - جلسة", color: { bg: "#a855f7", text: "#ffffff" } },
        { time: "11:30", client: "مريم الصغير - استشارة", color: { bg: "#10b981", text: "#ffffff" } },
        { time: "15:00", client: "سمير بنعبد الله - جلسة", color: { bg: "#ef4444", text: "#ffffff" } },
      ],
      mercredi: [
        { time: "10:00", client: "ليلى الصغير - جلسة", color: { bg: "#f97316", text: "#ffffff" } },
        { time: "13:00", client: "عمر بنحسن - استشارة", color: { bg: "#10b981", text: "#ffffff" } },
        { time: "17:00", client: "حسن العلوي - جلسة", color: { bg: "#8b5cf6", text: "#ffffff" } },
      ],
      jeudi: [
        { time: "09:30", client: "نورا الخالدي - جلسة", color: { bg: "#ef4444", text: "#ffffff" } },
        { time: "14:00", client: "زهرة المغربي - استشارة", color: { bg: "#22c55e", text: "#ffffff" } },
      ],
      vendredi: [
        { time: "11:00", client: "زينب المغربي - استشارة", color: { bg: "#8b5cf6", text: "#ffffff" } },
        { time: "13:00", client: "ياسر القاسمي - جلسة", color: { bg: "#3b82f6", text: "#ffffff" } },
      ],
    },
    notifications: [
      { id: 1, message: "جلسة جديدة مع أحمد قبالي في 08:00", timestamp: "2025-04-16 09:00" },
      { id: 2, message: "تم تحديث القضية رقم 123", timestamp: "2025-04-16 08:30" },
      { id: 3, message: "موعد استشارة مع سعاد العمراني اليوم 14:00", timestamp: "2025-04-16 07:45" },
      { id: 4, message: "تم إغلاق القضية رقم 150", timestamp: "2025-04-15 16:20" },
      { id: 5, message: "تمت إضافة عميل جديد: خديجة العلوي", timestamp: "2025-04-15 14:00" },
      { id: 6, message: "جلسة مع ياسر القاسمي في 13:00", timestamp: "2025-04-14 10:30" },
      { id: 7, message: "تم تحديث القضية رقم 145", timestamp: "2025-04-14 09:00" },
    ],
    activityLog: [
      { id: 1, action: "تمت إضافة عميل جديد: خديجة العلوي", timestamp: "2025-04-16 09:30", icon: <FaUserPlus /> },
      { id: 2, action: "تم تحديث القضية رقم 123", timestamp: "2025-04-16 08:30", icon: <FaFileAlt /> },
      { id: 3, action: "جدولة جلسة مع سمير بنعبد الله", timestamp: "2025-04-16 07:45", icon: <FaClock /> },
      { id: 4, action: "تم إغلاق القضية رقم 150", timestamp: "2025-04-15 16:20", icon: <FaCheckCircle /> },
      { id: 5, action: "تمت إضافة استشارة لزهرة المغربي", timestamp: "2025-04-15 14:00", icon: <FaClock /> },
      { id: 6, action: "تمت إضافة عميل جديد: نور الدين المريني", timestamp: "2025-04-14 11:00", icon: <FaUserPlus /> },
      { id: 7, action: "تم تحديث القضية رقم 145", timestamp: "2025-04-14 09:00", icon: <FaFileAlt /> },
    ],
  };

  // Static Data for April 20, 2025
  const dataApril20 = {
    stats: {
      totalClients: 87,
      totalSessions: 725,
      totalCases: 152,
      totalConsultations: 47,
    },
    latestCases: [
      { id: 11, clientName: "علي بن صالح", classification: "مدنية", court: "محكمة الدار البيضاء" },
      { id: 12, clientName: "حنان الخطيب", classification: "تجارية", court: "محكمة الرباط" },
      { id: 13, clientName: "إبراهيم العثماني", classification: "جنائية", court: "محكمة مراكش" },
      { id: 14, clientName: "لطيفة الصغير", classification: "أسرية", court: "محكمة فاس" },
      { id: 15, clientName: "خالد المغربي", classification: "إدارية", court: "محكمة طنجة" },
      { id: 16, clientName: "سعاد بنت أحمد", classification: "عمالية", court: "محكمة أكادير" },
      { id: 17, clientName: "محسن الراشدي", classification: "مدنية", court: "محكمة وجدة" },
      { id: 18, clientName: "زكرياء العلوي", classification: "تجارية", court: "محكمة مكناس" },
      { id: 19, clientName: "نبيلة الصغير", classification: "جنائية", court: "محكمة تطوان" },
      { id: 20, clientName: "أمينة بنت يوسف", classification: "أسرية", court: "محكمة الجديدة" },
    ],
    schedule: {
      lundi: [
        { time: "09:00", client: "علي بن صالح - جلسة", color: { bg: "#3b82f6", text: "#ffffff" } },
        { time: "13:00", client: "حنان الخطيب - استشارة", color: { bg: "#22c55e", text: "#ffffff" } },
      ],
      mardi: [
        { time: "10:00", client: "إبراهيم العثماني - جلسة", color: { bg: "#a855f7", text: "#ffffff" } },
        { time: "14:00", client: "لطيفة الصغير - استشارة", color: { bg: "#10b981", text: "#ffffff" } },
        { time: "16:30", client: "خالد المغربي - جلسة", color: { bg: "#ef4444", text: "#ffffff" } },
      ],
      mercredi: [
        { time: "08:30", client: "سعاد بنت أحمد - جلسة", color: { bg: "#f97316", text: "#ffffff" } },
        { time: "12:00", client: "محسن الراشدي - استشارة", color: { bg: "#10b981", text: "#ffffff" } },
      ],
      jeudi: [
        { time: "11:00", client: "زكرياء العلوي - جلسة", color: { bg: "#ef4444", text: "#ffffff" } },
        { time: "15:00", client: "نبيلة الصغير - استشارة", color: { bg: "#22c55e", text: "#ffffff" } },
        { time: "17:00", client: "أمينة بنت يوسف - جلسة", color: { bg: "#8b5cf6", text: "#ffffff" } },
      ],
      vendredi: [
        { time: "09:30", client: "خالد المغربي - استشارة", color: { bg: "#8b5cf6", text: "#ffffff" } },
        { time: "14:00", client: "علي بن صالح - جلسة", color: { bg: "#3b82f6", text: "#ffffff" } },
      ],
    },
    notifications: [
      { id: 8, message: "جلسة جديدة مع علي بن صالح في 09:00", timestamp: "2025-04-20 08:00" },
      { id: 9, message: "تم تحديث القضية رقم 152", timestamp: "2025-04-20 07:30" },
      { id: 10, message: "موعد استشارة مع حنان الخطيب اليوم 13:00", timestamp: "2025-04-20 06:45" },
      { id: 11, message: "تم إغلاق القضية رقم 151", timestamp: "2025-04-19 15:00" },
      { id: 12, message: "تمت إضافة عميل جديد: سعاد بنت أحمد", timestamp: "2025-04-19 13:00" },
      { id: 13, message: "جلسة مع أمينة بنت يوسف في 17:00", timestamp: "2025-04-18 11:00" },
      { id: 14, message: "تم تحديث القضية رقم 148", timestamp: "2025-04-18 09:30" },
    ],
    activityLog: [
      { id: 8, action: "تمت إضافة عميل جديد: سعاد بنت أحمد", timestamp: "2025-04-20 09:00", icon: <FaUserPlus /> },
      { id: 9, action: "تم تحديث القضية رقم 152", timestamp: "2025-04-20 07:30", icon: <FaFileAlt /> },
      { id: 10, action: "جدولة جلسة مع أمينة بنت يوسف", timestamp: "2025-04-20 06:45", icon: <FaClock /> },
      { id: 11, action: "تم إغلاق القضية رقم 151", timestamp: "2025-04-19 15:00", icon: <FaCheckCircle /> },
      { id: 12, action: "تمت إضافة استشارة لنبيلة الصغير", timestamp: "2025-04-19 13:00", icon: <FaClock /> },
      { id: 13, action: "تمت إضافة عميل جديد: زكرياء العلوي", timestamp: "2025-04-18 11:00", icon: <FaUserPlus /> },
      { id: 14, action: "تم تحديث القضية رقم 148", timestamp: "2025-04-18 09:30", icon: <FaFileAlt /> },
    ],
  };

  // Select the data based on the selected date
  const selectedData = selectedDate === 16 ? dataApril16 : dataApril20;

  const caseHeaders = ['رقم', "اسم العميل", "التصنيف", "المحكمة", "إجراءات"];

  // Calendar Data
  const daysInMonth = new Date(2025, 4, 0).getDate(); // 30 days in April 2025
  const firstDayOfMonth = new Date(2025, 3, 1).getDay(); // Tuesday (1)
  const daysOfWeek = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const calendarDays = Array(firstDayOfMonth).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const handleDismissNotification = (id) => {
    const updatedNotifications = selectedData.notifications.filter(notification => notification.id !== id);
    console.log(`Dismissed notification with id: ${id}`, updatedNotifications);
  };

  const handleDateClick = (day) => {
    if (day === 16 || day === 20) {
      setSelectedDate(day);
    }
  };

  return (
    <DashboardContainer>
      <NavDash />
      <Sidebar />
      <MainContent>
        {/* Stat Cards Section */}
        <StatCardGrid>
          <StatCardWrapper>
            <StatTitle>إجمالي العملاء</StatTitle>
            <StatValue>{selectedData.stats.totalClients}</StatValue>
            <StatPercentage isPositive={true}>
              <span>↑ 25%</span>
            </StatPercentage>
          </StatCardWrapper>
          <StatCardWrapper>
            <StatTitle>إجمالي الجلسات</StatTitle>
            <StatValue>{selectedData.stats.totalSessions}</StatValue>
            <StatPercentage isPositive={true}>
              <span>↑ 5%</span>
            </StatPercentage>
          </StatCardWrapper>
          <StatCardWrapper>
            <StatTitle>إجمالي القضايا</StatTitle>
            <StatValue>{selectedData.stats.totalCases}</StatValue>
            <StatPercentage isPositive={true}>
              <span>↑ 5%</span>
            </StatPercentage>
          </StatCardWrapper>
          <StatCardWrapper>
            <StatTitle>إجمالي الاستشارات</StatTitle>
            <StatValue>{selectedData.stats.totalConsultations}</StatValue>
            <StatPercentage isPositive={true}>
              <span>↑ 25%</span>
            </StatPercentage>
          </StatCardWrapper>
        </StatCardGrid>

        {/* Main Sections */}
        <MainGrid>
          <LeftColumn>
            {/* Latest Cases */}
            <Section>
              <SubHeader>أحدث القضايا</SubHeader>
              <CasesTable>
                <TableWrapper>
                  <thead>
                    <tr>
                      {caseHeaders.map((header, index) => (
                        <TableHeader key={index}>{header}</TableHeader>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedData.latestCases.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.clientName}</TableCell>
                        <TableCell>{row.classification}</TableCell>
                        <TableCell>{row.court}</TableCell>
                        <TableCell>
                          <ActionButton color="#3b82f6" hoverColor="#2563eb" onClick={() => console.log('View:', row)}>
                            عرض
                          </ActionButton>
                          <ActionButton color="#10b981" hoverColor="#059669" onClick={() => console.log('Edit:', row)}>
                            تعديل
                          </ActionButton>
                          <ActionButton color="#ef4444" hoverColor="#dc2626" onClick={() => console.log('Delete:', row)}>
                            حذف
                          </ActionButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </TableWrapper>
              </CasesTable>
            </Section>

            {/* Quick Actions */}
            <Section>
              <SubHeader>إجراءات سريعة</SubHeader>
              <QuickActionsGrid>
                <ActionButtonStyled onClick={() => console.log('Add Client')}>
                  إضافة عميل
                </ActionButtonStyled>
                <ActionButtonStyled onClick={() => console.log('Schedule Session')}>
                  جدولة جلسة
                </ActionButtonStyled>
                <ActionButtonStyled onClick={() => console.log('Create Case')}>
                  إنشاء قضية
                </ActionButtonStyled>
                <ActionButtonStyled onClick={() => console.log('Add Consultation')}>
                  إضافة استشارة
                </ActionButtonStyled>
              </QuickActionsGrid>
            </Section>

            {/* Recent Activity Log */}
            <Section>
              <SubHeader>سجل الأنشطة الأخيرة</SubHeader>
              <ActivityList>
                {selectedData.activityLog.map((activity) => (
                  <ActivityItem key={activity.id}>
                    <ActivityIcon>{activity.icon}</ActivityIcon>
                    <ActivityContent>
                      <p>{activity.action}</p>
                      <ActivityTimestamp>{activity.timestamp}</ActivityTimestamp>
                    </ActivityContent>
                  </ActivityItem>
                ))}
              </ActivityList>
            </Section>
          </LeftColumn>

          <RightColumn>
            {/* Calendar and Weekly Schedule */}
            <Section>
              <SubHeader>تخطيط الأسبوع</SubHeader>
              {/* Calendar */}
              <CalendarHeader>أبريل 2025</CalendarHeader>
              <CalendarWrapper>
                {daysOfWeek.map((day, index) => (
                  <CalendarDayHeader key={index}>{day}</CalendarDayHeader>
                ))}
                {calendarDays.map((day, index) => (
                  <CalendarDay
                    key={index}
                    isSelected={day === selectedDate}
                    onClick={() => handleDateClick(day)}
                  >
                    {day || ''}
                  </CalendarDay>
                ))}
              </CalendarWrapper>

              {/* Weekly Schedule */}
              <ScheduleGrid>
                {["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"].map((day, index) => (
                  <DayColumn key={day}>
                    <DayHeader>{day}</DayHeader>
                    {selectedData.schedule[Object.keys(selectedData.schedule)[index]].map((event, idx) => (
                      <ScheduleBox key={idx} bgColor={event.color.bg} textColor={event.color.text}>
                        <p>{event.time}</p>
                        <p>{event.client}</p>
                      </ScheduleBox>
                    ))}
                  </DayColumn>
                ))}
              </ScheduleGrid>
            </Section>

            {/* Notifications */}
            <Section>
              <SubHeader>الإشعارات</SubHeader>
              <NotificationList>
                {selectedData.notifications.map((notification) => (
                  <NotificationItem key={notification.id}>
                    <div>
                      <p>{notification.message}</p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{notification.timestamp}</p>
                    </div>
                    <DismissButton onClick={() => handleDismissNotification(notification.id)}>
                      إغلاق
                    </DismissButton>
                  </NotificationItem>
                ))}
              </NotificationList>
            </Section>
          </RightColumn>
        </MainGrid>
      </MainContent>
    </DashboardContainer>
  );
}

export default Dashboard;
import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Sidebar from '../components/Sidebar';
import NavDash from '../components/NavDash';
import { FaUserPlus, FaFileAlt, FaClock, FaCheckCircle, FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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
  &:last-child {
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  background: ${props => props.color || 'transparent'};
  color: #ffffff;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: ${props => props.hoverColor || 'transparent'};
  }

  svg {
    font-size: 1rem;
  }
`;

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
  background: rgba(255, 255, 255, 0.5);
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
  const [selectedDate, setSelectedDate] = useState(16);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalSessions: 0,
    totalCases: 0,
    totalConsultations: 0,
  });
  const [latestCases, setLatestCases] = useState([]);
  const navigate = useNavigate();

  // Static data for schedule, notifications, and activity log
  const staticData = {
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('يرجى تسجيل الدخول أولاً');
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/affaires/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Fetch stats error: Status ${response.status}, Message: ${errorData.message || 'No error message'}`);
          throw new Error(errorData.message || 'Failed to fetch stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('خطأ في جلب الإحصائيات: ' + error.message);
        if (error.message.includes('Invalid token') || error.message.includes('No token provided') || error.message.includes('Unauthorized')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    const fetchCases = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('يرجى تسجيل الدخول أولاً');
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/affaires', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Fetch cases error: Status ${response.status}, Message: ${errorData.message || 'No error message'}`);
          throw new Error(errorData.message || 'Failed to fetch cases');
        }

        const data = await response.json();
        console.log('Fetched cases:', data);

        const mappedCases = data.map((affaire, index) => ({
          id: index + 1,
          clientName: affaire.client_id ? `${affaire.client_id.nom || ''} ${affaire.client_id.prenom || ''}`.trim() : 'غير متوفر',
          classification: affaire.type_id?.nom || 'غير محدد',
          court: affaire.titre || 'غير متوفر',
          _id: affaire._id, // Store _id for actions
        }));
        setLatestCases(mappedCases.slice(0, 10));
        console.log('Mapped latestCases:', mappedCases);
      } catch (error) {
        console.error('Error fetching cases:', error);
        toast.error('خطأ في جلب القضايا: ' + error.message);
        if (error.message.includes('Invalid token') || error.message.includes('No token provided') || error.message.includes('Unauthorized')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchStats();
    fetchCases();
  }, [navigate]);

  const caseHeaders = ['رقم', "اسم العميل", "التصنيف", "المحكمة", "إجراءات"];

  const daysInMonth = new Date(2025, 4, 0).getDate();
  const firstDayOfMonth = new Date(2025, 3, 1).getDay();
  const daysOfWeek = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const calendarDays = Array(firstDayOfMonth).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const handleDismissNotification = (id) => {
    console.log(`Dismissed notification with id: ${id}`);
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
        <StatCardGrid>
          <StatCardWrapper>
            <StatTitle>إجمالي العملاء</StatTitle>
            <StatValue>{stats.totalClients}</StatValue>
            <StatPercentage isPositive={true}>
              <span>↑ 25%</span>
            </StatPercentage>
          </StatCardWrapper>
          <StatCardWrapper>
            <StatTitle>إجمالي الجلسات</StatTitle>
            <StatValue>{stats.totalSessions}</StatValue>
            <StatPercentage isPositive={true}>
              <span>↑ 5%</span>
            </StatPercentage>
          </StatCardWrapper>
          <StatCardWrapper>
            <StatTitle>إجمالي القضايا</StatTitle>
            <StatValue>{stats.totalCases}</StatValue>
            <StatPercentage isPositive={true}>
              <span>↑ 5%</span>
            </StatPercentage>
          </StatCardWrapper>
          <StatCardWrapper>
            <StatTitle>إجمالي الاستشارات</StatTitle>
            <StatValue>{stats.totalConsultations}</StatValue>
            <StatPercentage isPositive={true}>
              <span>↑ 25%</span>
            </StatPercentage>
          </StatCardWrapper>
        </StatCardGrid>

        <MainGrid>
          <LeftColumn>
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
                    {latestCases.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5}>لا توجد قضايا متاحة</TableCell>
                      </TableRow>
                    ) : (
                      latestCases.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.clientName}</TableCell>
                          <TableCell>{row.classification}</TableCell>
                          <TableCell>{row.court}</TableCell>
                          <TableCell>
                            <ActionButton
                              color="#3b82f6"
                              hoverColor="#2563eb"
                              onClick={() => navigate('/legal-case-management')}
                              title="عرض القضية"
                            >
                              <FaEye />
                            </ActionButton>
                            <ActionButton
                              color="#10b981"
                              hoverColor="#059669"
                              onClick={() => navigate('/legal-case-management')}
                              title="تعديل القضية"
                            >
                              <FaPencilAlt />
                            </ActionButton>
                            <ActionButton
                              color="#ef4444"
                              hoverColor="#dc2626"
                              onClick={() => console.log('Delete:', row)}
                              title="حذف القضية"
                            >
                              <FaTrash />
                            </ActionButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </tbody>
                </TableWrapper>
              </CasesTable>
            </Section>

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

            <Section>
              <SubHeader>سجل الأنشطة الأخيرة</SubHeader>
              <ActivityList>
                {staticData.activityLog.map((activity) => (
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
            <Section>
              <SubHeader>تخطيط الأسبوع</SubHeader>
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

              <ScheduleGrid>
                {["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"].map((day, index) => (
                  <DayColumn key={day}>
                    <DayHeader>{day}</DayHeader>
                    {staticData.schedule[Object.keys(staticData.schedule)[index]].map((event, idx) => (
                      <ScheduleBox key={idx} bgColor={event.color.bg} textColor={event.color.text}>
                        <p>{event.time}</p>
                        <p>{event.client}</p>
                      </ScheduleBox>
                    ))}
                  </DayColumn>
                ))}
              </ScheduleGrid>
            </Section>

            <Section>
              <SubHeader>الإشعارات</SubHeader>
              <NotificationList>
                {staticData.notifications.map((notification) => (
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
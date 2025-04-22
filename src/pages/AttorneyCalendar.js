import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NavDash from '../components/NavDash';
import { FaPlus, FaDownload, FaGavel, FaComments, FaUsers, FaClock, FaSearch } from 'react-icons/fa';

// Customize moment to use standard Arabic numerals (0-9)
moment.locale('ar', {
  preformat: (string) => {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return string.replace(/[0-9]/g, (match) => arabicNumerals[parseInt(match)]);
  },
  postformat: (string) => {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return string.replace(/[٠١٢٣٤٥٦٧٨٩]/g, (match) => arabicNumerals.indexOf(match).toString());
  },
});

// Setup moment localizer for react-big-calendar
const localizer = momentLocalizer(moment);

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
const CalendarContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #ffffff;
  direction: rtl;
`;

const MainContent = styled.div`
  flex: 1;
  margin-right: 70px;
  margin-top: 60px;
  padding: 2rem;
  overflow-y: auto;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
    margin-right: 0;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2e7d32;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const AddButton = styled.button`
  padding: 0.5rem 1.25rem;
  background: #2e7d32;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #1b5e20;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 1rem;
    font-size: 0.75rem;
  }
`;

const ExportButton = styled.button`
  padding: 0.5rem 1.25rem;
  background: #0288d1;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #01579b;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 1rem;
    font-size: 0.75rem;
  }
`;

const FilterSearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 0.5rem;
  width: 200px;
  transition: all 0.3s ease-in-out;

  &:focus-within {
    border-color: #2e7d32;
    box-shadow: 0 4px 10px rgba(46, 125, 50, 0.3);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: #333333;
  flex: 1;
  background: transparent;

  &::placeholder {
    color: #666666;
  }
`;

const SearchIcon = styled(FaSearch)`
  color: #666666;
  margin-left: 0.5rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #333333;
  background: #ffffff;
  width: 150px;
  transition: all 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 4px 10px rgba(46, 125, 50, 0.3);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ClearFilters = styled.button`
  padding: 0.5rem 1rem;
  background: #e0e0e0;
  color: #333333;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #d0d0d0;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }
`;

const CalendarSection = styled.div`
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  animation: ${css`${fadeIn} 0.8s ease-in-out forwards`};

  @media (min-width: 769px) {
    padding: 1.5rem;
  }
`;

const StyledCalendar = styled(Calendar)`
  .rbc-calendar {
    min-height: 900px;
    height: auto;
    @media (max-width: 768px) {
      min-height: 600px;
    }
  }

  .rbc-toolbar {
    margin-bottom: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    direction: rtl;
    background: #f9f9f9;
    padding: 0.75rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    .rbc-toolbar-label {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2e7d32;
      text-align: center;
      flex: 1;
      margin: 0 1rem;
      @media (max-width: 768px) {
        font-size: 1rem;
        margin: 0.5rem 0;
      }
    }

    .rbc-btn-group {
      display: flex;
      gap: 0.5rem;

      button {
        background: #ffffff;
        border: 1px solid #e0e0e0;
        color: #2e7d32;
        font-size: 0.875rem;
        font-weight: 500;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        cursor: pointer;
        transition: all 0.3s ease-in-out;

        &:hover {
          background: #2e7d32;
          color: #ffffff;
          border-color: #2e7d32;
        }

        &:focus {
          outline: 2px solid #2e7d32;
        }

        &.rbc-active {
          background: #2e7d32;
          color: #ffffff;
          border-color: #2e7d32;
        }

        @media (max-width: 768px) {
          font-size: 0.75rem;
          padding: 0.4rem 0.8rem;
        }
      }

      &:first-child {
        margin-right: 1rem;
      }

      &:last-child {
        margin-left: 1rem;
      }
    }
  }

  .rbc-event {
    background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
    border-radius: 0.25rem;
    padding: 0.75rem;
    font-size: 1rem;
    min-height: 40px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid #ffffff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
    white-space: normal;
    overflow-wrap: break-word;
    z-index: 1;
    margin: 2px 0;

    &[data-type="consultation"] {
      background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
    }
    &[data-type="meeting"] {
      background: linear-gradient(135deg, #0288d1 0%, #01579b 100%);
    }
    &[data-type="deadline"] {
      background: linear-gradient(135deg, #7b1fa2 0%, #4a0072 100%);
    }

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      z-index: 2;
    }

    &:focus {
      outline: 2px solid #2e7d32;
    }

    @media (max-width: 768px) {
      font-size: 0.875rem;
      padding: 0.5rem;
      min-height: 30px;
    }
  }

  .rbc-event-content {
    white-space: normal;
    line-height: 1.4;
    overflow: visible;
    font-size: inherit;
  }

  .rbc-time-view {
    border: 1px solid #e0e0e0;
    min-height: 800px;
    @media (max-width: 768px) {
      min-height: 500px;
    }

    .rbc-time-header {
      background: #ffffff;
      border-bottom: 1px solid #e0e0e0;

      .rbc-header {
        font-weight: 600;
        color: #2e7d32;
        padding: 0.75rem;
        font-size: 1rem;
        @media (max-width: 768px) {
          font-size: 0.875rem;
        }
      }
    }

    .rbc-time-content {
      border-top: none;
      overflow: visible;

      .rbc-time-gutter {
        background: #f5f5f5;

        .rbc-timeslot-group {
          font-size: 0.875rem;
          color: #333333;
          padding: 0.5rem;
          @media (max-width: 768px) {
            font-size: 0.75rem;
          }
        }
      }

      .rbc-current-time-indicator {
        background: #d32f2f;
        height: 2px;
      }
    }

    .rbc-time-slot {
      min-height: 40px;
      min-width: 100px;
      @media (max-width: 768px) {
        min-height: 30px;
        min-width: 80px;
      }
    }
  }

  .rbc-month-view {
    border: 1px solid #e0e0e0;

    .rbc-month-row {
      min-height: 250px;
      @media (max-width: 768px) {
        min-height: 100px;
      }

      .rbc-row-bg {
        .rbc-day-bg.rbc-today {
          background: rgba(46, 125, 50, 0.2);
          border: 1px solid #2e7d32;
        }
      }

      .rbc-date-cell {
        font-size: 0.875rem;
        color: #333333;
        padding: 0.75rem;
        text-align: center;

        &.rbc-now {
          background: #2e7d32;
          color: #ffffff;
          border-radius: 0.25rem;
        }

        @media (max-width: 768px) {
          font-size: 0.75rem;
          padding: 0.5rem;
        }
      }
    }

    .rbc-event {
      margin: 0.5rem 0.25rem;
      @media (max-width: 768px) {
        margin: 0.3rem 0.2rem;
      }
    }
  }

  .rbc-agenda-view {
    .rbc-agenda-date-cell,
    .rbc-agenda-time-cell {
      font-size: 0.875rem;
      color: #333333;
    }

    .rbc-agenda-event-cell {
      font-size: 0.875rem;
      color: #2e7d32;
    }
  }

  .rbc-time-header-content {
    .rbc-time-header {
      display: flex;

      .rbc-header {
        flex: 1;
        text-align: center;
      }
    }
  }

  .rbc-time-content {
    .rbc-day-slot {
      &.rbc-time-column {
        .rbc-timeslot-group {
          min-height: 40px;
        }
      }
    }
  }
`;

const AgendaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const AgendaDateHeader = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2e7d32;
  margin: 1rem 0 0.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const AgendaEvent = styled.div`
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.bgColor || '#2e7d32'};
  transition: transform 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: 2px solid #2e7d32;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const AgendaEventTime = styled.p`
  font-weight: 600;
  color: #2e7d32;
  margin: 0;
  font-size: 1rem;
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const AgendaEventDetail = styled.p`
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #333333;
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const AgendaEventLocation = styled.p`
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #666666;
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const AgendaEventNotes = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: #666666;
  font-style: italic;
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

function AttorneyCalendar() {
  const [view, setView] = useState(() => localStorage.getItem('calendarView') || 'week');
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'حميد المرضي - جلسة محكمة',
      start: new Date(2025, 3, 14, 9, 0),
      end: new Date(2025, 3, 14, 10, 0),
      client: 'حميد المرضي',
      type: 'court',
      location: 'محكمة الدار البيضاء',
      status: 'confirmed',
      notes: 'قضية مدنية، ملف رقم 123/2025',
      color: '#2e7d32',
    },
    {
      id: 2,
      title: 'سعاد العمراني - استشارة',
      start: new Date(2025, 3, 14, 14, 0),
      end: new Date(2025, 3, 14, 15, 30),
      client: 'سعاد العمراني',
      type: 'consultation',
      location: 'المكتب',
      status: 'pending',
      notes: 'مناقشة عقد عمل جديد',
      color: '#4caf50',
    },
    {
      id: 3,
      title: 'كريم الزياني - اجتماع',
      start: new Date(2025, 3, 15, 10, 0),
      end: new Date(2025, 3, 15, 11, 0),
      client: 'كريم الزياني',
      type: 'meeting',
      location: 'مكتب الرباط',
      status: 'confirmed',
      notes: 'تخطيط استراتيجية القضية',
      color: '#0288d1',
    },
    {
      id: 4,
      title: 'خالد الراشدي - جلسة محكمة',
      start: new Date(2025, 3, 15, 13, 0),
      end: new Date(2025, 3, 15, 14, 0),
      client: 'خالد الراشدي',
      type: 'court',
      location: 'محكمة مراكش',
      status: 'confirmed',
      notes: 'قضية تجارية، ملف رقم 456/2025',
      color: '#2e7d32',
    },
    {
      id: 5,
      title: 'مريم الصغير - استشارة',
      start: new Date(2025, 3, 16, 9, 0),
      end: new Date(2025, 3, 16, 10, 30),
      client: 'مريم الصغير',
      type: 'consultation',
      location: 'المكتب',
      status: 'pending',
      notes: 'استشارة قانونية حول الإرث',
      color: '#4caf50',
    },
    {
      id: 6,
      title: 'سمير بنعبد الله - موعد نهائي',
      start: new Date(2025, 3, 16, 15, 0),
      end: new Date(2025, 3, 16, 16, 0),
      client: 'سمير بنعبد الله',
      type: 'deadline',
      location: 'محكمة فاس',
      status: 'confirmed',
      notes: 'تقديم مستندات القضية',
      color: '#7b1fa2',
    },
    {
      id: 7,
      title: 'ليلى الصغير - جلسة محكمة',
      start: new Date(2025, 3, 17, 9, 30),
      end: new Date(2025, 3, 17, 11, 0),
      client: 'ليلى الصغير',
      type: 'court',
      location: 'محكمة طنجة',
      status: 'cancelled',
      notes: 'تم إلغاء الجلسة من قبل المحكمة',
      color: '#2e7d32',
    },
    {
      id: 8,
      title: 'عمر بنحسن - اجتماع',
      start: new Date(2025, 3, 17, 14, 0),
      end: new Date(2025, 3, 17, 15, 0),
      client: 'عمر بنحسن',
      type: 'meeting',
      location: 'مكتب أكادير',
      status: 'confirmed',
      notes: 'مناقشة قضية جديدة',
      color: '#0288d1',
    },
    {
      id: 9,
      title: 'نورا الخالدي - استشارة',
      start: new Date(2025, 3, 18, 10, 0),
      end: new Date(2025, 3, 18, 11, 30),
      client: 'نورا الخالدي',
      type: 'consultation',
      location: 'المكتب',
      status: 'confirmed',
      notes: 'استشارة حول عقار',
      color: '#4caf50',
    },
    {
      id: 10,
      title: 'زهرة المغربي - موعد نهائي',
      start: new Date(2025, 3, 18, 13, 0),
      end: new Date(2025, 3, 18, 14, 0),
      client: 'زهرة المغربي',
      type: 'deadline',
      location: 'محكمة وجدة',
      status: 'pending',
      notes: 'إعداد مذكرة دفاع',
      color: '#7b1fa2',
    },
    {
      id: 11,
      title: 'يوسف الإدريسي - جلسة محكمة',
      start: new Date(2025, 3, 20, 10, 0),
      end: new Date(2025, 3, 20, 11, 30),
      client: 'يوسف الإدريسي',
      type: 'court',
      location: 'محكمة الدار البيضاء',
      status: 'confirmed',
      notes: 'قضية عائلية، ملف رقم 789/2025',
      color: '#2e7d32',
    },
    {
      id: 12,
      title: 'فاطمة الزهراء - استشارة',
      start: new Date(2025, 3, 20, 14, 0),
      end: new Date(2025, 3, 20, 15, 0),
      client: 'فاطمة الزهراء',
      type: 'consultation',
      location: 'المكتب',
      status: 'pending',
      notes: 'مناقشة قضية طلاق',
      color: '#4caf50',
    },
    {
      id: 13,
      title: 'محمد الصغير - اجتماع',
      start: new Date(2025, 3, 21, 9, 0),
      end: new Date(2025, 3, 21, 10, 0),
      client: 'محمد الصغير',
      type: 'meeting',
      location: 'مكتب الرباط',
      status: 'confirmed',
      notes: 'مراجعة وثائق القضية',
      color: '#0288d1',
    },
    {
      id: 14,
      title: 'حسناء العلوي - جلسة محكمة',
      start: new Date(2025, 3, 21, 13, 0),
      end: new Date(2025, 3, 21, 14, 30),
      client: 'حسناء العلوي',
      type: 'court',
      location: 'محكمة مراكش',
      status: 'confirmed',
      notes: 'قضية عقارية، ملف رقم 101/2025',
      color: '#2e7d32',
    },
    {
      id: 15,
      title: 'عبد الله بنعيسى - استشارة',
      start: new Date(2025, 3, 22, 9, 30),
      end: new Date(2025, 3, 22, 10, 30),
      client: 'عبد الله بنعيسى',
      type: 'consultation',
      location: 'المكتب',
      status: 'confirmed',
      notes: 'استشارة حول ضرائب الشركات',
      color: '#4caf50',
    },
    {
      id: 16,
      title: 'خديجة المريني - موعد نهائي',
      start: new Date(2025, 3, 22, 16, 0),
      end: new Date(2025, 3, 22, 17, 0),
      client: 'خديجة المريني',
      type: 'deadline',
      location: 'محكمة فاس',
      status: 'pending',
      notes: 'تسليم مستندات إضافية',
      color: '#7b1fa2',
    },
    {
      id: 17,
      title: 'إبراهيم الكبير - جلسة محكمة',
      start: new Date(2025, 3, 23, 9, 0),
      end: new Date(2025, 3, 23, 10, 30),
      client: 'إبراهيم الكبير',
      type: 'court',
      location: 'محكمة طنجة',
      status: 'confirmed',
      notes: 'قضية جنائية، ملف رقم 202/2025',
      color: '#2e7d32',
    },
    {
      id: 18,
      title: 'سلمى بناني - اجتماع',
      start: new Date(2025, 3, 23, 14, 0),
      end: new Date(2025, 3, 23, 15, 0),
      client: 'سلمى بناني',
      type: 'meeting',
      location: 'مكتب أكادير',
      status: 'confirmed',
      notes: 'إعداد استراتيجية قانونية',
      color: '#0288d1',
    },
    {
      id: 19,
      title: 'رشيد العماري - استشارة',
      start: new Date(2025, 3, 24, 10, 0),
      end: new Date(2025, 3, 24, 11, 0),
      client: 'رشيد العماري',
      type: 'consultation',
      location: 'المكتب',
      status: 'pending',
      notes: 'مناقشة قضية إيجار',
      color: '#4caf50',
    },
    {
      id: 20,
      title: 'نوال الحسني - موعد نهائي',
      start: new Date(2025, 3, 24, 13, 0),
      end: new Date(2025, 3, 24, 14, 0),
      client: 'نوال الحسني',
      type: 'deadline',
      location: 'محكمة وجدة',
      status: 'confirmed',
      notes: 'مراجعة التقرير النهائي',
      color: '#7b1fa2',
    },
  ]);

  const navigate = useNavigate();
  const location = useLocation();

  const eventTypes = [
    { value: 'court', label: 'جلسة محكمة', color: '#2e7d32', icon: <FaGavel /> },
    { value: 'consultation', label: 'استشارة', color: '#4caf50', icon: <FaComments /> },
    { value: 'meeting', label: 'اجتماع', color: '#0288d1', icon: <FaUsers /> },
    { value: 'deadline', label: 'موعد نهائي', color: '#7b1fa2', icon: <FaClock /> },
  ];

  const statusOptions = [
    { value: 'confirmed', label: 'مؤكد' },
    { value: 'pending', label: 'معلق' },
    { value: 'cancelled', label: 'ملغى' },
  ];

  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    const result = events.filter(event => {
      const matchesType = filterType === 'all' || event.type === filterType;
      const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
      const matchesSearch =
        searchQuery === '' ||
        (event.client && event.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.notes && event.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesStatus && matchesSearch;
    });
    console.log('Filtered events:', result);
    return result;
  }, [events, filterType, filterStatus, searchQuery]);

  // Validate events on mount
  useEffect(() => {
    console.log('Initial events:', events);
    events.forEach(event => {
      if (!(event.start instanceof Date) || !(event.end instanceof Date)) {
        console.warn(`Invalid date in event ID ${event.id}:`, event);
      }
    });
  }, [events]);

  // Log day view events for debugging
  useEffect(() => {
    if (view === 'day') {
      const dayEvents = filteredEvents.filter(event =>
        moment(event.start).isSame(moment(date), 'day')
      );
      console.log('Day view events:', dayEvents);
    }
  }, [view, date, filteredEvents]);

  // Handle updates from AppointmentForm
  useEffect(() => {
    if (location.state?.action && location.state?.event) {
      const { action, event } = location.state;
      if (action === 'add') {
        setEvents(prev => [...prev, {
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }]);
        toast.success(`تم إضافة موعد ${event.client} بنجاح`);
      } else if (action === 'update') {
        setEvents(prev => prev.map(e => (e.id === event.id ? {
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        } : e)));
        toast.success(`تم تحديث موعد ${event.client} بنجاح`);
      } else if (action === 'delete') {
        setEvents(prev => prev.filter(e => e.id !== event.id));
        toast.success(`تم حذف موعد ${event.client} بنجاح`);
      }
      navigate('/calendar', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Persist calendar view
  useEffect(() => {
    localStorage.setItem('calendarView', view);
    console.log('Current view:', view);
  }, [view]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleClearFilters = () => {
    setFilterType('all');
    setFilterStatus('all');
    setSearchQuery('');
  };

  const calculateDuration = (start, end) => {
    const diff = moment(end).diff(moment(start), 'minutes');
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours > 0 ? `${hours}س ` : ''}${minutes > 0 ? `${minutes}د` : ''}`.trim() || '0د';
  };

  const handleAddAppointment = () => {
    navigate('/appointment/new', { state: { events } });
  };

  const handleSelectEvent = (event) => {
    navigate(`/appointment/${event.id}`, { state: { event, events } });
  };

  const handleExportPDF = () => {
    const filteredEvents = events.filter(event => {
      const matchesType = filterType === 'all' || event.type === filterType;
      const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
      const matchesSearch =
        searchQuery === '' ||
        (event.client && event.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.notes && event.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesStatus && matchesSearch;
    });

    if (filteredEvents.length === 0) {
      toast.error('لا توجد مواعيد للتصدير');
      return;
    }

    const doc = new jsPDF();
    doc.setFont('Amiri', 'normal');
    doc.setFontSize(16);
    doc.text('تقويم المحامي', 105, 10, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`التاريخ: ${moment().locale('ar').format('YYYY-MM-DD')}`, 190, 20, { align: 'right' });
    const typeLabel = filterType === 'all' ? 'الكل' : eventTypes.find(t => t.value === filterType)?.label || 'الكل';
    const statusLabel = filterStatus === 'all' ? 'الكل' : statusOptions.find(s => s.value === filterStatus)?.label || 'الكل';
    doc.text(
      `تصفية: نوع=${typeLabel}, حالة=${statusLabel}${searchQuery ? `, البحث=${searchQuery}` : ''}`,
      190,
      25,
      { align: 'right' }
    );
    let y = 35;

    filteredEvents.forEach(event => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(
        `${moment(event.start).locale('ar').format('YYYY-MM-DD HH:mm')} - ${event.title} (${event.location}) - ${statusOptions.find(s => s.value === event.status)?.label || event.status}`,
        190,
        y,
        { align: 'right' }
      );
      if (event.notes) {
        doc.setFontSize(10);
        doc.text(`ملاحظات: ${event.notes}`, 190, y + 5, { align: 'right' });
        doc.setFontSize(12);
        y += 10;
      } else {
        y += 7;
      }
    });

    doc.save('calendar_events.pdf');
    toast.success('تم تصدير المواعيد كملف PDF');
  };

  const CustomAgendaView = ({ events, date }) => {
    const startOfWeek = moment(date).startOf('week');
    const endOfWeek = moment(date).endOf('week');
    const weekEvents = events.filter(event =>
      moment(event.start).isBetween(startOfWeek, endOfWeek, null, '[]')
    );

    const groupedEvents = weekEvents.reduce((acc, event) => {
      const dateStr = moment(event.start).format('YYYY-MM-DD');
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(event);
      return acc;
    }, {});

    return (
      <AgendaList>
        {Object.keys(groupedEvents).map(date => (
          <div key={date}>
            <AgendaDateHeader>
              {moment(date).locale('ar').format('dddd، D MMMM YYYY')}
            </AgendaDateHeader>
            {groupedEvents[date].map(event => (
              <AgendaEvent
                key={event.id}
                bgColor={event.color}
                onClick={() => handleSelectEvent(event)}
                tabIndex={0}
                onKeyPress={e => e.key === 'Enter' && handleSelectEvent(event)}
              >
                <AgendaEventTime>
                  {`${moment(event.start).format('HH:mm')} - ${moment(event.end).format('HH:mm')} (${calculateDuration(event.start, event.end)})`}
                </AgendaEventTime>
                <AgendaEventDetail>{event.client}</AgendaEventDetail>
                <AgendaEventDetail>{eventTypes.find(t => t.value === event.type)?.label || event.type}</AgendaEventDetail>
                <AgendaEventLocation>
                  {event.location} - {statusOptions.find(s => s.value === event.status)?.label || event.status}
                </AgendaEventLocation>
                {event.notes && <AgendaEventNotes>{event.notes}</AgendaEventNotes>}
              </AgendaEvent>
            ))}
          </div>
        ))}
        {weekEvents.length === 0 && (
          <p style={{ color: '#333333', textAlign: 'center' }}>لا توجد مواعيد هذا الأسبوع</p>
        )}
      </AgendaList>
    );
  };

  return (
    <CalendarContainer>
      <NavDash />
      <Sidebar />
      <MainContent>
        <HeaderSection>
          <Title>تقويم المحامي</Title>
          <ActionButtons>
            <AddButton onClick={handleAddAppointment}>
              <FaPlus /> إضافة موعد
            </AddButton>
            <ExportButton onClick={handleExportPDF}>
              <FaDownload /> تصدير كـ PDF
            </ExportButton>
          </ActionButtons>
        </HeaderSection>

        <FilterSearchBar>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="ابحث حسب العميل أو الملاحظات"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </SearchContainer>
          <FilterSelect value={filterType} onChange={handleFilterTypeChange}>
            <option value="all">كل الأنواع</option>
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </FilterSelect>
          <FilterSelect value={filterStatus} onChange={handleFilterStatusChange}>
            <option value="all">كل الحالات</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </FilterSelect>
          <ClearFilters onClick={handleClearFilters}>مسح الكل</ClearFilters>
        </FilterSearchBar>

        <CalendarSection>
          <StyledCalendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            defaultDate={new Date(2025, 3, 14)}
            onSelectEvent={handleSelectEvent}
            min={new Date(2025, 3, 14, 9, 0)}
            max={new Date(2025, 3, 14, 18, 0)}
            formats={{
              timeGutterFormat: (date, culture, localizer) =>
                view === 'day' ? localizer.format(date, 'HH:mm', culture) : '',
              eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                view === 'day'
                  ? `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`
                  : localizer.format(start, 'D MMMM', culture),
              dayHeaderFormat: 'dddd D MMMM',
            }}
            components={{
              agenda: CustomAgendaView,
              event: ({ event }) => (
                <span>
                  {eventTypes.find(t => t.value === event.type)?.icon || <FaGavel />}
                  {' '}
                  {event.title}
                </span>
              ),
            }}
            eventPropGetter={event => ({
              'data-type': event.type,
            })}
            messages={{
              today: 'اليوم',
              previous: 'السابق',
              next: 'التالي',
              month: 'شهر',
              week: 'أسبوع',
              day: 'يوم',
              agenda: 'جدول أعمال',
            }}
            timeslots={2}
            step={30}
          />
        </CalendarSection>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </MainContent>
    </CalendarContainer>
  );
}

export default AttorneyCalendar;
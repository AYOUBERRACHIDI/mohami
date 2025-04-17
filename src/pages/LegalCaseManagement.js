import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import Sidebar from '../components/Sidebar';
import NavDash from '../components/NavDash';
import { FaEye, FaEdit, FaTrash, FaDownload, FaTimes, FaFilter, FaFolder, FaHourglassHalf, FaPauseCircle, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

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

const modalFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Styled Components
const LegalCaseContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f1f5f9;
  direction: rtl;
  font-family: 'Inter', 'Roboto', sans-serif;
`;

const MainContent = styled.div`
  flex: 1;
  margin-right: 70px;
  margin-top: 60px;
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2e7d32;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -0.25rem;
    right: 0;
    width: 2.5rem;
    height: 3px;
    background: #2e7d32;
    border-radius: 2px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: #2e7d32;
  color: #ffffff;
  font-weight: 500;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease-in-out;

  &:hover {
    background:rgb(17, 91, 48);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const DeleteButton = styled(ActionButton)`
  background: #e53e3e;

  &:hover {
    background: #c53030;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

// Unified Filter Section
const FilterSection = styled(motion.div)`
  position: relative;
  margin-bottom: 2rem;
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
`;

const FilterIconWrapper = styled.div`
  position: relative;
`;

const FilterIcon = styled.span`
  color: #6b7280;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #2e7d32;
  }
`;

const FilterInputWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  background: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 5px rgba(46, 204, 113, 0.3);
    background: #ffffff;
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  background: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 5px rgba(46, 204, 113, 0.3);
    background: #ffffff;
  }
`;

const FilterDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  padding: 0.5rem 0;
  width: 120px;
`;

const FilterOption = styled.div`
  padding: 0.5rem 1rem;
  color: #6b7280;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: #f1f5f9;
  }
`;

// Enhanced Summary Card Section
const SummaryCard = styled.div`
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryItem = styled(motion.div)`
  text-align: center;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const SummaryIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => props.color || '#2e7d32'};
`;

const SummaryTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
`;

const SummaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  ${props => {
    switch (props.type) {
      case 'inProgress':
        return 'color: #f39c12;';
      case 'pending':
        return 'color: #e53e3e;';
      case 'closed':
        return 'color: #2e7d32;';
      default:
        return 'color: #2e7d32;';
    }
  }}
`;

// Cases Table Styling
const CasesTable = styled.div`
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  animation: ${css`${fadeIn} 0.8s ease-in-out forwards`};
  overflow-x: auto;
`;

const TableWrapper = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.75rem;
`;

const TableHeader = styled.th`
  padding: 1rem;
  background: #f1f5f9;
  color: #2e7d32;
  font-weight: 600;
  text-align: right;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  position: relative;

  &:hover {
    background: #e5e7eb;
  }

  &:first-child {
    border-top-right-radius: 0.5rem;
  }

  &:last-child {
    border-top-left-radius: 0.5rem;
  }
`;

const SortArrow = styled.span`
  margin-left: 0.5rem;
  font-size: 0.75rem;
`;

const TableRow = styled(motion.tr)`
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #f1f5f9;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #6b7280;
  text-align: right;
  border-bottom: 1px solid #e5e7eb;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  ${props => props.color};
`;

const ActionIcons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionIcon = styled(motion.button)`
  padding: 0.5rem;
  background: ${props => props.bgColor};
  color: #ffffff;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    background: ${props => props.hoverColor};
  }
`;

const Checkbox = styled.input`
  accent-color: #2e7d32;
  width: 0.875rem;
  height: 0.875rem;
`;

// Pagination Styling
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: ${props => (props.active ? '#2e7d32' : '#ffffff')};
  color: ${props => (props.active ? '#ffffff' : '#6b7280')};
  border-radius: 0.5rem;
  font-size: 0.75rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: ${props => (props.active ? 'rgb(17, 91, 48)' : '#f1f5f9')};
  }
`;

// Modal Styling
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 2rem;
  width: 90%;
  max-width: 700px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2e7d32;
`;

const CloseButton = styled(motion.button)`
  background: none;
  color: #6b7280;
  font-size: 1.25rem;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #e53e3e;
  }
`;

const ModalForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
`;

const FormInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  background: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: border 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 5px rgba(46, 204, 113, 0.3);
  }
`;

const FormSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  background: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: border 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 5px rgba(46, 204, 113, 0.3);
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 0.5rem;
  background: #2e7d32;
  color: #ffffff;
  font-weight: 500;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  grid-column: span 2;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: rgb(17, 91, 48);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

function LegalCaseManagement() {
  const [filters, setFilters] = useState({ status: '', type: '', date: '2025-04-16' });
  const [filterType, setFilterType] = useState('type'); 
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [cases, setCases] = useState([]);
  const [selectedCases, setSelectedCases] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCase, setNewCase] = useState({
    caseNumber: '',
    title: '',
    client: '',
    opponent: '',
    status: 'قيد التقدم',
    totalAmount: 0,
  });
  const casesPerPage = 5;

  // Static Data for April 16, 2025
  const dataApril16 = [
    {
      caseNumber: "LAW0101",
      title: "طلاق",
      client: "مريم الصغير",
      opponent: "حميد المرضي",
      status: { text: "قيد التقدم", color: "background: #fefcbf; color: #f39c12;" },
      totalAmount: 20000,
    },
    {
      caseNumber: "LAW0102",
      title: "عقد",
      client: "حميد المرضي",
      opponent: "زكريا حداف",
      status: { text: "معلق", color: "background: #fee2e2; color: #e53e3e;" },
      totalAmount: 25000,
    },
    {
      caseNumber: "LAW0103",
      title: "دعوى قضائية",
      client: "زكريا حداف",
      opponent: "مريم الصغير",
      status: { text: "مغلق", color: "background: #d1fae5; color: #2e7d32;" },
      totalAmount: 18000,
    },
    {
      caseNumber: "LAW0104",
      title: "نزاع تجاري",
      client: "أحمد قبالي",
      opponent: "مصطفى لاريك",
      status: { text: "قيد التقدم", color: "background: #fefcbf; color: #f39c12;" },
      totalAmount: 20000,
    },
    {
      caseNumber: "LAW0105",
      title: "إرث",
      client: "فاطمة الزهراء",
      opponent: "يوسف بنعيسى",
      status: { text: "معلق", color: "background: #fee2e2; color: #e53e3e;" },
      totalAmount: 20000,
    },
    {
      caseNumber: "LAW0106",
      title: "عمالية",
      client: "خديجة العلوي",
      opponent: "عبد الله السعدي",
      status: { text: "مغلق", color: "background: #d1fae5; color: #2e7d32;" },
      totalAmount: 20000,
    },
    {
      caseNumber: "LAW0107",
      title: "دعوى إدارية",
      client: "نور الدين المريني",
      opponent: "رشيد الصغير",
      status: { text: "قيد التقدم", color: "background: #fefcbf; color: #f39c12;" },
      totalAmount: 15000,
    },
  ];

  // Static Data for April 20, 2025
  const dataApril20 = [
    {
      caseNumber: "LAW0108",
      title: "طلاق",
      client: "علي بن صالح",
      opponent: "حنان الخطيب",
      status: { text: "قيد التقدم", color: "background: #fefcbf; color: #f39c12;" },
      totalAmount: 20000,
    },
    {
      caseNumber: "LAW0109",
      title: "عقد",
      client: "إبراهيم العثماني",
      opponent: "لطيفة الصغير",
      status: { text: "معلق", color: "background: #fee2e2; color: #e53e3e;" },
      totalAmount: 30000,
    },
    {
      caseNumber: "LAW0110",
      title: "دعوى قضائية",
      client: "خالد المغربي",
      opponent: "سعاد بنت أحمد",
      status: { text: "مغلق", color: "background: #d1fae5; color: #2e7d32;" },
      totalAmount: 22000,
    },
    {
      caseNumber: "LAW0111",
      title: "نزاع تجاري",
      client: "محسن الراشدي",
      opponent: "زكرياء العلوي",
      status: { text: "قيد التقدم", color: "background: #fefcbf; color: #f39c12;" },
      totalAmount: 20000,
    },
    {
      caseNumber: "LAW0112",
      title: "إرث",
      client: "نبيلة الصغير",
      opponent: "أمينة بنت يوسف",
      status: { text: "معلق", color: "background: #fee2e2; color: #e53e3e;" },
      totalAmount: 20000,
    },
    {
      caseNumber: "LAW0113",
      title: "عمالية",
      client: "سعاد بنت أحمد",
      opponent: "علي بن صالح",
      status: { text: "مغلق", color: "background: #d1fae5; color: #2e7d32;" },
      totalAmount: 21000,
    },
    {
      caseNumber: "LAW0114",
      title: "دعوى إدارية",
      client: "زكرياء العلوي",
      opponent: "نبيلة الصغير",
      status: { text: "قيد التقدم", color: "background: #fefcbf; color: #f39c12;" },
      totalAmount: 15000,
    },
  ];

  // Initialize cases state with April 16 data
  if (cases.length === 0) {
    setCases(filters.date === '2025-04-16' ? dataApril16 : dataApril20);
  }

  // Select data based on the date
  const selectedData = cases;

  // Filter the data based on the unified filter
  const filteredCases = selectedData.filter(caseItem => {
    const matchesStatus = filters.status ? caseItem.status.text === filters.status : true;
    const matchesType = filters.type ? caseItem.title.includes(filters.type) : true;
    return matchesStatus && matchesType;
  });

  // Sort the data
  const sortedCases = [...filteredCases].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (sortConfig.key === 'caseNumber') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Paginate the data
  const totalPages = Math.ceil(sortedCases.length / casesPerPage);
  const paginatedCases = sortedCases.slice(
    (currentPage - 1) * casesPerPage,
    currentPage * casesPerPage
  );

  // Calculate summary stats
  const summary = {
    total: selectedData.length,
    inProgress: selectedData.filter(c => c.status.text === 'قيد التقدم').length,
    pending: selectedData.filter(c => c.status.text === 'معلق').length,
    closed: selectedData.filter(c => c.status.text === 'مغلق').length,
  };

  const headers = [
    { label: "", key: "" }, // For checkbox
    { label: "رقم القضية", key: "caseNumber" },
    { label: "العنوان", key: "title" },
    { label: "العميل", key: "client" },
    { label: "الخصم", key: "opponent" },
    { label: "الحالة", key: "status" },
    { label: "الإجمالي (MAD)", key: "totalAmount" },
    { label: "الإجراءات", key: "" },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleDateChange = (e) => {
    setFilters(prev => ({ ...prev, date: e.target.value }));
    setCases(e.target.value === '2025-04-16' ? dataApril16 : dataApril20);
    setCurrentPage(1); // Reset to first page on date change
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleExport = () => {
    const csvContent = [
      headers.map(h => h.label).join(','),
      ...selectedData.map(row =>
        [
          row.caseNumber,
          row.title,
          row.client,
          row.opponent,
          row.status.text,
          row.totalAmount,
        ].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cases_${filters.date}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCheckboxChange = (caseNumber) => {
    setSelectedCases(prev =>
      prev.includes(caseNumber)
        ? prev.filter(id => id !== caseNumber)
        : [...prev, caseNumber]
    );
  };

  const handleBulkDelete = () => {
    console.log('Deleting cases:', selectedCases);
    setCases(prev => prev.filter(c => !selectedCases.includes(c.caseNumber)));
    setSelectedCases([]);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewCase({
      caseNumber: '',
      title: '',
      client: '',
      opponent: '',
      status: 'قيد التقدم',
      totalAmount: 0,
    });
  };

  const handleNewCaseChange = (e) => {
    const { name, value } = e.target;
    setNewCase(prev => ({
      ...prev,
      [name]: name === 'totalAmount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddCase = (e) => {
    e.preventDefault();
    const newCaseData = {
      caseNumber: newCase.caseNumber,
      title: newCase.title,
      client: newCase.client,
      opponent: newCase.opponent,
      status: {
        text: newCase.status,
        color: newCase.status === 'قيد التقدم'
          ? "background: #fefcbf; color: #f39c12;"
          : newCase.status === 'معلق'
          ? "background: #fee2e2; color: #e53e3e;"
          : "background: #d1fae5; color: #2e7d32;",
      },
      totalAmount: newCase.totalAmount,
    };
    setCases(prev => [...prev, newCaseData]);
    handleModalClose();
  };

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(prev => !prev);
  };

  const selectFilterType = (type) => {
    setFilterType(type);
    setFilters({ status: '', type: '', date: '2025-04-16' }); // Reset filters
    setIsFilterDropdownOpen(false);
  };

  return (
    <LegalCaseContainer>
      <NavDash />
      <Sidebar />
      <MainContent>
        {/* Header Section */}
        <HeaderSection>
          <Title>إدارة القضايا القانونية</Title>
          <ButtonGroup>
            {selectedCases.length > 0 && (
              <DeleteButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBulkDelete}
              >
                <FaTrash /> حذف المحدد ({selectedCases.length})
              </DeleteButton>
            )}
            <ActionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
            >
              <FaDownload /> تصدير
            </ActionButton>
            <ActionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleModalOpen}
            >
              + قضية جديدة
            </ActionButton>
          </ButtonGroup>
        </HeaderSection>

        {/* Enhanced Summary Card */}
        <SummaryCard>
          <SummaryItem
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <SummaryIcon color="#2e7d32">
              <FaFolder />
            </SummaryIcon>
            <SummaryTitle>إجمالي القضايا</SummaryTitle>
            <SummaryValue>{summary.total}</SummaryValue>
          </SummaryItem>
          <SummaryItem
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <SummaryIcon color="#f39c12">
              <FaHourglassHalf />
            </SummaryIcon>
            <SummaryTitle>قيد التقدم</SummaryTitle>
            <SummaryValue type="inProgress">{summary.inProgress}</SummaryValue>
          </SummaryItem>
          <SummaryItem
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <SummaryIcon color="#e53e3e">
              <FaPauseCircle />
            </SummaryIcon>
            <SummaryTitle>معلق</SummaryTitle>
            <SummaryValue type="pending">{summary.pending}</SummaryValue>
          </SummaryItem>
          <SummaryItem
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <SummaryIcon color="#2e7d32">
              <FaCheckCircle />
            </SummaryIcon>
            <SummaryTitle>مغلق</SummaryTitle>
            <SummaryValue type="closed">{summary.closed}</SummaryValue>
          </SummaryItem>
        </SummaryCard>

        {/* Unified Filter Section */}
        <FilterSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FilterWrapper>
            <FilterIconWrapper>
              <FilterIcon onClick={toggleFilterDropdown}>
                <FaFilter />
              </FilterIcon>
              {isFilterDropdownOpen && (
                <FilterDropdown
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FilterOption onClick={() => selectFilterType('type')}>
                    العنوان
                  </FilterOption>
                  <FilterOption onClick={() => selectFilterType('status')}>
                    الحالة
                  </FilterOption>
                  <FilterOption onClick={() => selectFilterType('date')}>
                    التاريخ
                  </FilterOption>
                </FilterDropdown>
              )}
            </FilterIconWrapper>
            <FilterInputWrapper>
              {filterType === 'type' && (
                <FilterInput
                  type="text"
                  placeholder="ابحث حسب العنوان..."
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                />
              )}
              {filterType === 'status' && (
                <FilterSelect name="status" value={filters.status} onChange={handleFilterChange}>
                  <option value="">الكل</option>
                  <option value="قيد التقدم">قيد التقدم</option>
                  <option value="معلق">معلق</option>
                  <option value="مغلق">مغلق</option>
                </FilterSelect>
              )}
              {filterType === 'date' && (
                <FilterInput
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleDateChange}
                  min="2025-04-16"
                  max="2025-04-20"
                />
              )}
            </FilterInputWrapper>
          </FilterWrapper>
        </FilterSection>

        {/* Cases Table */}
        <CasesTable>
          <TableWrapper>
            <thead>
              <tr>
                {headers.map((header) => (
                  <TableHeader key={header.label} onClick={() => header.key && handleSort(header.key)}>
                    {header.label}
                    {sortConfig.key === header.key && (
                      <SortArrow>{sortConfig.direction === 'asc' ? '↑' : '↓'}</SortArrow>
                    )}
                  </TableHeader>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedCases.map((row) => (
                <TableRow
                  key={row.caseNumber}
                  whileHover={{ scale: 1.005 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell>
                    <Checkbox
                      type="checkbox"
                      checked={selectedCases.includes(row.caseNumber)}
                      onChange={() => handleCheckboxChange(row.caseNumber)}
                    />
                  </TableCell>
                  <TableCell>{row.caseNumber}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.client}</TableCell>
                  <TableCell>{row.opponent}</TableCell>
                  <TableCell>
                    <StatusBadge color={row.status.color}>{row.status.text}</StatusBadge>
                  </TableCell>
                  <TableCell>{row.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <ActionIcons>
                      <ActionIcon
                        bgColor="#2e7d32"
                        hoverColor="rgb(17, 91, 48)"
                        onClick={() => console.log('View:', row)}
                        title="عرض"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaEye />
                      </ActionIcon>
                      <ActionIcon
                        bgColor="#2e7d32"
                        hoverColor="rgb(17, 91, 48)"
                        onClick={() => console.log('Edit:', row)}
                        title="تعديل"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaEdit />
                      </ActionIcon>
                      <ActionIcon
                        bgColor="#e53e3e"
                        hoverColor="#c53030"
                        onClick={() => console.log('Delete:', row)}
                        title="حذف"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaTrash />
                      </ActionIcon>
                    </ActionIcons>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </TableWrapper>
        </CasesTable>

        {/* Pagination */}
        <Pagination>
          <PageButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            السابق
          </PageButton>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <PageButton
              key={page}
              active={currentPage === page}
              onClick={() => setCurrentPage(page)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {page}
            </PageButton>
          ))}
          <PageButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            التالي
          </PageButton>
        </Pagination>

        {/* Add Case Modal */}
        {isModalOpen && (
          <ModalOverlay>
            <ModalContent
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ModalHeader>
                <ModalTitle>إضافة قضية جديدة</ModalTitle>
                <CloseButton
                  onClick={handleModalClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes />
                </CloseButton>
              </ModalHeader>
              <ModalForm onSubmit={handleAddCase}>
                <div>
                  <FormField>
                    <FormLabel>رقم القضية</FormLabel>
                    <FormInput
                      type="text"
                      name="caseNumber"
                      value={newCase.caseNumber}
                      onChange={handleNewCaseChange}
                      required
                    />
                  </FormField>
                  <FormField>
                    <FormLabel>العنوان</FormLabel>
                    <FormSelect
                      name="title"
                      value={newCase.title}
                      onChange={handleNewCaseChange}
                      required
                    >
                      <option value="">اختر العنوان</option>
                      <option value="طلاق">طلاق</option>
                      <option value="عقد">عقد</option>
                      <option value="دعوى قضائية">دعوى قضائية</option>
                      <option value="نزاع تجاري">نزاع تجاري</option>
                      <option value="إرث">إرث</option>
                      <option value="عمالية">عمالية</option>
                      <option value="دعوى إدارية">دعوى إدارية</option>
                    </FormSelect>
                  </FormField>
                  <FormField>
                    <FormLabel>العميل</FormLabel>
                    <FormInput
                      type="text"
                      name="client"
                      value={newCase.client}
                      onChange={handleNewCaseChange}
                      required
                    />
                  </FormField>
                  <FormField>
                    <FormLabel>الخصم</FormLabel>
                    <FormInput
                      type="text"
                      name="opponent"
                      value={newCase.opponent}
                      onChange={handleNewCaseChange}
                      required
                    />
                  </FormField>
                </div>
                <div>
                  <FormField>
                    <FormLabel>الحالة</FormLabel>
                    <FormSelect
                      name="status"
                      value={newCase.status}
                      onChange={handleNewCaseChange}
                      required
                    >
                      <option value="قيد التقدم">قيد التقدم</option>
                      <option value="معلق">معلق</option>
                      <option value="مغلق">مغلق</option>
                    </FormSelect>
                  </FormField>
                  <FormField>
                    <FormLabel>الإجمالي (MAD)</FormLabel>
                    <FormInput
                      type="number"
                      name="totalAmount"
                      value={newCase.totalAmount}
                      onChange={handleNewCaseChange}
                      required
                    />
                  </FormField>
                </div>
                <SubmitButton
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  إضافة القضية
                </SubmitButton>
              </ModalForm>
            </ModalContent>
          </ModalOverlay>
        )}
      </MainContent>
    </LegalCaseContainer>
  );
}

export default LegalCaseManagement;
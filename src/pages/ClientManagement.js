import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import Sidebar from '../components/Sidebar';
import NavDash from '../components/NavDash';
import { FaEye, FaEdit, FaTrash, FaDownload, FaTimes } from 'react-icons/fa';

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
const ClientContainer = styled.div`
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

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #2e7d32;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -0.25rem;
    right: 0;
    width: 3rem;
    height: 3px;
    background: linear-gradient(to right, #2e7d32, #facc15);
    border-radius: 2px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #2e7d32, #1a4d1e);
  color: #ffffff;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(46, 125, 50, 0.5);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: linear-gradient(to right, #1a4d1e, #2e7d32);
    box-shadow: 0 0 15px rgba(46, 125, 50, 0.7);
    transform: translateY(-2px);
  }
`;

const DeleteButton = styled(ActionButton)`
  background: linear-gradient(to right, #ef4444, #b91c1c);

  &:hover {
    background: linear-gradient(to right, #b91c1c, #ef4444);
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.7);
  }
`;

// Filters Section
const FiltersSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.4);
`;

const FilterInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  background: rgba(255, 255, 255, 0.5);
  transition: border 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 5px rgba(46, 125, 50, 0.3);
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  background: rgba(255, 255, 255, 0.5);
  transition: border 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 5px rgba(46, 125, 50, 0.3);
  }
`;

const DatePicker = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  background: rgba(255, 255, 255, 0.5);
  transition: border 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 5px rgba(46, 125, 50, 0.3);
  }
`;

// Summary Card Section
const SummaryCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.4);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryItem = styled.div`
  text-align: center;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const SummaryTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
`;

const SummaryValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  ${props => {
    switch (props.type) {
      case 'active':
        return 'color: #d97706; background: #fefcbf;';
      case 'inactive':
        return 'color: #dc2626; background: #fee2e2;';
      default:
        return 'color: #2e7d32;';
    }
  }}
  padding: 0.5rem;
  border-radius: 0.25rem;
`;

// Clients Table Styling
const ClientsTable = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.4);
  animation: ${css`${fadeIn} 0.8s ease-in-out forwards`};
  overflow-x: auto;
`;

const TableWrapper = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const TableHeader = styled.th`
  padding: 1rem;
  background: rgba(46, 125, 50, 0.1);
  color: #2e7d32;
  font-weight: 600;
  text-align: right;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;

  &:hover {
    background: rgba(46, 125, 50, 0.2);
  }
`;

const SortArrow = styled.span`
  margin-left: 0.5rem;
  font-size: 0.75rem;
`;

const TableRow = styled.tr`
  transition: transform 0.3s ease-in-out;

  &:hover {
    background: rgba(46, 125, 50, 0.05);
    transform: scale(1.005);
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #4b5563;
  text-align: right;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  ${props => props.color};
`;

const ProgressBarWrapper = styled.div`
  width: 100px;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: linear-gradient(to right, #2e7d32, #facc15);
  width: ${props => props.percentage}%;
  transition: width 0.3s ease-in-out;
`;

const ActionIcons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionIcon = styled.button`
  padding: 0.5rem;
  background: ${props => props.bgColor};
  color: #ffffff;
  border-radius: 0.25rem;
  font-size: 1rem;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: ${props => props.hoverColor};
  }
`;

const Checkbox = styled.input`
  accent-color: #2e7d32;
`;

// Pagination Styling
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => (props.active ? '#2e7d32' : 'rgba(255, 255, 255, 0.5)')};
  color: ${props => (props.active ? '#ffffff' : '#4b5563')};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: ${props => (props.active ? '#2e7d32' : 'rgba(46, 125, 50, 0.1)')};
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

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  animation: ${css`${modalFadeIn} 0.3s ease-in-out forwards`};
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2e7d32;
`;

const CloseButton = styled.button`
  background: none;
  color: #4b5563;
  font-size: 1.5rem;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #ef4444;
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
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
`;

const FormInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  background: rgba(255, 255, 255, 0.5);
  transition: border 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 5px rgba(46, 125, 50, 0.3);
  }
`;

const FormSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  background: rgba(255, 255, 255, 0.5);
  transition: border 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 5px rgba(46, 125, 50, 0.3);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background: linear-gradient(to right, #2e7d32, #1a4d1e);
  color: #ffffff;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(46, 125, 50, 0.5);
  transition: all 0.3s ease-in-out;
  grid-column: span 2;

  &:hover {
    background: linear-gradient(to right, #1a4d1e, #2e7d32);
    box-shadow: 0 0 15px rgba(46, 125, 50, 0.7);
    transform: translateY(-2px);
  }
`;

function ClientManagement() {
  const [filters, setFilters] = useState({ cin: '', status: '', caseNumber: '' });
  const [selectedDate, setSelectedDate] = useState('2025-04-16');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    cin: '',
    fullName: '',
    phone: '',
    status: 'active',
    caseNumber: '',
    engagementDate: '',
  });
  const clientsPerPage = 5;

  // Static Data for April 16, 2025
  const dataApril16 = [
    { cin: "BW56789", fullName: "مريم الصغير", phone: "0785 78 76 58", status: { text: "نشط", color: "background: #d1fae5; color: #059669;" }, caseNumber: "LAW0101", engagementDate: "03-02-2025" },
    { cin: "BW56123", fullName: "محمد طارق", phone: "0643 67 90 88", status: { text: "غير نشط", color: "background: #fee2e2; color: #dc2626;" }, caseNumber: "LAW0103", engagementDate: "01-02-2025" },
    { cin: "BW56555", fullName: "حميد المرضي", phone: "0700 33 38 63", status: { text: "نشط", color: "background: #d1fae5; color: #059669;" }, caseNumber: "LAW0102", engagementDate: "26-02-2025" },
    { cin: "BW56678", fullName: "فاطمة الزهراء", phone: "0699 12 34 56", status: { text: "غير نشط", color: "background: #fee2e2; color: #dc2626;" }, caseNumber: "LAW0104", engagementDate: "15-02-2025" },
    { cin: "BW56901", fullName: "أحمد قبالي", phone: "0678 90 12 34", status: { text: "نشط", color: "background: #d1fae5; color: #059669;" }, caseNumber: "LAW0105", engagementDate: "10-02-2025" },
  ];

  // Static Data for April 20, 2025
  const dataApril20 = [
    { cin: "BW57012", fullName: "علي بن صالح", phone: "0655 44 33 22", status: { text: "نشط", color: "background: #d1fae5; color: #059669;" }, caseNumber: "LAW0106", engagementDate: "18-02-2025" },
    { cin: "BW57134", fullName: "حنان الخطيب", phone: "0622 11 99 88", status: { text: "غير نشط", color: "background: #fee2e2; color: #dc2626;" }, caseNumber: "LAW0107", engagementDate: "20-02-2025" },
    { cin: "BW57256", fullName: "إبراهيم العثماني", phone: "0688 77 66 55", status: { text: "نشط", color: "background: #d1fae5; color: #059669;" }, caseNumber: "LAW0108", engagementDate: "19-02-2025" },
    { cin: "BW57378", fullName: "لطيفة الصغير", phone: "0611 22 33 44", status: { text: "غير نشط", color: "background: #fee2e2; color: #dc2626;" }, caseNumber: "LAW0109", engagementDate: "21-02-2025" },
    { cin: "BW57490", fullName: "خالد المغربي", phone: "0644 55 66 77", status: { text: "نشط", color: "background: #d1fae5; color: #059669;" }, caseNumber: "LAW0110", engagementDate: "22-02-2025" },
  ];

  // Initialize clients state with April 16 data
  if (clients.length === 0) {
    setClients(selectedDate === '2025-04-16' ? dataApril16 : dataApril20);
  }

  // Filter the data
  const filteredClients = clients.filter(client => {
    const matchesCin = filters.cin ? client.cin.includes(filters.cin) : true;
    const matchesStatus = filters.status ? client.status.text.toLowerCase() === filters.status : true;
    const matchesCaseNumber = filters.caseNumber ? client.caseNumber.includes(filters.caseNumber) : true;
    return matchesCin && matchesStatus && matchesCaseNumber;
  });

  // Sort the data
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (sortConfig.key === 'cin' || sortConfig.key === 'fullName' || sortConfig.key === 'phone' || sortConfig.key === 'caseNumber' || sortConfig.key === 'engagementDate') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Paginate the data
  const totalPages = Math.ceil(sortedClients.length / clientsPerPage);
  const paginatedClients = sortedClients.slice(
    (currentPage - 1) * clientsPerPage,
    currentPage * clientsPerPage
  );

  // Calculate summary stats
  const summary = {
    total: clients.length,
    active: clients.filter(c => c.status.text === 'نشط').length,
    inactive: clients.filter(c => c.status.text === 'غير نشط').length,
  };

  const headers = [
    { label: "", key: "" }, // For checkbox
    { label: "رقم الهوية", key: "cin" },
    { label: "الاسم الكامل", key: "fullName" },
    { label: "رقم الهاتف", key: "phone" },
    { label: "الحالة", key: "status" },
    { label: "التقدم", key: "" },
    { label: "رقم القضية", key: "caseNumber" },
    { label: "تاريخ التسجيل", key: "engagementDate" },
    { label: "الإجراءات", key: "" },
  ];

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setClients(e.target.value === '2025-04-16' ? dataApril16 : dataApril20);
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
      ...clients.map(row =>
        [
          row.cin,
          row.fullName,
          row.phone,
          row.status.text,
          row.caseNumber,
          row.engagementDate,
        ].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_${selectedDate}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCheckboxChange = (cin) => {
    setSelectedClients(prev =>
      prev.includes(cin)
        ? prev.filter(id => id !== cin)
        : [...prev, cin]
    );
  };

  const handleBulkDelete = () => {
    console.log('Deleting clients:', selectedClients);
    setClients(prev => prev.filter(c => !selectedClients.includes(c.cin)));
    setSelectedClients([]);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewClient({
      cin: '',
      fullName: '',
      phone: '',
      status: 'active',
      caseNumber: '',
      engagementDate: '',
    });
  };

  const handleNewClientChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    const newClientData = {
      cin: newClient.cin,
      fullName: newClient.fullName,
      phone: newClient.phone,
      status: {
        text: newClient.status === 'active' ? 'نشط' : 'غير نشط',
        color: newClient.status === 'active'
          ? "background: #d1fae5; color: #059669;"
          : "background: #fee2e2; color: #dc2626;",
      },
      caseNumber: newClient.caseNumber,
      engagementDate: newClient.engagementDate,
    };
    setClients(prev => [...prev, newClientData]);
    handleModalClose();
  };

  // Simulated progress based on engagement date (days since start of month)
  const getProgress = (date) => {
    const startDate = new Date('2025-02-01');
    const engagementDate = new Date(`2025-02-${date}`);
    const days = Math.floor((engagementDate - startDate) / (1000 * 60 * 60 * 24));
    return Math.min((days / 28) * 100, 100); // Max 28 days in February 2025
  };

  return (
    <ClientContainer>
      <NavDash />
      <Sidebar />
      <MainContent>
        {/* Header Section */}
        <HeaderSection>
          <Title>إدارة العملاء</Title>
          <ButtonGroup>
            {selectedClients.length > 0 && (
              <DeleteButton onClick={handleBulkDelete}>
                <FaTrash /> حذف المحدد ({selectedClients.length})
              </DeleteButton>
            )}
            <ActionButton onClick={handleExport}>
              <FaDownload /> تصدير
            </ActionButton>
            <ActionButton onClick={handleModalOpen}>
              + عميل جديد
            </ActionButton>
          </ButtonGroup>
        </HeaderSection>

        {/* Filters Section */}
        <FiltersSection>
          <FilterInput
            type="text"
            placeholder="بحث..."
            onChange={(e) => setFilters({ ...filters, cin: e.target.value })}
          />
          <FilterSelect name="cin" value={filters.cin} onChange={handleFilterChange}>
            <option value="">رقم الهوية</option>
            <option value="BW56789">BW56789</option>
            <option value="BW56123">BW56123</option>
          </FilterSelect>
          <FilterSelect name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">الكل</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </FilterSelect>
          <FilterSelect name="caseNumber" value={filters.caseNumber} onChange={handleFilterChange}>
            <option value="">رقم القضية</option>
            <option value="LAW0101">LAW0101</option>
            <option value="LAW0102">LAW0102</option>
          </FilterSelect>
          <DatePicker
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min="2025-04-16"
            max="2025-04-20"
          />
        </FiltersSection>

        {/* Summary Card */}
        <SummaryCard>
          <SummaryItem>
            <SummaryTitle>إجمالي العملاء</SummaryTitle>
            <SummaryValue>{summary.total}</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryTitle>نشط</SummaryTitle>
            <SummaryValue type="active">{summary.active}</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryTitle>غير نشط</SummaryTitle>
            <SummaryValue type="inactive">{summary.inactive}</SummaryValue>
          </SummaryItem>
        </SummaryCard>

        {/* Clients Table */}
        <ClientsTable>
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
              {paginatedClients.map((row) => (
                <TableRow key={row.cin}>
                  <TableCell>
                    <Checkbox
                      type="checkbox"
                      checked={selectedClients.includes(row.cin)}
                      onChange={() => handleCheckboxChange(row.cin)}
                    />
                  </TableCell>
                  <TableCell>{row.cin}</TableCell>
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>
                    <StatusBadge color={row.status.color}>{row.status.text}</StatusBadge>
                  </TableCell>
                  <TableCell>
                    <ProgressBarWrapper>
                      <ProgressBar percentage={getProgress(row.engagementDate.split('-')[0])} />
                    </ProgressBarWrapper>
                  </TableCell>
                  <TableCell>{row.caseNumber}</TableCell>
                  <TableCell>{row.engagementDate}</TableCell>
                  <TableCell>
                    <ActionIcons>
                      <ActionIcon
                        bgColor="#3b82f6"
                        hoverColor="#2563eb"
                        onClick={() => console.log('View:', row)}
                        title="عرض"
                      >
                        <FaEye />
                      </ActionIcon>
                      <ActionIcon
                        bgColor="#10b981"
                        hoverColor="#059669"
                        onClick={() => console.log('Edit:', row)}
                        title="تعديل"
                      >
                        <FaEdit />
                      </ActionIcon>
                      <ActionIcon
                        bgColor="#ef4444"
                        hoverColor="#dc2626"
                        onClick={() => console.log('Delete:', row)}
                        title="حذف"
                      >
                        <FaTrash />
                      </ActionIcon>
                    </ActionIcons>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </TableWrapper>
        </ClientsTable>

        {/* Pagination */}
        <Pagination>
          <PageButton
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
            >
              {page}
            </PageButton>
          ))}
          <PageButton
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            التالي
          </PageButton>
        </Pagination>

        {/* Add Client Modal */}
        {isModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>إضافة عميل جديد</ModalTitle>
                <CloseButton onClick={handleModalClose}>
                  <FaTimes />
                </CloseButton>
              </ModalHeader>
              <ModalForm onSubmit={handleAddClient}>
                <div>
                  <FormField>
                    <FormLabel>رقم الهوية</FormLabel>
                    <FormInput
                      type="text"
                      name="cin"
                      value={newClient.cin}
                      onChange={handleNewClientChange}
                      required
                    />
                  </FormField>
                  <FormField>
                    <FormLabel>الاسم الكامل</FormLabel>
                    <FormInput
                      type="text"
                      name="fullName"
                      value={newClient.fullName}
                      onChange={handleNewClientChange}
                      required
                    />
                  </FormField>
                  <FormField>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormInput
                      type="text"
                      name="phone"
                      value={newClient.phone}
                      onChange={handleNewClientChange}
                      required
                    />
                  </FormField>
                </div>
                <div>
                  <FormField>
                    <FormLabel>الحالة</FormLabel>
                    <FormSelect
                      name="status"
                      value={newClient.status}
                      onChange={handleNewClientChange}
                      required
                    >
                      <option value="active">نشط</option>
                      <option value="inactive">غير نشط</option>
                    </FormSelect>
                  </FormField>
                  <FormField>
                    <FormLabel>رقم القضية</FormLabel>
                    <FormSelect
                      name="caseNumber"
                      value={newClient.caseNumber}
                      onChange={handleNewClientChange}
                      required
                    >
                      <option value="">اختر رقم القضية</option>
                      <option value="LAW0101">LAW0101</option>
                      <option value="LAW0102">LAW0102</option>
                    </FormSelect>
                  </FormField>
                  <FormField>
                    <FormLabel>تاريخ التسجيل</FormLabel>
                    <FormInput
                      type="text"
                      name="engagementDate"
                      value={newClient.engagementDate}
                      onChange={handleNewClientChange}
                      placeholder="DD-MM-YYYY"
                      required
                    />
                  </FormField>
                </div>
                <SubmitButton type="submit">إضافة العميل</SubmitButton>
              </ModalForm>
            </ModalContent>
          </ModalOverlay>
        )}
      </MainContent>
    </ClientContainer>
  );
}

export default ClientManagement;
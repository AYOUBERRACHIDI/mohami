import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import axios from 'axios';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NavDash from '../components/NavDash';
import { FaEye, FaEdit, FaTrash, FaDownload, FaTimes, FaCheckCircle, FaHourglassHalf, FaPauseCircle, FaFolder } from 'react-icons/fa';
import { GlassesIcon as MagnifyingGlassIcon, XCircleIcon, FileText, Calendar, User } from 'lucide-react';
import { debounce } from 'lodash';

// CSS Variables for Theme
const theme = {
  primary: '#2e7d32',
  primaryDark: '#059669',
  secondary: '#6b7280',
  background: '#f9fafb',
  cardBackground: 'rgba(255, 255, 255, 0.95)',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  error: '#ef4444',
  success: '#d1fae5',
  warning: '#fefcbf',
  danger: '#fee2e2',
};

// Keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const modalSlideIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const PaymentContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${theme.background};
  direction: rtl;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const MainContent = styled.div`
  flex: 1;
  margin-right: 70px;
  margin-top: 60px;
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    margin-right: 0;
    padding: 1rem;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.textPrimary};
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    right: 0;
    width: 3rem;
    height: 4px;
    background: ${theme.primary};
    border-radius: 2px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${theme.primary};
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const DeleteButton = styled(ActionButton)`
  background: ${theme.error};

  &:hover {
    background: #dc2626;
  }
`;

const SummarySection = styled.div`
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const SummaryCard = styled(motion.div)`
  background: ${theme.cardBackground};
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
`;

const SummaryIconWrapper = styled.div`
  padding: 0.75rem;
  background: ${props => props.bgColor};
  border-radius: 9999px;
`;

const SummaryIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => props.color};
`;

const SummaryText = styled.div`
  flex: 1;
`;

const SummaryTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.textSecondary};
`;

const SummaryValue = styled.p`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${theme.textPrimary};
`;

const FiltersSection = styled.div`
  margin-bottom: 2rem;
  background: ${theme.cardBackground};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  border: 1px solid #e5e7eb;
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: ${theme.textPrimary};
  background: white;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 160px;

  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 3px ${theme.primary}20;
  }
`;

const DatePicker = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: ${theme.textPrimary};
  background: white;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 160px;

  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 3px ${theme.primary}20;
  }
`;

const PaymentsTable = styled.div`
  background: ${theme.cardBackground};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  animation: ${css`${fadeIn} 0.5s ease-out`};
  overflow-x: auto;
  border: 1px solid #e5e7eb;
`;

const TableWrapper = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.9rem;
`;

const TableHeader = styled.th`
  padding: 1rem;
  background: ${theme.primary}05;
  color: ${theme.textPrimary};
  font-weight: 600;
  text-align: right;
  position: sticky;
  top: 0;
  z-index: 10;
  transition: background 0.3s ease;

  &:hover {
    background: ${theme.primary}10;
  }
`;

const SortArrow = styled.span`
  margin-left: 0.5rem;
  font-size: 0.75rem;
`;

const TableRow = styled.tr`
  transition: background 0.3s ease;

  &:nth-child(even) {
    background: rgba(0, 0, 0, 0.02);
  }

  &:hover {
    background: ${theme.primary}05;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: ${theme.textPrimary};
  text-align: right;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const StatusBadge = styled.span`
  padding: 0.35rem 1rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
  ${props => props.color};
`;

const ActionIcons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionIcon = styled.button`
  padding: 0.5rem;
  background: ${props => props.bgColor};
  color: white;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: ${props => props.hoverColor};
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:hover:after {
    content: attr(title);
    position: absolute;
    top: -2.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: ${theme.textPrimary};
    color: white;
    padding: 0.35rem 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    white-space: nowrap;
  }
`;

const Checkbox = styled.input`
  accent-color: ${theme.primary};
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.75rem 1.25rem;
  background: ${props => (props.active ? theme.primary : 'white')};
  color: ${props => (props.active ? 'white' : theme.textPrimary)};
  border: 1px solid ${props => (props.active ? theme.primary : '#d1d5db')};
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => (props.active ? theme.primaryDark : '#f3f4f6')};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${theme.cardBackground};
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: ${css`${modalSlideIn} 0.3s ease-out`};
  border: 1px solid #e5e7eb;
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
  color: ${theme.textPrimary};
`;

const CloseButton = styled.button`
  background: none;
  color: ${theme.textSecondary};
  font-size: 1.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${theme.error};
  }
`;

const ModalForm = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${theme.textPrimary};
`;

const FormInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: ${theme.textPrimary};
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 3px ${theme.primary}20;
  }

  &:invalid[required] {
    border-color: ${theme.error};
  }
`;

const FormTextarea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: ${theme.textPrimary};
  background: white;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 3px ${theme.primary}20;
  }
`;

const FormSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: ${theme.textPrimary};
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 3px ${theme.primary}20;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background: ${theme.primary};
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  grid-column: span 2;

  &:hover {
    background: ${theme.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SkeletonRow = styled.tr`
  height: 3.5rem;
`;

const SkeletonCell = styled.td`
  padding: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const DetailsCard = styled.div`
  background: ${theme.cardBackground};
  border-radius: 1rem;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: ${css`${fadeIn} 0.3s ease-out`};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid #e5e7eb;
`;

const DetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const DetailsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${theme.textPrimary};
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: ${theme.textSecondary};
`;

const DetailValue = styled.span`
  color: ${theme.textPrimary};
  font-weight: 500;
`;

// SearchBar Component
const SearchBar = ({ onSearch, placeholder = 'بحث...', initialValue = '', className = '' }) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const debouncedSearch = useCallback(debounce((term) => onSearch(term), 300), [onSearch]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full py-3 px-4 pl-12 pr-12 bg-white rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-secondary text-right dir-rtl shadow-sm"
        dir="rtl"
        aria-label="بحث الدفعات"
        maxLength={100}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-secondary" />
      </div>
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 left-0 flex items-center pl-4 hover:text-error"
          aria-label="Clear search"
        >
          <XCircleIcon className="h-5 w-5 text-secondary hover:text-error" />
        </button>
      )}
    </div>
  );
};

// API URLs
const API_URL = 'http://localhost:5000/api/paiements';
const CLIENTS_API_URL = 'http://localhost:5000/api/clients';
const AFFAIRES_API_URL = 'http://localhost:5000/api/affaires';
const CONSULTATIONS_API_URL = 'http://localhost:5000/api/consultations';

function PaymentManagement({ setToken }) {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    client: '',
    date: '',
  });
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    montant_total: '',
    statut: 'en attente',
    description: '',
    client_id: '',
    affaire_id: '',
    consultation_id: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const paymentsPerPage = 5;

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('لم يتم تسجيل الدخول. الرجاء تسجيل الدخول.');
        window.location.href = '/login';
        return;
      }

      try {
        setLoading(true);
        const [paymentsRes, clientsRes, casesRes, sessionsRes] = await Promise.all([
          axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(CLIENTS_API_URL, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(AFFAIRES_API_URL, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(CONSULTATIONS_API_URL, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setPayments(paymentsRes.data);
        setClients(clientsRes.data);
        setCases(casesRes.data);
        setSessions(sessionsRes.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setToken(null);
          window.location.href = '/login';
          setError('انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.');
        } else {
          setError('فشل جلب البيانات');
          console.error('Fetch error:', err.response?.data || err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setToken]);

  // Handle search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  // Filter Payments
  const filteredPayments = useMemo(() => {
    let filtered = [...payments];

    if (filters.status) {
      filtered = filtered.filter(payment => payment.statut === filters.status);
    }

    if (filters.client) {
      filtered = filtered.filter(payment => payment.client_id?._id === filters.client);
    }

    if (filters.date) {
      const filterDate = new Date(filters.date).toISOString().split('T')[0];
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.date_creation).toISOString().split('T')[0];
        return paymentDate === filterDate;
      });
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        payment =>
          (payment.description && payment.description.toLowerCase().includes(searchLower)) ||
          (payment.client_id?.nom && payment.client_id.nom.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [payments, filters, searchTerm]);

  // Sort Payments
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === 'client_id') {
      aValue = a.client_id?.nom || '-';
      bValue = b.client_id?.nom || '-';
    }

    if (sortConfig.key === 'montant_total') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    } else if (sortConfig.key === 'date_creation') {
      return sortConfig.direction === 'asc'
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    } else {
      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    }
  });

  // Paginate Payments
  const totalPages = Math.ceil(sortedPayments.length / paymentsPerPage);
  const paginatedPayments = sortedPayments.slice(
    (currentPage - 1) * paymentsPerPage,
    currentPage * paymentsPerPage
  );

  // Calculate summary stats
  const summary = {
    total: filteredPayments.length,
    payé: filteredPayments.filter(p => p.statut === 'payé').length,
    annulé: filteredPayments.filter(p => p.statut === 'annulé').length,
    en_attente: filteredPayments.filter(p => p.statut === 'en attente').length,
  };

  // Headers
  const headers = [
    { label: '', key: '' }, // Checkbox
    { label: 'رمز الطلب', key: '_id' },
    { label: 'البيان', key: 'description' },
    { label: 'العميل', key: 'client_id' },
    { label: 'الحالة', key: 'statut' },
    { label: 'التاريخ', key: 'date_creation' },
    { label: 'الإجمالي (MAD)', key: 'montant_total' },
    { label: 'الإجراءات', key: '' },
  ];

  // Handlers
  const handleSort = (key) => {
    if (key) {
      setSortConfig({
        key,
        direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csvContent = [
      headers.map(h => h.label).join(','),
      ...filteredPayments.map(row => [
        row._id.slice(-6),
        row.description || '-',
        row.client_id?.nom || '-',
        row.statut === 'en attente' ? 'في انتظار' : row.statut === 'payé' ? 'مدفوع' : 'ملغى',
        new Date(row.date_creation).toLocaleDateString('ar'),
        row.montant_total.toFixed(2),
      ].join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `payments_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCheckboxChange = (id) => {
    setSelectedPayments(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('لم يتم تسجيل الدخول. الرجاء تسجيل الدخول.');
      window.location.href = '/login';
      return;
    }

    if (window.confirm('هل أنت متأكد من حذف الدفعات المحددة؟')) {
      try {
        await Promise.all(
          selectedPayments.map(id =>
            axios.delete(`${API_URL}/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );
        setPayments(prev => prev.filter(p => !selectedPayments.includes(p._id)));
        setSelectedPayments([]);
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setToken(null);
          window.location.href = '/login';
          setError('انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.');
        } else {
          setError('فشل حذف الدفعات');
          console.error('Bulk delete error:', err.response?.data || err.message);
        }
      }
    }
  };

  const handleModalOpen = (payment = null) => {
    if (payment) {
      setNewPayment({
        montant_total: payment.montant_total || '',
        statut: payment.statut || 'en attente',
        description: payment.description || '',
        client_id: payment.client_id?._id || (typeof payment.client_id === 'string' ? payment.client_id : ''),
        affaire_id: payment.affaire_id?._id || (typeof payment.affaire_id === 'string' ? payment.affaire_id : ''),
        consultation_id: payment.consultation_id?._id || (typeof payment.consultation_id === 'string' ? payment.consultation_id : ''),
      });
      setEditingId(payment._id);
    } else {
      setNewPayment({
        montant_total: '',
        statut: 'en attente',
        description: '',
        client_id: '',
        affaire_id: '',
        consultation_id: '',
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewPayment({
      montant_total: '',
      statut: 'en attente',
      description: '',
      client_id: '',
      affaire_id: '',
      consultation_id: '',
    });
    setEditingId(null);
    setError(null);
  };

  const handleNewPaymentChange = (e) => {
    const { name, value } = e.target;
    setNewPayment(prev => ({
      ...prev,
      [name]: name === 'montant_total' ? parseFloat(value) || '' : value,
    }));
  };

  const handleAddOrEditPayment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('لم يتم تسجيل الدخول. الرجاء تسجيل الدخول.');
      window.location.href = '/login';
      return;
    }

    if (!newPayment.client_id) {
      setError('يرجى اختيار عميل');
      return;
    }
    if (!newPayment.montant_total) {
      setError('يرجى إدخال المبلغ الإجمالي');
      return;
    }

    try {
      const payload = {
        montant_total: newPayment.montant_total,
        statut: newPayment.statut,
        description: newPayment.description || '',
        client_id: newPayment.client_id,
        ...(newPayment.affaire_id && { affaire_id: newPayment.affaire_id }),
        ...(newPayment.consultation_id && { consultation_id: newPayment.consultation_id }),
      };

      let response;
      if (editingId) {
        response = await axios.put(`${API_URL}/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(prev =>
          prev.map(p => (p._id === editingId ? response.data : p))
        );
      } else {
        response = await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(prev => [...prev, response.data]);
      }
      handleModalClose();
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setToken(null);
        window.location.href = '/login';
        setError('انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.');
      } else {
        setError(err.response?.data?.message || 'حدث خطأ أثناء حفظ الدفعة');
        console.error('Submit error:', err.response?.data || err.message);
      }
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('لم يتم تسجيل الدخول. الرجاء تسجيل الدخول.');
      window.location.href = '/login';
      return;
    }

    if (window.confirm('هل أنت متأكد من حذف هذه الدفعة؟')) {
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(prev => prev.filter(p => p._id !== id));
        setSelectedPayments(prev => prev.filter(pid => pid !== id));
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setToken(null);
          window.location.href = '/login';
          setError('انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.');
        } else {
          setError('فشل حذف الدفعة');
          console.error('Delete error:', err.response?.data || err.message);
        }
      }
    }
  };

  const handleShowDetails = (payment) => {
    setSelectedPayment(payment);
  };

  const handleCloseDetails = () => {
    setSelectedPayment(null);
  };

  const formatSessionDisplay = (session) => {
    if (!session?.date_debut || !session?.heure_debut) {
      return session?._id || '-';
    }
    const date = new Date(session.date_debut).toLocaleDateString('ar');
    return `${date} ${session.heure_debut}`;
  };

  if (loading) {
    return (
      <PaymentContainer>
        <NavDash setToken={setToken} />
        <Sidebar setToken={setToken} />
        <MainContent>
          <PaymentsTable>
            <TableWrapper>
              <thead>
                <tr>
                  {headers.map(header => (
                    <TableHeader key={header.label}>{header.label}</TableHeader>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array(5).fill().map((_, i) => (
                  <SkeletonRow key={i}>
                    {headers.map((_, j) => (
                      <SkeletonCell key={j} />
                    ))}
                  </SkeletonRow>
                ))}
              </tbody>
            </TableWrapper>
          </PaymentsTable>
        </MainContent>
      </PaymentContainer>
    );
  }

  return (
    <PaymentContainer>
      <NavDash setToken={setToken} />
      <Sidebar setToken={setToken} />
      <MainContent>
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg text-sm shadow-sm">
            {error}
          </div>
        )}
        <HeaderSection>
          <Title>إدارة المدفوعات</Title>
          <ButtonGroup>
            {selectedPayments.length > 0 && (
              <DeleteButton onClick={handleBulkDelete}>
                <FaTrash /> حذف المحدد ({selectedPayments.length})
              </DeleteButton>
            )}
            <ActionButton onClick={handleExport}>
              <FaDownload /> تصدير
            </ActionButton>
            <ActionButton onClick={() => handleModalOpen()}>
              + دفعة جديدة
            </ActionButton>
          </ButtonGroup>
        </HeaderSection>
        <SummarySection>
          <SummaryCard whileHover={{ scale: 1.02 }}>
            <SummaryIconWrapper bgColor="#e6f3e9">
              <FileText className="h-6 w-6 text-green-600" />
            </SummaryIconWrapper>
            <SummaryText>
              <SummaryTitle>إجمالي الدفعات</SummaryTitle>
              <SummaryValue>{summary.total}</SummaryValue>
            </SummaryText>
          </SummaryCard>
          <SummaryCard whileHover={{ scale: 1.02 }}>
            <SummaryIconWrapper bgColor="#fefcbf">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </SummaryIconWrapper>
            <SummaryText>
              <SummaryTitle>قيد الانتظار</SummaryTitle>
              <SummaryValue>{summary.en_attente}</SummaryValue>
            </SummaryText>
          </SummaryCard>
          <SummaryCard whileHover={{ scale: 1.02 }}>
            <SummaryIconWrapper bgColor="#d1fae5">
              <User className="h-6 w-6 text-green-600" />
            </SummaryIconWrapper>
            <SummaryText>
              <SummaryTitle>مدفوع</SummaryTitle>
              <SummaryValue>{summary.payé}</SummaryValue>
            </SummaryText>
          </SummaryCard>
          <SummaryCard whileHover={{ scale: 1.02 }}>
            <SummaryIconWrapper bgColor="#fee2e2">
              <FaPauseCircle className="h-6 w-6 text-red-600" />
            </SummaryIconWrapper>
            <SummaryText>
              <SummaryTitle>ملغى</SummaryTitle>
              <SummaryValue>{summary.annulé}</SummaryValue>
            </SummaryText>
          </SummaryCard>
        </SummarySection>
        <FiltersSection>
          <SearchBar
            onSearch={handleSearch}
            placeholder="ابحث بالوصف أو العميل..."
            initialValue={searchTerm}
            className="flex-1 min-w-[220px]"
          />
          <FilterSelect name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">كل الحالات</option>
            <option value="en attente">في انتظار</option>
            <option value="payé">مدفوع</option>
            <option value="annulé">ملغى</option>
          </FilterSelect>
          <FilterSelect name="client" value={filters.client} onChange={handleFilterChange}>
            <option value="">كل العملاء</option>
            {clients.length > 0 ? (
              clients.map(client => (
                <option key={client._id} value={client._id}>
                  {client.nom}
                </option>
              ))
            ) : (
              <option value="">لا توجد عملاء متاحة</option>
            )}
          </FilterSelect>
          <DatePicker
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </FiltersSection>
        <PaymentsTable>
          <TableWrapper>
            <thead>
              <tr>
                {headers.map(header => (
                  <TableHeader
                    key={header.label}
                    onClick={() => handleSort(header.key)}
                  >
                    {header.label}
                    {sortConfig.key === header.key && (
                      <SortArrow>
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </SortArrow>
                    )}
                  </TableHeader>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map(row => (
                <TableRow key={row._id}>
                  <TableCell>
                    <Checkbox
                      type="checkbox"
                      checked={selectedPayments.includes(row._id)}
                      onChange={() => handleCheckboxChange(row._id)}
                    />
                  </TableCell>
                  <TableCell>{row._id.slice(-6)}</TableCell>
                  <TableCell>{row.description || '-'}</TableCell>
                  <TableCell>{row.client_id?.nom || '-'}</TableCell>
                  <TableCell>
                    <StatusBadge
                      color={
                        row.statut === 'payé'
                          ? 'background: #d1fae5; color: #2e7d32;'
                          : row.statut === 'annulé'
                          ? 'background: #fee2e2; color: #e53e3e;'
                          : 'background: #fefcbf; color: #f39c12;'
                      }
                    >
                      {row.statut === 'en attente' ? 'في انتظار' : row.statut === 'payé' ? 'مدفوع' : 'ملغى'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{new Date(row.date_creation).toLocaleDateString('ar')}</TableCell>
                  <TableCell>{row.montant_total.toFixed(2)}</TableCell>
                  <TableCell>
                    <ActionIcons>
                      <ActionIcon
                        bgColor="#3b82f6"
                        hoverColor="#2563eb"
                        title="عرض"
                        onClick={() => handleShowDetails(row)}
                      >
                        <FaEye />
                      </ActionIcon>
                      <ActionIcon
                        bgColor={theme.primary}
                        hoverColor={theme.primaryDark}
                        onClick={() => handleModalOpen(row)}
                        title="تعديل"
                      >
                        <FaEdit />
                      </ActionIcon>
                      <ActionIcon
                        bgColor={theme.error}
                        hoverColor="#dc2626"
                        onClick={() => handleDelete(row._id)}
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
          {paginatedPayments.length === 0 && (
            <div className="text-center text-secondary p-6">
              {searchTerm
                ? `لا توجد نتائج مطابقة لـ "${searchTerm}"`
                : 'لا توجد بيانات'}
            </div>
          )}
        </PaymentsTable>
        {selectedPayment && (
          <DetailsCard>
            <DetailsHeader>
              <DetailsTitle>تفاصيل الدفعة</DetailsTitle>
              <CloseButton onClick={handleCloseDetails}>
                <FaTimes />
              </CloseButton>
            </DetailsHeader>
            <DetailItem>
              <DetailLabel>رمز الدفعة</DetailLabel>
              <DetailValue>{selectedPayment._id}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>المبلغ</DetailLabel>
              <DetailValue>{selectedPayment.montant_total.toFixed(2)} MAD</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>الحالة</DetailLabel>
              <DetailValue>
                {selectedPayment.statut === 'en attente' ? 'في انتظار' : selectedPayment.statut === 'payé' ? 'مدفوع' : 'ملغى'}
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>التاريخ</DetailLabel>
              <DetailValue>{new Date(selectedPayment.date_creation).toLocaleDateString('ar')}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>العميل</DetailLabel>
              <DetailValue>{selectedPayment.client_id?.nom || '-'}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>الوصف</DetailLabel>
              <DetailValue>{selectedPayment.description || '-'}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>القضية</DetailLabel>
              <DetailValue>{selectedPayment.affaire_id?.titre || '-'}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>الاستشارة</DetailLabel>
              <DetailValue>{selectedPayment.consultation_id ? formatSessionDisplay(selectedPayment.consultation_id) : '-'}</DetailValue>
            </DetailItem>
          </DetailsCard>
        )}
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
        {isModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>{editingId ? 'تعديل الدفعة' : 'إضافة دفعة جديدة'}</ModalTitle>
                <CloseButton onClick={handleModalClose}>
                  <FaTimes />
                </CloseButton>
              </ModalHeader>
              <ModalForm onSubmit={handleAddOrEditPayment}>
                <FormField>
                  <FormLabel>المبلغ الإجمالي (MAD) *</FormLabel>
                  <FormInput
                    type="number"
                    name="montant_total"
                    value={newPayment.montant_total}
                    onChange={handleNewPaymentChange}
                    required
                  />
                </FormField>
                <FormField>
                  <FormLabel>الحالة *</FormLabel>
                  <FormSelect
                    name="statut"
                    value={newPayment.statut}
                    onChange={handleNewPaymentChange}
                    required
                  >
                    <option value="en attente">في انتظار</option>
                    <option value="payé">مدفوع</option>
                    <option value="annulé">ملغى</option>
                  </FormSelect>
                </FormField>
                <FormField>
                  <FormLabel>الوصف</FormLabel>
                  <FormTextarea
                    name="description"
                    value={newPayment.description}
                    onChange={handleNewPaymentChange}
                  />
                </FormField>
                <FormField>
                  <FormLabel>العميل *</FormLabel>
                  <FormSelect
                    name="client_id"
                    value={newPayment.client_id}
                    onChange={handleNewPaymentChange}
                    required
                  >
                    <option value="">اختر العميل</option>
                    {clients.length > 0 ? (
                      clients.map(client => (
                        <option key={client._id} value={client._id}>
                          {client.nom}
                        </option>
                      ))
                    ) : (
                      <option value="">لا توجد عملاء متاحة</option>
                    )}
                  </FormSelect>
                </FormField>
                <FormField>
                  <FormLabel>معرف القضية (اختياري)</FormLabel>
                  <FormSelect
                    name="affaire_id"
                    value={newPayment.affaire_id}
                    onChange={handleNewPaymentChange}
                  >
                    <option value="">اختر القضية</option>
                    {cases.length > 0 ? (
                      cases.map(caseItem => (
                        <option key={caseItem._id} value={caseItem._id}>
                          {caseItem.titre}
                        </option>
                      ))
                    ) : (
                      <option value="">لا توجد قضايا متاحة</option>
                    )}
                  </FormSelect>
                </FormField>
                <FormField>
                  <FormLabel>معرف الاستشارة (اختياري)</FormLabel>
                  <FormSelect
                    name="consultation_id"
                    value={newPayment.consultation_id}
                    onChange={handleNewPaymentChange}
                  >
                    <option value="">اختر الاستشارة</option>
                    {sessions.length > 0 ? (
                      sessions.map(session => (
                        <option key={session._id} value={session._id}>
                          {formatSessionDisplay(session)}
                        </option>
                      ))
                    ) : (
                      <option value="">لا توجد استشارات متاحة</option>
                    )}
                  </FormSelect>
                </FormField>
                <SubmitButton type="submit">
                  {editingId ? 'تعديل الدفعة' : 'إضافة الدفعة'}
                </SubmitButton>
              </ModalForm>
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-lg text-sm shadow-sm">
                  {error}
                </div>
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </MainContent>
    </PaymentContainer>
  );
}

export default PaymentManagement;
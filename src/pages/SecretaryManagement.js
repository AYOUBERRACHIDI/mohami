import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import NavDash from '../components/NavDash';
import { FaEye, FaEdit, FaTrash, FaDownload, FaTimes } from 'react-icons/fa';
import { GlassesIcon as MagnifyingGlassIcon, XCircleIcon } from 'lucide-react';
import { debounce } from 'lodash';

// CSS Variables for Theme (matching ClientManagement.jsx)
const theme = {
  primary: '#2e7d32',
  primaryDark: '#059669',
  secondary: '#6b7280',
  background: '#f9fafb',
  cardBackground: 'rgba(255, 255, 255, 0.9)',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  error: '#ef4444',
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

// Styled Components (aligned with ClientManagement.jsx)
const SecretaryContainer = styled.div`
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
  padding: 1.5rem;
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
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 600;
  color: ${theme.textPrimary};
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    right: 0;
    width: 2.5rem;
    height: 4px;
    background: ${theme.primary};
    border-radius: 2px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1.25rem;
  background: ${theme.primary};
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const DeleteButton = styled(ActionButton)`
  background: ${theme.error};

  &:hover {
    background: #dc2626;
  }
`;

const FiltersSection = styled.div`
  margin-bottom: 1.5rem;
  background: ${theme.cardBackground};
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const SecretariesTable = styled.div`
  background: ${theme.cardBackground};
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  animation: ${css`${fadeIn} 0.5s ease-out`};
  overflow-x: auto;
`;

const TableWrapper = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.875rem;
`;

const TableHeader = styled.th`
  padding: 0.75rem 1rem;
  background: ${theme.primary}10;
  color: ${theme.textPrimary};
  font-weight: 500;
  text-align: right;
  position: sticky;
  top: 0;
  z-index: 10;
  transition: background 0.2s ease;

  &:hover {
    background: ${theme.primary}20;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: rgba(0, 0, 0, 0.02);
  }

  &:hover {
    background: ${theme.primary}05;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem 1rem;
  color: ${theme.textPrimary};
  text-align: right;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const ActionIcons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionIcon = styled.button`
  padding: 0.5rem;
  background: ${props => props.bgColor};
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${props => props.hoverColor};
    transform: translateY(-1px);
  }

  &:hover:after {
    content: attr(title);
    position: absolute;
    top: -2rem;
    left: 50%;
    transform: translateX(-50%);
    background: ${theme.textPrimary};
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    white-space: nowrap;
  }
`;

const Checkbox = styled.input`
  accent-color: ${theme.primary};
  width: 1rem;
  height: 1rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => (props.active ? theme.primary : 'white')};
  color: ${props => (props.active ? 'white' : theme.textPrimary)};
  border: 1px solid ${props => (props.active ? theme.primary : '#d1d5db')};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => (props.active ? theme.primaryDark : '#f3f4f6')};
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
  border-radius: 0.75rem;
  padding: 1.5rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: ${css`${modalSlideIn} 0.3s ease-out`};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.textPrimary};
`;

const CloseButton = styled.button`
  background: none;
  color: ${theme.textSecondary};
  font-size: 1.25rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.error};
  }
`;

const ModalForm = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.textPrimary};
`;

const FormInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: ${theme.textPrimary};
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 3px ${theme.primary}20;
  }

  &:invalid[required] {
    border-color: ${theme.error};
  }
`;

const SubmitButton = styled.button`
  padding: 0.5rem;
  background: ${theme.primary};
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  grid-column: span 2;

  &:hover {
    background: ${theme.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SkeletonRow = styled.tr`
  height: 3rem;
`;

const SkeletonCell = styled.td`
  padding: 0.75rem 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const SortArrow = styled.span`
  margin-left: 0.5rem;
  font-size: 0.75rem;
`;

const DetailsCard = styled.div`
  background: ${theme.cardBackground};
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-top: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: ${css`${fadeIn} 0.3s ease-out`};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const DetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const DetailsTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.textPrimary};
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
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
`;

// SearchBar Component (from ClientManagement.jsx)
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
        className="w-full py-2 px-4 pl-10 pr-12 bg-white rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-secondary text-right dir-rtl"
        dir="rtl"
        aria-label="بحث السكرتارية"
        maxLength={100}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-secondary" />
      </div>
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 left-0 flex items-center pl-3 hover:text-error"
          aria-label="Clear search"
        >
          <XCircleIcon className="h-5 w-5 text-secondary hover:text-error" />
        </button>
      )}
    </div>
  );
};

// API URLs
const API_URL = 'http://localhost:5000/api/secretaires';

function SecretaryManagement({ setToken }) {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [secretaries, setSecretaries] = useState([]);
  const [selectedSecretaries, setSelectedSecretaries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSecretary, setNewSecretary] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
    ville: '',
    email: '',
    password: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSecretary, setSelectedSecretary] = useState(null);
  const secretariesPerPage = 5;

  // Fetch Secretaries with token validation
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
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSecretaries(response.data);
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

  // Filter Secretaries
  const filteredSecretaries = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return secretaries.filter(
      secretary =>
        (secretary.nom && secretary.nom.toLowerCase().includes(searchLower)) ||
        (secretary.prenom && secretary.prenom.toLowerCase().includes(searchLower)) ||
        (secretary.email && secretary.email.toLowerCase().includes(searchLower))
    );
  }, [secretaries, searchTerm]);

  // Sort Secretaries
  const sortedSecretaries = [...filteredSecretaries].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    return sortConfig.direction === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  // Paginate Secretaries
  const totalPages = Math.ceil(sortedSecretaries.length / secretariesPerPage);
  const paginatedSecretaries = sortedSecretaries.slice(
    (currentPage - 1) * secretariesPerPage,
    currentPage * secretariesPerPage
  );

  // Headers
  const headers = [
    { label: '', key: '' }, // Checkbox
    { label: 'الاسم', key: 'nom' },
    { label: 'اللقب', key: 'prenom' },
    { label: 'الهاتف', key: 'telephone' },
    { label: 'العنوان', key: 'adresse' },
    { label: 'المدينة', key: 'ville' },
    { label: 'البريد الإلكتروني', key: 'email' },
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

  const handleExport = () => {
    const csvContent = [
      headers.map(h => h.label).join(','),
      ...secretaries.map(row =>
        [
          row.nom || '',
          row.prenom || '',
          row.telephone || '',
          row.adresse || '',
          row.ville || '',
          row.email || '',
        ].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `secretaries_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCheckboxChange = (id) => {
    setSelectedSecretaries(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('لم يتم تسجيل الدخول. الرجاء تسجيل الدخول.');
      window.location.href = '/login';
      return;
    }

    if (window.confirm('هل أنت متأكد من حذف السكرتارية المحددين؟')) {
      try {
        await Promise.all(
          selectedSecretaries.map(id =>
            axios.delete(`${API_URL}/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );
        setSecretaries(prev => prev.filter(s => !selectedSecretaries.includes(s._id)));
        setSelectedSecretaries([]);
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setToken(null);
          window.location.href = '/login';
          setError('انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.');
        } else {
          setError('فشل حذف السكرتارية');
          console.error('Bulk delete error:', err.response?.data || err.message);
        }
      }
    }
  };

  const handleModalOpen = (secretary = null) => {
    if (secretary) {
      setNewSecretary({
        nom: secretary.nom || '',
        prenom: secretary.prenom || '',
        telephone: secretary.telephone || '',
        adresse: secretary.adresse || '',
        ville: secretary.ville || '',
        email: secretary.email || '',
        password: '', // Leave password blank for security
      });
      setEditingId(secretary._id);
    } else {
      setNewSecretary({
        nom: '',
        prenom: '',
        telephone: '',
        adresse: '',
        ville: '',
        email: '',
        password: '',
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewSecretary({
      nom: '',
      prenom: '',
      telephone: '',
      adresse: '',
      ville: '',
      email: '',
      password: '',
    });
    setEditingId(null);
    setError(null);
  };

  const handleNewSecretaryChange = (e) => {
    const { name, value } = e.target;
    setNewSecretary(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrEditSecretary = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('لم يتم تسجيل الدخول. الرجاء تسجيل الدخول.');
      window.location.href = '/login';
      return;
    }

    if (!newSecretary.nom) {
      setError('يرجى إدخال الاسم');
      return;
    }
    if (!newSecretary.prenom) {
      setError('يرجى إدخال اللقب');
      return;
    }
    if (!newSecretary.telephone) {
      setError('يرجى إدخال الهاتف');
      return;
    }
    if (!newSecretary.adresse) {
      setError('يرجى إدخال العنوان');
      return;
    }
    if (!newSecretary.ville) {
      setError('يرجى إدخال المدينة');
      return;
    }
    if (!newSecretary.email) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }
    if (!editingId && !newSecretary.password) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }

    try {
      const payload = {
        nom: newSecretary.nom,
        prenom: newSecretary.prenom,
        telephone: newSecretary.telephone,
        adresse: newSecretary.adresse,
        ville: newSecretary.ville,
        email: newSecretary.email,
      };
      if (newSecretary.password) {
        payload.password = newSecretary.password;
      }

      let response;
      if (editingId) {
        response = await axios.put(`${API_URL}/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSecretaries(prev =>
          prev.map(s => (s._id === editingId ? response.data : s))
        );
      } else {
        response = await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSecretaries(prev => [...prev, response.data]);
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
        setError(err.response?.data?.message || 'حدث خطأ أثناء حفظ السكرتير');
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

    if (window.confirm('هل أنت متأكد من حذف هذا السكرتير؟')) {
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSecretaries(prev => prev.filter(s => s._id !== id));
        setSelectedSecretaries(prev => prev.filter(sid => sid !== id));
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setToken(null);
          window.location.href = '/login';
          setError('انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.');
        } else {
          setError('فشل حذف السكرتير');
          console.error('Delete error:', err.response?.data || err.message);
        }
      }
    }
  };

  const handleShowDetails = (secretary) => {
    setSelectedSecretary(secretary);
  };

  const handleCloseDetails = () => {
    setSelectedSecretary(null);
  };

  if (loading) {
    return (
      <SecretaryContainer>
        <NavDash setToken={setToken} />
        <Sidebar setToken={setToken} />
        <MainContent>
          <SecretariesTable>
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
          </SecretariesTable>
        </MainContent>
      </SecretaryContainer>
    );
  }

  return (
    <SecretaryContainer>
      <NavDash setToken={setToken} />
      <Sidebar setToken={setToken} />
      <MainContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
            {error}
          </div>
        )}
        <HeaderSection>
          <Title>إدارة السكرتارية</Title>
          <ButtonGroup>
            {selectedSecretaries.length > 0 && (
              <DeleteButton onClick={handleBulkDelete}>
                <FaTrash /> حذف المحدد ({selectedSecretaries.length})
              </DeleteButton>
            )}
            <ActionButton onClick={handleExport}>
              <FaDownload /> تصدير
            </ActionButton>
            <ActionButton onClick={() => handleModalOpen()}>
              + سكرتير جديد
            </ActionButton>
          </ButtonGroup>
        </HeaderSection>
        <FiltersSection>
          <SearchBar
            onSearch={handleSearch}
            placeholder="ابحث بالاسم، اللقب، أو البريد الإلكتروني..."
            initialValue={searchTerm}
          />
        </FiltersSection>
        <SecretariesTable>
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
              {paginatedSecretaries.map(row => (
                <TableRow key={row._id}>
                  <TableCell>
                    <Checkbox
                      type="checkbox"
                      checked={selectedSecretaries.includes(row._id)}
                      onChange={() => handleCheckboxChange(row._id)}
                    />
                  </TableCell>
                  <TableCell>{row.nom}</TableCell>
                  <TableCell>{row.prenom}</TableCell>
                  <TableCell>{row.telephone}</TableCell>
                  <TableCell>{row.adresse}</TableCell>
                  <TableCell>{row.ville}</TableCell>
                  <TableCell>{row.email}</TableCell>
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
          {paginatedSecretaries.length === 0 && (
            <div className="text-center text-secondary p-6">
              {searchTerm
                ? `لا توجد نتائج مطابقة لـ "${searchTerm}"`
                : 'لا توجد بيانات'}
            </div>
          )}
        </SecretariesTable>
        {selectedSecretary && (
          <DetailsCard>
            <DetailsHeader>
              <DetailsTitle>تفاصيل السكرتير</DetailsTitle>
              <CloseButton onClick={handleCloseDetails}>
                <FaTimes />
              </CloseButton>
            </DetailsHeader>
            <DetailItem>
              <DetailLabel>الاسم</DetailLabel>
              <DetailValue>{selectedSecretary.nom}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>اللقب</DetailLabel>
              <DetailValue>{selectedSecretary.prenom}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>الهاتف</DetailLabel>
              <DetailValue>{selectedSecretary.telephone}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>العنوان</DetailLabel>
              <DetailValue>{selectedSecretary.adresse}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>المدينة</DetailLabel>
              <DetailValue>{selectedSecretary.ville}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>البريد الإلكتروني</DetailLabel>
              <DetailValue>{selectedSecretary.email}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>المحامي</DetailLabel>
              <DetailValue>
                {selectedSecretary.avocat_id ? `${selectedSecretary.avocat_id.nom} ${selectedSecretary.avocat_id.prenom}` : '-'}
              </DetailValue>
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
                <ModalTitle>{editingId ? 'تعديل السكرتير' : 'إضافة سكرتير جديد'}</ModalTitle>
                <CloseButton onClick={handleModalClose}>
                  <FaTimes />
                </CloseButton>
              </ModalHeader>
              <ModalForm onSubmit={handleAddOrEditSecretary}>
                <FormField>
                  <FormLabel>الاسم *</FormLabel>
                  <FormInput
                    type="text"
                    name="nom"
                    value={newSecretary.nom}
                    onChange={handleNewSecretaryChange}
                    required
                  />
                </FormField>
                <FormField>
                  <FormLabel>اللقب *</FormLabel>
                  <FormInput
                    type="text"
                    name="prenom"
                    value={newSecretary.prenom}
                    onChange={handleNewSecretaryChange}
                    required
                  />
                </FormField>
                <FormField>
                  <FormLabel>الهاتف *</FormLabel>
                  <FormInput
                    type="tel"
                    name="telephone"
                    value={newSecretary.telephone}
                    onChange={handleNewSecretaryChange}
                    required
                  />
                </FormField>
                <FormField>
                  <FormLabel>العنوان *</FormLabel>
                  <FormInput
                    type="text"
                    name="adresse"
                    value={newSecretary.adresse}
                    onChange={handleNewSecretaryChange}
                    required
                  />
                </FormField>
                <FormField>
                  <FormLabel>المدينة *</FormLabel>
                  <FormInput
                    type="text"
                    name="ville"
                    value={newSecretary.ville}
                    onChange={handleNewSecretaryChange}
                    required
                  />
                </FormField>
                <FormField>
                  <FormLabel>البريد الإلكتروني *</FormLabel>
                  <FormInput
                    type="email"
                    name="email"
                    value={newSecretary.email}
                    onChange={handleNewSecretaryChange}
                    required
                  />
                </FormField>
                <FormField>
                  <FormLabel>كلمة المرور {editingId ? '(اختياري)' : '*'}</FormLabel>
                  <FormInput
                    type="password"
                    name="password"
                    value={newSecretary.password}
                    onChange={handleNewSecretaryChange}
                    required={!editingId}
                  />
                </FormField>
                <SubmitButton type="submit">
                  {editingId ? 'تعديل السكرتير' : 'إضافة السكرتير'}
                </SubmitButton>
              </ModalForm>
              {error && (
                <div className="mt-3 p-2 bg-red-50 text-red-800 rounded-md text-sm">
                  {error}
                </div>
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </MainContent>
    </SecretaryContainer>
  );
}

export default SecretaryManagement;
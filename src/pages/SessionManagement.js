// import React, { useState, useEffect } from 'react';
// import styled, { keyframes, css } from 'styled-components';
// import Sidebar from '../components/Sidebar';
// import NavDash from '../components/NavDash';
// import { FaEye, FaEdit, FaTrash, FaFilter, FaFolder, FaClock } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import debounce from 'lodash/debounce';

// // Keyframes for Animations
// const fadeIn = keyframes`
//   from {
//     opacity: 0;
//     transform: translateY(20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// `;

// const modalFadeIn = keyframes`
//   from {
//     opacity: 0;
//     transform: scale(0.95);
//   }
//   to {
//     opacity: 1;
//     transform: scale(1);
//   }
// `;

// // Styled Components
// const SessionContainer = styled.div`
//   display: flex;
//   min-height: 100vh;
//   background: #e6f0fa;
//   direction: rtl;
//   font-family: 'Inter', 'Roboto', sans-serif;
// `;

// const MainContent = styled.div`
//   flex: 1;
//   margin-right: 70px;
//   margin-top: 60px;
//   padding: 1rem;
//   overflow-y: auto;

//   @media (max-width: 768px) {
//     padding: 0.5rem;
//   }
// `;

// const HeaderSection = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1rem;
// `;

// const Title = styled.h1`
//   font-size: 1.5rem;
//   font-weight: 600;
//   color: #2e7d32;
//   position: relative;

//   &:after {
//     content: '';
//     position: absolute;
//     bottom: -0.25rem;
//     right: 0;
//     width: 2.5rem;
//     height: 3px;
//     background: #2e7d32;
//     border-radius: 2px;
//   }
// `;

// const ButtonGroup = styled.div`
//   display: flex;
//   gap: 0.5rem;
// `;

// const ActionButton = styled(motion.button)`
//   padding: 0.5rem 1rem;
//   background: #2e7d32;
//   color: #ffffff;
//   font-weight: 500;
//   font-size: 0.75rem;
//   border-radius: 0.25rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   transition: all 0.3s ease-in-out;

//   &:hover {
//     background: rgb(17, 91, 48);
//     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//   }
// `;

// const DeleteButton = styled(ActionButton)`
//   background: #e53e3e;

//   &:hover {
//     background: #c53030;
//     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//   }
// `;

// const FiltersSection = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 1.5rem;
//   margin-bottom: 2rem;
//   background: rgba(255, 255, 255, 0.95);
//   backdrop-filter: blur(15px);
//   border-radius: 1rem;
//   padding: 1.5rem;
//   box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
//   border: 1px solid rgba(255, 255, 255, 0.4);
// `;

// const FilterInput = styled.input`
//   flex: 1;
//   padding: 0.75rem;
//   border: 1px solid #d1d5db;
//   border-radius: 0.5rem;
//   font-size: 0.875rem;
//   color: #4b5563;
//   background: rgba(255, 255, 255, 0.5);
//   transition: border 0.3s ease-in-out;

//   &:focus {
//     outline: none;
//     border-color: #2e7d32;
//     box-shadow: 0 0 5px rgba(46, 125, 50, 0.3);
//   }
// `;

// const FilterSelect = styled.select`
//   padding: 0.75rem;
//   border: 1px solid #d1d5db;
//   border-radius: 0.5rem;
//   font-size: 0.875rem;
//   color: #4b5563;
//   background: rgba(255, 255, 255, 0.5);
//   transition: border 0.3s ease-in-out;

//   &:focus {
//     outline: none;
//     border-color: #2e7d32;
//     box-shadow: 0 0 5px rgba(46, 125, 50, 0.3);
//   }
// `;

// const SummaryCard = styled.div`
//   background: #ffffff;
//   border-radius: 0.5rem;
//   padding: 1rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//   border: 1px solid #e5e7eb;
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
//   gap: 1rem;
//   margin-bottom: 1rem;
// `;

// const SummaryItem = styled(motion.div)`
//   text-align: center;
//   padding: 0.75rem;
//   border-radius: 0.5rem;
//   border: 1px solid #e5e7eb;
//   background: #ffffff;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 0.5rem;
// `;

// const SummaryIcon = styled.div`
//   font-size: 1.5rem;
//   color: ${props => props.color || '#2e7d32'};
// `;

// const SummaryTitle = styled.h3`
//   font-size: 0.75rem;
//   font-weight: 500;
//   color: #6b7280;
// `;

// const SummaryValue = styled.div`
//   font-size: 1.5rem;
//   font-weight: 600;
//   color: #2e7d32;
// `;

// const SessionsTable = styled.div`
//   background: #ffffff;
//   border-radius: 0.5rem;
//   padding: 1rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//   border: 1px solid #e5e7eb;
//   animation: ${css`${fadeIn} 0.8s ease-in-out forwards`};
//   overflow-x: auto;
// `;

// const TableWrapper = styled.table`
//   width: 100%;
//   border-collapse: separate;
//   border-spacing: 0;
//   font-size: 0.75rem;
// `;

// const TableHeader = styled.th`
//   padding: 0.75rem;
//   background: #f1f5f9;
//   color: #2e7d32;
//   font-weight: 600;
//   text-align: right;
//   border-bottom: 1px solid #e5e7eb;
//   cursor: pointer;
//   position: relative;

//   &:hover {
//     background: #e5e7eb;
//   }

//   &:first-child {
//     border-top-right-radius: 0.5rem;
//   }

//   &:last-child {
//     border-top-left-radius: 0.5rem;
//   }
// `;

// const SortArrow = styled.span`
//   margin-left: 0.5rem;
//   font-size: 0.75rem;
// `;

// const TableRow = styled(motion.tr)`
//   transition: all 0.3s ease-in-out;

//   &:hover {
//     background: #f1f5f9;
//     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//   }
// `;

// const TableCell = styled.td`
//   padding: 0.75rem;
//   color: #6b7280;
//   text-align: right;
//   border-bottom: 1px solid #e5e7eb;
// `;

// const ActionIcons = styled.div`
//   display: flex;
//   gap: 0.5rem;
// `;

// const ActionIcon = styled(motion.button)`
//   padding: 0.5rem;
//   background: ${props => props.bgColor};
//   color: #ffffff;
//   border-radius: 0.25rem;
//   font-size: 0.875rem;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
//   transition: all 0.3s ease-in-out;

//   &:hover {
//     background: ${props => props.hoverColor};
//   }
// `;

// const Checkbox = styled.input`
//   accent-color: #2e7d32;
//   width: 0.875rem;
//   height: 0.875rem;
// `;

// const Pagination = styled.div`
//   display: flex;
//   justify-content: center;
//   gap: 0.5rem;
//   margin-top: 1rem;
// `;

// const PageButton = styled(motion.button)`
//   padding: 0.5rem 1rem;
//   background: ${props => (props.active ? '#2e7d32' : '#ffffff')};
//   color: ${props => (props.active ? '#ffffff' : '#6b7280')};
//   border-radius: 0.25rem;
//   font-size: 0.75rem;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
//   border: 1px solid #e5e7eb;
//   transition: all 0.3s ease-in-out;

//   &:hover {
//     background: ${props => (props.active ? 'rgb(17, 91, 48)' : '#f1f5f9')};
//   }
// `;

// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: rgba(0, 0, 0, 0.5);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 1000;
// `;

// const ModalContent = styled(motion.div)`
//   background: #ffffff;
//   border-radius: 0.5rem;
//   padding: 1.5rem;
//   width: 90%;
//   max-width: 700px;
//   box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//   border: 1px solid #e5e7eb;
//   position: relative;
// `;

// const ModalHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1rem;
// `;

// const ModalTitle = styled.h2`
//   font-size: 1.25rem;
//   font-weight: 600;
//   color: #2e7d32;
// `;

// const CloseButton = styled(motion.button)`
//   background: none;
//   color: #6b7280;
//   font-size: 1.25rem;
//   transition: color 0.3s ease-in-out;

//   &:hover {
//     color: #e53e3e;
//   }
// `;

// const ModalForm = styled.form`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 1rem;
// `;

// const FormField = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
// `;

// const FormLabel = styled.label`
//   font-size: 0.75rem;
//   font-weight: 500;
//   color: #6b7280;
// `;

// const FormInput = styled.input`
//   padding: 0.5rem 0.75rem;
//   border: 1px solid #e5e7eb;
//   border-radius: 0.25rem;
//   font-size: 0.75rem;
//   color: #6b7280;
//   background: #ffffff;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
//   transition: border 0.3s ease-in-out;

//   &:focus {
//     outline: none;
//     border-color: #2e7d32;
//     box-shadow: 0 0 5px rgba(46, 204, 113, 0.3);
//   }
// `;

// const FormSelect = styled.select`
//   padding: 0.5rem 0.75rem;
//   border: 1px solid #e5e7eb;
//   border-radius: 0.25rem;
//   font-size: 0.75rem;
//   color: #6b7280;
//   background: #ffffff;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
//   transition: border 0.3s ease-in-out;

//   &:focus {
//     outline: none;
//     border-color: #2e7d32;
//     box-shadow: 0 0 5px rgba(46, 204, 113, 0.3);
//   }
// `;

// const FormTextarea = styled.textarea`
//   padding: 0.5rem 0.75rem;
//   border: 1px solid #e5e7eb;
//   border-radius: 0.25rem;
//   font-size: 0.75rem;
//   color: #6b7280;
//   background: #ffffff;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
//   transition: border 0.3s ease-in-out;
//   resize: vertical;
//   min-height: 100px;

//   &:focus {
//     outline: none;
//     border-color: #2e7d32;
//     box-shadow: 0 0 5px rgba(46, 204, 113, 0.3);
//   }
// `;

// const SubmitButton = styled(motion.button)`
//   padding: 0.5rem;
//   background: #2e7d32;
//   color: #ffffff;
//   font-weight: 500;
//   font-size: 0.75rem;
//   border-radius: 0.25rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//   grid-column: span 2;
//   transition: all 0.3s ease-in-out;

//   &:hover {
//     background: rgb(17, 91, 48);
//     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//   }
// `;

// const ConfirmationModalContent = styled(motion.div)`
//   background: #ffffff;
//   border-radius: 0.5rem;
//   padding: 1.5rem;
//   width: 90%;
//   max-width: 400px;
//   box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//   border: 1px solid #e5e7eb;
//   position: relative;
//   text-align: center;
// `;

// const ConfirmationMessage = styled.p`
//   font-size: 1rem;
//   color: #6b7280;
//   margin-bottom: 1.5rem;
// `;

// const ConfirmationButtonGroup = styled.div`
//   display: flex;
//   justify-content: center;
//   gap: 1rem;
// `;

// const ConfirmButton = styled(motion.button)`
//   padding: 0.5rem 1.5rem;
//   background: #e53e3e;
//   color: #ffffff;
//   font-weight: 500;
//   font-size: 0.875rem;
//   border-radius: 0.25rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//   transition: all 0.3s ease-in-out;

//   &:hover {
//     background: #c53030;
//     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//   }
// `;

// const CancelButton = styled(motion.button)`
//   padding: 0.5rem 1.5rem;
//   background: #2e7d32;
//   color: #ffffff;
//   font-weight: 500;
//   font-size: 0.875rem;
//   border-radius: 0.25rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//   transition: all 0.3s ease-in-out;

//   &:hover {
//     background: rgb(17, 91, 48);
//     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//   }
// `;

// const DetailsModalContent = styled(motion.div)`
//   background: #ffffff;
//   border-radius: 0.5rem;
//   padding: 1.5rem;
//   width: 90%;
//   max-width: 500px;
//   box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//   border: 1px solid #e5e7eb;
//   position: relative;
// `;

// const DetailsContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
// `;

// const DetailRow = styled.div`
//   display: flex;
//   justify-content: space-between;
//   padding: 0.5rem 0;
//   border-bottom: 1px solid #e5e7eb;
// `;

// const DetailLabel = styled.span`
//   font-size: 0.875rem;
//   font-weight: 500;
//   color: #2e7d32;
// `;

// const DetailValue = styled.span`
//   font-size: 0.875rem;
//   color: #6b7280;
// `;

// const CloseModalButton = styled(motion.button)`
//   padding: 0.5rem 1.5rem;
//   background: #2e7d32;
//   color: #ffffff;
//   font-weight: 500;
//   font-size: 0.875rem;
//   border-radius: 0.25rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//   margin-top: 1rem;
//   align-self: center;
//   transition: all 0.3s ease-in-out;

//   &:hover {
//     background: rgb(17, 91, 48);
//     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//   }
// `;

// function SessionManagement() {
//     const [allSessions, setAllSessions] = useState([]);
//     const [filteredSessions, setFilteredSessions] = useState([]);
//     const [cases, setCases] = useState([]);
//     const [appointments, setAppointments] = useState([]);
//     const [filters, setFilters] = useState({
//         affaire: '',
//         rendez_vous: '',
//         search: '',
//     });
//     const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
//     const [currentPage, setCurrentPage] = useState(1);
//     const [selectedSessions, setSelectedSessions] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editSession, setEditSession] = useState(null);
//     const [newSession, setNewSession] = useState({
//         remarque: '',
//         ordre: '',
//         emplacement: '',
//         affaire_id: '',
//         rendez_vous_id: '',
//     });
//     const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
//     const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//     const [sessionToDelete, setSessionToDelete] = useState(null);
//     const [isBulkDelete, setIsBulkDelete] = useState(false);
//     const [selectedSessionDetails, setSelectedSessionDetails] = useState(null);
//     const sessionsPerPage = 5;

//     useEffect(() => {
//         fetchCases();
//         fetchAppointments();
//         fetchSessions();
//     }, []);

//     const fetchCases = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/affaires', {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//             });
//             console.log('Cases fetched:', response.data);
//             setCases(response.data);
//         } catch (error) {
//             console.error('Error fetching cases:', error.response?.data || error.message);
//             setCases([]);
//         }
//     };

//     const fetchAppointments = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/rendezvous', {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//             });
//             console.log('Appointments fetched:', response.data);
//             setAppointments(response.data);
//         } catch (error) {
//             console.error('Error fetching appointments:', error.response?.data || error.message);
//             setAppointments([]);
//         }
//     };

//     const fetchSessions = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/sessions', {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//             });
//             console.log('Sessions fetched for authenticated lawyer:', response.data);
//             setAllSessions(response.data);
//             setFilteredSessions(response.data);
//         } catch (error) {
//             console.error('Error fetching sessions:', error.response?.data || error.message);
//             setAllSessions([]);
//             setFilteredSessions([]);
//         }
//     };

//     useEffect(() => {
//         let filtered = [...allSessions];

//         if (filters.affaire) {
//             filtered = filtered.filter(session => session.affaire_id?._id === filters.affaire);
//         }

//         if (filters.rendez_vous) {
//             filtered = filtered.filter(session => session.rendez_vous_id?._id === filters.rendez_vous);
//         }

//         if (filters.search) {
//             const searchLower = filters.search.toLowerCase();
//             filtered = filtered.filter(session =>
//                 (session.remarque && session.remarque.toLowerCase().includes(searchLower)) ||
//                 (session.emplacement && session.emplacement.toLowerCase().includes(searchLower)) ||
//                 (session.affaire_id?.titre && session.affaire_id.titre.toLowerCase().includes(searchLower))
//             );
//         }

//         setFilteredSessions(filtered);
//         setCurrentPage(1);
//     }, [filters, allSessions]);

//     const debouncedSetSearchFilter = debounce((value) => {
//         setFilters(prev => ({ ...prev, search: value }));
//     }, 300);

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         console.log(`Filter changed: ${name}=${value}`);
//         if (name === 'search') {
//             debouncedSetSearchFilter(value);
//         } else {
//             setFilters(prev => ({ ...prev, [name]: value }));
//         }
//     };

//     const sortedSessions = [...filteredSessions].sort((a, b) => {
//         if (!sortConfig.key) return 0;
//         let aValue = a[sortConfig.key];
//         let bValue = b[sortConfig.key];

//         if (sortConfig.key === 'affaire_id') {
//             aValue = a.affaire_id?.titre || '-';
//             bValue = b.affaire_id?.titre || '-';
//         } else if (sortConfig.key === 'rendez_vous_id') {
//             aValue = a.rendez_vous_id?.date || '-';
//             bValue = b.rendez_vous_id?.date || '-';
//         } else if (sortConfig.key === 'ordre') {
//             return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
//         }

//         return sortConfig.direction === 'asc'
//             ? String(aValue).localeCompare(String(bValue))
//             : String(bValue).localeCompare(String(aValue));
//     });

//     const totalPages = Math.ceil(sortedSessions.length / sessionsPerPage);
//     const paginatedSessions = sortedSessions.slice(
//         (currentPage - 1) * sessionsPerPage,
//         currentPage * sessionsPerPage
//     );

//     const summary = {
//         total: filteredSessions.length,
//     };

//     const headers = [
//         { label: '', key: '' },
//         { label: 'ملاحظة', key: 'remarque' },
//         { label: 'الترتيب', key: 'ordre' },
//         { label: 'الموقع', key: 'emplacement' },
//         { label: 'القضية', key: 'affaire_id' },
//         { label: 'الموعد', key: 'rendez_vous_id' },
//         { label: 'الإجراءات', key: '' },
//     ];

//     const handleSort = (key) => {
//         setSortConfig({
//             key,
//             direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
//         });
//     };

//     const handleCheckboxChange = (id) => {
//         setSelectedSessions(prev =>
//             prev.includes(id)
//                 ? prev.filter(sid => sid !== id)
//                 : [...prev, id]
//         );
//     };

//     const handleBulkDelete = () => {
//         setIsBulkDelete(true);
//         setIsConfirmationModalOpen(true);
//     };

//     const handleConfirmDelete = async () => {
//         try {
//             if (isBulkDelete) {
//                 await Promise.all(
//                     selectedSessions.map(id =>
//                         axios.delete(`http://localhost:5000/api/sessions/${id}`, {
//                             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//                         })
//                     )
//                 );
//                 setSelectedSessions([]);
//             } else if (sessionToDelete) {
//                 await axios.delete(`http://localhost:5000/api/sessions/${sessionToDelete}`, {
//                     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//                 });
//             }
//             fetchSessions();
//         } catch (error) {
//             console.error('Error deleting session(s):', error.response?.data || error.message);
//         } finally {
//             setIsConfirmationModalOpen(false);
//             setSessionToDelete(null);
//             setIsBulkDelete(false);
//         }
//     };

//     const handleCancelDelete = () => {
//         setIsConfirmationModalOpen(false);
//         setSessionToDelete(null);
//         setIsBulkDelete(false);
//     };

//     const handleExport = () => {
//         const csvContent = [
//             headers.map(h => h.label).join(','),
//             ...filteredSessions.map(row =>
//                 [
//                     row.remarque || '-',
//                     row.ordre,
//                     row.emplacement,
//                     row.affaire_id?.titre || '-',
//                     row.rendez_vous_id?.date || '-',
//                 ].join(',')
//             ),
//         ].join('\n');
//         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.setAttribute('href', url);
//         link.setAttribute('download', `sessions_${new Date().toISOString()}.csv`);
//         link.click();
//         URL.revokeObjectURL(url);
//     };

//     const handleView = (session) => {
//         setSelectedSessionDetails(session);
//         setIsDetailsModalOpen(true);
//     };

//     const handleCloseDetailsModal = () => {
//         setIsDetailsModalOpen(false);
//         setSelectedSessionDetails(null);
//     };

//     const handleEdit = (session) => {
//         setEditSession(session);
//         setNewSession({
//             remarque: session.remarque || '',
//             ordre: session.ordre || '',
//             emplacement: session.emplacement || '',
//             affaire_id: session.affaire_id?._id || (typeof session.affaire_id === 'string' ? session.affaire_id : ''),
//             rendez_vous_id: session.rendez_vous_id?._id || (typeof session.rendez_vous_id === 'string' ? session.rendez_vous_id : ''),
//         });
//         setIsModalOpen(true);
//     };

//     const handleDelete = (id) => {
//         setSessionToDelete(id);
//         setIsConfirmationModalOpen(true);
//     };

//     const handleModalOpen = () => {
//         setEditSession(null);
//         setNewSession({
//             remarque: '',
//             ordre: '',
//             emplacement: '',
//             affaire_id: '',
//             rendez_vous_id: '',
//         });
//         setIsModalOpen(true);
//     };

//     const handleModalClose = () => {
//         setIsModalOpen(false);
//         setEditSession(null);
//     };

//     const handleNewSessionChange = (e) => {
//         const { name, value } = e.target;
//         setNewSession(prev => ({
//             ...prev,
//             [name]: name === 'ordre' ? parseInt(value) || '' : value,
//         }));
//     };

//     const handleAddOrUpdateSession = async (e) => {
//         e.preventDefault();
//         if (!newSession.ordre) {
//             alert('يرجى إدخال الترتيب');
//             return;
//         }
//         if (!newSession.emplacement) {
//             alert('يرجى إدخال الموقع');
//             return;
//         }
//         if (!newSession.affaire_id) {
//             alert('يرجى اختيار القضية');
//             return;
//         }
//         if (!newSession.rendez_vous_id) {
//             alert('يرجى اختيار الموعد');
//             return;
//         }

//         try {
//             const payload = {
//                 remarque: newSession.remarque || '',
//                 ordre: newSession.ordre,
//                 emplacement: newSession.emplacement,
//                 affaire_id: newSession.affaire_id,
//                 rendez_vous_id: newSession.rendez_vous_id,
//             };
//             console.log('Submitting session payload:', payload);

//             if (editSession) {
//                 await axios.put(`http://localhost:5000/api/sessions/${editSession._id}`, payload, {
//                     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//                 });
//             } else {
//                 await axios.post('http://localhost:5000/api/sessions', payload, {
//                     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//                 });
//             }
//             fetchSessions();
//             fetchCases();
//             fetchAppointments();
//             handleModalClose();
//         } catch (error) {
//             console.error('Error saving session:', error.response?.data || error.message);
//             alert('حدث خطأ أثناء حفظ الجلسة: ' + (error.response?.data?.message || error.message));
//         }
//     };

//     const formatAppointmentDisplay = (appointment) => {
//         if (!appointment.date || !appointment.heure_debut) {
//             return appointment._id;
//         }
//         const date = new Date(appointment.date).toLocaleDateString('ar');
//         return `${date} ${appointment.heure_debut}`;
//     };

//     return (
//         <SessionContainer>
//             <NavDash />
//             <Sidebar />
//             <MainContent>
//                 <HeaderSection>
//                     <Title>إدارة الجلسات</Title>
//                     <ButtonGroup>
//                         {selectedSessions.length > 0 && (
//                             <DeleteButton
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={handleBulkDelete}
//                             >
//                                 <FaTrash /> حذف
//                             </DeleteButton>
//                         )}
//                         <ActionButton
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={handleExport}
//                         >
//                             <FaFilter /> تصدير
//                         </ActionButton>
//                         <ActionButton
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={handleModalOpen}
//                         >
//                             + إضافة
//                         </ActionButton>
//                     </ButtonGroup>
//                 </HeaderSection>

//                 <SummaryCard>
//                     <SummaryItem whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
//                         <SummaryIcon color="#2e7d32">
//                             <FaFolder />
//                         </SummaryIcon>
//                         <SummaryTitle>إجمالي الجلسات</SummaryTitle>
//                         <SummaryValue>{summary.total}</SummaryValue>
//                     </SummaryItem>
//                 </SummaryCard>

//                 <FiltersSection>
//                     <FilterInput
//                         type="text"
//                         placeholder="البحث..."
//                         name="search"
//                         value={filters.search}
//                         onChange={handleFilterChange}
//                     />
//                     <FilterSelect name="affaire" value={filters.affaire} onChange={handleFilterChange}>
//                         <option value="">الكل</option>
//                         {cases.length > 0 ? (
//                             cases.map(caseItem => (
//                                 <option key={caseItem._id} value={caseItem._id}>{caseItem.titre}</option>
//                             ))
//                         ) : (
//                             <option value="">لا توجد قضايا متاحة</option>
//                         )}
//                     </FilterSelect>
//                     <FilterSelect name="rendez_vous" value={filters.rendez_vous} onChange={handleFilterChange}>
//                         <option value="">الكل</option>
//                         {appointments.length > 0 ? (
//                             appointments.map(appointment => (
//                                 <option key={appointment._id} value={appointment._id}>{formatAppointmentDisplay(appointment)}</option>
//                             ))
//                         ) : (
//                             <option value="">لا توجد مواعيد متاحة</option>
//                         )}
//                     </FilterSelect>
//                 </FiltersSection>

//                 <SessionsTable>
//                     <TableWrapper>
//                         <thead>
//                             <tr>
//                                 {headers.map((header) => (
//                                     <TableHeader key={header.label} onClick={() => header.key && handleSort(header.key)}>
//                                         {header.label}
//                                         {sortConfig.key === header.key && (
//                                             <SortArrow>{sortConfig.direction === 'asc' ? '↑' : '↓'}</SortArrow>
//                                         )}
//                                     </TableHeader>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {paginatedSessions.map((session) => (
//                                 <TableRow
//                                     key={session._id}
//                                     whileHover={{ scale: 1.005 }}
//                                     transition={{ duration: 0.3 }}
//                                 >
//                                     <TableCell>
//                                         <Checkbox
//                                             type="checkbox"
//                                             checked={selectedSessions.includes(session._id)}
//                                             onChange={() => handleCheckboxChange(session._id)}
//                                         />
//                                     </TableCell>
//                                     <TableCell>{session.remarque || '-'}</TableCell>
//                                     <TableCell>{session.ordre}</TableCell>
//                                     <TableCell>{session.emplacement}</TableCell>
//                                     <TableCell>{session.affaire_id?.titre || '-'}</TableCell>
//                                     <TableCell>{session.rendez_vous_id ? formatAppointmentDisplay(session.rendez_vous_id) : '-'}</TableCell>
//                                     <TableCell>
//                                         <ActionIcons>
//                                             <ActionIcon
//                                                 bgColor="#2e7d32"
//                                                 hoverColor="rgb(17, 91, 48)"
//                                                 onClick={() => handleView(session)}
//                                                 title="عرض"
//                                                 whileHover={{ scale: 1.1 }}
//                                                 whileTap={{ scale: 0.9 }}
//                                             >
//                                                 <FaEye />
//                                             </ActionIcon>
//                                             <ActionIcon
//                                                 bgColor="#2e7d32"
//                                                 hoverColor="rgb(17, 91, 48)"
//                                                 onClick={() => handleEdit(session)}
//                                                 title="تعديل"
//                                                 whileHover={{ scale: 1.1 }}
//                                                 whileTap={{ scale: 0.9 }}
//                                             >
//                                                 <FaEdit />
//                                             </ActionIcon>
//                                             <ActionIcon
//                                                 bgColor="#e53e3e"
//                                                 hoverColor="#c53030"
//                                                 onClick={() => handleDelete(session._id)}
//                                                 title="حذف"
//                                                 whileHover={{ scale: 1.1 }}
//                                                 whileTap={{ scale: 0.9 }}
//                                             >
//                                                 <FaTrash />
//                                             </ActionIcon>
//                                         </ActionIcons>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </tbody>
//                     </TableWrapper>
//                 </SessionsTable>

//                 <Pagination>
//                     <PageButton
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                         disabled={currentPage === 1}
//                     >
//                         السابق
//                     </PageButton>
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                         <PageButton
//                             key={page}
//                             active={currentPage === page}
//                             onClick={() => setCurrentPage(page)}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                         >
//                             {page}
//                         </PageButton>
//                     ))}
//                     <PageButton
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                         disabled={currentPage === totalPages}
//                     >
//                         التالي
//                     </PageButton>
//                 </Pagination>

//                 {isModalOpen && (
//                     <ModalOverlay>
//                         <ModalContent
//                             initial={{ opacity: 0, scale: 0.95 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{ duration: 0.3 }}
//                         >
//                             <ModalHeader>
//                                 <ModalTitle>{editSession ? 'تعديل الجلسة' : 'إضافة جلسة جديدة'}</ModalTitle>
//                                 <CloseButton
//                                     onClick={handleModalClose}
//                                     whileHover={{ scale: 1.1 }}
//                                     whileTap={{ scale: 0.9 }}
//                                 >
//                                     <FaTrash />
//                                 </CloseButton>
//                             </ModalHeader>
//                             <ModalForm onSubmit={handleAddOrUpdateSession}>
//                                 <div>
//                                     <FormField>
//                                         <FormLabel>ملاحظة</FormLabel>
//                                         <FormTextarea
//                                             name="remarque"
//                                             value={newSession.remarque}
//                                             onChange={handleNewSessionChange}
//                                         />
//                                     </FormField>
//                                     <FormField>
//                                         <FormLabel>الترتيب</FormLabel>
//                                         <FormInput
//                                             type="number"
//                                             name="ordre"
//                                             value={newSession.ordre}
//                                             onChange={handleNewSessionChange}
//                                             required
//                                         />
//                                     </FormField>
//                                     <FormField>
//                                         <FormLabel>الموقع</FormLabel>
//                                         <FormInput
//                                             type="text"
//                                             name="emplacement"
//                                             value={newSession.emplacement}
//                                             onChange={handleNewSessionChange}
//                                             required
//                                         />
//                                     </FormField>
//                                 </div>
//                                 <div>
//                                     <FormField>
//                                         <FormLabel>القضية</FormLabel>
//                                         <FormSelect
//                                             name="affaire_id"
//                                             value={newSession.affaire_id}
//                                             onChange={handleNewSessionChange}
//                                             required
//                                         >
//                                             <option value="">اختر القضية</option>
//                                             {cases.length > 0 ? (
//                                                 cases.map(caseItem => (
//                                                     <option key={caseItem._id} value={caseItem._id}>{caseItem.titre}</option>
//                                                 ))
//                                             ) : (
//                                                 <option value="">لا توجد قضايا متاحة</option>
//                                             )}
//                                         </FormSelect>
//                                     </FormField>
//                                     <FormField>
//                                         <FormLabel>الموعد</FormLabel>
//                                         <FormSelect
//                                             name="rendez_vous_id"
//                                             value={newSession.rendez_vous_id}
//                                             onChange={handleNewSessionChange}
//                                             required
//                                         >
//                                             <option value="">اختر الموعد</option>
//                                             {appointments.length > 0 ? (
//                                                 appointments.map(appointment => (
//                                                     <option key={appointment._id} value={appointment._id}>{formatAppointmentDisplay(appointment)}</option>
//                                                 ))
//                                             ) : (
//                                                 <option value="">لا توجد مواعيد متاحة</option>
//                                             )}
//                                         </FormSelect>
//                                     </FormField>
//                                 </div>
//                                 <SubmitButton
//                                     type="submit"
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     {editSession ? 'تحديث الجلسة' : 'إضافة الجلسة'}
//                                 </SubmitButton>
//                             </ModalForm>
//                         </ModalContent>
//                     </ModalOverlay>
//                 )}

//                 {isConfirmationModalOpen && (
//                     <ModalOverlay>
//                         <ConfirmationModalContent
//                             initial={{ opacity: 0, scale: 0.95 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{ duration: 0.3 }}
//                         >
//                             <ModalHeader>
//                                 <ModalTitle>تأكيد الحذف</ModalTitle>
//                             </ModalHeader>
//                             <ConfirmationMessage>
//                                 {isBulkDelete
//                                     ? `هل أنت متأكد أنك تريد حذف ${selectedSessions.length} جلسة؟`
//                                     : 'هل أنت متأكد أنك تريد حذف هذه الجلسة؟'}
//                             </ConfirmationMessage>
//                             <ConfirmationButtonGroup>
//                                 <ConfirmButton
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                     onClick={handleConfirmDelete}
//                                 >
//                                     حذف
//                                 </ConfirmButton>
//                                 <CancelButton
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                     onClick={handleCancelDelete}
//                                 >
//                                     إلغاء
//                                 </CancelButton>
//                             </ConfirmationButtonGroup>
//                         </ConfirmationModalContent>
//                     </ModalOverlay>
//                 )}

//                 {isDetailsModalOpen && selectedSessionDetails && (
//                     <ModalOverlay>
//                         <DetailsModalContent
//                             initial={{ opacity: 0, scale: 0.95 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{ duration: 0.3 }}
//                         >
//                             <ModalHeader>
//                                 <ModalTitle>تفاصيل الجلسة</ModalTitle>
//                                 <CloseButton
//                                     onClick={handleCloseDetailsModal}
//                                     whileHover={{ scale: 1.1 }}
//                                     whileTap={{ scale: 0.9 }}
//                                 >
//                                     <FaTrash />
//                                 </CloseButton>
//                             </ModalHeader>
//                             <DetailsContainer>
//                                 <DetailRow>
//                                     <DetailLabel>ملاحظة:</DetailLabel>
//                                     <DetailValue>{selectedSessionDetails.remarque || '-'}</DetailValue>
//                                 </DetailRow>
//                                 <DetailRow>
//                                     <DetailLabel>الترتيب:</DetailLabel>
//                                     <DetailValue>{selectedSessionDetails.ordre}</DetailValue>
//                                 </DetailRow>
//                                 <DetailRow>
//                                     <DetailLabel>الموقع:</DetailLabel>
//                                     <DetailValue>{selectedSessionDetails.emplacement}</DetailValue>
//                                 </DetailRow>
//                                 <DetailRow>
//                                     <DetailLabel>القضية:</DetailLabel>
//                                     <DetailValue>{selectedSessionDetails.affaire_id?.titre || '-'}</DetailValue>
//                                 </DetailRow>
//                                 <DetailRow>
//                                     <DetailLabel>الموعد:</DetailLabel>
//                                     <DetailValue>{selectedSessionDetails.rendez_vous_id ? formatAppointmentDisplay(selectedSessionDetails.rendez_vous_id) : '-'}</DetailValue>
//                                 </DetailRow>
//                             </DetailsContainer>
//                             <CloseModalButton
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={handleCloseDetailsModal}
//                             >
//                                 إغلاق
//                             </CloseModalButton>
//                         </DetailsModalContent>
//                     </ModalOverlay>
//                 )}
//             </MainContent>
//         </SessionContainer>
//     );
// }

// export default SessionManagement;












import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import NavDash from '../components/NavDash';
import { FaEye, FaEdit, FaTrash, FaDownload, FaTimes } from 'react-icons/fa';
import { GlassesIcon as MagnifyingGlassIcon, XCircleIcon } from 'lucide-react';
import { debounce } from 'lodash';

// CSS Variables for Theme (consistent with other components)
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

// Styled Components (aligned with other components)
const SessionContainer = styled.div`
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
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: ${theme.textPrimary};
  background: white;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 3px ${theme.primary}20;
  }
`;

const SessionsTable = styled.div`
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

const FormTextarea = styled.textarea`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: ${theme.textPrimary};
  background: white;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 3px ${theme.primary}20;
  }
`;

const FormSelect = styled.select`
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

// SearchBar Component (consistent with other components)
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
        aria-label="بحث الجلسات"
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
const API_URL = 'http://localhost:5000/api/sessions';
const AFFAIRES_API_URL = 'http://localhost:5000/api/affaires';
const RENDEZVOUS_API_URL = 'http://localhost:5000/api/rendez-vous';

function SessionManagement({ setToken }) {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [sessions, setSessions] = useState([]);
  const [cases, setCases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({
    affaire: '',
    rendez_vous: '',
  });
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    remarque: '',
    ordre: '',
    emplacement: '',
    affaire_id: '',
    rendez_vous_id: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const sessionsPerPage = 5;

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
        const [sessionsRes, casesRes, appointmentsRes] = await Promise.all([
          axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(AFFAIRES_API_URL, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(RENDEZVOUS_API_URL, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setSessions(sessionsRes.data);
        setCases(casesRes.data);
        setAppointments(appointmentsRes.data);
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

  // Filter Sessions
  const filteredSessions = useMemo(() => {
    let filtered = [...sessions];

    if (filters.affaire) {
      filtered = filtered.filter(session => session.affaire_id?._id === filters.affaire);
    }

    if (filters.rendez_vous) {
      filtered = filtered.filter(session => session.rendez_vous_id?._id === filters.rendez_vous);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        session =>
          (session.remarque && session.remarque.toLowerCase().includes(searchLower)) ||
          (session.emplacement && session.emplacement.toLowerCase().includes(searchLower)) ||
          (session.affaire_id?.titre && session.affaire_id.titre.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [sessions, filters, searchTerm]);

  // Sort Sessions
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === 'affaire_id') {
      aValue = a.affaire_id?.titre || '-';
      bValue = b.affaire_id?.titre || '-';
    } else if (sortConfig.key === 'rendez_vous_id') {
      aValue = a.rendez_vous_id?.date || '-';
      bValue = b.rendez_vous_id?.date || '-';
    } else if (sortConfig.key === 'ordre') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return sortConfig.direction === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  // Paginate Sessions
  const totalPages = Math.ceil(sortedSessions.length / sessionsPerPage);
  const paginatedSessions = sortedSessions.slice(
    (currentPage - 1) * sessionsPerPage,
    currentPage * sessionsPerPage
  );

  // Headers
  const headers = [
    { label: '', key: '' }, // Checkbox
    { label: 'ملاحظة', key: 'remarque' },
    { label: 'الترتيب', key: 'ordre' },
    { label: 'الموقع', key: 'emplacement' },
    { label: 'القضية', key: 'affaire_id' },
    { label: 'الموعد', key: 'rendez_vous_id' },
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
      ...filteredSessions.map(row => [
        row.remarque || '-',
        row.ordre,
        row.emplacement,
        row.affaire_id?.titre || '-',
        row.rendez_vous_id ? formatAppointmentDisplay(row.rendez_vous_id) : '-',
      ].join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sessions_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCheckboxChange = (id) => {
    setSelectedSessions(prev =>
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

    if (window.confirm('هل أنت متأكد من حذف الجلسات المحددة؟')) {
      try {
        await Promise.all(
          selectedSessions.map(id =>
            axios.delete(`${API_URL}/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );
        setSessions(prev => prev.filter(s => !selectedSessions.includes(s._id)));
        setSelectedSessions([]);
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setToken(null);
          window.location.href = '/login';
          setError('انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.');
        } else {
          setError('فشل حذف الجلسات');
          console.error('Bulk delete error:', err.response?.data || err.message);
        }
      }
    }
  };

  const handleModalOpen = (session = null) => {
    if (session) {
      setNewSession({
        remarque: session.remarque || '',
        ordre: session.ordre || '',
        emplacement: session.emplacement || '',
        affaire_id: session.affaire_id?._id || (typeof session.affaire_id === 'string' ? session.affaire_id : ''),
        rendez_vous_id: session.rendez_vous_id?._id || (typeof session.rendez_vous_id === 'string' ? session.rendez_vous_id : ''),
      });
      setEditingId(session._id);
    } else {
      setNewSession({
        remarque: '',
        ordre: '',
        emplacement: '',
        affaire_id: '',
        rendez_vous_id: '',
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewSession({
      remarque: '',
      ordre: '',
      emplacement: '',
      affaire_id: '',
      rendez_vous_id: '',
    });
    setEditingId(null);
    setError(null);
  };

  const handleNewSessionChange = (e) => {
    const { name, value } = e.target;
    setNewSession(prev => ({
      ...prev,
      [name]: name === 'ordre' ? parseInt(value) || '' : value,
    }));
  };

  const handleAddOrEditSession = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('لم يتم تسجيل الدخول. الرجاء تسجيل الدخول.');
      window.location.href = '/login';
      return;
    }

    if (!newSession.ordre) {
      setError('يرجى إدخال الترتيب');
      return;
    }
    if (!newSession.emplacement) {
      setError('يرجى إدخال الموقع');
      return;
    }
    if (!newSession.affaire_id) {
      setError('يرجى اختيار القضية');
      return;
    }
    if (!newSession.rendez_vous_id) {
      setError('يرجى اختيار الموعد');
      return;
    }

    try {
      const payload = {
        remarque: newSession.remarque || '',
        ordre: newSession.ordre,
        emplacement: newSession.emplacement,
        affaire_id: newSession.affaire_id,
        rendez_vous_id: newSession.rendez_vous_id,
      };

      let response;
      if (editingId) {
        response = await axios.put(`${API_URL}/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(prev =>
          prev.map(s => (s._id === editingId ? response.data : s))
        );
      } else {
        response = await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(prev => [...prev, response.data]);
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
        setError(err.response?.data?.message || 'حدث خطأ أثناء حفظ الجلسة');
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

    if (window.confirm('هل أنت متأكد من حذف هذه الجلسة؟')) {
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(prev => prev.filter(s => s._id !== id));
        setSelectedSessions(prev => prev.filter(sid => sid !== id));
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setToken(null);
          window.location.href = '/login';
          setError('انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.');
        } else {
          setError('فشل حذف الجلسة');
          console.error('Delete error:', err.response?.data || err.message);
        }
      }
    }
  };

  const handleShowDetails = (session) => {
    setSelectedSession(session);
  };

  const handleCloseDetails = () => {
    setSelectedSession(null);
  };

  const formatAppointmentDisplay = (appointment) => {
    if (!appointment?.date || !appointment?.heure_debut) {
      return appointment?._id || '-';
    }
    const date = new Date(appointment.date).toLocaleDateString('ar');
    return `${date} ${appointment.heure_debut}`;
  };

  if (loading) {
    return (
      <SessionContainer>
        <NavDash setToken={setToken} />
        <Sidebar setToken={setToken} />
        <MainContent>
          <SessionsTable>
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
          </SessionsTable>
        </MainContent>
      </SessionContainer>
    );
  }

  return (
    <SessionContainer>
      <NavDash setToken={setToken} />
      <Sidebar setToken={setToken} />
      <MainContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
            {error}
          </div>
        )}
        <HeaderSection>
          <Title>إدارة الجلسات</Title>
          <ButtonGroup>
            {selectedSessions.length > 0 && (
              <DeleteButton onClick={handleBulkDelete}>
                <FaTrash /> حذف المحدد ({selectedSessions.length})
              </DeleteButton>
            )}
            <ActionButton onClick={handleExport}>
              <FaDownload /> تصدير
            </ActionButton>
            <ActionButton onClick={() => handleModalOpen()}>
              + جلسة جديدة
            </ActionButton>
          </ButtonGroup>
        </HeaderSection>
        <FiltersSection>
          <SearchBar
            onSearch={handleSearch}
            placeholder="ابحث بالملاحظة، الموقع، أو القضية..."
            initialValue={searchTerm}
            className="flex-1 min-w-[200px]"
          />
          <FilterSelect name="affaire" value={filters.affaire} onChange={handleFilterChange}>
            <option value="">كل القضايا</option>
            {cases.length > 0 ? (
              cases.map(caseItem => (
                <option key={caseItem._id} value={caseItem._id}>
                  {caseItem.titre}
                </option>
              ))
            ) : (
              <option value="">لا توجد قضايا متاحة</option>
            )}
          </FilterSelect>
          <FilterSelect name="rendez_vous" value={filters.rendez_vous} onChange={handleFilterChange}>
            <option value="">كل المواعيد</option>
            {appointments.length > 0 ? (
              appointments.map(appointment => (
                <option key={appointment._id} value={appointment._id}>
                  {formatAppointmentDisplay(appointment)}
                </option>
              ))
            ) : (
              <option value="">لا توجد مواعيد متاحة</option>
            )}
          </FilterSelect>
        </FiltersSection>
        <SessionsTable>
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
              {paginatedSessions.map(row => (
                <TableRow key={row._id}>
                  <TableCell>
                    <Checkbox
                      type="checkbox"
                      checked={selectedSessions.includes(row._id)}
                      onChange={() => handleCheckboxChange(row._id)}
                    />
                  </TableCell>
                  <TableCell>{row.remarque || '-'}</TableCell>
                  <TableCell>{row.ordre}</TableCell>
                  <TableCell>{row.emplacement}</TableCell>
                  <TableCell>{row.affaire_id?.titre || '-'}</TableCell>
                  <TableCell>{row.rendez_vous_id ? formatAppointmentDisplay(row.rendez_vous_id) : '-'}</TableCell>
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
          {paginatedSessions.length === 0 && (
            <div className="text-center text-secondary p-6">
              {searchTerm
                ? `لا توجد نتائج مطابقة لـ "${searchTerm}"`
                : 'لا توجد بيانات'}
            </div>
          )}
        </SessionsTable>
        {selectedSession && (
          <DetailsCard>
            <DetailsHeader>
              <DetailsTitle>تفاصيل الجلسة</DetailsTitle>
              <CloseButton onClick={handleCloseDetails}>
                <FaTimes />
              </CloseButton>
            </DetailsHeader>
            <DetailItem>
              <DetailLabel>ملاحظة</DetailLabel>
              <DetailValue>{selectedSession.remarque || '-'}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>الترتيب</DetailLabel>
              <DetailValue>{selectedSession.ordre}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>الموقع</DetailLabel>
              <DetailValue>{selectedSession.emplacement}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>القضية</DetailLabel>
              <DetailValue>{selectedSession.affaire_id?.titre || '-'}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>الموعد</DetailLabel>
              <DetailValue>{selectedSession.rendez_vous_id ? formatAppointmentDisplay(selectedSession.rendez_vous_id) : '-'}</DetailValue>
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
                <ModalTitle>{editingId ? 'تعديل الجلسة' : 'إضافة جلسة جديدة'}</ModalTitle>
                <CloseButton onClick={handleModalClose}>
                  <FaTimes />
                </CloseButton>
              </ModalHeader>
              <ModalForm onSubmit={handleAddOrEditSession}>
                <FormField>
                  <FormLabel>ملاحظة</FormLabel>
                  <FormTextarea
                    name="remarque"
                    value={newSession.remarque}
                    onChange={handleNewSessionChange}
                  />
                </FormField>
                <FormField>
                  <FormLabel>الترتيب *</FormLabel>
                  <FormInput
                    type="number"
                    name="ordre"
                    value={newSession.ordre}
                    onChange={handleNewSessionChange}
                    required
                  />
                </FormField>
                <FormField>
                  <FormLabel>الموقع *</FormLabel>
                  <FormInput
                    type="text"
                    name="emplacement"
                    value={newSession.emplacement}
                    onChange={handleNewSessionChange}
                    required
                  />
                </FormField>
                <FormField>
                  <FormLabel>القضية *</FormLabel>
                  <FormSelect
                    name="affaire_id"
                    value={newSession.affaire_id}
                    onChange={handleNewSessionChange}
                    required
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
                  <FormLabel>الموعد *</FormLabel>
                  <FormSelect
                    name="rendez_vous_id"
                    value={newSession.rendez_vous_id}
                    onChange={handleNewSessionChange}
                    required
                  >
                    <option value="">اختر الموعد</option>
                    {appointments.length > 0 ? (
                      appointments.map(appointment => (
                        <option key={appointment._id} value={appointment._id}>
                          {formatAppointmentDisplay(appointment)}
                        </option>
                      ))
                    ) : (
                      <option value="">لا توجد مواعيد متاحة</option>
                    )}
                  </FormSelect>
                </FormField>
                <SubmitButton type="submit">
                  {editingId ? 'تعديل الجلسة' : 'إضافة الجلسة'}
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
    </SessionContainer>
  );
}

export default SessionManagement;
// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import { FaEye, FaEdit, FaTrash, FaDownload, FaTimes } from 'react-icons/fa';
// import { Eye, Pencil, Trash2, Plus, X, Search, Download, Calendar, User, FileText, Paperclip, Download as DownloadIcon } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { jwtDecode } from 'jwt-decode';
// import toast, { Toaster } from 'react-hot-toast';
// import Sidebar from '../components/Sidebar';
// import NavDash from '../components/NavDash';

// // Theme for consistent colors
// const theme = {
//   primary: '#2e7d32',
//   primaryDark: '#059669',
//   error: '#ef4444',
// };

// // Styled Action Button for consistency with PaymentManagement.jsx
// const ActionIcon = styled.button`
//   padding: 0.5rem;
//   background: ${props => props.bgColor};
//   color: white;
//   border-radius: 0.375rem;
//   font-size: 0.875rem;
//   transition: all 0.2s ease;
//   position: relative;

//   &:hover {
//     background: ${props => props.hoverColor};
//     transform: translateY(-1px);
//   }

//   &:hover:after {
//     content: attr(title);
//     position: absolute;
//     top: -2rem;
//     left: 50%;
//     transform: translateX(-50%);
//     background: ${theme.textPrimary};
//     color: white;
//     padding: 0.25rem 0.5rem;
//     border-radius: 0.25rem;
//     font-size: 0.75rem;
//     white-space: nowrap;
//   }
// `;

// const API_URL = 'http://localhost:5000/api/affaires';
// const LAWYERS_API_URL = 'http://localhost:5000/api/avocats';
// const TYPES_API_URL = 'http://localhost:5000/api/types';
// const CLIENTS_API_URL = 'http://localhost:5000/api/clients';

// const LegalCaseManagement = ({ setToken }) => {
//   const [showFormModal, setShowFormModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
//   const [cases, setCases] = useState([]);
//   const [filteredCases, setFilteredCases] = useState([]);
//   const [selectedCase, setSelectedCase] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterStatus, setFilterStatus] = useState('');
//   const [filterDate, setFilterDate] = useState('');
//   const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedCases, setSelectedCases] = useState([]);
//   const [formData, setFormData] = useState({
//     titre: '',
//     description: '',
//     type_id: '',
//     avocat_id: '',
//     client_id: '',
//     adversaire: '',
//     statut: 'en cours',
//     attachments: [],
//   });
//   const [attachmentFiles, setAttachmentFiles] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [lawyers, setLawyers] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [clients, setClients] = useState([]);
//   const [loadingLawyers, setLoadingLawyers] = useState(true);
//   const [loadingTypes, setLoadingTypes] = useState(true);
//   const [loadingClients, setLoadingClients] = useState(true);
//   const [avocatId, setAvocatId] = useState(null);
//   const casesPerPage = 5;

//   const statutDisplay = {
//     'en cours': 'جارية',
//     terminée: 'منتهية',
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setAvocatId(decoded.id);
//       } catch (err) {
//         console.error('Error decoding token:', err);
//         setError('فشل التحقق من المصادقة');
//       }
//     } else {
//       setError('لم يتم العثور على رمز المصادقة');
//     }
//   }, []);

//   useEffect(() => {
//     if (avocatId) {
//       fetchCases();
//       fetchClients();
//     }
//     fetchLawyers();
//     fetchTypes();
//   }, [avocatId]);

//   const fetchCases = async () => {
//     if (!avocatId) return;
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_URL}/avocat/${avocatId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setCases(response.data);
//       setFilteredCases(response.data);
//     } catch (error) {
//       if (error.response?.status === 404) {
//         setCases([]);
//         setFilteredCases([]);
//       } else {
//         setError('فشل جلب القضايا');
//         console.error('Fetch cases error:', error.response?.data);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLawyers = async () => {
//     try {
//       setLoadingLawyers(true);
//       const response = await axios.get(LAWYERS_API_URL, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setLawyers(response.data);
//     } catch (error) {
//       setError('فشل جلب بيانات المحامين');
//       console.error('Fetch lawyers error:', error.response?.data);
//     } finally {
//       setLoadingLawyers(false);
//     }
//   };

//   const fetchTypes = async () => {
//     try {
//       setLoadingTypes(true);
//       const response = await axios.get(TYPES_API_URL, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setTypes(response.data);
//     } catch (error) {
//       setError('فشل جلب أنواع القضايا');
//       console.error('Fetch types error:', error.response?.data);
//     } finally {
//       setLoadingTypes(false);
//     }
//   };

//   const fetchClients = async () => {
//     try {
//       setLoadingClients(true);
//       const response = await axios.get(CLIENTS_API_URL, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setClients(response.data);
//     } catch (error) {
//       setError('فشل جلب بيانات العملاء');
//       console.error('Fetch clients error:', error.response?.data);
//     } finally {
//       setLoadingClients(false);
//     }
//   };

//   const handleFilter = () => {
//     let filtered = cases;
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (c) =>
//           c.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           c.client_id?.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           c.adversaire?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     if (filterStatus) {
//       filtered = filtered.filter((c) => c.statut === filterStatus);
//     }
//     if (filterDate) {
//       const selectedDate = new Date(filterDate);
//       selectedDate.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((c) => {
//         const creationDate = new Date(c.date_creation);
//         creationDate.setHours(0, 0, 0, 0);
//         return (
//           creationDate.getFullYear() === selectedDate.getFullYear() &&
//           creationDate.getMonth() === selectedDate.getMonth() &&
//           creationDate.getDate() === selectedDate.getDate()
//         );
//       });
//     }
//     setFilteredCases(filtered);
//     setCurrentPage(1);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.titre || !formData.description || !formData.type_id || !formData.client_id || !formData.adversaire) {
//       setError('جميع الحقول مطلوبة');
//       toast.error('جميع الحقول مطلوبة');
//       return;
//     }
//     const submitData = new FormData();
//     submitData.append('titre', formData.titre);
//     submitData.append('description', formData.description);
//     submitData.append('type_id', formData.type_id);
//     submitData.append('avocat_id', avocatId);
//     submitData.append('client_id', formData.client_id);
//     submitData.append('adversaire', formData.adversaire);
//     submitData.append('statut', formData.statut);
//     attachmentFiles.forEach((file) => {
//       submitData.append('attachments', file);
//     });

//     try {
//       let response;
//       if (editingId) {
//         response = await axios.put(`${API_URL}/${editingId}`, submitData, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         setCases(cases.map((c) => (c._id === editingId ? response.data : c)));
//         setEditingId(null);
//         toast.success('تم تعديل القضية بنجاح');
//       } else {
//         response = await axios.post(API_URL, submitData, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         setCases([...cases, response.data]);
//         toast.success('تم إضافة القضية بنجاح');
//       }
//       setFormData({ titre: '', description: '', type_id: '', avocat_id: '', client_id: '', adversaire: '', statut: 'en cours', attachments: [] });
//       setAttachmentFiles([]);
//       setShowFormModal(false);
//       fetchCases();
//       setError(null);
//     } catch (error) {
//       setError(error.response?.data?.message || 'حدث خطأ أثناء حفظ القضية');
//       toast.error(error.response?.data?.message || 'حدث خطأ أثناء حفظ القضية');
//     }
//   };

//   const handleEdit = (caseItem) => {
//     setFormData({
//       titre: caseItem.titre,
//       description: caseItem.description,
//       type_id: caseItem.type_id._id,
//       avocat_id: caseItem.avocat_id._id,
//       client_id: caseItem.client_id?._id || '',
//       adversaire: caseItem.adversaire || '',
//       statut: caseItem.statut,
//       attachments: caseItem.attachments || [],
//     });
//     setAttachmentFiles([]);
//     setEditingId(caseItem._id);
//     setShowFormModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('هل أنت متأكد من حذف هذه القضية؟')) {
//       try {
//         await axios.delete(`${API_URL}/${id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         setCases(cases.filter((c) => c._id !== id));
//         setFilteredCases(filteredCases.filter((c) => c._id !== id));
//         setSelectedCases(selectedCases.filter((c) => c !== id));
//         setError(null);
//         toast.success('تم حذف القضية بنجاح');
//       } catch (error) {
//         setError('فشل حذف القضية');
//         toast.error('فشل حذف القضية');
//       }
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (window.confirm('هل أنت متأكد من حذف القضايا المحددة؟')) {
//       try {
//         await Promise.all(
//           selectedCases.map((id) =>
//             axios.delete(`${API_URL}/${id}`, {
//               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//             })
//           )
//         );
//         setCases(cases.filter((c) => !selectedCases.includes(c._id)));
//         setFilteredCases(filteredCases.filter((c) => !selectedCases.includes(c._id)));
//         setSelectedCases([]);
//         setError(null);
//         toast.success('تم حذف القضايا المحددة بنجاح');
//       } catch (error) {
//         setError('فشل حذف القضايا');
//         toast.error('فشل حذف القضايا');
//       }
//     }
//   };

//   const handleExport = () => {
//     const csvContent = [
//       'العنوان,الوصف,الحالة,المحامي,العميل,الخصم,تاريخ الإنشاء,عدد المرفقات',
//       ...cases.map((row) =>
//         [
//           row.titre,
//           row.description,
//           statutDisplay[row.statut] || row.statut,
//           `${row.avocat_id?.nom || ''} ${row.avocat_id?.prenom || ''}`,
//           row.client_id?.nom || '',
//           row.adversaire || '',
//           new Date(row.date_creation).toLocaleDateString('ar-EG'),
//           row.attachments ? row.attachments.length : 0,
//         ].join(',')
//       ),
//     ].join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'cases.csv');
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   const handleSort = (key) => {
//     const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
//     setSortConfig({ key, direction });
//     const sorted = [...filteredCases].sort((a, b) => {
//       let aValue = a[key];
//       let bValue = b[key];
//       if (key === 'avocat_id') {
//         aValue = `${a.avocat_id?.nom || ''} ${a.avocat_id?.prenom || ''}`;
//         bValue = `${b.avocat_id?.nom || ''} ${b.avocat_id?.prenom || ''}`;
//       } else if (key === 'type_id') {
//         aValue = a.type_id?.name || '';
//         bValue = b.type_id?.name || '';
//       } else if (key === 'client_id') {
//         aValue = a.client_id?.nom || '';
//         bValue = b.client_id?.nom || '';
//       } else if (key === 'adversaire') {
//         aValue = a.adversaire || '';
//         bValue = b.adversaire || '';
//       } else if (key === 'date_creation') {
//         aValue = new Date(aValue);
//         bValue = new Date(bValue);
//       }
//       if (typeof aValue === 'string' && key !== 'date_creation') {
//         return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
//       }
//       return direction === 'asc' ? aValue - bValue : bValue - aValue;
//     });
//     setFilteredCases(sorted);
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setAttachmentFiles(files);
//   };

//   const handleAttachmentsModal = (caseItem) => {
//     setSelectedCase(caseItem);
//     setAttachmentFiles([]);
//     setShowAttachmentsModal(true);
//   };

//   const handleAddAttachments = async (e) => {
//     e.preventDefault();
//     if (attachmentFiles.length === 0) {
//       setError('يرجى اختيار ملفات لإضافتها');
//       toast.error('يرجى اختيار ملفات لإضافتها');
//       return;
//     }
//     const submitData = new FormData();
//     attachmentFiles.forEach((file) => {
//       submitData.append('attachments', file);
//     });
//     try {
//       const response = await axios.put(`${API_URL}/${selectedCase._id}`, submitData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setCases(cases.map((c) => (c._id === selectedCase._id ? response.data : c)));
//       setFilteredCases(filteredCases.map((c) => (c._id === selectedCase._id ? response.data : c)));
//       setShowAttachmentsModal(false);
//       setAttachmentFiles([]);
//       setError(null);
//       toast.success('تم إضافة المرفقات بنجاح');
//     } catch (error) {
//       setError(error.response?.data?.message || 'حدث خطأ أثناء إضافة المرفقات');
//       toast.error(error.response?.data?.message || 'حدث خطأ أثناء إضافة المرفقات');
//     }
//   };

//   const handleDownloadAttachment = async (filePath) => {
//     if (typeof filePath !== 'string') {
//       console.error('Invalid filePath:', filePath);
//       setError('مسار الملف غير صالح');
//       toast.error('مسار الملف غير صالح');
//       return;
//     }
//     try {
//       const encodedFilePath = encodeURIComponent(filePath);
//       const response = await axios.get(`http://localhost:5000/api/affaires/download/${encodedFilePath}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         responseType: 'blob',
//       });
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', filePath.split('/').pop());
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error downloading file:', error);
//       setError('فشل تحميل الملف');
//       toast.error('فشل تحميل الملف');
//     }
//   };

//   const getFileName = (filePath) => {
//     if (typeof filePath === 'string') {
//       return filePath.split('/').pop() || 'ملف غير صالح';
//     }
//     return 'ملف غير صالح';
//   };

//   const totalPages = Math.ceil(filteredCases.length / casesPerPage);
//   const paginatedCases = filteredCases.slice(
//     (currentPage - 1) * casesPerPage,
//     currentPage * casesPerPage
//   );

//   const summary = {
//     total: cases.length,
//     inProgress: cases.filter((c) => c.statut === 'en cours').length,
//     closed: cases.filter((c) => c.statut === 'terminée').length,
//   };

//   if (loading || loadingClients) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50 font-sans">
//       <NavDash setToken={setToken} />
//       <Sidebar setToken={setToken} />
//       <div className="flex-1 p-6 md:p-8 md:mt-16 sm:mr-16" dir="rtl">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
//             إدارة القضايا القانونية
//           </h1>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={handleExport}
//               className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg shadow-sm hover:bg-green-700 transition-all duration-300 text-sm"
//             >
//               <Download className="h-4 w-4" /> تصدير
//             </button>
//             <button
//               onClick={() => setShowFormModal(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg shadow-sm hover:bg-green-700 transition-all duration-300 text-sm"
//             >
//               <Plus className="h-4 w-4" /> إضافة قضية
//             </button>
//           </div>
//         </div>

//         {/* Stats Section */}
//         <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <motion.div
//             whileHover={{ scale: 1.02 }}
//             className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4"
//           >
//             <div className="p-3 bg-green-100 rounded-full">
//               <FileText className="h-6 w-6 text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600">إجمالي القضايا</p>
//               <p className="text-2xl font-bold text-gray-800">{summary.total}</p>
//             </div>
//           </motion.div>
//           <motion.div
//             whileHover={{ scale: 1.02 }}
//             className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4"
//           >
//             <div className="p-3 bg-yellow-100 rounded-full">
//               <Calendar className="h-6 w-6 text-yellow-600" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600">القضايا الجارية</p>
//               <p className="text-2xl font-bold text-gray-800">{summary.inProgress}</p>
//             </div>
//           </motion.div>
//           <motion.div
//             whileHover={{ scale: 1.02 }}
//             className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4"
//           >
//             <div className="p-3 bg-blue-100 rounded-full">
//               <User className="h-6 w-6 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600">القضايا المنتهية</p>
//               <p className="text-2xl font-bold text-gray-800">{summary.closed}</p>
//             </div>
//           </motion.div>
//         </div>

//         {/* Filter Section */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-md border border-gray-100">
//           <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
//             <div className="relative w-full sm:w-64">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   handleFilter();
//                 }}
//                 placeholder="البحث حسب العنوان أو الوصف أو العميل أو الخصم..."
//                 className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm"
//               />
//               <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             </div>
//             <select
//               value={filterStatus}
//               onChange={(e) => {
//                 setFilterStatus(e.target.value);
//                 handleFilter();
//               }}
//               className="w-full sm:w-48 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-300 text-gray-700 text-sm"
//             >
//               <option value="">جميع الحالات</option>
//               <option value="en cours">جارية</option>
//               <option value="terminée">منتهية</option>
//             </select>
//             <input
//               type="date"
//               value={filterDate}
//               onChange={(e) => setFilterDate(e.target.value)}
//               onBlur={handleFilter}
//               className="w-full sm:w-48 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-300 text-gray-700 text-sm"
//             />
//           </div>
//           <div className="flex items-center gap-3 mt-4 sm:mt-0">
//             {selectedCases.length > 0 && (
//               <button
//                 onClick={handleBulkDelete}
//                 className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-all duration-300 text-sm"
//               >
//                 <FaTrash className="h-4 w-4" /> حذف المحدد ({selectedCases.length})
//               </button>
//             )}
//           </div>
//         </div>

//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg shadow-sm flex justify-between items-center border border-red-200"
//           >
//             <span>{error}</span>
//             <button onClick={() => setError(null)} className="text-red-600 hover:text-red-700">
//               <X className="h-5 w-5" />
//             </button>
//           </motion.div>
//         )}

//         {/* Add/Edit Case Modal */}
//         <AnimatePresence>
//           {showFormModal && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               onClick={() => setShowFormModal(false)}
//             >
//               <motion.div
//                 initial={{ scale: 0.95, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.95, opacity: 0 }}
//                 className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-2xl font-bold text-gray-800">
//                     {editingId ? 'تعديل القضية' : 'إضافة قضية جديدة'}
//                   </h2>
//                   <button
//                     onClick={() => {
//                       setShowFormModal(false);
//                       setEditingId(null);
//                       setFormData({ titre: '', description: '', type_id: '', avocat_id: '', client_id: '', adversaire: '', statut: 'en cours', attachments: [] });
//                       setAttachmentFiles([]);
//                     }}
//                     className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>
//                 <form onSubmit={handleSubmit}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Left Column */}
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
//                         <input
//                           type="text"
//                           value={formData.titre}
//                           onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
//                           className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700 transition-all duration-200 text-sm"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
//                         <textarea
//                           value={formData.description}
//                           onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                           className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700 transition-all duration-200 text-sm resize-none h-24"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">العميل</label>
//                         {loadingClients ? (
//                           <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 animate-pulse text-sm">
//                             جاري تحميل العملاء...
//                           </div>
//                         ) : (
//                           <select
//                             value={formData.client_id}
//                             onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
//                             className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700 transition-all duration-200 text-sm"
//                             required
//                           >
//                             <option value="" disabled>
//                               اختر العميل
//                             </option>
//                             {clients.map((client) => (
//                               <option key={client._id} value={client._id}>
//                                 {client.nom}
//                               </option>
//                             ))}
//                           </select>
//                         )}
//                       </div>
//                     </div>
//                     {/* Right Column */}
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">النوع</label>
//                         {loadingTypes ? (
//                           <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 animate-pulse text-sm">
//                             جاري تحميل الأنواع...
//                           </div>
//                         ) : (
//                           <select
//                             value={formData.type_id}
//                             onChange={(e) => setFormData({ ...formData, type_id: e.target.value })}
//                             className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700 transition-all duration-200 text-sm"
//                             required
//                           >
//                             <option value="" disabled>
//                               اختر النوع
//                             </option>
//                             {types.map((type) => (
//                               <option key={type._id} value={type._id}>
//                                 {type.name || type._id}
//                               </option>
//                             ))}
//                           </select>
//                         )}
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">الخصم</label>
//                         <input
//                           type="text"
//                           value={formData.adversaire}
//                           onChange={(e) => setFormData({ ...formData, adversaire: e.target.value })}
//                           className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700 transition-all duration-200 text-sm"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
//                         <select
//                           value={formData.statut}
//                           onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
//                           className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700 transition-all duration-200 text-sm"
//                           required
//                         >
//                           <option value="en cours">جارية</option>
//                           <option value="terminée">منتهية</option>
//                         </select>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">المرفقات</label>
//                         <input
//                           type="file"
//                           multiple
//                           onChange={handleFileChange}
//                           accept="image/*,application/pdf,.doc,.docx"
//                           className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700 transition-all duration-200 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
//                         />
//                         {attachmentFiles.length > 0 && (
//                           <div className="mt-2 flex flex-wrap gap-2">
//                             {attachmentFiles.map((file, index) => (
//                               <span key={index} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
//                                 {file.name}
//                                 <button
//                                   type="button"
//                                   onClick={() => setAttachmentFiles(attachmentFiles.filter((_, i) => i !== index))}
//                                   className="ml-2 text-red-600 hover:text-red-700"
//                                 >
//                                   <X className="h-4 w-4" />
//                                 </button>
//                               </span>
//                             ))}
//                           </div>
//                         )}
//                         {editingId && formData.attachments.length > 0 && (
//                           <div className="mt-2 flex flex-wrap gap-2">
//                             {formData.attachments.map((filePath, index) => (
//                               <span key={index} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
//                                 {getFileName(filePath)}
//                                 <button
//                                   type="button"
//                                   onClick={() => handleDownloadAttachment(filePath)}
//                                   className="ml-2 text-blue-600 hover:text-blue-700"
//                                 >
//                                   <DownloadIcon className="h-4 w-4" />
//                                 </button>
//                               </span>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-6 flex justify-end gap-3">
//                     <button
//                       type="submit"
//                       className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg shadow-sm hover:bg-green-700 transition-all duration-300 text-sm"
//                     >
//                       {editingId ? 'تعديل القضية' : 'إضافة القضية'}
//                     </button>
//                   </div>
//                 </form>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-x-auto"
//         >
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   <input
//                     type="checkbox"
//                     onChange={(e) =>
//                       setSelectedCases(e.target.checked ? cases.map((c) => c._id) : [])
//                     }
//                     checked={selectedCases.length === cases.length && cases.length > 0}
//                     className="accent-green-600 rounded"
//                   />
//                 </th>
//                 <th
//                   className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('titre')}
//                 >
//                   العنوان {sortConfig.key === 'titre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                 </th>
//                 <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   الوصف
//                 </th>
//                 <th
//                   className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('type_id')}
//                 >
//                   النوع {sortConfig.key === 'type_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                 </th>
//                 <th
//                   className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('client_id')}
//                 >
//                   العميل {sortConfig.key === 'client_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                 </th>
//                 <th
//                   className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('adversaire')}
//                 >
//                   الخصم {sortConfig.key === 'adversaire' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                 </th>
//                 <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   الحالة
//                 </th>
//                 <th
//                   className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('date_creation')}
//                 >
//                   تاريخ الإنشاء {sortConfig.key === 'date_creation' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                 </th>
//                 <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   المرفقات
//                 </th>
//                 <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   الإجراءات
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               <AnimatePresence>
//                 {paginatedCases.map((caseItem) => (
//                   <motion.tr
//                     key={caseItem._id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.3 }}
//                     className="hover:bg-gray-50 transition-all duration-200"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <input
//                         type="checkbox"
//                         checked={selectedCases.includes(caseItem._id)}
//                         onChange={() =>
//                           setSelectedCases(
//                             selectedCases.includes(caseItem._id)
//                               ? selectedCases.filter((id) => id !== caseItem._id)
//                               : [...selectedCases, caseItem._id]
//                           )
//                         }
//                         className="accent-green-600 rounded"
//                       />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium text-sm">
//                       {caseItem.titre}
//                     </td>
//                     <td className="px-6 py-4 text-gray-600 text-

// sm line-clamp-2">{caseItem.description}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
//                       {caseItem.type_id?.name || 'غير محدد'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
//                       {caseItem.client_id?.nom || 'غير محدد'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
//                       {caseItem.adversaire || 'غير محدد'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           caseItem.statut === 'en cours'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-gray-100 text-gray-800'
//                         }`}
//                       >
//                         {statutDisplay[caseItem.statut] || caseItem.statut}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
//                       {new Date(caseItem.date_creation).toLocaleDateString('ar-EG')}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
//                       <button
//                         onClick={() => handleAttachmentsModal(caseItem)}
//                         className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors duration-200"
//                       >
//                         <Paperclip className="h-5 w-5" />
//                         ({caseItem.attachments ? caseItem.attachments.length : 0})
//                       </button>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <div className="flex gap-2">
//                         <ActionIcon
//                           bgColor="#3b82f6"
//                           hoverColor="#2563eb"
//                           title="عرض"
//                           onClick={() => {
//                             setSelectedCase(caseItem);
//                             setShowDetailsModal(true);
//                           }}
//                         >
//                           <FaEye className="h-3 w-3" />
//                         </ActionIcon>
//                         <ActionIcon
//                           bgColor={theme.primary}
//                           hoverColor={theme.primaryDark}
//                           title="تعديل"
//                           onClick={() => handleEdit(caseItem)}
//                         >
//                           <FaEdit className="h-3 w-3" />
//                         </ActionIcon>
//                         <ActionIcon
//                           bgColor={theme.error}
//                           hoverColor="#dc2626"
//                           title="حذف"
//                           onClick={() => handleDelete(caseItem._id)}
//                         >
//                           <FaTrash className="h-3 w-3," />
//                         </ActionIcon>
//                       </div>
//                     </td>
//                   </motion.tr>
//                 ))}
//               </AnimatePresence>
//             </tbody>
//           </table>
//           {paginatedCases.length === 0 && (
//             <div className="text-center text-gray-500 p-6">لا توجد قضايا متاحة</div>
//           )}
//         </motion.div>

//         <div className="flex justify-center gap-2 mt-6">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 text-sm"
//           >
//             السابق
//           </button>
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//               key={page}
//               onClick={() => setCurrentPage(page)}
//               className={`px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm ${
//                 currentPage === page
//                   ? 'bg-green-600 text-white'
//                   : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-100'
//               }`}
//             >
//               {page}
//             </button>
//           ))}
//           <button
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 text-sm"
//           >
//             التالي
//           </button>
//         </div>

//         {/* Details Modal */}
//         <AnimatePresence>
//           {showDetailsModal && selectedCase && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               onClick={() => setShowDetailsModal(false)}
//             >
//               <motion.div
//                 initial={{ scale: 0.95, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.95, opacity: 0 }}
//                 className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-2xl font-bold text-gray-800">تفاصيل القضية</h2>
//                   <button
//                     onClick={() => setShowDetailsModal(false)}
//                     className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Left Column */}
//                   <div className="space-y-4">
//                     <div>
//                       <span className="font-semibold text-gray-700">العنوان:</span>
//                       <p className="mt-1 text-gray-600">{selectedCase.titre}</p>
//                     </div>
//                     <div>
//                       <span className="font-semibold text-gray-700">الوصف:</span>
//                       <p className="mt-1 text-gray-600">{selectedCase.description}</p>
//                     </div>
//                     <div>
//                       <span className="font-semibold text-gray-700">النوع:</span>
//                       <p className="mt-1 text-gray-600">{selectedCase.type_id?.name || 'غير محدد'}</p>
//                     </div>
//                     <div>
//                       <span className="font-semibold text-gray-700">الحالة:</span>
//                       <p className="mt-1 text-gray-600">{statutDisplay[selectedCase.statut] || selectedCase.statut}</p>
//                     </div>
//                   </div>
//                   {/* Right Column */}
//                   <div className="space-y-4">
//                     <div>
//                       <span className="font-semibold text-gray-700">العميل:</span>
//                       <p className="mt-1 text-gray-600">{selectedCase.client_id?.nom || 'غير محدد'}</p>
//                     </div>
//                     <div>
//                       <span className="font-semibold text-gray-700">الخصم:</span>
//                       <p className="mt-1 text-gray-600">{selectedCase.adversaire || 'غير محدد'}</p>
//                     </div>
//                     <div>
//                       <span className="font-semibold text-gray-700">المحامي:</span>
//                       <p className="mt-1 text-gray-600">
//                         {selectedCase.avocat_id ? `${selectedCase.avocat_id.nom} ${selectedCase.avocat_id.prenom}` : 'غير محدد'}
//                       </p>
//                     </div>
//                     <div>
//                       <span className="font-semibold text-gray-700">تاريخ الإنشاء:</span>
//                       <p className="mt-1 text-gray-600">{new Date(selectedCase.date_creation).toLocaleDateString('ar-EG')}</p>
//                     </div>
//                   </div>
//                 </div>
//                 {/* Attachments Section (Full Width) */}
//                 <div className="mt-6">
//                   <span className="font-semibold text-gray-700">المرفقات:</span>
//                   {selectedCase.attachments && selectedCase.attachments.length > 0 ? (
//                     <div className="mt-2 flex flex-wrap gap-2">
//                       {selectedCase.attachments.map((filePath, index) => (
//                         <button
//                           key={index}
//                           onClick={() => handleDownloadAttachment(filePath)}
//                           className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors duration-200"
//                         >
//                           {getFileName(filePath)}
//                           <DownloadIcon className="h-4 w-4 ml-2" />
//                         </button>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="mt-1 text-gray-600">لا توجد مرفقات</p>
//                   )}
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Attachments Modal */}
//         <AnimatePresence>
//           {showAttachmentsModal && selectedCase && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               onClick={() => setShowAttachmentsModal(false)}
//             >
//               <motion.div
//                 initial={{ scale: 0.95, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.95, opacity: 0 }}
//                 className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-2xl font-bold text-gray-800">إدارة المرفقات</h2>
//                   <button
//                     onClick={() => setShowAttachmentsModal(false)}
//                     className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <span className="font-semibold text-gray-700">المرفقات الحالية:</span>
//                     {selectedCase.attachments && selectedCase.attachments.length > 0 ? (
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         {selectedCase.attachments.map((filePath, index) => (
//                           <button
//                             key={index}
//                             onClick={() => handleDownloadAttachment(filePath)}
//                             className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors duration-200"
//                           >
//                             {getFileName(filePath)}
//                             <DownloadIcon className="h-4 w-4 ml-2" />
//                           </button>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="mt-1 text-gray-600">لا توجد مرفقات</p>
//                     )}
//                   </div>
//                   <form onSubmit={handleAddAttachments}>
//                     <div className="mt-4">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">إضافة مرفقات جديدة:</label>
//                       <input
//                         type="file"
//                         multiple
//                         onChange={handleFileChange}
//                         accept="image/*,application/pdf,.doc,.docx"
//                         className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700 transition-all duration-200 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
//                       />
//                       {attachmentFiles.length > 0 && (
//                         <div className="mt-2 flex flex-wrap gap-2">
//                           {attachmentFiles.map((file, index) => (
//                             <span key={index} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
//                               {file.name}
//                               <button
//                                 type="button"
//                                 onClick={() => setAttachmentFiles(attachmentFiles.filter((_, i) => i !== index))}
//                                 className="ml-2 text-red-600 hover:text-red-700"
//                               >
//                                 <X className="h-4 w-4" />
//                               </button>
//                             </span>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                     <div className="mt-6 flex justify-end gap-3">
//                       <button
//                         type="submit"
//                         className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-all duration-300 text-sm"
//                       >
//                         إضافة المرفقات
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Toast Container */}
//         <Toaster position="top-right" reverseOrder={false} />
//       </div>
//     </div>
//   );
// };

// export default LegalCaseManagement;




import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaEye, FaEdit, FaTrash, FaDownload, FaTimes } from 'react-icons/fa';
import { Eye, Pencil, Trash2, Plus, X, Search, Download, Calendar, User, FileText, Paperclip, Download as DownloadIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import NavDash from '../components/NavDash';

// Theme for consistent colors
const theme = {
  primary: '#2e7d32',
  primaryDark: '#059669',
  error: '#ef4444',
};

// Styled Action Button for consistency with PaymentManagement.jsx
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

// Styled components for autocomplete
const AutocompleteContainer = styled.div`
  position: relative;
  width: 100%;
`;

const AutocompleteInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #1f2937;
  background: #fff;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
  }
`;

const AutocompleteList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: 0.25rem;
  padding: 0;
  list-style: none;
`;

const AutocompleteItem = styled.li`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #1f2937;
  cursor: pointer;
  &:hover {
    background: #f1f5f9;
  }
`;

const ManageClientsButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${theme.primary};
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    background: ${theme.primaryDark};
    transform: translateY(-1px);
  }
`;

const API_URL = 'http://localhost:5000/api/affaires';
const LAWYERS_API_URL = 'http://localhost:5000/api/avocats';
const TYPES_API_URL = 'http://localhost:5000/api/types';
const CLIENTS_API_URL = 'http://localhost:5000/api/clients';

const LegalCaseManagement = ({ setToken }) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCases, setSelectedCases] = useState([]);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type_id: '',
    avocat_id: '',
    client_id: '',
    client_name: '', // New field for autocomplete display
    adversaire: '',
    statut: 'en cours',
    attachments: [],
  });
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lawyers, setLawyers] = useState([]);
  const [types, setTypes] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  const [loadingLawyers, setLoadingLawyers] = useState(true);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [avocatId, setAvocatId] = useState(null);
  const casesPerPage = 5;
  const navigate = useNavigate();
  const clientInputRef = useRef(null);

  const statutDisplay = {
    'en cours': 'جارية',
    terminée: 'منتهية',
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAvocatId(decoded.id);
      } catch (err) {
        console.error('Error decoding token:', err);
        setError('فشل التحقق من المصادقة');
      }
    } else {
      setError('لم يتم العثور على رمز المصادقة');
    }
  }, []);

  useEffect(() => {
    if (avocatId) {
      fetchCases();
      fetchClients();
    }
    fetchLawyers();
    fetchTypes();
  }, [avocatId]);

  useEffect(() => {
    // Filter clients based on client_name
    if (formData.client_name) {
      const filtered = clients.filter((client) =>
        client.nom.toLowerCase().includes(formData.client_name.toLowerCase())
      );
      setFilteredClients(filtered);
      setShowClientSuggestions(filtered.length > 0);
    } else {
      setFilteredClients(clients);
      setShowClientSuggestions(false);
    }
  }, [formData.client_name, clients]);

  const fetchCases = async () => {
    if (!avocatId) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/avocat/${avocatId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCases(response.data);
      setFilteredCases(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setCases([]);
        setFilteredCases([]);
      } else {
        setError('فشل جلب القضايا');
        console.error('Fetch cases error:', error.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLawyers = async () => {
    try {
      setLoadingLawyers(true);
      const response = await axios.get(LAWYERS_API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setLawyers(response.data);
    } catch (error) {
      setError('فشل جلب بيانات المحامين');
      console.error('Fetch lawyers error:', error.response?.data);
    } finally {
      setLoadingLawyers(false);
    }
  };

  const fetchTypes = async () => {
    try {
      setLoadingTypes(true);
      const response = await axios.get(TYPES_API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTypes(response.data);
    } catch (error) {
      setError('فشل جلب أنواع القضايا');
      console.error('Fetch types error:', error.response?.data);
    } finally {
      setLoadingTypes(false);
    }
  };

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const response = await axios.get(CLIENTS_API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setClients(response.data);
      setFilteredClients(response.data);
    } catch (error) {
      setError('فشل جلب بيانات العملاء');
      console.error('Fetch clients error:', error.response?.data);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleFilter = () => {
    let filtered = cases;
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.client_id?.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.adversaire?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterStatus) {
      filtered = filtered.filter((c) => c.statut === filterStatus);
    }
    if (filterDate) {
      const selectedDate = new Date(filterDate);
      selectedDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((c) => {
        const creationDate = new Date(c.date_creation);
        creationDate.setHours(0, 0, 0, 0);
        return (
          creationDate.getFullYear() === selectedDate.getFullYear() &&
          creationDate.getMonth() === selectedDate.getMonth() &&
          creationDate.getDate() === selectedDate.getDate()
        );
      });
    }
    setFilteredCases(filtered);
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titre || !formData.description || !formData.type_id || !formData.client_id || !formData.adversaire) {
      setError('جميع الحقول مطلوبة');
      toast.error('جميع الحقول مطلوبة');
      return;
    }
    const submitData = new FormData();
    submitData.append('titre', formData.titre);
    submitData.append('description', formData.description);
    submitData.append('type_id', formData.type_id);
    submitData.append('avocat_id', avocatId);
    submitData.append('client_id', formData.client_id);
    submitData.append('adversaire', formData.adversaire);
    submitData.append('statut', formData.statut);
    attachmentFiles.forEach((file) => {
      submitData.append('attachments', file);
    });

    try {
      let response;
      if (editingId) {
        response = await axios.put(`${API_URL}/${editingId}`, submitData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setCases(cases.map((c) => (c._id === editingId ? response.data : c)));
        setEditingId(null);
        toast.success('تم تعديل القضية بنجاح');
      } else {
        response = await axios.post(API_URL, submitData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setCases([...cases, response.data]);
        toast.success('تم إضافة القضية بنجاح');
      }
      setFormData({
        titre: '',
        description: '',
        type_id: '',
        avocat_id: '',
        client_id: '',
        client_name: '',
        adversaire: '',
        statut: 'en cours',
        attachments: [],
      });
      setAttachmentFiles([]);
      setShowFormModal(false);
      fetchCases();
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ أثناء حفظ القضية');
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء حفظ القضية');
    }
  };

  const handleEdit = (caseItem) => {
    setFormData({
      titre: caseItem.titre,
      description: caseItem.description,
      type_id: caseItem.type_id._id,
      avocat_id: caseItem.avocat_id._id,
      client_id: caseItem.client_id?._id || '',
      client_name: caseItem.client_id?.nom || '',
      adversaire: caseItem.adversaire || '',
      statut: caseItem.statut,
      attachments: caseItem.attachments || [],
    });
    setAttachmentFiles([]);
    setEditingId(caseItem._id);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه القضية؟')) {
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCases(cases.filter((c) => c._id !== id));
        setFilteredCases(filteredCases.filter((c) => c._id !== id));
        setSelectedCases(selectedCases.filter((c) => c !== id));
        setError(null);
        toast.success('تم حذف القضية بنجاح');
      } catch (error) {
        setError('فشل حذف القضية');
        toast.error('فشل حذف القضية');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm('هل أنت متأكد من حذف القضايا المحددة؟')) {
      try {
        await Promise.all(
          selectedCases.map((id) =>
            axios.delete(`${API_URL}/${id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
          )
        );
        setCases(cases.filter((c) => !selectedCases.includes(c._id)));
        setFilteredCases(filteredCases.filter((c) => !selectedCases.includes(c._id)));
        setSelectedCases([]);
        setError(null);
        toast.success('تم حذف القضايا المحددة بنجاح');
      } catch (error) {
        setError('فشل حذف القضايا');
        toast.error('فشل حذف القضايا');
      }
    }
  };

  const handleExport = () => {
    const csvContent = [
      'العنوان,الوصف,الحالة,المحامي,العميل,الخصم,تاريخ الإنشاء,عدد المرفقات',
      ...cases.map((row) =>
        [
          row.titre,
          row.description,
          statutDisplay[row.statut] || row.statut,
          `${row.avocat_id?.nom || ''} ${row.avocat_id?.prenom || ''}`,
          row.client_id?.nom || '',
          row.adversaire || '',
          new Date(row.date_creation).toLocaleDateString('ar-EG'),
          row.attachments ? row.attachments.length : 0,
        ].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'cases.csv');
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    const sorted = [...filteredCases].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];
      if (key === 'avocat_id') {
        aValue = `${a.avocat_id?.nom || ''} ${a.avocat_id?.prenom || ''}`;
        bValue = `${b.avocat_id?.nom || ''} ${b.avocat_id?.prenom || ''}`;
      } else if (key === 'type_id') {
        aValue = a.type_id?.name || '';
        bValue = b.type_id?.name || '';
      } else if (key === 'client_id') {
        aValue = a.client_id?.nom || '';
        bValue = b.client_id?.nom || '';
      } else if (key === 'adversaire') {
        aValue = a.adversaire || '';
        bValue = b.adversaire || '';
      } else if (key === 'date_creation') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      if (typeof aValue === 'string' && key !== 'date_creation') {
        return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
    setFilteredCases(sorted);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachmentFiles(files);
  };

  const handleAttachmentsModal = (caseItem) => {
    setSelectedCase(caseItem);
    setAttachmentFiles([]);
    setShowAttachmentsModal(true);
  };

  const handleAddAttachments = async (e) => {
    e.preventDefault();
    if (attachmentFiles.length === 0) {
      setError('يرجى اختيار ملفات لإضافتها');
      toast.error('يرجى اختيار ملفات لإضافتها');
      return;
    }
    const submitData = new FormData();
    attachmentFiles.forEach((file) => {
      submitData.append('attachments', file);
    });
    try {
      const response = await axios.put(`${API_URL}/${selectedCase._id}`, submitData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setCases(cases.map((c) => (c._id === selectedCase._id ? response.data : c)));
      setFilteredCases(filteredCases.map((c) => (c._id === selectedCase._id ? response.data : c)));
      setShowAttachmentsModal(false);
      setAttachmentFiles([]);
      setError(null);
      toast.success('تم إضافة المرفقات بنجاح');
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ أثناء إضافة المرفقات');
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء إضافة المرفقات');
    }
  };

  const handleDownloadAttachment = async (filePath) => {
    if (typeof filePath !== 'string') {
      console.error('Invalid filePath:', filePath);
      setError('مسار الملف غير صالح');
      toast.error('مسار الملف غير صالح');
      return;
    }
    try {
      const encodedFilePath = encodeURIComponent(filePath);
      const response = await axios.get(`http://localhost:5000/api/affaires/download/${encodedFilePath}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filePath.split('/').pop());
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('فشل تحميل الملف');
      toast.error('فشل تحميل الملف');
    }
  };

  const getFileName = (filePath) => {
    if (typeof filePath === 'string') {
      return filePath.split('/').pop() || 'ملف غير صالح';
    }
    return 'ملف غير صالح';
  };

  const selectClient = (client) => {
    setFormData({
      ...formData,
      client_id: client._id,
      client_name: client.nom,
    });
    setShowClientSuggestions(false);
  };

  const handleClientInputChange = (e) => {
    setFormData({
      ...formData,
      client_name: e.target.value,
      client_id: '', // Reset client_id until a suggestion is selected
    });
  };

  const handleClientFocus = () => {
    if (formData.client_name || filteredClients.length > 0) {
      setShowClientSuggestions(true);
    }
  };

  const handleClientBlur = () => {
    setTimeout(() => setShowClientSuggestions(false), 200);
  };

  const totalPages = Math.ceil(filteredCases.length / casesPerPage);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * casesPerPage,
    currentPage * casesPerPage
  );

  const summary = {
    total: cases.length,
    inProgress: cases.filter((c) => c.statut === 'en cours').length,
    closed: cases.filter((c) => c.statut === 'terminée').length,
  };

  if (loading || loadingClients) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <NavDash setToken={setToken} />
      <Sidebar setToken={setToken} />
      <div className="flex-1 p-6 md:p-8 md:mt-16 sm:mr-16" dir="rtl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            إدارة القضايا القانونية
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg shadow-sm hover:bg-green-700 transition-all duration-300 text-sm"
            >
              <Download className="h-4 w-4" /> تصدير
            </button>
            <button
              onClick={() => setShowFormModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg shadow-sm hover:bg-green-700 transition-all duration-300 text-sm"
            >
              <Plus className="h-4 w-4" /> إضافة قضية
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4"
          >
            <div className="p-3 bg-green-100 rounded-full">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي القضايا</p>
              <p className="text-2xl font-bold text-gray-800">{summary.total}</p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4"
          >
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">القضايا الجارية</p>
              <p className="text-2xl font-bold text-gray-800">{summary.inProgress}</p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4"
          >
            <div className="p-3 bg-blue-100 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">القضايا المنتهية</p>
              <p className="text-2xl font-bold text-gray-800">{summary.closed}</p>
            </div>
          </motion.div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleFilter();
                }}
                placeholder="البحث حسب العنوان أو الوصف أو العميل أو الخصم..."
                className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                handleFilter();
              }}
              className="w-full sm:w-48 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-300 text-gray-700 text-sm"
            >
              <option value="">جميع الحالات</option>
              <option value="en cours">جارية</option>
              <option value="terminée">منتهية</option>
            </select>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              onBlur={handleFilter}
              className="w-full sm:w-48 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-300 text-gray-700 text-sm"
            />
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            {selectedCases.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-all duration-300 text-sm"
              >
                <FaTrash className="h-4 w-4" /> حذف المحدد ({selectedCases.length})
              </button>
            )}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg shadow-sm flex justify-between items-center border border-red-200"
          >
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-700">
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}

        {/* Add/Edit Case Modal */}
        <AnimatePresence>
          {showFormModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowFormModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingId ? 'تعديل القضية' : 'إضافة قضية جديدة'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowFormModal(false);
                      setEditingId(null);
                      setFormData({
                        titre: '',
                        description: '',
                        type_id: '',
                        avocat_id: '',
                        client_id: '',
                        client_name: '',
                        adversaire: '',
                        statut: 'en cours',
                        attachments: [],
                      });
                      setAttachmentFiles([]);
                    }}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                        <input
                          type="text"
                          value={formData.titre}
                          onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700 transition-all duration-200 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700 transition-all duration-200 text-sm resize-none h-24"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">العميل</label>
                        {loadingClients ? (
                          <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 animate-pulse text-sm">
                            جاري تحميل العملاء...
                          </div>
                        ) : (
                          <AutocompleteContainer>
                            <AutocompleteInput
                              type="text"
                              value={formData.client_name}
                              onChange={handleClientInputChange}
                              onFocus={handleClientFocus}
                              onBlur={handleClientBlur}
                              placeholder="ابحث عن العميل..."
                              ref={clientInputRef}
                              required
                            />
                            {showClientSuggestions && (
                              <AutocompleteList>
                                {filteredClients.map((client) => (
                                  <AutocompleteItem
                                    key={client._id}
                                    onClick={() => selectClient(client)}
                                  >
                                    {client.nom}
                                  </AutocompleteItem>
                                ))}
                              </AutocompleteList>
                            )}
                          </AutocompleteContainer>
                        )}
                        <ManageClientsButton
                          type="button"
                          onClick={() => navigate('/client-management')}
                        >
                          إدارة العملاء
                        </ManageClientsButton>
                      </div>
                    </div>
                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">النوع</label>
                        {loadingTypes ? (
                          <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 animate-pulse text-sm">
                            جاري تحميل الأنواع...
                          </div>
                        ) : (
                          <select
                            value={formData.type_id}
                            onChange={(e) => setFormData({ ...formData, type_id: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700 transition-all duration-200 text-sm"
                            required
                          >
                            <option value="" disabled>
                              اختر النوع
                            </option>
                            {types.map((type) => (
                              <option key={type._id} value={type._id}>
                                {type.name || type._id}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الخصم</label>
                        <input
                          type="text"
                          value={formData.adversaire}
                          onChange={(e) => setFormData({ ...formData, adversaire: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700 transition-all duration-200 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                        <select
                          value={formData.statut}
                          onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700 transition-all duration-200 text-sm"
                          required
                        >
                          <option value="en cours">جارية</option>
                          <option value="terminée">منتهية</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">المرفقات</label>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          accept="image/*,application/pdf,.doc,.docx"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700 transition-all duration-200 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                        {attachmentFiles.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {attachmentFiles.map((file, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                {file.name}
                                <button
                                  type="button"
                                  onClick={() => setAttachmentFiles(attachmentFiles.filter((_, i) => i !== index))}
                                  className="ml-2 text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        {editingId && formData.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {formData.attachments.map((filePath, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                {getFileName(filePath)}
                                <button
                                  type="button"
                                  onClick={() => handleDownloadAttachment(filePath)}
                                  className="ml-2 text-blue-600 hover:text-blue-700"
                                >
                                  <DownloadIcon className="h-4 w-4" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg shadow-sm hover:bg-green-700 transition-all duration-300 text-sm"
                    >
                      {editingId ? 'تعديل القضية' : 'إضافة القضية'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-x-auto"
        >
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedCases(e.target.checked ? cases.map((c) => c._id) : [])
                    }
                    checked={selectedCases.length === cases.length && cases.length > 0}
                    className="accent-green-600 rounded"
                  />
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('titre')}
                >
                  العنوان {sortConfig.key === 'titre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  الوصف
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('type_id')}
                >
                  النوع {sortConfig.key === 'type_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('client_id')}
                >
                  العميل {sortConfig.key === 'client_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('adversaire')}
                >
                  الخصم {sortConfig.key === 'adversaire' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  الحالة
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date_creation')}
                >
                  تاريخ الإنشاء {sortConfig.key === 'date_creation' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  المرفقات
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {paginatedCases.map((caseItem) => (
                  <motion.tr
                    key={caseItem._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCases.includes(caseItem._id)}
                        onChange={() =>
                          setSelectedCases(
                            selectedCases.includes(caseItem._id)
                              ? selectedCases.filter((id) => id !== caseItem._id)
                              : [...selectedCases, caseItem._id]
                          )
                        }
                        className="accent-green-600 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium text-sm">
                      {caseItem.titre}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm line-clamp-2">{caseItem.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                      {caseItem.type_id?.name || 'غير محدد'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                      {caseItem.client_id?.nom || 'غير محدد'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                      {caseItem.adversaire || 'غير محدد'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          caseItem.statut === 'en cours'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {statutDisplay[caseItem.statut] || caseItem.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                      {new Date(caseItem.date_creation).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                      <button
                        onClick={() => handleAttachmentsModal(caseItem)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                      >
                        <Paperclip className="h-5 w-5" />
                        ({caseItem.attachments ? caseItem.attachments.length : 0})
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2">
                        <ActionIcon
                          bgColor="#3b82f6"
                          hoverColor="#2563eb"
                          title="عرض"
                          onClick={() => {
                            setSelectedCase(caseItem);
                            setShowDetailsModal(true);
                          }}
                        >
                          <FaEye className="h-3 w-3" />
                        </ActionIcon>
                        <ActionIcon
                          bgColor={theme.primary}
                          hoverColor={theme.primaryDark}
                          title="تعديل"
                          onClick={() => handleEdit(caseItem)}
                        >
                          <FaEdit className="h-3 w-3" />
                        </ActionIcon>
                        <ActionIcon
                          bgColor={theme.error}
                          hoverColor="#dc2626"
                          title="حذف"
                          onClick={() => handleDelete(caseItem._id)}
                        >
                          <FaTrash className="h-3 w-3" />
                        </ActionIcon>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {paginatedCases.length === 0 && (
            <div className="text-center text-gray-500 p-6">لا توجد قضايا متاحة</div>
          )}
        </motion.div>

        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 text-sm"
          >
            السابق
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm ${
                currentPage === page
                  ? 'bg-green-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 text-sm"
          >
            التالي
          </button>
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedCase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowDetailsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">تفاصيل القضية</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <span className="font-semibold text-gray-700">العنوان:</span>
                      <p className="mt-1 text-gray-600">{selectedCase.titre}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">الوصف:</span>
                      <p className="mt-1 text-gray-600">{selectedCase.description}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">النوع:</span>
                      <p className="mt-1 text-gray-600">{selectedCase.type_id?.name || 'غير محدد'}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">الحالة:</span>
                      <p className="mt-1 text-gray-600">{statutDisplay[selectedCase.statut] || selectedCase.statut}</p>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <span className="font-semibold text-gray-700">العميل:</span>
                      <p className="mt-1 text-gray-600">{selectedCase.client_id?.nom || 'غير محدد'}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">الخصم:</span>
                      <p className="mt-1 text-gray-600">{selectedCase.adversaire || 'غير محدد'}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">المحامي:</span>
                      <p className="mt-1 text-gray-600">
                        {selectedCase.avocat_id ? `${selectedCase.avocat_id.nom} ${selectedCase.avocat_id.prenom}` : 'غير محدد'}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">تاريخ الإنشاء:</span>
                      <p className="mt-1 text-gray-600">{new Date(selectedCase.date_creation).toLocaleDateString('ar-EG')}</p>
                    </div>
                  </div>
                </div>
                {/* Attachments Section (Full Width) */}
                <div className="mt-6">
                  <span className="font-semibold text-gray-700">المرفقات:</span>
                  {selectedCase.attachments && selectedCase.attachments.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedCase.attachments.map((filePath, index) => (
                        <button
                          key={index}
                          onClick={() => handleDownloadAttachment(filePath)}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors duration-200"
                        >
                          {getFileName(filePath)}
                          <DownloadIcon className="h-4 w-4 ml-2" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-gray-600">لا توجد مرفقات</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachments Modal */}
        <AnimatePresence>
          {showAttachmentsModal && selectedCase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowAttachmentsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">إدارة المرفقات</h2>
                  <button
                    onClick={() => setShowAttachmentsModal(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold text-gray-700">المرفقات الحالية:</span>
                    {selectedCase.attachments && selectedCase.attachments.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedCase.attachments.map((filePath, index) => (
                          <button
                            key={index}
                            onClick={() => handleDownloadAttachment(filePath)}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors duration-200"
                          >
                            {getFileName(filePath)}
                            <DownloadIcon className="h-4 w-4 ml-2" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-gray-600">لا توجد مرفقات</p>
                    )}
                  </div>
                  <form onSubmit={handleAddAttachments}>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">إضافة مرفقات جديدة:</label>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept="image/*,application/pdf,.doc,.docx"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700 transition-all duration-200 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      {attachmentFiles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {attachmentFiles.map((file, index) => (
                            <span key={index} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {file.name}
                              <button
                                type="button"
                                onClick={() => setAttachmentFiles(attachmentFiles.filter((_, i) => i !== index))}
                                className="ml-2 text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-all duration-300 text-sm"
                      >
                        إضافة المرفقات
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast Container */}
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </div>
  );
};

export default LegalCaseManagement;
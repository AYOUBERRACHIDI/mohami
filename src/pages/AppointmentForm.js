import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaUser, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaStickyNote, FaRedo, FaGavel, FaBriefcase } from 'react-icons/fa';
import NavDash from '../components/NavDash';
import Sidebar from '../components/Sidebar';

// Keyframes for Animations
const pageFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Styled Components (unchanged from original)
const FormContainer = styled.div`
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

  @media (max-width: 1024px) {
    padding: 1.5rem;
  }
  @media (max-width: 768px) {
    padding: 1rem;
    margin-right: 0;
  }
`;

const FormSection = styled.div`
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  width: 1000px;
  max-width: 95%;
  margin: 0 auto;
  display: flex;
  border: 1px solid #2e7d32;
  animation: ${css`${pageFadeIn} 0.3s ease-in-out forwards`};

  @media (max-width: 1024px) {
    width: 90%;
  }
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormLeft = styled.div`
  flex: 3;
  padding: 0.75rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FormRight = styled.div`
  flex: 2;
  padding: 0.75rem;
  background: #f9f9f9;
  border-left: 0.5px solid #e0e0e0;

  @media (max-width: 768px) {
    border-left: none;
    border-top: 0.5px solid #e0e0e0;
    padding: 1rem;
  }
`;

const FormHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #333333;
  margin-bottom: 0.25rem;

  &::after {
    content: '${props => props.required ? '*' : ''}';
    color: #d32f2f;
    margin-right: 0.25rem;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #333333;
  min-height: 36px;
  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 5px rgba(46, 125, 50, 0.3);
  }
  ${props => props.error ? `
    border-color: #d32f2f;
    background: #fff1f1;
  ` : ''}

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.75rem;
    min-height: 44px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #333333;
  min-height: 36px;
  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 5px rgba(46, 125, 50, 0.3);
  }
  ${props => props.error ? `
    border-color: #d32f2f;
    background: #fff1f1;
  ` : ''}

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.75rem;
    min-height: 44px;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #333333;
  resize: vertical;
  min-height: 60px;
  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 5px rgba(46, 125, 50, 0.3);
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.75rem;
    min-height: 80px;
  }
`;

const ErrorMessage = styled.p`
  font-size: 0.75rem;
  color: #d32f2f;
  margin-top: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const AutocompleteContainer = styled.div`
  position: relative;
`;

const AutocompleteList = styled.ul`
  position: absolute;
  top: 100%;
  right: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 0.25rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: 0.25rem;
  padding: 0;
  list-style: none;
`;

const AutocompleteItem = styled.li`
  padding: 0.5rem;
  font-size: 0.75rem;
  color: #333333;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.75rem;
  }
`;

const RecurrenceSection = styled.div`
  margin-top: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.25rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const RecurrenceToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #333333;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const SummaryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToggleSummary = styled.button`
  display: none;
  padding: 0.5rem 1rem;
  background: #2e7d32;
  color: #ffffff;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease-in-out;
  &:hover {
    background: #1b5e20;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const SummaryContent = styled.div`
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    margin-top: 0.5rem;
  }
`;

const SummaryText = styled.p`
  font-size: 0.75rem;
  color: #333333;
  margin: 0.5rem 0;
  word-wrap: break-word;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const DurationDisplay = styled.p`
  font-size: 0.75rem;
  color: #2e7d32;
  margin-top: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const FormButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const SaveButton = styled.button`
  padding: 0.5rem 1rem;
  background: #2e7d32;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.3s ease-in-out;
  min-height: 36px;
  &:hover {
    background: #1b5e20;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.75rem 1.25rem;
    min-height: 44px;
  }
`;

const CancelButton = styled.button`
  padding: 0.5rem 1rem;
  background: #e0e0e0;
  color: #333333;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.3s ease-in-out;
  min-height: 36px;
  &:hover {
    background: #d0d0d0;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.75rem 1.25rem;
    min-height: 44px;
  }
`;

const ResetButton = styled.button`
  padding: 0.5rem 1rem;
  background: #666666;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.3s ease-in-out;
  min-height: 36px;
  &:hover {
    background: #555555;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.75rem 1.25rem;
    min-height: 44px;
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background: #d32f2f;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.3s ease-in-out;
  min-height: 36px;
  &:hover {
    background: #b71c1c;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.75rem 1.25rem;
    min-height: 44px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 0.75rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ModalHeader = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 1rem;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1rem;
`;

const ModalConfirmButton = styled.button`
  padding: 0.5rem 1rem;
  background: #d32f2f;
  color: #ffffff;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease-in-out;
  &:hover {
    background: #b71c1c;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.75rem 1.25rem;
  }
`;

const ModalCancelButton = styled.button`
  padding: 0.5rem 1rem;
  background: #e0e0e0;
  color: #333333;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease-in-out;
  &:hover {
    background: #d0d0d0;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.75rem 1.25rem;
  }
`;

function AppointmentForm() {
  const { mode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const eventTypes = [
    { value: 'consultation', label: 'استشارة', color: '#4caf50' },
    { value: 'meeting', label: 'اجتماع مع العميل بخصوص قضية', color: '#0288d1' },
    { value: 'court', label: 'جلسة محكمة مع العميل', color: '#2e7d32' },
  ];

  const statusOptions = [
    { value: 'confirmed', label: 'مؤكد' },
    { value: 'pending', label: 'معلق' },
    { value: 'cancelled', label: 'ملغى' },
  ];

  const recurrenceOptions = [
    { value: 'none', label: 'غير متكرر' },
    { value: 'daily', label: 'يومي' },
    { value: 'weekly', label: 'أسبوعي' },
    { value: 'monthly', label: 'شهري' },
  ];

  const initialFormData = {
    client: '',
    client_id: '',
    type: 'consultation',
    caseNumber: '',
    affaire_id: '',
    courtName: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    status: 'confirmed',
    notes: '',
    isRecurring: false,
    recurrenceFrequency: 'none',
    recurrenceEndDate: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [editingEvent, setEditingEvent] = useState(null);
  const [errors, setErrors] = useState({});
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [caseNumberSuggestions, setCaseNumberSuggestions] = useState([]);
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  const [showCaseNumberSuggestions, setShowCaseNumberSuggestions] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [events, setEvents] = useState([]);
  const clientInputRef = useRef(null);
  const caseNumberInputRef = useRef(null);

  // Fetch all appointments for conflict checking
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/rendez-vous', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error('جلسة منتهية، يرجى تسجيل الدخول مرة أخرى');
          navigate('/login');
        } else {
          toast.error('خطأ في جلب المواعيد');
        }
      }
    };
    fetchEvents();
  }, [navigate]);

  // Populate form for editing
  useEffect(() => {
    if (mode !== 'new' && state?.event) {
      const event = state.event;
      setEditingEvent(event);
      setFormData({
        client: event.client || '',
        client_id: event.client_id || '',
        type: event.type || 'consultation',
        caseNumber: event.caseNumber || '',
        affaire_id: event.affaire_id || '',
        courtName: event.courtName || '',
        date: moment(event.start).format('YYYY-MM-DD'),
        startTime: moment(event.start).format('HH:mm'),
        endTime: moment(event.end).format('HH:mm'),
        location: event.location || '',
        status: event.status || 'confirmed',
        notes: event.notes || '',
        isRecurring: !!event.recurrence,
        recurrenceFrequency: event.recurrence?.frequency || 'none',
        recurrenceEndDate: event.recurrence?.endDate || '',
      });
    }
  }, [mode, state]);

  // Fetch client suggestions
  useEffect(() => {
    const fetchClientSuggestions = async () => {
      if (formData.client.length < 2) {
        setClientSuggestions([]);
        setShowClientSuggestions(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/clients/search?query=${formData.client}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientSuggestions(response.data);
        setShowClientSuggestions(response.data.length > 0);
      } catch (error) {
        console.error('Error fetching client suggestions:', error);
        setShowClientSuggestions(false);
      }
    };
    fetchClientSuggestions();
  }, [formData.client]);

  // Fetch case number suggestions
  useEffect(() => {
    const fetchCaseNumberSuggestions = async () => {
      if ((formData.type !== 'meeting' && formData.type !== 'court') || formData.caseNumber.length < 2) {
        setCaseNumberSuggestions([]);
        setShowCaseNumberSuggestions(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/affaires/search?query=${formData.caseNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCaseNumberSuggestions(response.data);
        setShowCaseNumberSuggestions(response.data.length > 0);
      } catch (error) {
        console.error('Error fetching case number suggestions:', error);
        setShowCaseNumberSuggestions(false);
      }
    };
    fetchCaseNumberSuggestions();
  }, [formData.caseNumber, formData.type]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    validateField(name, type === 'checkbox' ? checked : value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'client':
        newErrors.client = value ? '' : 'اسم العميل مطلوب';
        break;
      case 'caseNumber':
        if (formData.type === 'meeting' || formData.type === 'court') {
          newErrors.caseNumber = value ? '' : 'رقم القضية مطلوب';
        } else {
          newErrors.caseNumber = '';
        }
        break;
      case 'courtName':
        if (formData.type === 'court') {
          newErrors.courtName = value ? '' : 'اسم المحكمة مطلوب';
        } else {
          newErrors.courtName = '';
        }
        break;
      case 'date':
        const today = moment().startOf('day');
        newErrors.date = value
          ? moment(value).isSameOrAfter(today)
            ? ''
            : 'التاريخ لا يمكن أن يكون في الماضي'
          : 'التاريخ مطلوب';
        break;
      case 'startTime':
        newErrors.startTime = value ? '' : 'وقت البدء مطلوب';
        break;
      case 'endTime':
        newErrors.endTime = value ? '' : 'وقت الانتهاء مطلوب';
        if (formData.date && formData.startTime && value) {
          const start = new Date(`${formData.date}T${formData.startTime}`);
          const end = new Date(`${formData.date}T${value}`);
          newErrors.endTime = end > start ? '' : 'وقت الانتهاء يجب أن يكون بعد وقت البدء';
        }
        break;
      case 'location':
        newErrors.location = value && value.length >= 3 ? '' : 'الموقع مطلوب (3 أحرف على الأقل)';
        break;
      case 'recurrenceEndDate':
        if (formData.isRecurring && formData.recurrenceFrequency !== 'none') {
          newErrors.recurrenceEndDate = value ? '' : 'تاريخ انتهاء التكرار مطلوب';
        } else {
          newErrors.recurrenceEndDate = '';
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.client_id) newErrors.client = 'اسم العميل مطلوب';
    if ((formData.type === 'meeting' || formData.type === 'court') && !formData.affaire_id) {
      newErrors.caseNumber = 'رقم القضية مطلوب';
    }
    if (formData.type === 'court' && !formData.courtName) {
      newErrors.courtName = 'اسم المحكمة مطلوب';
    }
    if (!formData.date) newErrors.date = 'التاريخ مطلوب';
    else {
      const today = moment().startOf('day');
      if (!moment(formData.date).isSameOrAfter(today)) {
        newErrors.date = 'التاريخ لا يمكن أن يكون في الماضي';
      }
    }
    if (!formData.startTime) newErrors.startTime = 'وقت البدء مطلوب';
    if (!formData.endTime) newErrors.endTime = 'وقت الانتهاء مطلوب';
    if (!formData.location || formData.location.length < 3) {
      newErrors.location = 'الموقع مطلوب (3 أحرف على الأقل)';
    }

    if (formData.date && formData.startTime && formData.endTime) {
      const start = new Date(`${formData.date}T${formData.startTime}`);
      const end = new Date(`${formData.date}T${formData.endTime}`);
      if (end <= start) {
        newErrors.endTime = 'وقت الانتهاء يجب أن يكون بعد وقت البدء';
      }
    }

    if (formData.isRecurring && formData.recurrenceFrequency !== 'none' && !formData.recurrenceEndDate) {
      newErrors.recurrenceEndDate = 'تاريخ انتهاء التكرار مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkConflicts = () => {
    if (!events || !formData.date || !formData.startTime || !formData.endTime) return [];

    const newStart = new Date(`${formData.date}T${formData.startTime}`);
    const newEnd = new Date(`${formData.date}T${formData.endTime}`);
    return events.filter(event => {
      if (editingEvent && event.id === editingEvent.id) return false;
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return (
        moment(newStart).isSame(eventStart, 'day') &&
        (newStart < eventEnd && newEnd > eventStart)
      );
    });
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return 'غير محدد';
    const diff = moment(end).diff(moment(start), 'minutes');
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours > 0 ? `${hours}س ` : ''}${minutes > 0 ? `${minutes}د` : ''}`.trim() || '0د';
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج');
      return;
    }

    const conflicts = checkConflicts();
    if (conflicts.length > 0) {
      toast.warn(
        `هذا الموعد يتعارض مع: ${conflicts.map(c => c.title).join(', ')}. هل تريد المتابعة؟`,
        {
          onClick: () => proceedWithSave(),
          autoClose: false,
          closeOnClick: false,
        }
      );
      return;
    }

    await proceedWithSave();
  };

  const proceedWithSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const payload = {
        avocat_id: localStorage.getItem('userId'), // Assumes userId is stored in localStorage after login
        client_id: formData.client_id,
        affaire_id: formData.affaire_id || null,
        date: formData.date,
        heure_debut: formData.startTime,
        heure_fin: formData.endTime,
        status: formData.status,
        notes: formData.notes,
        location: formData.location,
        type: formData.type,
        courtName: formData.type === 'court' ? formData.courtName : null,
        recurrence: formData.isRecurring && formData.recurrenceFrequency !== 'none' ? {
          frequency: formData.recurrenceFrequency,
          endDate: formData.recurrenceEndDate,
        } : null,
      };

      let response;
      if (editingEvent) {
        response = await axios.put(`http://localhost:5000/api/rendez-vous/${editingEvent.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('تم تحديث الموعد بنجاح');
      } else {
        response = await axios.post('http://localhost:5000/api/rendez-vous', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('تم إنشاء الموعد بنجاح');
      }

      navigate('/calendar', {
        state: {
          action: editingEvent ? 'update' : 'add',
          event: response.data,
        },
      });
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('جلسة منتهية، يرجى تسجيل الدخول مرة أخرى');
        navigate('/login');
      } else if (error.response?.data?.message === 'Conflict with existing rendez-vous') {
        toast.warn(
          `هذا الموعد يتعارض مع: ${error.response.data.conflicts.map(c => c.title).join(', ')}. هل تريد المتابعة؟`,
          {
            onClick: async () => {
              try {
                const token = localStorage.getItem('token');
                const payload = {
                  avocat_id: localStorage.getItem('userId'),
                  client_id: formData.client_id,
                  affaire_id: formData.affaire_id || null,
                  date: formData.date,
                  heure_debut: formData.startTime,
                  heure_fin: formData.endTime,
                  status: formData.status,
                  notes: formData.notes,
                  location: formData.location,
                  type: formData.type,
                  courtName: formData.type === 'court' ? formData.courtName : null,
                  recurrence: formData.isRecurring && formData.recurrenceFrequency !== 'none' ? {
                    frequency: formData.recurrenceFrequency,
                    endDate: formData.recurrenceEndDate,
                  } : null,
                };
                const response = editingEvent
                  ? await axios.put(`http://localhost:5000/api/rendez-vous/${editingEvent.id}`, payload, {
                      headers: { Authorization: `Bearer ${token}` },
                    })
                  : await axios.post('http://localhost:5000/api/rendez-vous', payload, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                toast.success(`تم ${editingEvent ? 'تحديث' : 'إنشاء'} الموعد بنجاح`);
                navigate('/calendar', {
                  state: { action: editingEvent ? 'update' : 'add', event: response.data },
                });
              } catch (err) {
                toast.error(err.response?.data?.message || 'خطأ في حفظ الموعد');
              }
            },
            autoClose: false,
            closeOnClick: false,
          }
        );
      } else {
        toast.error(error.response?.data?.message || 'خطأ في حفظ الموعد');
      }
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.delete(`http://localhost:5000/api/rendez-vous/${editingEvent.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('تم حذف الموعد بنجاح');
      navigate('/calendar', {
        state: {
          action: 'delete',
          event: editingEvent,
        },
      });
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('جلسة منتهية، يرجى تسجيل الدخول مرة أخرى');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'خطأ في حذف الموعد');
      }
    }
    setShowDeleteModal(false);
  };

  const handleReset = () => {
    if (editingEvent) {
      setFormData({
        client: editingEvent.client || '',
        client_id: editingEvent.client_id || '',
        type: editingEvent.type || 'consultation',
        caseNumber: editingEvent.caseNumber || '',
        affaire_id: editingEvent.affaire_id || '',
        courtName: editingEvent.courtName || '',
        date: moment(editingEvent.start).format('YYYY-MM-DD'),
        startTime: moment(editingEvent.start).format('HH:mm'),
        endTime: moment(editingEvent.end).format('HH:mm'),
        location: editingEvent.location || '',
        status: editingEvent.status || 'confirmed',
        notes: editingEvent.notes || '',
        isRecurring: !!editingEvent.recurrence,
        recurrenceFrequency: editingEvent.recurrence?.frequency || 'none',
        recurrenceEndDate: editingEvent.recurrence?.endDate || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
    toast.info('تم إعادة تعيين النموذج');
  };

  const handleCancel = () => {
    navigate('/calendar');
  };

  const selectClient = (client) => {
    setFormData(prev => ({ ...prev, client: client.nom, client_id: client._id }));
    setShowClientSuggestions(false);
    validateField('client', client.nom);
  };

  const selectCaseNumber = (caseNumber) => {
    setFormData(prev => ({ ...prev, caseNumber: caseNumber.titre, affaire_id: caseNumber._id }));
    setShowCaseNumberSuggestions(false);
    validateField('caseNumber', caseNumber.titre);
  };

  const handleClientFocus = () => {
    if (formData.client && clientSuggestions.length > 0) {
      setShowClientSuggestions(true);
    }
  };

  const handleClientBlur = () => {
    setTimeout(() => setShowClientSuggestions(false), 200);
  };

  const handleCaseNumberFocus = () => {
    if (formData.caseNumber && caseNumberSuggestions.length > 0) {
      setShowCaseNumberSuggestions(true);
    }
  };

  const handleCaseNumberBlur = () => {
    setTimeout(() => setShowCaseNumberSuggestions(false), 200);
  };

  const toggleSummary = () => {
    setIsSummaryOpen(prev => !prev);
  };

  return (
    <FormContainer>
      <NavDash />
      <Sidebar />
      <MainContent>
        <FormSection>
          <FormLeft>
            <FormHeader>{editingEvent ? 'تعديل الموعد' : 'إضافة موعد جديد'}</FormHeader>
            <FormGroup>
              <Label required>اسم العميل</Label>
              <AutocompleteContainer>
                <Input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  onFocus={handleClientFocus}
                  onBlur={handleClientBlur}
                  placeholder="أدخل اسم العميل"
                  error={!!errors.client}
                  ref={clientInputRef}
                />
                {showClientSuggestions && (
                  <AutocompleteList>
                    {clientSuggestions.map((client) => (
                      <AutocompleteItem key={client._id} onClick={() => selectClient(client)}>
                        {client.nom}
                      </AutocompleteItem>
                    ))}
                  </AutocompleteList>
                )}
              </AutocompleteContainer>
              {errors.client && <ErrorMessage>{errors.client}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label required>نوع الموعد</Label>
              <Select name="type" value={formData.type} onChange={handleInputChange}>
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </Select>
            </FormGroup>
            {(formData.type === 'meeting' || formData.type === 'court') && (
              <FormGroup>
                <Label required>رقم القضية</Label>
                <AutocompleteContainer>
                  <Input
                    type="text"
                    name="caseNumber"
                    value={formData.caseNumber}
                    onChange={handleInputChange}
                    onFocus={handleCaseNumberFocus}
                    onBlur={handleCaseNumberBlur}
                    placeholder="أدخل رقم القضية"
                    error={!!errors.caseNumber}
                    ref={caseNumberInputRef}
                  />
                  {showCaseNumberSuggestions && (
                    <AutocompleteList>
                      {caseNumberSuggestions.map((caseNumber) => (
                        <AutocompleteItem key={caseNumber._id} onClick={() => selectCaseNumber(caseNumber)}>
                          {caseNumber.titre}
                        </AutocompleteItem>
                      ))}
                    </AutocompleteList>
                  )}
                </AutocompleteContainer>
                {errors.caseNumber && <ErrorMessage>{errors.caseNumber}</ErrorMessage>}
              </FormGroup>
            )}
            {formData.type === 'court' && (
              <FormGroup>
                <Label required>اسم المحكمة</Label>
                <Input
                  type="text"
                  name="courtName"
                  value={formData.courtName}
                  onChange={handleInputChange}
                  placeholder="أدخل اسم المحكمة"
                  error={!!errors.courtName}
                />
                {errors.courtName && <ErrorMessage>{errors.courtName}</ErrorMessage>}
              </FormGroup>
            )}
            <FormGroup>
              <Label required>الحالة</Label>
              <Select name="status" value={formData.status} onChange={handleInputChange}>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label required>التاريخ</Label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                error={!!errors.date}
              />
              {errors.date && <ErrorMessage>{errors.date}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label required>وقت البدء</Label>
              <Input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                error={!!errors.startTime}
              />
              {errors.startTime && <ErrorMessage>{errors.startTime}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label required>وقت الانتهاء</Label>
              <Input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                error={!!errors.endTime}
              />
              {errors.endTime && <ErrorMessage>{errors.endTime}</ErrorMessage>}
              {formData.date && formData.startTime && formData.endTime && !errors.endTime && (
                <DurationDisplay>
                  المدة: {calculateDuration(
                    new Date(`${formData.date}T${formData.startTime}`),
                    new Date(`${formData.date}T${formData.endTime}`)
                  )}
                </DurationDisplay>
              )}
            </FormGroup>
            <FormGroup>
              <Label required>الموقع</Label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="أدخل الموقع"
                error={!!errors.location}
              />
              {errors.location && <ErrorMessage>{errors.location}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label>ملاحظات</Label>
              <Textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="أدخل ملاحظات إضافية"
              />
            </FormGroup>
            <RecurrenceSection>
              <RecurrenceToggle>
                <Input
                  type="checkbox"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleInputChange}
                />
                تكرار الموعد
              </RecurrenceToggle>
              {formData.isRecurring && (
                <>
                  <FormGroup>
                    <Label required>تكرار</Label>
                    <Select
                      name="recurrenceFrequency"
                      value={formData.recurrenceFrequency}
                      onChange={handleInputChange}
                    >
                      {recurrenceOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <Label required>تاريخ الانتهاء</Label>
                    <Input
                      type="date"
                      name="recurrenceEndDate"
                      value={formData.recurrenceEndDate}
                      onChange={handleInputChange}
                      error={!!errors.recurrenceEndDate}
                    />
                    {errors.recurrenceEndDate && <ErrorMessage>{errors.recurrenceEndDate}</ErrorMessage>}
                  </FormGroup>
                </>
              )}
            </RecurrenceSection>
            <FormButtons>
              <SaveButton onClick={handleSave}>حفظ</SaveButton>
              <ResetButton onClick={handleReset}>إعادة تعيين</ResetButton>
              <CancelButton onClick={handleCancel}>إلغاء</CancelButton>
              {editingEvent && (
                <DeleteButton onClick={handleDelete}>حذف</DeleteButton>
              )}
            </FormButtons>
          </FormLeft>
          <FormRight>
            <SummaryHeader>
              <FormHeader>ملخص الموعد</FormHeader>
              <ToggleSummary onClick={toggleSummary}>
                {isSummaryOpen ? 'إخفاء' : 'إظهار'}
              </ToggleSummary>
            </SummaryHeader>
            <SummaryContent isOpen={isSummaryOpen}>
              <SummaryText>
                <FaUser />
                <span><strong>العميل:</strong> {formData.client || 'غير محدد'}</span>
              </SummaryText>
              <SummaryText>
                <FaCalendarAlt />
                <span><strong>النوع:</strong> {eventTypes.find(t => t.value === formData.type)?.label || 'غير محدد'}</span>
              </SummaryText>
              {(formData.type === 'meeting' || formData.type === 'court') && (
                <SummaryText>
                  <FaBriefcase />
                  <span><strong>رقم القضية:</strong> {formData.caseNumber || 'غير محدد'}</span>
                </SummaryText>
              )}
              {formData.type === 'court' && (
                <SummaryText>
                  <FaGavel />
                  <span><strong>اسم المحكمة:</strong> {formData.courtName || 'غير محدد'}</span>
                </SummaryText>
              )}
              <SummaryText>
                <FaCalendarAlt />
                <span><strong>الحالة:</strong> {statusOptions.find(s => s.value === formData.status)?.label || 'غير محدد'}</span>
              </SummaryText>
              <SummaryText>
                <FaCalendarAlt />
                <span><strong>التاريخ:</strong> {formData.date || 'غير محدد'}</span>
              </SummaryText>
              <SummaryText>
                <FaClock />
                <span>
                  <strong>الوقت:</strong> {formData.startTime && formData.endTime
                    ? `${formData.startTime} - ${formData.endTime} (${calculateDuration(
                        new Date(`${formData.date}T${formData.startTime}`),
                        new Date(`${formData.date}T${formData.endTime}`)
                      )})`
                    : 'غير محدد'}
                </span>
              </SummaryText>
              <SummaryText>
                <FaMapMarkerAlt />
                <span><strong>الموقع:</strong> {formData.location || 'غير محدد'}</span>
              </SummaryText>
              <SummaryText>
                <FaStickyNote />
                <span><strong>ملاحظات:</strong> {formData.notes || 'لا توجد ملاحظات'}</span>
              </SummaryText>
              <SummaryText>
                <FaRedo />
                <span>
                  <strong>التكرار:</strong> {formData.isRecurring && formData.recurrenceFrequency !== 'none'
                    ? `${recurrenceOptions.find(r => r.value === formData.recurrenceFrequency)?.label} حتى ${formData.recurrenceEndDate || 'غير محدد'}`
                    : 'غير متكرر'}
                </span>
              </SummaryText>
            </SummaryContent>
          </FormRight>
        </FormSection>
      </MainContent>
      {showDeleteModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>تأكيد الحذف</ModalHeader>
            <p>هل أنت متأكد من حذف هذا الموعد؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <ModalButtons>
              <ModalConfirmButton onClick={confirmDelete}>حذف</ModalConfirmButton>
              <ModalCancelButton onClick={() => setShowDeleteModal(false)}>إلغاء</ModalCancelButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </FormContainer>
  );
}

export default AppointmentForm;
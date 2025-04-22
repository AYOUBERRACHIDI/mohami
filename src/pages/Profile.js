import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import NavDash from '../components/NavDash';
import Sidebar from '../components/Sidebar';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaSave, FaEdit, FaLock } from 'react-icons/fa';

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
const ProfileContainer = styled.div`
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

const ProfileSection = styled.div`
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid #2e7d32;
  animation: ${css`${fadeIn} 0.8s ease-in-out forwards`};

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ProfileHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 1.5rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #333333;
  margin-bottom: 0.5rem;

  &::after {
    content: '${props => props.required ? '*' : ''}';
    color: #d32f2f;
    margin-right: 0.25rem;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #333333;
  background: ${props => (props.readOnly ? '#f5f5f5' : '#ffffff')};
  cursor: ${props => (props.readOnly ? 'not-allowed' : 'text')};

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
    font-size: 0.75rem;
    padding: 0.5rem;
  }
`;

const ErrorMessage = styled.p`
  font-size: 0.75rem;
  color: #d32f2f;
  margin-top: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => (props.primary ? '#2e7d32' : '#e0e0e0')};
  color: ${props => (props.primary ? '#ffffff' : '#333333')};
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: ${props => (props.primary ? '#1b5e20' : '#d0d0d0')};
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.5rem 1rem;
  }
`;

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [avocatId, setAvocatId] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('يرجى تسجيل الدخول أولاً');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/avocats/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Fetch profile error: Status ${response.status}, Message: ${errorData.error || 'No error message'}`);
        throw new Error(errorData.error || 'Failed to fetch profile');
      }

      const data = await response.json();
      setAvocatId(data._id);
      setFormData(prev => ({
        ...prev,
        nom: data.nom || '',
        prenom: data.prenom || '',
        email: data.email || '',
        telephone: data.telephone || '',
        adresse: data.adresse || '',
        ville: data.ville || '',
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('خطأ في جلب الملف الشخصي: ' + error.message);
      if (error.message.includes('Invalid token') || error.message.includes('No token provided') || error.message.includes('Avocat not found')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'nom':
        newErrors.nom = value.trim() ? '' : 'الاسم مطلوب';
        break;
      case 'prenom':
        newErrors.prenom = value.trim() ? '' : 'اللقب مطلوب';
        break;
      case 'email':
        newErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ''
          : 'البريد الإلكتروني غير صالح';
        break;
      case 'telephone':
        newErrors.telephone = /^\+?[1-9]\d{1,14}$/.test(value)
          ? ''
          : 'رقم الهاتف غير صالح';
        break;
      case 'adresse':
        newErrors.adresse = value.trim() ? '' : 'العنوان مطلوب';
        break;
      case 'ville':
        newErrors.ville = value.trim() ? '' : 'المدينة مطلوبة';
        break;
      case 'currentPassword':
        newErrors.currentPassword = value.trim() ? '' : 'كلمة المرور الحالية مطلوبة';
        break;
      case 'newPassword':
        newErrors.newPassword = value.length >= 6 ? '' : 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل';
        break;
      case 'confirmNewPassword':
        newErrors.confirmNewPassword = value === formData.newPassword ? '' : 'تأكيد كلمة المرور غير متطابق';
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = 'الاسم مطلوب';
    if (!formData.prenom.trim()) newErrors.prenom = 'اللقب مطلوب';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(formData.telephone)) {
      newErrors.telephone = 'رقم الهاتف غير صالح';
    }
    if (!formData.adresse.trim()) newErrors.adresse = 'العنوان مطلوب';
    if (!formData.ville.trim()) newErrors.ville = 'المدينة مطلوبة';
    if (formData.newPassword || formData.confirmNewPassword) {
      if (!formData.currentPassword.trim()) newErrors.currentPassword = 'كلمة المرور الحالية مطلوبة';
      if (formData.newPassword.length < 6) newErrors.newPassword = 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل';
      if (formData.confirmNewPassword !== formData.newPassword) newErrors.confirmNewPassword = 'تأكيد كلمة المرور غير متطابق';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('يرجى تسجيل الدخول أولاً');
        navigate('/login');
        return;
      }

      // Update profile fields
      const profileResponse = await fetch(`http://localhost:5000/api/avocats/${avocatId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          adresse: formData.adresse,
          ville: formData.ville,
        }),
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      // Update password if provided
      if (formData.currentPassword && formData.newPassword) {
        const passwordResponse = await fetch('http://localhost:5000/api/avocats/me/password', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        });

        if (!passwordResponse.ok) {
          const errorData = await passwordResponse.json();
          throw new Error(errorData.message || 'Failed to update password');
        }
      }

      const updatedAvocat = await profileResponse.json();
      setFormData(prev => ({
        ...prev,
        nom: updatedAvocat.nom,
        prenom: updatedAvocat.prenom,
        email: updatedAvocat.email,
        telephone: updatedAvocat.telephone,
        adresse: updatedAvocat.adresse,
        ville: updatedAvocat.ville,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
      toast.success('تم حفظ الملف الشخصي بنجاح');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('خطأ في تحديث الملف الشخصي: ' + error.message);
      if (error.message.includes('Invalid token') || error.message.includes('No token provided') || error.message.includes('Incorrect current password')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <ProfileContainer>
      <NavDash />
      <Sidebar />
      <MainContent>
        <ProfileSection>
          <ProfileHeader>الملف الشخصي</ProfileHeader>
          <FormGroup>
            <Label required>الاسم</Label>
            <Input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              readOnly={!isEditing}
              error={!!errors.nom}
            />
            {errors.nom && <ErrorMessage>{errors.nom}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label required>اللقب</Label>
            <Input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              readOnly={!isEditing}
              error={!!errors.prenom}
            />
            {errors.prenom && <ErrorMessage>{errors.prenom}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label required>البريد الإلكتروني</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              readOnly={!isEditing}
              error={!!errors.email}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label required>رقم الهاتف</Label>
            <Input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              readOnly={!isEditing}
              error={!!errors.telephone}
            />
            {errors.telephone && <ErrorMessage>{errors.telephone}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label required>العنوان</Label>
            <Input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleInputChange}
              readOnly={!isEditing}
              error={!!errors.adresse}
            />
            {errors.adresse && <ErrorMessage>{errors.adresse}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label required>المدينة</Label>
            <Input
              type="text"
              name="ville"
              value={formData.ville}
              onChange={handleInputChange}
              readOnly={!isEditing}
              error={!!errors.ville}
            />
            {errors.ville && <ErrorMessage>{errors.ville}</ErrorMessage>}
          </FormGroup>
          {isEditing && (
            <>
              <FormGroup>
                <Label required>كلمة المرور الحالية</Label>
                <Input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  error={!!errors.currentPassword}
                />
                {errors.currentPassword && <ErrorMessage>{errors.currentPassword}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>كلمة المرور الجديدة</Label>
                <Input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  error={!!errors.newPassword}
                />
                {errors.newPassword && <ErrorMessage>{errors.newPassword}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>تأكيد كلمة المرور الجديدة</Label>
                <Input
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  error={!!errors.confirmNewPassword}
                />
                {errors.confirmNewPassword && <ErrorMessage>{errors.confirmNewPassword}</ErrorMessage>}
              </FormGroup>
            </>
          )}
          <ButtonGroup>
            {isEditing ? (
              <ActionButton primary onClick={handleSave}>
                <FaSave style={{ marginLeft: '0.5rem' }} /> حفظ
              </ActionButton>
            ) : (
              <ActionButton primary onClick={handleEdit}>
                <FaEdit style={{ marginLeft: '0.5rem' }} /> تعديل
              </ActionButton>
            )}
          </ButtonGroup>
        </ProfileSection>
      </MainContent>
    </ProfileContainer>
  );
}

export default Profile;
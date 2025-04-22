import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// Styled Components
const SettingsContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  direction: rtl;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  font-size: 1rem;
  color: #374151;
  background: #f9fafb;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2e7d32;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.9rem;
  text-align: center;
`;

function Settings() {
  const [user, setUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:5000/api/avocats/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser({ ...response.data, password: '' }); // Password is not fetched, set to empty for form
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data');
        setLoading(false);
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const updateData = { ...user };
      if (!updateData.password) {
        delete updateData.password; // Don't send password if it's empty
      }

      await axios.put(
        `http://localhost:5000/api/avocats/${user._id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('تم تحديث المعلومات بنجاح');
      setIsSubmitting(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setIsSubmitting(false);
      console.error(err);
    }
  };

  if (loading) {
    return <SettingsContainer>جاري التحميل...</SettingsContainer>;
  }

  return (
    <SettingsContainer>
      <Title>الإعدادات</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>الاسم</Label>
          <Input
            type="text"
            name="nom"
            value={user.nom}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>اللقب</Label>
          <Input
            type="text"
            name="prenom"
            value={user.prenom}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>البريد الإلكتروني</Label>
          <Input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>رقم الهاتف</Label>
          <Input
            type="text"
            name="telephone"
            value={user.telephone}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>العنوان</Label>
          <Input
            type="text"
            name="adresse"
            value={user.adresse}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>المدينة</Label>
          <Input
            type="text"
            name="ville"
            value={user.ville}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>كلمة المرور الجديدة (اترك فارغًا إذا لم ترغب في التغيير)</Label>
          <Input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="أدخل كلمة المرور الجديدة"
          />
        </InputGroup>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </Form>
      <Toaster position="top-right" reverseOrder={false} />
    </SettingsContainer>
  );
}

export default Settings;
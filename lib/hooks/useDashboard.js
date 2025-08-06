// hooks/useDashboard.js
"use client";
import { useState } from 'react';
import { INITIAL_DATA } from '../data/mockData';

export const useDashboard = () => {
  const [activeTab, setActiveTab] = useState('technology');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState(INITIAL_DATA);
  const [formData, setFormData] = useState({});

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setFormData({});
  };

  const handleSubmit = () => {
    const newData = { ...data };
    
    if (modalType === 'create') {
      const newId = Math.max(...newData[activeTab].map(item => item.id)) + 1;
      newData[activeTab].push({ ...formData, id: newId });
    } else {
      const index = newData[activeTab].findIndex(item => item.id === selectedItem.id);
      newData[activeTab][index] = { ...formData };
    }
    
    setData(newData);
    closeModal();
  };

  const handleDelete = (id) => {
    const newData = { ...data };
    newData[activeTab] = newData[activeTab].filter(item => item.id !== id);
    setData(newData);
  };

  const filteredData = data[activeTab].filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return {
    // State
    activeTab,
    sidebarOpen,
    showModal,
    modalType,
    selectedItem,
    searchTerm,
    data,
    formData,
    filteredData,
    
    // Setters
    setActiveTab,
    setSidebarOpen,
    setSearchTerm,
    setFormData,
    
    // Actions
    openModal,
    closeModal,
    handleSubmit,
    handleDelete
  };
};
// hooks/useDashboardNew.js
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { INITIAL_DATA } from '../data/mockData';

export const useDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('team');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data management with localStorage
  const [data, setData] = useLocalStorage('dashboard-data', INITIAL_DATA);

  // Filtered data based on search
  const [filteredData, setFilteredData] = useState([]);

  // Update filtered data when search term or active tab changes
  useEffect(() => {
    const currentData = data[activeTab] || [];
    
    if (!searchTerm) {
      setFilteredData(currentData);
      return;
    }

    const filtered = currentData.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      
      switch (activeTab) {
        case 'team':
          return (
            item.name?.toLowerCase().includes(searchLower) ||
            item.position?.toLowerCase().includes(searchLower)
          );
        case 'technology':
          return item.name?.toLowerCase().includes(searchLower);
        case 'service':
          return (
            item.name?.toLowerCase().includes(searchLower) ||
            item.description?.toLowerCase().includes(searchLower)
          );
        case 'career':
          return (
            item.title?.toLowerCase().includes(searchLower) ||
            item.description?.toLowerCase().includes(searchLower)
          );
        default:
          return false;
      }
    });
    
    setFilteredData(filtered);
  }, [data, activeTab, searchTerm]);

  // CRUD operations
  const handleSubmit = (formData) => {
    try {
      const currentData = data[activeTab] || [];
      
      if (formData.id) {
        // Update existing item
        const updatedData = currentData.map(item =>
          item.id === formData.id ? { ...item, ...formData } : item
        );
        
        setData(prev => ({
          ...prev,
          [activeTab]: updatedData
        }));
      } else {
        // Create new item
        const newItem = {
          ...formData,
          id: Date.now() // Simple ID generation
        };
        
        setData(prev => ({
          ...prev,
          [activeTab]: [...currentData, newItem]
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  };

  const handleDelete = (id) => {
    try {
      const currentData = data[activeTab] || [];
      const updatedData = currentData.filter(item => item.id !== id);
      
      setData(prev => ({
        ...prev,
        [activeTab]: updatedData
      }));
      
      return true;
    } catch (error) {
      console.error('Error deleting data:', error);
      return false;
    }
  };

  // Reset search when changing tabs
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchTerm('');
  };

  return {
    // State
    activeTab,
    sidebarOpen,
    searchTerm,
    data,
    filteredData,
    
    // Setters
    setActiveTab: handleTabChange,
    setSidebarOpen,
    setSearchTerm,
    
    // Actions
    handleSubmit,
    handleDelete
  };
};


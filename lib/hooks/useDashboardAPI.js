// hooks/useDashboardAPI.js
import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('team');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState({
    team: [],
    technology: [],
    service: [],
    career: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtered data based on search
  const [filteredData, setFilteredData] = useState([]);

  // API endpoints mapping
  const endpoints = {
    team: 'teams',
    technology: 'technologies',
    service: 'services',
    career: 'careers'
  };

  // Fetch data from API
  const fetchData = async (type) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/${endpoints[type]}`);
      setData(prev => ({
        ...prev,
        [type]: response.data.data || response.data
      }));
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      setError(`Failed to fetch ${type} data`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const promises = Object.keys(endpoints).map(type => 
          api.get(`/${endpoints[type]}`)
            .then(response => ({ type, data: response.data.data || response.data }))
            .catch(error => ({ type, error }))
        );
        
        const results = await Promise.all(promises);
        
        const newData = {};
        results.forEach(result => {
          if (result.error) {
            console.error(`Error fetching ${result.type}:`, result.error);
            newData[result.type] = [];
          } else {
            newData[result.type] = result.data;
          }
        });
        
        setData(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

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
  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = endpoints[activeTab];
      let response;
      
      // Prepare form data for file upload
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      if (formData.id) {
        // Update existing item
        response = await api.put(`/admin/${endpoint}/${formData.id}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // Update local state
        setData(prev => ({
          ...prev,
          [activeTab]: prev[activeTab].map(item =>
            item.id === formData.id ? response.data.data || response.data : item
          )
        }));
      } else {
        // Create new item
        response = await api.post(`/admin/${endpoint}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // Update local state
        setData(prev => ({
          ...prev,
          [activeTab]: [...prev[activeTab], response.data.data || response.data]
        }));
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error saving data:', error);
      setError(error.response?.data?.message || 'Failed to save data');
      return { success: false, error: error.response?.data?.message || 'Failed to save data' };
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = endpoints[activeTab];
      await api.delete(`/admin/${endpoint}/${id}`);
      
      // Update local state
      setData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(item => item.id !== id)
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting data:', error);
      setError(error.response?.data?.message || 'Failed to delete data');
      return { success: false, error: error.response?.data?.message || 'Failed to delete data' };
    } finally {
      setLoading(false);
    }
  };

  // Reset search when changing tabs
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchTerm('');
    setError(null);
  };

  // Refresh data for current tab
  const refreshData = () => {
    fetchData(activeTab);
  };

  return {
    // State
    activeTab,
    sidebarOpen,
    searchTerm,
    data,
    filteredData,
    loading,
    error,
    
    // Setters
    setActiveTab: handleTabChange,
    setSidebarOpen,
    setSearchTerm,
    
    // Actions
    handleSubmit,
    handleDelete,
    refreshData,
    
    // Utilities
    clearError: () => setError(null)
  };
};


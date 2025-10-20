import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import UserNavbar from '../components/UserNavbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      currentUser.getSession((err, session) => {
        if (err) {
          console.error('Error getting session:', err);
          return;
        }
        currentUser.getUserAttributes((err, attributes) => {
          if (err) {
            console.error('Error getting user attributes:', err);
            return;
          }
          const userData = {};
          attributes.forEach(attr => {
            userData[attr.Name] = attr.Value;
          });
          setUser(userData);
          setFormData(userData);
        });
      });
    }
  }, []);

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = getCurrentUser();
  
    currentUser.getSession((err, session) => {
      if (err) {
        console.error('Error getting session:', err);
        return;
      }
  
      const attributes = [
        { Name: 'name', Value: formData.name },
        { Name: 'email', Value: formData.email },
        { Name: 'phone_number', Value: formData.phone_number }
      ];
  
      currentUser.updateAttributes(attributes, (err, result) => {
        if (err) {
          console.error('Error updating attributes:', err);
          return;
        }
        console.log('Attributes updated:', result);
        setUser(formData);
        setIsEditing(false);
      });
    });
  };
  

  if (!user) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <UserNavbar />
      <div className="space-y-8 p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          <br /><br />
          User Profile
        </h1>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Profile Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="border-b border-gray-700 pb-4">
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-lg text-white">{user.name}</p>
              </div>
              <div className="border-b border-gray-700 pb-4">
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-lg text-white">{user.email}</p>
              </div>
              <div className="border-b border-gray-700 pb-4">
                <p className="text-sm text-gray-400">Phone Number</p>
                <p className="text-lg text-white">{user.phone_number}</p>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            <Link 
              to="/dashboard" 
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
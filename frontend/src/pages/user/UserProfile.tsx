import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { User, Lock, Mail, Phone, Eye, EyeOff, CheckCircle, RefreshCw,  Save } from 'lucide-react';


import { formatDate } from 'date-fns';
import { apiGet, apiPut, userAPI } from '../../utils/api';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import type { UserProfileData } from '@/types/users';
import { useAuth } from '@/contexts/AuthContext';
// import type { BankingInfo } from '../../types';



interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}



const UserProfile: React.FC = () => {
  const { updateUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  // const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'banking'>('profile');
  // const [bankingInfo, setBankingInfo] = useState<BankingInfo | null>(null);
  // const [bankingLoading, setBankingLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });



  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    watch,
    reset: resetPassword
  } = useForm<PasswordFormData>();
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile
  } = useForm<UserProfileData>();


  
  const onProfileSubmit = async (data: UserProfileData) => {
    setLoading(true);
    try {
      // const response:any = await apiPut('/admin/profile', {name:data.name,phone:data.phone});

      const updatedData:any = {};
      if(data.accountNumber){
        if(!userProfile?.accountNumber || userProfile.accountNumber !==data.accountNumber )updatedData.accountNumber = data.accountNumber;
        if(!userProfile?.accountIfsc || userProfile.accountIfsc !==data.accountIfsc )updatedData.accountIfsc = data.accountIfsc;
      }
      if(data.upiId && data.upiId!== userProfile?.upiId){
        updatedData.upiId= data.upiId;
      }
      if(data.name!==userProfile?.name){
        updatedData.name = data.name;
      }
      if(data.phone!==userProfile?.phone){
        updatedData.phone = data.phone;
      }
      const response:any = await userAPI.updateProfile(updatedData)
      if (response.success) {
        toast.success('Profile updated successfully!');
        // Update both local state and auth context
        if (response.data) {
          setUserProfile(prev => prev ? { ...prev, ...response.data } : null);
          updateUser(response.data.user);
        }
        // Refresh profile data to get any server-side updates
        await fetchUserProfile();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  const newPassword = watch('newPassword');

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true);
      const response:any = await apiGet<UserProfileData>('/auth/me');
      if (response.success && response.data.user) {
        setUserProfile(response.data.user);
        resetProfile({
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone,
          upiId:response.data.user.upiId,
          accountNumber:response.data.user.accountNumber,
          accountIfsc:response.data.user.accountIfsc,
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch profile data');
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  const onPasswordSubmit = async (data: PasswordFormData) => {
    setLoading(true);
    try {
      const { confirmPassword, ...passwordData } = data;
      const response = await apiPut('/auth/change-password', passwordData);
      if (response.success) {
        toast.success('Password changed successfully!');
        resetPassword();
        // Clear password fields
        setShowPassword({ current: false, new: false, confirm: false });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message || error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };
  const refreshProfile = async () => {
    await fetchUserProfile();
    toast.success('Profile data refreshed!');
  };

  if (profileLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>
        <Button
          variant="outline"
          onClick={refreshProfile}
          className="flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              <User className="w-4 h-4 mr-2" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'password'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab==='profile'&& 
          <div className="max-w-2xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <p className="text-gray-600 mt-1">Update your personal information</p>
              </div>

              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  <div>
                    <Input
                      label="Full Name"
                      type="text"
                      leftIcon={<User className="w-4 h-4" />}
                      {...registerProfile('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                      error={profileErrors.name?.message}
                      placeholder="Enter your full name"
                    />
                  </div>

                 

                  <div className="">
                    <Input
                      label="Contact Information"
                      type="text"
                      leftIcon={<Phone className="w-4 h-4" />}
                      {...registerProfile('phone', {
                        required: 'Contact information is required',
                        minLength: {
                          value: 10,
                          message: 'Contact information must be at least 10 characters'
                        }
                      })}
                      error={profileErrors.phone?.message}
                      placeholder="Phone number or contact info"
                    />
                  </div>

                  <div>
                    <Input
                      label="Email Address"
                      type="email"
                      leftIcon={<Mail className="w-4 h-4" />} 
                      disabled
                      value ={userProfile?.email}
                      placeholder="Your email address"
                    />
                  </div>


                  <div className="">
                    <Input
                      label="UPI ID"
                      required
                      type="text"
                      {...registerProfile('upiId' , {
                        required:'UPI ID is required'
                      })}
                      error={profileErrors.upiId?.message}
                      placeholder="Enter UPI ID (optional)"
                    />
                  </div>
                <div className="">
                  <Input
                    label="Account Number"
                    type="text"
                    {...registerProfile('accountNumber')}
                    error={profileErrors.accountNumber?.message}
                    placeholder="Enter account number"
                  />
                </div>
                <div>


                  <Input
                    label="IFSC Code"
                    type="text"
                    {...registerProfile('accountIfsc')}
                    error={profileErrors.accountIfsc?.message}
                    placeholder="Enter IFSC code"
                    />
                    </div>

                
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Profile data fetched: {new Date().toLocaleTimeString()}
                  </div>
                  <Button
                    type="submit"
                    isLoading={loading}
                    className="min-w-[120px]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </form>
            </div> }

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="max-w-2xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                <p className="text-gray-600 mt-1">Update your password to keep your account secure</p>
              </div>

              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <Input
                    label="Current Password"
                    type={showPassword.current ? 'text' : 'password'}
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    {...registerPassword('currentPassword', {
                      required: 'Current password is required'
                    })}
                    error={passwordErrors.currentPassword?.message}
                    placeholder="Enter your current password"
                  />

                  <Input
                    label="New Password"
                    type={showPassword.new ? 'text' : 'password'}
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    {...registerPassword('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    error={passwordErrors.newPassword?.message}
                    placeholder="Enter your new password"
                  />

                  <Input
                    label="Confirm New Password"
                    type={showPassword.confirm ? 'text' : 'password'}
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    {...registerPassword('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value =>
                        value === newPassword || 'Passwords do not match'
                    })}
                    error={passwordErrors.confirmPassword?.message}
                    placeholder="Confirm your new password"
                  />
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Password Requirements</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      At least 6 characters long
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Should be different from current password
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Use a combination of letters, numbers, and symbols
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    isLoading={loading}
                    className="min-w-[120px]"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </form>
            </div>
          )}

         
        </div>
      </div>

      {/* Account Info Card */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Role</label>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-900 capitalize">{userProfile?.role || 'Admin'}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
            <p className="text-sm text-gray-900">
              {userProfile?.createdAt ? formatDate(new Date(userProfile.createdAt), 'MMMM d, yyyy') : 'N/A'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
            <p className="text-sm text-gray-900">
              {userProfile?.lastLogin ? formatDate(new Date(userProfile.lastLogin), 'MMMM d, yyyy') : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Data Source Info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Profile data fetched directly from server API
        </p>
      </div>
    </div>
  );
};

export default UserProfile;

import React, { useState } from 'react';
import { MOCK_USER } from '@/constants';
import { Mail, Shield, User as UserIcon, Camera, Smartphone, Edit2, X, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/lib/i18n';
import useUserStore from '@/store';
import { userProfile, accountData } from '@/types/auth/user';
import axios from 'axios';


export const UserProfile: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 2FA Modal State
  const [show2FA, setShow2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');

  // Form State
  const [formData, setFormData] = useState<userProfile>({
    name: MOCK_USER.name,
    email: MOCK_USER.email,
    role: MOCK_USER.role,
    phoneNumber: '13800000000', // Default placeholder
    nickname: MOCK_USER.name, // Default placeholder
    bio: 'Senior developer passionate about React and AI agents.', // Default placeholder
    password: '', // Should represent new password
  });


  // API call to update user profile
  const updateUserProfile = async (data: Partial<accountData>): Promise<accountData> => {
    const token = useUserStore.getState().bearerToken;
    const response = await axios.put('api/v1/users/me', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || ''
      }
    });
    return response.data;
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Cancel edit: reset specific sensitive fields if needed
      setFormData(prev => ({ ...prev, password: '' }));
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const initiateSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password) {
      // If password field is filled, trigger 2FA
      setShow2FA(true);
    } else {
      // Normal save without password change
      await performSave();
    }
  };

  const verifyAndSave = async () => {
    if (twoFACode.length < 4) {
      alert('Please enter a valid code');
      return;
    }
    // Simulate verification
    setTimeout(async () => {
      setShow2FA(false);
      setTwoFACode('');
      setFormData(prev => ({ ...prev, password: '' })); // Clear password after save
      await performSave();
    }, 800);
  };

  const performSave = async () => {
    setIsSaving(true);
    // Save current form data in case we need to revert
    const previousFormData = { ...formData };
    
    try {
      // Prepare data to match accountData interface
      const updateData: Partial<accountData> = {
        name: formData.name,
        phoneNumber: formData.phone || '',
        bio: formData.bio || null,
        email: formData.email
      };
      
      // Only include password if it's not empty
      if (formData.password) {
        // In a real app, you would handle password updates separately
        // For now, we'll just clear it from the form data
        (updateData as any)['password'] = formData.password;
      }
      
      // Call the API to update user profile
      const updatedAccountData = await updateUserProfile(updateData);
      
      // Update Zustand store with the new data
      useUserStore.getState().setAccountData(updatedAccountData);
      
      // Update local state
      setIsSaving(false);
      setIsEditing(false);
      
      alert(language === 'en' ? 'Settings saved successfully!' : '设置已保存！');
    } catch (error) {
      // Revert to previous form data on error
      setFormData(previousFormData);
      
      // Show error message
      console.error('Failed to save profile:', error);
      alert(language === 'en' ? 'Failed to save settings. Please try again.' : '设置保存失败，请重试。');
      
      setIsSaving(false);
    }
  };


  // Subscribe to accountData changes from the store
  const accountData = useUserStore(state => state.accountData);
  console.log(accountData);
  React.useEffect(() => {
    // Always run on first mount and when accountData changes
    if (accountData) {
      setFormData({
        name: accountData.name,
        email: accountData.email,
        role: MOCK_USER.role,
        phone: accountData.phoneNumber,
        nickname: accountData.name,
        bio: accountData.bio,
        password: '', // Don't show password in form
      })
    }
    // If accountData is null but we have stored data, we could load from localStorage here
    // This ensures the effect runs at least once on mount
  }, [accountData]);


  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in relative">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">{t.profile.title}</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-6">
              <div className="relative group">
                <img 
                  src={MOCK_USER.avatar} 
                  alt="Profile" 
                  className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md object-cover"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors cursor-pointer z-10">
                    <Camera className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="mb-1">
                <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
                <p className="text-gray-500">{formData.role.replace('_', ' ')}</p>
              </div>
            </div>
            <Button 
              variant={isEditing ? 'secondary' : 'primary'} 
              size="sm" 
              onClick={toggleEdit}
              className="flex items-center gap-2"
            >
              {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              {isEditing ? t.profile.cancelEdit : t.profile.editProfile}
            </Button>
          </div>

          <form onSubmit={initiateSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Account Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                   <UserIcon className="h-5 w-5 text-gray-400" /> {t.profile.accountInfo}
                </h3>
                
                <Input
                  label={t.common.fullName}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed" : ""}
                />

                <Input
                  label={t.profile.nickname}
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed" : ""}
                />

                <Input
                  label={t.common.email}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true} // Email usually requires a separate process to change
                  className="bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed"
                  icon={<Mail className="h-4 w-4 text-gray-400" />}
                />

                <div className="w-full">
                   <label className="block text-sm font-medium text-gray-700 mb-1">
                     {t.profile.bio}
                   </label>
                   <textarea
                     name="bio"
                     rows={4}
                     value={formData.bio}
                     onChange={handleChange}
                     disabled={!isEditing}
                     className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                       !isEditing ? 'bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed' : 'border-gray-300'
                     }`}
                   />
                </div>
              </div>

              {/* Right Column: Private Details & Preferences */}
              <div className="space-y-8">
                {/* Private Details */}
                <div className="space-y-6">
                   <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                     <Shield className="h-5 w-5 text-gray-400" /> {t.profile.personalDetails}
                   </h3>

                   <Input
                      label={t.profile.telephone}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed" : ""}
                      icon={<Smartphone className="h-4 w-4 text-gray-400" />}
                    />
                   
                   <Input
                      label={t.profile.role}
                      value={formData.role.replace('_', ' ').toUpperCase()}
                      disabled={true}
                      className="bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed capitalize"
                    />
                </div>

                {/* Security Section (Only in Edit Mode) */}
                {isEditing && (
                  <div className="space-y-6 animate-fade-in">
                    <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2 text-primary-600">
                      <Lock className="h-5 w-5" /> {t.profile.security}
                    </h3>
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                       <Input
                         label={t.profile.newPassword}
                         type="password"
                         name="password"
                         value={formData.password}
                         onChange={handleChange}
                         placeholder={t.profile.newPasswordPlaceholder}
                         className="bg-white"
                       />
                       <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                         <Shield className="h-3 w-3" />
                         {t.profile.twoFaDesc}
                       </p>
                    </div>
                  </div>
                )}

                {/* Preferences */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold border-b pb-2">{t.profile.preferences}</h3>
                  
                  {/* Language Switcher */}
                  <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{t.profile.language}</span>
                    <select
                      value={language}
                      disabled={!isEditing}
                      onChange={(e) => setLanguage(e.target.value as 'en' | 'zh')}
                      className={`bg-white border text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2 outline-none ${!isEditing ? 'border-transparent appearance-none bg-transparent' : 'border-gray-300'}`}
                    >
                      <option value="en">English</option>
                      <option value="zh">中文 (Chinese)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{t.profile.emailNotifications}</span>
                    <input type="checkbox" defaultChecked disabled={!isEditing} className="h-4 w-4 text-primary-600 rounded border-gray-300 disabled:opacity-50" />
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4 flex justify-end">
                      <Button size="lg" type="submit" disabled={isSaving}>
                        {isSaving ? t.common.processing : t.profile.saveChanges}
                      </Button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* 2FA Modal */}
      {show2FA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShow2FA(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-fade-in-up">
             <div className="flex flex-col items-center text-center mb-6">
                <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                   <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{t.profile.twoFaTitle}</h3>
                <p className="text-sm text-gray-500 mt-2">{t.profile.twoFaDesc}</p>
             </div>

             <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center text-sm border border-gray-200">
                   <span className="text-gray-500">{t.profile.verificationSent}</span>
                   <div className="font-mono font-bold text-gray-900 text-lg mt-1">{formData.phone || '138****0000'}</div>
                </div>

                <Input
                   placeholder="0000"
                   className="text-center text-2xl tracking-widest font-mono"
                   maxLength={6}
                   value={twoFACode}
                   onChange={(e) => setTwoFACode(e.target.value)}
                />

                <Button fullWidth onClick={verifyAndSave} disabled={isSaving}>
                   {isSaving ? t.common.processing : t.profile.verify}
                </Button>
                
                <button 
                  onClick={() => setShow2FA(false)}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {t.common.cancel}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

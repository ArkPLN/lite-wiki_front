// UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { Mail, Shield, User as UserIcon, Camera, Smartphone, Edit2, X, Lock, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/lib/i18n';
import useUserStore from '@/store'; // 引入你的 Zustand store
import { accountData } from '@/types/auth/user';
import axios from 'axios';

// 本地表单状态接口 (移除了 nickname)
interface LocalUserProfile {
  name: string;
  email: string;
  role: string;
  phone: string;
  bio: string | null;
  password: string | null;
}

export const UserProfile: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 2FA Modal State
  const [show2FA, setShow2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');

  // Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Zustand: 获取设置方法和当前数据
  const { setAccountData, accountData: storeAccountData } = useUserStore();

  // Form State: 初始化为空，等待数据拉取
  const [formData, setFormData] = useState<LocalUserProfile>({
    name: '',
    email: '',
    role: 'user', // 始终为 user
    phone: '',
    bio: '',
    password: '',
  });

  // 获取 Token 辅助函数
  const getToken = () => localStorage.getItem('token') || useUserStore.getState().bearerToken || '';

  // ---------------------------------------------------------------------------
  // 核心逻辑 1: 获取用户信息并同步全局状态 (GET /api/v1/auth/me)
  // ---------------------------------------------------------------------------
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = getToken();

      if (!token) {
        console.error("No token found");
        setIsLoading(false);
        return;
      }

      // 使用 /auth/me 接口，它不需要 ID，只需要 Token
      // 这解决了 "User ID missing" 的问题，并且能获取最新数据
      const response = await axios.get<accountData>('api/v1/auth/me', {
        headers: {
          'Authorization': token
        }
      });

      const latestUserData = response.data;

      // [关键点]：请求成功后，立即同步更新 Zustand 全局状态
      setAccountData(latestUserData);

      // 同步更新本地表单状态
      setFormData({
        name: latestUserData.name || '',
        email: latestUserData.email || '',
        role: 'user', // 强制
        phone: latestUserData.phoneNumber || '',
        bio: latestUserData.bio || '',
        password: '', // 密码字段默认清空
      });

    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // 可以在这里处理 Token 过期跳转登录等逻辑
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 核心逻辑 2: 更新用户信息 (PUT /api/v1/users/me)
  // ---------------------------------------------------------------------------
  const updateUserProfile = async (data: any): Promise<accountData> => {
    const token = getToken();
    const response = await axios.put('api/v1/users/me', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });
    return response.data;
  };

  // Effect: 组件挂载时立即执行一次数据拉取
  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空依赖数组确保只在挂载时执行一次

  const toggleEdit = () => {
    if (isEditing && storeAccountData) {
      // 取消编辑：从全局 Store 回滚数据，防止未保存的修改残留
      setFormData(prev => ({
        ...prev,
        name: storeAccountData.name,
        phone: storeAccountData.phoneNumber,
        bio: storeAccountData.bio,
        password: ''
      }));
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
      setShow2FA(true);
    } else {
      await performSave();
    }
  };

  const verifyAndSave = async () => {
    if (twoFACode.length < 4) {
      alert('Please enter a valid code');
      return;
    }
    setTimeout(async () => {
      setShow2FA(false);
      setTwoFACode('');
      setFormData(prev => ({ ...prev, password: '' }));
      await performSave();
    }, 800);
  };

  const performSave = async () => {
    setIsSaving(true);
    const previousFormData = { ...formData };
    
    try {
      // 构建符合 API 要求的 Payload
      // 假设 storeAccountData 已在 fetchUserData 中被填充
      const currentAvatar = storeAccountData?.avatar || null;

      const payload = {
        name: formData.name,
        email: formData.email, 
        avatar: currentAvatar, // 保持原头像
        phoneNumber: formData.phone || '',
        bio: formData.bio || null,
        password: formData.password ? formData.password : null
      };
      
      // 发送更新请求
      const updatedAccountData = await updateUserProfile(payload);
      
      // [关键点]：更新成功后，再次同步 Zustand 全局状态
      setAccountData(updatedAccountData);
      
      // 更新本地状态
      setFormData(prev => ({
        ...prev,
        name: updatedAccountData.name,
        phone: updatedAccountData.phoneNumber,
        bio: updatedAccountData.bio,
        email: updatedAccountData.email,
        password: ''
      }));

      setIsSaving(false);
      setIsEditing(false);
      
      alert(language === 'en' ? 'Settings saved successfully!' : '设置已保存！');
    } catch (error) {
      // 失败回滚
      setFormData(previousFormData);
      console.error('Failed to save profile:', error);
      alert(language === 'en' ? 'Failed to save settings. Please try again.' : '设置保存失败，请重试。');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

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
                  // 优先使用 Store 中的头像，其次使用 UI Avatars 生成的占位图
                  src={storeAccountData?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=random`} 
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
                <p className="text-gray-500">{formData.role.toUpperCase()}</p>
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

                {/* Nickname 字段已移除 */}

                <Input
                  label={t.common.email}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  // Email 不允许修改
                  disabled={true} 
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
                     value={formData.bio || ''}
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
                      value={formData.role.toUpperCase()}
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
                         value={formData.password || ''}
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
                  
                  {/* Delete Account Button */}
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full flex items-center justify-center gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                      {t.profile.deleteAccount}
                    </Button>
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

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fade-in-up">
             <div className="flex flex-col items-center text-center mb-6">
                <div className="h-14 w-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                   <AlertTriangle className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{t.profile.deleteAccountTitle}</h3>
                <p className="text-sm text-gray-500 mt-2">{t.profile.deleteAccountDesc}</p>
             </div>

             <div className="space-y-4">
                <div className="bg-red-50 p-3 rounded-lg text-center text-sm border border-red-100">
                   <p className="text-red-600 font-medium">{t.profile.deleteAccountWarning}</p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    fullWidth 
                    onClick={() => {
                      alert(t.profile.deleteAccountSuccess);
                      setShowDeleteModal(false);
                    }}
                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                  >
                    {t.profile.confirmDelete}
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    fullWidth 
                    onClick={() => setShowDeleteModal(false)}
                  >
                    {t.common.cancel}
                  </Button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
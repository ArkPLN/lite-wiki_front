
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, CheckCircle, Mail, Smartphone, VenetianMask } from 'lucide-react';
import { Button as CustomButton } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ROUTES, APP_NAME } from '../constants';
import { useLanguage } from '../lib/i18n';
import {Dialog, DialogContent ,DialogTitle, DialogActions, DialogContentText, Button} from '@mui/material';
import axios from 'axios';
type AuthMethod = 'email' | 'phone';
type RegisterFormData = {
  name: string;
  email: string;
  phoneNumber: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
};
export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [modelShow, setModelShow] = useState(false);
  const [modelMessage, setModelMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const { t } = useLanguage();

  const registerUser = async (formData: RegisterFormData) => {
    // 生成一个标准的11位中国手机号码
    const generateRandomPhone = () => {
      // 中国手机号规则：1开头，第二位是3-9之间的数字，后面9位是0-9的随机数字
      const secondDigit = Math.floor(Math.random() * 7) + 3; // 3-9之间的数字
      let phoneNumber = '1' + secondDigit;
      
      // 生成剩余的9位数字
      for (let i = 0; i < 9; i++) {
        phoneNumber += Math.floor(Math.random() * 10); // 0-9之间的数字
      }
      
      return phoneNumber;
    };
    
    // 如果用户没有提供手机号，则生成一个随机手机号
    const phoneNumber = formData.phoneNumber || generateRandomPhone().toString();
    
    try {
      const response = await axios.post('api/v1/auth/register', {
        name: formData.name,
        email: formData.email,
        phoneNumber: phoneNumber,
        password: formData.password
      });
      return response.data;
    } catch (error) {
      // 处理不同的错误状态码
      if (error.response) {
        // 打印详细的错误信息
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        
        switch (error.response.status) {
          case 400:
            // 尝试从响应中获取更具体的错误信息
            const errorMessage = error.response.data?.message || error.response.data?.error || '无效的请求参数';
            setModelMessage(`注册失败: ${errorMessage}`);
            break;
          case 409:
            setModelMessage('邮箱或手机号已被注册');
            break;
          default:
            setModelMessage('注册失败，请重试');
        }
      } else {
        setModelMessage('网络错误，请稍后重试');
      }
      console.error('Registration failed:', error);
      throw error;
    }
  };


  // Form State 表单数据
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    verificationCode: '',
    password: '',
    confirmPassword: ''
  });

  // SMS Timer State
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: number;
    if (timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 表单验证
    const regEmail = formData.email;
    const regPassword = formData.password;
    
    if(!regEmail || !regPassword) {
      setModelMessage('请填写所有字段');
      setModelShow(true);
      setLoading(false);
      return;
    };
    
    if(regPassword !== formData.confirmPassword) {
      setModelMessage('两次密码输入不一致');
      setModelShow(true);
      setLoading(false);
      return;
    };
    
    // 如果使用手机号注册，需要验证验证码
    if (authMethod === 'phone' && !formData.verificationCode) {
      setModelMessage('请输入验证码');
      setModelShow(true);
      setLoading(false);
      return;
    }
    
    try {
      // 调用注册API
      await registerUser(formData);
      setModelMessage('注册成功！');
      setModelShow(true);
      
      // 延迟跳转到登录页面
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 1500);
    } catch (error) {
      console.error('Registration failed:', error);
      setModelMessage('注册失败，请重试');
      setModelShow(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendCode = () => {
    if (!formData.phone) return;
    setTimer(60); // Start 60s cooldown
    // Simulate SMS API call
    console.log(`Sending code to ${formData.phone}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Visual (Different from Login) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 animate-fade-in bg-linear-500"  />
        
        {/* Abstract shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob" style={{ animationDelay: '4s' }}></div>

        <div className="relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-3 text-white/90">
            <BookOpen className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight">{APP_NAME}</span>
          </div>
        </div>
        
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Join the community.</h2>
          <div className="space-y-6">
            <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex-shrink-0 mt-1">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Centralized Knowledge</h3>
                <p className="text-slate-400">Stop digging through email chains. Everything is here.</p>
              </div>
            </div>
            <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex-shrink-0 mt-1">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI-Powered</h3>
                <p className="text-slate-400">Let AI handle the summaries and drafting.</p>
              </div>
            </div>
            <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex-shrink-0 mt-1">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Free for Education</h3>
                <p className="text-slate-400">Perfect for student groups and clubs.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-sm text-slate-500 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 bg-white overflow-y-auto">
        <div className="w-full max-w-sm mx-auto py-8">
            <Link to={ROUTES.HOME} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-transform hover:-translate-x-1 duration-200">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t.common.backToHome}
            </Link>

          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.common.createAccount}</h1>
            <p className="text-gray-600">
              Already have an account? {' '}
              <Link to={ROUTES.LOGIN} className="text-primary-600 font-medium hover:text-primary-500 hover:underline transition-all">
                {t.common.login}
              </Link>
            </p>
          </div>

          {/* Auth Method Tabs */}
          <div className="flex border-b border-gray-200 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-2 ${
                authMethod === 'email'
                  ? 'border-primary-600 text-primary-600 bg-primary-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Mail className="h-4 w-4" />
              {t.common.registerMethodEmail}
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-2 ${
                authMethod === 'phone'
                  ? 'border-primary-600 text-primary-600 bg-primary-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              {t.common.registerMethodPhone}
            </button>
          </div>
                {/* 用户尝试使用第三方登录时,弹窗提醒用户 */}
                          <Dialog
                            open={modelShow}
                            onClose={() => setModelShow(false)}
                            aria-labelledby="register-dialog-title"
                            aria-describedby="register-dialog-description"
                          >
                            {(() => {
                            
                              return (
                                <>
                                  <DialogTitle id="register-dialog-title">
                                    提示
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="register-dialog-description"> 
                                      {modelMessage}
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={() => setModelShow(false)} autoFocus sx={{flex: 1}}>
                                      好的
                                    </Button>
                                  </DialogActions>
                                </>
                              );
                            })()}
                          </Dialog>
          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="group">
                <Input
                label={t.common.fullName}
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="transition-all duration-200 group-hover:border-primary-300"
                />
            </div>

            {authMethod === 'email' ? (
              <div className="animate-fade-in">
                  <Input
                    label={t.common.email}
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="transition-all duration-200 hover:border-primary-300"
                  />
              </div>
            ) : (
              <div className="animate-fade-in space-y-5">
                <Input
                  label={t.common.phoneNumber}
                  type="tel"
                  name="phone"
                  placeholder={t.common.phonePlaceholder}
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <div className="space-y-1">
                   <label className="block text-sm font-medium text-gray-700">
                     {t.common.verificationCode}
                   </label>
                   <div className="flex gap-2">
                     <div className="flex-1">
                       <Input
                         type="text"
                         name="verificationCode"
                         placeholder={t.common.codePlaceholder}
                         value={formData.verificationCode}
                         onChange={handleChange}
                         required
                       />
                     </div>
                     <CustomButton 
                       type="button" 
                       variant="secondary" 
                       onClick={handleSendCode}
                       disabled={timer > 0 || !formData.phone}
                       className="w-32 flex-shrink-0"
                     >
                       {timer > 0 ? t.common.resendCode.replace('{time}', timer.toString()) : t.common.sendCode}
                     </CustomButton>
                   </div>
                   {timer > 0 && (
                     <p className="text-xs text-green-600 flex items-center gap-1 mt-1 animate-fade-in">
                       <CheckCircle className="h-3 w-3" /> {t.common.codeSent}
                     </p>
                   )}
                </div>
              </div>
            )}
            
            <Input
              label={t.common.password}
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              className="transition-all duration-200 hover:border-primary-300"
            />

            <Input
              label={t.common.confirmPassword}
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="transition-all duration-200 hover:border-primary-300"
            />
            {/* 注册按钮 */}
            <CustomButton type="submit" fullWidth disabled={loading} className="mt-2 transform transition-all active:scale-95 shadow-md hover:shadow-lg">
              {loading ? t.common.processing : t.common.createAccount}
            </CustomButton>
          </form>

          <div className="mt-4 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
             <CustomButton 
                variant="outline" 
                fullWidth 
                to={ROUTES.ANONYMOUS_LOGIN}
                className="border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
             >
                <VenetianMask className="h-4 w-4" />
                {t.common.continueAsGuest}
             </CustomButton>
          </div>
          
          <p className="mt-6 text-xs text-center text-gray-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {t.common.agreeToTerms}
          </p>
        </div>
      </div>
    </div>
  );
};
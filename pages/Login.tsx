
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, VenetianMask } from 'lucide-react';
import { Button as CustomButton } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ROUTES, APP_NAME } from '../constants';
import { useLanguage } from '../lib/i18n';
import axios from 'axios';
import {loginRequest} from '@/types/auth/user';
import useUserStore from '@/store';
import { useMutation } from '@tanstack/react-query';



interface DialogContent{
  id: number;
  title: string;
  content: string;
  buttonText?: string;
  subText?: string;

}



export const Login: React.FC = () => {  
  const navigate = useNavigate();
  const [modelShow, setModelShow] = useState(false);
  // 登录按钮是否禁用
  const [loginDisabled, setLoginDisabled] = useState(false);
  const [currentDialogId, setCurrentDialogId] = useState<number>(1);
  const { t } = useLanguage();
  // 保存用户的登录数据
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  })<loginRequest>;

  const [dialogContent, setDialogContent] = useState<DialogContent[]>([
    {
      id: 2,
      title: 'Google 登录',
      content: '我们尚未开通使用Google的授权登录方式，请您注册账号再使用，感谢！',
      buttonText: '确定'
    },
    {
      id: 3,
      title: 'GitHub 登录',
      content: '我们尚未开通使用Github的授权登录方式，请您注册账号再使用，感谢！',
      buttonText: '确定'
    },
    {
      id: 4,
      title: '登录提示',
      content: '账号或密码有误，请重新输入！',
      buttonText: '好的'
    },
    {
      id: 5,
      title: '登录成功',
      content: '您已成功登录！正在跳转到主页...',
      buttonText: '确定'
    }
  ]);

  const handleThirdLogin = (id: number) => {
    setCurrentDialogId(id);
    setModelShow(true);
    setLoginDisabled(true);
  };

  const handleClose = () => {
    setModelShow(false);
    setLoginDisabled(false);
  };


  const handleLoginSuccess = () => {
    // Navigate to the Overview page explicitly
    navigate(ROUTES.DASHBOARD.OVERVIEW);
  };

  // 创建登录函数供 useMutation 使用
  const loginMutation = useMutation({
    mutationFn: async (loginData: loginRequest) => {
      const response = await axios.post('api/v1/auth/login', loginData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    },
    onMutate: () => {
      // 在发起请求前设置登录按钮为禁用状态
      setLoginDisabled(true);
    },
    onSuccess: (data) => {
      // 登录成功
      console.log('登录成功:', data);
      // 存储token或其他用户信息
      if (data.token) {
        localStorage.setItem('token', `Bearer ${data.token}`);
        useUserStore.setState({ bearerToken: `Bearer ${data.token}` });
      }
      
      // 显示成功消息
      handleThirdLogin(5);
      
      // 延迟后跳转到仪表板
      setTimeout(() => {
        handleLoginSuccess();
      }, 500);
    },
    onError: (error: any) => {
      console.error('登录错误:', error);
      
      // 处理错误响应
      let errorMessage = '登录失败，请检查您的凭据';
      
      if (error.response) {
        // 服务器返回了错误响应
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          errorMessage = data?.message || '无效的请求参数';
        } else if (status === 401) {
          errorMessage = data?.message || '账号或密码有误，请重新输入';
        } else if (status === 404) {
          errorMessage = data?.message || '用户不存在';
        } else if (status === 429) {
          errorMessage = '登录尝试次数过多，请稍后再试';
        } else {
          errorMessage = data?.message || `服务器错误 (${status})`;
        }
      } else if (error.request) {
        // 请求已发出但没有收到响应
        errorMessage = '无法连接到服务器，请检查网络连接';
      }
      
      // 更新对话框内容显示具体错误
      const updatedDialogContent = dialogContent.map(item => 
        item.id === 4 ? { ...item, content: errorMessage } : item
      );
      setDialogContent(updatedDialogContent);
      
      // 显示错误消息
      handleThirdLogin(4);
    },
    onSettled: () => {
      // 无论成功或失败，都要在请求结束后启用登录按钮
      setLoginDisabled(false);
    }
  });

  

  





  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 使用 useMutation 进行登录
    loginMutation.mutate({
      emailOrPhone: formData.email,
      password: formData.password
    } as loginRequest);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-primary-600 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 animate-fade-in bg-linear-500 " />

        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-400 opacity-20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-3 text-white/90">
            <BookOpen className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight " >{APP_NAME}</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-4xl font-bold mb-6">{t.common.welcomeBack}</h2>
          <p className="text-primary-100 text-lg leading-relaxed">
            "Lite-Wiki彻底改变了我们学生组织管理活动文档的方式。其人工智能功能堪称颠覆性变革。"
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm" />
            <div>
              <p className="font-semibold">Sarah Chen</p>
              <p className="text-sm text-primary-200">President, Tech Club</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-sm text-primary-200 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 bg-white relative">
        <div className="w-full max-w-sm mx-auto">
          <Link to={ROUTES.HOME} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-transform hover:-translate-x-1 duration-200">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t.common.backToHome}
          </Link>

          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.common.signIn}</h1>
            <p className="text-gray-600">
              New to {APP_NAME}? {' '}
              <Link to={ROUTES.REGISTER} className="text-primary-600 font-medium hover:text-primary-500 hover:underline transition-all">
                {t.common.createAccount}
              </Link>
            </p>
          </div>

          

          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="group">
              <Input
                label={t.common.email}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="transition-all duration-200 group-hover:border-primary-300"
              />
            </div>

            <div className="group">
              <Input
                label={t.common.password}
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="transition-all duration-200 group-hover:border-primary-300"
              />
              <div className="flex justify-end mt-1">
                <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm text-primary-600 hover:text-primary-500 hover:underline">
                  {t.common.forgotPassword}
                </Link>
              </div>
            </div>

            <CustomButton type="submit" fullWidth disabled={loginDisabled} className="transform transition-all active:scale-95 shadow-md hover:shadow-lg">
              {loginDisabled ? t.common.loading : t.common.login}
            </CustomButton>
          </form>

          <div className="mt-4 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
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

          <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t.common.orContinueWith}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <CustomButton variant="secondary" className="w-full transform transition-transform hover:-translate-y-0.5" onClick={() => handleThirdLogin(2)} type="button">
                Google
              </CustomButton>
              <CustomButton variant="secondary" className="w-full transform transition-transform hover:-translate-y-0.5" onClick={() => handleThirdLogin(3)} type="button">
                GitHub
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
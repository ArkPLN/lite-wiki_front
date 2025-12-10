
import React from 'react';
import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Portal } from './pages/Portal';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { AnonymousLogin } from './pages/AnonymousLogin'; // Import
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Overview } from './pages/dashboard/Overview';
import { Editor } from './pages/dashboard/Editor';
import { Community } from './pages/dashboard/Community'; 
import { KnowledgeCenter } from './pages/dashboard/KnowledgeCenter'; 
import { UserProfile } from './pages/dashboard/UserProfile';
import { Team } from './pages/dashboard/Team';
import { Forum } from './pages/dashboard/team/Forum';
import { TeamWiki } from './pages/dashboard/team/TeamWiki';
import { Directory } from './pages/dashboard/team/Directory';
import { Management } from './pages/dashboard/team/Management';
import { Favorites } from './pages/dashboard/Favorites';
import { Recent } from './pages/dashboard/Recent';
import { Trash } from './pages/dashboard/Trash';
import { Notifications } from './pages/dashboard/Notifications';
import { Welcome } from './pages/dashboard/Welcome'; // Import
import { ROUTES } from './constants';
import { LanguageProvider } from './lib/i18n';
import { queryClient } from './lib/queryClient';

const router = createHashRouter([
  {
    path: ROUTES.HOME,
    element: <Portal />,
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />,
  },
  {
    path: ROUTES.ANONYMOUS_LOGIN, // New Route
    element: <AnonymousLogin />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: ROUTES.DASHBOARD.ROOT,
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD.OVERVIEW} replace />,
      },
      {
        path: "welcome", // New Route
        element: <Welcome />,
      },
      {
        path: "overview",
        element: <Overview />,
      },
      {
        path: "documents",
        element: <Editor />,
      },
      {
        path: "community", 
        element: <Community />,
      },
      {
        path: "knowledge", 
        element: <KnowledgeCenter />,
      },
      {
        path: "profile",
        element: <UserProfile />,
      },
      {
        path: "team",
        element: <Team />,
        children: [
          {
             path: "forum",
             element: <Forum />
          },
          {
             path: "wiki",
             element: <TeamWiki />
          },
          {
             path: "directory",
             element: <Directory />
          },
          {
             path: "management",
             element: <Management />
          }
        ]
      },
      {
        path: "favorites",
        element: <Favorites />,
      },
      {
        path: "recent",
        element: <Recent />,
      },
      {
        path: "trash",
        element: <Trash />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={ROUTES.HOME} replace />,
  }
]);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
import React from 'react';
import {
  Bot,
  FolderTree,
  Users,
  Layout,
  ShieldCheck,
  Search,
  ArrowRight,
  Zap,
  Cpu,
  Share2,
  BookOpen,
  VenetianMask
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../constants';
import { FeatureCardProps } from '../types';
import { useLanguage } from '../lib/i18n';
import axios from 'axios';
/* =========================================
   Component: FeatureCard
   Description: Displays a single feature with an icon, title, and description.
   Added hover effects for interactivity.
   ========================================= */
const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default group">
    <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

/* =========================================
   Page: Portal (Home)
   Description: The main landing page including Hero, Features, Deep Dive, and About sections.
   ========================================= */
export const Portal: React.FC = () => {
  const { t } = useLanguage();
  const [stats, updateStats] = React.useState<number>(0);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* 
         SECTION: Hero
         Description: Main visual introduction with gradient background and floating animations.
      */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10 animate-fade-in" />

        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mb-8 animate-fade-in-up">
            <Zap className="h-4 w-4" />
            <span>{t.hero.newFeature}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {t.hero.title}
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" className="group shadow-lg shadow-primary-500/30" to={ROUTES.REGISTER}>
              {t.hero.startFree}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="secondary" size="lg" to={ROUTES.LOGIN}>
              {t.hero.liveDemo}
            </Button>
          </div>

          <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button
              variant="ghost"
              size="sm"
              to={ROUTES.ANONYMOUS_LOGIN}
              className="text-gray-500 hover:text-gray-900"
            >
              <VenetianMask className="h-4 w-4 mr-2" />
              {t.common.continueAsGuest}
            </Button>
          </div>
        </div>
      </section>

      {/* 
         SECTION: Features Grid
         Description: High-level overview of 6 key features.
      */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              <i className="fa-solid fa-sync fa-spin-pluse"></i>
              {t.portal.featuresGrid.header}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t.portal.featuresGrid.subHeader}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            <FeatureCard
              title={t.portal.featuresGrid.structuredKnowledge.title}
              description={t.portal.featuresGrid.structuredKnowledge.desc}
              icon={<FolderTree className="h-6 w-6" />}
            />
            <FeatureCard
              title={t.portal.featuresGrid.aiCopilot.title}
              description={t.portal.featuresGrid.aiCopilot.desc}
              icon={<Bot className="h-6 w-6" />}
            />
            <FeatureCard
              title={t.portal.featuresGrid.realTimeEditor.title}
              description={t.portal.featuresGrid.realTimeEditor.desc}
              icon={<Layout className="h-6 w-6" />}
            />
            <FeatureCard
              title={t.portal.featuresGrid.teamHub.title}
              description={t.portal.featuresGrid.teamHub.desc}
              icon={<Users className="h-6 w-6" />}
            />
            <FeatureCard
              title={t.portal.featuresGrid.smartDashboard.title}
              description={t.portal.featuresGrid.smartDashboard.desc}
              icon={<Search className="h-6 w-6" />}
            />
            <FeatureCard
              title={t.portal.featuresGrid.securePrivate.title}
              description={t.portal.featuresGrid.securePrivate.desc}
              icon={<ShieldCheck className="h-6 w-6" />}
            />
          </div>

          {/* 
             SECTION: Deep Dive Feature Details
             Description: Alternating layout (Left text/Right Image, Right text/Left Image) for major features.
          */}
          <div className="space-y-24">

            {/* Detail 1: Personal Workbench */}
            <div className="flex flex-col md:flex-row items-center gap-12 group">
              <div className="flex-1 space-y-6">
                <div className="inline-block p-3 bg-blue-100 rounded-xl text-blue-600 mb-2">
                  <Layout className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{t.portal.deepDive.personalWorkbench.title}</h3>
                <p className="text-lg text-gray-600">
                  {t.portal.deepDive.personalWorkbench.desc}
                </p>
                <ul className="space-y-3">
                  {t.portal.deepDive.personalWorkbench.points.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="h-2 w-2 bg-blue-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl p-8 aspect-video flex items-center justify-center border border-gray-200 shadow-inner transform group-hover:scale-[1.02] transition-transform duration-500">
                {/* Placeholder UI visualization */}
                <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex flex-col gap-3">
                  <div className="flex gap-4 mb-2">
                    <div className="w-1/4 h-32 bg-gray-100 rounded animate-pulse"></div>
                    <div className="w-3/4 h-32 bg-blue-50 rounded animate-pulse"></div>
                  </div>
                  <div className="w-full h-24 bg-gray-50 rounded mt-auto flex items-center justify-center text-gray-400 text-sm">
                    Workbench UI Visualization
                  </div>
                </div>
              </div>
            </div>

            {/* Detail 2: AI Assistance */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 group">
              <div className="flex-1 space-y-6">
                <div className="inline-block p-3 bg-purple-100 rounded-xl text-purple-600 mb-2">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{t.portal.deepDive.aiAssistant.title}</h3>
                <p className="text-lg text-gray-600">
                  {t.portal.deepDive.aiAssistant.desc}
                </p>
                <ul className="space-y-3">
                  {t.portal.deepDive.aiAssistant.points.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="h-2 w-2 bg-purple-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl p-8 aspect-video flex items-center justify-center border border-gray-200 shadow-inner transform group-hover:scale-[1.02] transition-transform duration-500">
                <div className="relative w-full max-w-xs bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                  <div className="flex items-center gap-3 mb-4 border-b pb-2">
                    <Bot className="text-purple-500 h-5 w-5" />
                    <span className="text-sm font-semibold">AI Assistant</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg p-2 text-xs w-3/4">Summarize this doc?</div>
                    <div className="bg-purple-50 text-purple-900 rounded-lg p-2 text-xs w-3/4 ml-auto">Sure! This document outlines...</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail 3: Team Collaboration */}
            <div className="flex flex-col md:flex-row items-center gap-12 group">
              <div className="flex-1 space-y-6">
                <div className="inline-block p-3 bg-green-100 rounded-xl text-green-600 mb-2">
                  <Share2 className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{t.portal.deepDive.teamSync.title}</h3>
                <p className="text-lg text-gray-600">
                  {t.portal.deepDive.teamSync.desc}
                </p>
                <ul className="space-y-3">
                  {t.portal.deepDive.teamSync.points.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="h-2 w-2 bg-green-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl p-8 aspect-video flex items-center justify-center border border-gray-200 shadow-inner transform group-hover:scale-[1.02] transition-transform duration-500">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                    <Users className="h-8 w-8 text-green-500 mb-2" />
                    <span className="text-xs font-medium">Team Directory</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                    <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
                    <span className="text-xs font-medium">Shared Wiki</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
         SECTION: About
         Description: Project background and mission statement.
         Note: This section was previously truncated.
      */}
      <section id="about" className="py-24 bg-slate-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">{t.hero.whyLiteWiki}</h2>
            <div className="h-1 w-20 bg-primary-600 mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {t.portal.about.p1}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.portal.about.p2}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mt-8">
              {t.portal.about.p3}
            </p>
          </div>
        </div>
      </section>

      {/* 
         SECTION: CTA (Call to Action)
         Description: Final push to get users to register.
      */}
      <section className="py-20 bg-primary-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-20 -mb-20"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.hero.readyToOrganize}</h2>
          <p className="text-primary-200 text-lg mb-8 max-w-2xl mx-auto">
            {t.hero.joinPrefix} {stats} {t.hero.joinSuffix}          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" to={ROUTES.REGISTER}>
              {t.hero.startFree}
            </Button>
            <Button variant="outline" size="lg" className="border-primary-400 text-primary-100 hover:bg-primary-800 hover:text-white" to={ROUTES.LOGIN}>
              {t.hero.contactSales}
            </Button>
          </div>
        </div>
      </section>

      {/* 
         COMPONENT: Footer
         Description: Standard site footer.
         Fix: Ensure this is properly rendered within the main container.
      */}
      <Footer />
    </div>
  );
};
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import FeaturesPage from './pages/Features/Features';
import AboutUs from './pages/AboutUs/AboutUs';
import Dashboard from './pages/Dashboard/Dashboard';
import ContentDashboard from './components/ContentDashboard';

import Summarizer from './pages/Summarizer/Summarizer';
import MindMap from './pages/MindMap/MindMap';
import YouTubeTest from './pages/YouTubeTest/YouTubeTest';
import CurateContentTest from './components/CurateContentTest';
import SmartScheduler from './components/SmartScheduler';
import { Contact } from 'lucide-react';
import Footer4Col from './components/Footer/Footer';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <div style={{ width: '100%', margin: 0, padding: 0 }}>
            <Home />
            <FeaturesPage />
            <AboutUs />
            <Footer4Col/>
          </div>
        } />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/content" element={
          <div className="min-h-screen bg-[#060010] pt-20">
            <ContentDashboard />
          </div>
        } />

        <Route path="/summarizer" element={<Summarizer />} />
        <Route path="/mindmap" element={<MindMap />} />
        <Route path="/youtube-test" element={
          <div className="min-h-screen bg-[#060010] pt-20">
            <YouTubeTest />
          </div>
        } />
        <Route path="/curate-test" element={<CurateContentTest />} />
        <Route path="/smart-scheduler" element={
          <div className="min-h-screen bg-[#060010] pt-20">
            <SmartScheduler />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

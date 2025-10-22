import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import FeaturesPage from './pages/Features/Features';
import AboutUs from './pages/AboutUs/AboutUs';
import Dashboard from './pages/Dashboard/Dashboard';
import ContentDashboard from './components/ContentDashboard';

import Summarizer from './pages/Summarizer/Summarizer';


import SmartScheduler from './components/SmartScheduler';
import VideoPlayer from './pages/VideoPlayer/VideoPlayer';
import VideoNotes from './pages/VideoNotes/VideoNotes';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import AuthDemo from './pages/Auth/AuthDemo';
import { Contact } from 'lucide-react';
import Footer4Col from './components/Footer/Footer';

const App = () => {
  return (
    <AuthProvider>
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


        <Route path="/smart-scheduler" element={
          <div className="min-h-screen bg-[#060010] pt-20">
            <SmartScheduler />
          </div>
        } />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
        <Route path="/notes" element={<VideoNotes />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/auth-demo" element={<AuthDemo />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

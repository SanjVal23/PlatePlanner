import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { LoginScreen } from './components/LoginPage';
import { OnboardingScreen } from './components/OnboardingScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CreateAccountScreen } from './components/CreateAccountScreen';
import { HomePage } from './components/HomePage';
import { RecipePage } from './components/RecipePage';
import { RecipeDetail } from './components/RecipeDetail';
import { TrackMeals } from './components/TrackMeals';
import { WeeklySummary } from './components/WeeklySummary';
import { ProfilePage } from './components/ProfilePage';
import { CommunityForum } from './components/CommunityForum';
import { PlatePlanner } from './components/PlatePlanner';

const AppContent: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (screen: string) => {
    navigate(`/${screen}`);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<WelcomeScreen onNavigate={handleNavigate} />} />
        <Route path="/welcome" element={<WelcomeScreen onNavigate={handleNavigate} />} />
        <Route path="/login" element={<LoginScreen onNavigate={handleNavigate} />} />
        <Route path="/create-account" element={<CreateAccountScreen onNavigate={handleNavigate} />} />
        <Route path="/onboarding" element={<OnboardingScreen onNavigate={handleNavigate} />} />
        <Route path="/home" element={<HomePage onNavigate={handleNavigate} />} />
        <Route path="/recipe" element={<RecipePage onNavigate={handleNavigate} />} />
        <Route path="/recipe-detail" element={<RecipeDetail onNavigate={handleNavigate} />} />
        <Route path="/track-meals" element={<TrackMeals onNavigate={handleNavigate} />} />
        <Route path="/weekly-summary" element={<WeeklySummary onNavigate={handleNavigate} />} />
        <Route path="/profile" element={<ProfilePage onNavigate={handleNavigate} />} />
        <Route path="/community" element={<CommunityForum onNavigate={handleNavigate} />} />
        <Route path="/plate-planner" element={<PlatePlanner onNavigate={handleNavigate} />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

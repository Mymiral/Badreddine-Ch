import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { AuthProvider } from '@/context/AuthContext';
import { PropertyProvider } from '@/context/PropertyContext';
import { AppProvider } from '@/contexts/AppContext';

import Header from '@/sections/Header';
import Footer from '@/sections/Footer';
import BottomNav from '@/components/BottomNav';
import Hero from '@/sections/Hero';
import FeaturedProperties from '@/sections/FeaturedProperties';
import Categories from '@/sections/Categories';
import HowItWorks from '@/sections/HowItWorks';
import CTASection from '@/sections/CTASection';

import PropertyDetail from '@/pages/PropertyDetail';
import Properties from '@/pages/Properties';
import Contact from '@/pages/Contact';
import Agents from '@/pages/Agents';
import PublishProperty from '@/pages/PublishProperty';
import MyListings from '@/pages/MyListings';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import AdminDashboard from '@/pages/AdminDashboard';
import PriceEstimator from '@/pages/PriceEstimator';
import SocialHousing from '@/pages/SocialHousing';
import Profile from '@/pages/Profile';
import Favorites from '@/pages/Favorites';
import Welcome from '@/pages/Welcome';
import { CookieConsent } from '@/components/CookieConsent';

import './App.css';

gsap.registerPlugin(ScrollTrigger);

// Home page component
function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <Categories />
      <HowItWorks />
      <CTASection />
    </>
  );
}

// Layout wrapper for pages with header/footer
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
    </>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedWelcome');
    if (!hasVisited && location.pathname !== '/welcome') {
      navigate('/welcome', { replace: true });
    }
  }, [navigate, location]);

  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/properties"
        element={
          <Layout>
            <Properties />
          </Layout>
        }
      />
      <Route
        path="/property/:id"
        element={
          <Layout>
            <PropertyDetail />
          </Layout>
        }
      />
      <Route
        path="/agents"
        element={
          <Layout>
            <Agents />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route
        path="/publish"
        element={
          <Layout>
            <PublishProperty />
          </Layout>
        }
      />
      <Route
        path="/my-listings"
        element={
          <Layout>
            <MyListings />
          </Layout>
        }
      />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/estimator" element={
        <Layout>
          <PriceEstimator />
        </Layout>
      } />
      <Route path="/social-housing" element={
        <Layout>
          <SocialHousing />
        </Layout>
      } />
      <Route path="/profile" element={
        <Layout>
          <Profile />
        </Layout>
      } />
      <Route path="/favorites" element={
        <Layout>
          <Favorites />
        </Layout>
      } />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    ScrollTrigger.defaults({
      toggleActions: 'play none none none',
    });
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <AppProvider>
        <AuthProvider>
          <PropertyProvider>
            <Router>
              <AppRoutes />
              <CookieConsent />
            </Router>
          </PropertyProvider>
        </AuthProvider>
      </AppProvider>
    </I18nextProvider>
  );
}

export default App;

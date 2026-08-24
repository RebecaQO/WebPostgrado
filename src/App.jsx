import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ApplicantsProvider } from './context/ApplicantsContext';
import { TopBar } from './components/layout/TopBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LoginModal } from './components/auth/LoginModal';

import { HeroSection } from './components/home/HeroSection';
import { KpiSection } from './components/home/KpiSection';
import { FeaturedPrograms } from './components/home/FeaturedPrograms';
import { LabsSection } from './components/home/LabsSection';
import { EventsSection } from './components/home/EventsSection';

import { InstitutionView } from './components/institution/InstitutionView';
import { ProgramsView } from './components/programs/ProgramsView';
import { ProgramDetailModal } from './components/programs/ProgramDetailModal';
import { AdmissionView } from './components/admission/AdmissionView';
import { RegulationsView } from './components/regulations/RegulationsView';
import { NewsView } from './components/news/NewsView';
import { ContactView } from './components/contact/ContactView';

import { StudentPortal } from './components/portals/StudentPortal';
import { TeacherPortal } from './components/portals/TeacherPortal';
import { AdminPortal } from './components/portals/AdminPortal';

import './styles/index.css';
import './styles/components.css';

const MainApp = () => {
  const [currentTab, setCurrentTab] = useState('inicio');
  const [selectedProgramModal, setSelectedProgramModal] = useState(null);
  const [targetProgramForAdmission, setTargetProgramForAdmission] = useState(null);
  const [programFilterState, setProgramFilterState] = useState(null);

  const { currentUser } = useAuth();

  const handleNavigateToAdmission = (programId = null) => {
    if (programId) {
      setTargetProgramForAdmission(programId);
    }
    setCurrentTab('admision');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterPrograms = (filterObj) => {
    setProgramFilterState(filterObj);
    setCurrentTab('programas');
  };

  const handleLoginSuccess = (role) => {
    setCurrentTab(`portal-${role}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top franja institucional */}
      <TopBar />

      {/* Main Glass Sticky Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenProgramDetail={(prog) => setSelectedProgramModal(prog)}
      />

      {/* Main Content Router */}
      <main style={{ flex: 1 }}>
        {/* INICIO TAB */}
        {currentTab === 'inicio' && (
          <div className="animate-fade-in">
            <HeroSection
              onNavigate={setCurrentTab}
              onFilterPrograms={handleFilterPrograms}
            />
            <KpiSection />
            <FeaturedPrograms
              onSelectProgram={(prog) => setSelectedProgramModal(prog)}
              onNavigateToAdmission={handleNavigateToAdmission}
            />
            <LabsSection />
            <EventsSection onNavigate={setCurrentTab} />
          </div>
        )}

        {/* INSTITUCIÓN TAB */}
        {currentTab === 'institucion' && <InstitutionView />}

        {/* PROGRAMAS TAB */}
        {currentTab === 'programas' && (
          <ProgramsView
            onNavigateToAdmission={handleNavigateToAdmission}
            initialFilter={programFilterState}
          />
        )}

        {/* ADMISIÓN TAB */}
        {currentTab === 'admision' && (
          <AdmissionView targetProgramId={targetProgramForAdmission} />
        )}

        {/* NORMATIVA TAB */}
        {currentTab === 'normativa' && <RegulationsView />}

        {/* NOTICIAS Y DEFENSAS TAB */}
        {currentTab === 'noticias' && <NewsView />}

        {/* CONTACTO Y UBICACIÓN TAB */}
        {currentTab === 'contacto' && <ContactView />}

        {/* ROLE PORTALS */}
        {currentTab === 'portal-estudiante' && <StudentPortal />}
        {currentTab === 'portal-docente' && <TeacherPortal />}
        {currentTab === 'portal-admin' && <AdminPortal />}
      </main>

      {/* Global Institutional Footer */}
      <Footer onNavigate={setCurrentTab} />

      {/* Auth Login Modal */}
      <LoginModal onLoginSuccess={handleLoginSuccess} />

      {/* Program Detail Modal */}
      {selectedProgramModal && (
        <ProgramDetailModal
          program={selectedProgramModal}
          onClose={() => setSelectedProgramModal(null)}
          onApply={(progId) => {
            setSelectedProgramModal(null);
            handleNavigateToAdmission(progId);
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ApplicantsProvider>
        <MainApp />
      </ApplicantsProvider>
    </AuthProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { DigitalTwinMap } from './components/DigitalTwinMap';
import { TrafficDashboard } from './components/TrafficDashboard';
import { AccidentDashboard } from './components/AccidentDashboard';
import { EnvironmentDashboard } from './components/EnvironmentDashboard';
import { UtilitiesView } from './components/UtilitiesView';
import { CitizenServicesView } from './components/CitizenServicesView';
import { CitizenComplaintsDashboard } from './components/CitizenComplaintsDashboard';
import { ReportsView } from './components/ReportsView';
import { AIChatbot } from './components/AIChatbot';
import { AuthModal } from './components/AuthModal';
import { WardIntelligenceDashboard } from './components/WardIntelligenceDashboard';
import { WardComparisonCenter } from './components/WardComparisonCenter';
import { AnalyticsCenter } from './components/AnalyticsCenter';
import { DataExplorerView } from './components/DataExplorerView';
import { AdminCenter } from './components/AdminCenter';
import { GlobalFilterPanel, DEFAULT_GLOBAL_FILTERS } from './components/GlobalFilterPanel';
import { NotFoundView } from './components/NotFoundView';
import { 
  WardRouteWrapper, 
  FacilityRouteWrapper, 
  ComplaintRouteWrapper, 
  ReportRouteWrapper, 
  TrafficRouteWrapper 
} from './components/RouteWrappers';

import { 
  BENGALURU_WARDS, 
  CITY_FACILITIES, 
  TRAFFIC_SENSORS, 
  ACCIDENT_HOTSPOTS, 
  AQI_SENSORS, 
  CITIZEN_COMPLAINTS, 
  EMERGENCY_DISPATCHES, 
  CITY_HEALTH_SCORE 
} from './data/bengaluruData';

import { UserRole, CitizenComplaint, Ward, TrafficSensor, AQISensor, Facility, EmergencyDispatch, GlobalFilterState } from './types';
import { CityApi } from './services/api';
import { Sparkles } from 'lucide-react';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedWard, setSelectedWard] = useState<string>('Indiranagar');
  const [userRole, setUserRole] = useState<UserRole>('Super Admin');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [showAIChatDrawer, setShowAIChatDrawer] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);
  const [globalFilters, setGlobalFilters] = useState<GlobalFilterState>(DEFAULT_GLOBAL_FILTERS);

  // Dynamic API State
  const [wards, setWards] = useState<Ward[]>(BENGALURU_WARDS);
  const [facilities, setFacilities] = useState<Facility[]>(CITY_FACILITIES);
  const [trafficSensors, setTrafficSensors] = useState<TrafficSensor[]>(TRAFFIC_SENSORS);
  const [aqiSensors, setAqiSensors] = useState<AQISensor[]>(AQI_SENSORS);
  const [complaints, setComplaints] = useState<CitizenComplaint[]>(CITIZEN_COMPLAINTS);
  const [dispatches, setDispatches] = useState<EmergencyDispatch[]>(EMERGENCY_DISPATCHES);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(true);

  // Determine active module from URL route
  const getActiveModuleFromPath = (path: string): string => {
    if (path === '/' || path === '/executive' || path === '/analytics') return 'executive';
    if (path === '/digital-twin' || path === '/map') return 'digital-twin';
    if (path.startsWith('/ward/') || path === '/ward-analytics' || path === '/ward-comparison') return 'ward-analytics';
    if (path === '/traffic' || path.startsWith('/road/')) return 'traffic';
    if (path === '/environment' || path === '/aqi') return 'environment';
    if (path === '/utilities' || path === '/water' || path === '/electricity') return 'utilities';
    if (path === '/citizen-services' || path === '/complaints' || path === '/accidents' || path.startsWith('/complaint/')) return 'citizen-services';
    if (path === '/reports' || path.startsWith('/report/')) return 'reports';
    if (path === '/smartcity-ai') return 'smartcity-ai';
    if (path.startsWith('/hospital/') || path.startsWith('/police-station/') || path.startsWith('/metro/') || path.startsWith('/fire-station/') || path.startsWith('/facility/')) return 'digital-twin';
    return 'executive';
  };

  const activeModule = getActiveModuleFromPath(location.pathname);

  // Sync Dark Class on Document HTML Root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load backend API data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoadingApi(true);
      try {
        const [wData, fData, tData, aData, cData, eData] = await Promise.all([
          CityApi.getWards(),
          CityApi.getFacilities(),
          CityApi.getTrafficSensors(),
          CityApi.getAQISensors(),
          CityApi.getComplaints(),
          CityApi.getEmergencyDispatches()
        ]);
        if (wData && wData.length > 0) setWards(wData);
        if (fData && fData.length > 0) setFacilities(fData);
        if (tData && tData.length > 0) setTrafficSensors(tData);
        if (aData && aData.length > 0) setAqiSensors(aData);
        if (cData && cData.length > 0) setComplaints(cData);
        if (eData && eData.length > 0) setDispatches(eData);
      } catch (err) {
        console.warn('API sync warning, using local state:', err);
      } finally {
        setIsLoadingApi(false);
      }
    }
    loadData();
  }, []);

  const handleCreateComplaint = async (newComp: Partial<CitizenComplaint>) => {
    const created = await CityApi.submitComplaint({
      ...newComp,
      ward: newComp.ward || selectedWard
    });
    setComplaints([created, ...complaints]);
  };

  const handleSelectModule = (modId: string) => {
    switch (modId) {
      case 'executive': navigate('/executive'); break;
      case 'digital-twin': navigate('/digital-twin'); break;
      case 'ward-analytics': navigate(`/ward/${encodeURIComponent(selectedWard)}`); break;
      case 'traffic': navigate('/traffic'); break;
      case 'environment': navigate('/environment'); break;
      case 'utilities': navigate('/utilities'); break;
      case 'citizen-services': navigate('/citizen-services'); break;
      case 'reports': navigate('/reports'); break;
      case 'smartcity-ai': navigate('/smartcity-ai'); break;
      default: navigate(`/${modId}`); break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0B1220] text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200">
      
      {/* Top Navigation Header */}
      <Header
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
        userRole={userRole}
        onOpenAuthModal={() => setShowAuthModal(true)}
        selectedWard={selectedWard}
        onSelectWard={(wardVal) => {
          setSelectedWard(wardVal);
          if (location.pathname.startsWith('/ward/')) {
            navigate(`/ward/${encodeURIComponent(wardVal)}`);
          }
        }}
        wards={wards}
        facilities={facilities}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onToggleAIChat={() => setShowAIChatDrawer(!showAIChatDrawer)}
        onOpenFilters={() => setShowFilterPanel(true)}
        onSearchResultSelect={(item) => {
          if (item.wardName) setSelectedWard(item.wardName);
        }}
      />

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Nav Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={handleSelectModule}
          userRole={userRole}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenAIChat={() => setShowAIChatDrawer(true)}
        />

        {/* Center Main View Canvas */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={
              <ExecutiveDashboard
                healthScore={CITY_HEALTH_SCORE}
                wards={wards}
                onSelectWard={(wName) => {
                  setSelectedWard(wName);
                  navigate(`/ward/${encodeURIComponent(wName)}`);
                }}
                onNavigateModule={handleSelectModule}
              />
            } />

            <Route path="/executive" element={
              <ExecutiveDashboard
                healthScore={CITY_HEALTH_SCORE}
                wards={wards}
                onSelectWard={(wName) => {
                  setSelectedWard(wName);
                  navigate(`/ward/${encodeURIComponent(wName)}`);
                }}
                onNavigateModule={handleSelectModule}
              />
            } />

            <Route path="/analytics" element={
              <AnalyticsCenter
                wards={wards}
                facilities={facilities}
                trafficSensors={trafficSensors}
                aqiSensors={aqiSensors}
                complaints={complaints}
                selectedWard={selectedWard}
                onSelectWard={(wName) => {
                  setSelectedWard(wName);
                  navigate(`/ward/${encodeURIComponent(wName)}`);
                }}
                onNavigateMap={() => navigate('/digital-twin')}
                onOpenFilters={() => setShowFilterPanel(true)}
              />
            } />

            <Route path="/predictive" element={
              <ExecutiveDashboard
                healthScore={CITY_HEALTH_SCORE}
                wards={wards}
                onSelectWard={(wName) => {
                  setSelectedWard(wName);
                  navigate(`/ward/${encodeURIComponent(wName)}`);
                }}
                onNavigateModule={handleSelectModule}
              />
            } />

            <Route path="/data-explorer" element={
              <DataExplorerView
                wards={wards}
                facilities={facilities}
                trafficSensors={trafficSensors}
                aqiSensors={aqiSensors}
                complaints={complaints}
              />
            } />

            <Route path="/ward-analytics" element={
              <WardRouteWrapper
                wards={wards}
                facilities={facilities}
                trafficSensors={trafficSensors}
                aqiSensors={aqiSensors}
                complaints={complaints}
                dispatches={dispatches}
                selectedWard={selectedWard}
                onSelectWard={setSelectedWard}
                onOpenFilters={() => setShowFilterPanel(true)}
              />
            } />

            <Route path="/ward/:wardName" element={
              <WardRouteWrapper
                wards={wards}
                facilities={facilities}
                trafficSensors={trafficSensors}
                aqiSensors={aqiSensors}
                complaints={complaints}
                dispatches={dispatches}
                selectedWard={selectedWard}
                onSelectWard={setSelectedWard}
                onOpenFilters={() => setShowFilterPanel(true)}
              />
            } />

            <Route path="/ward-comparison" element={
              <WardComparisonCenter
                selectedWardId={selectedWard}
                wards={wards}
                facilities={facilities}
                trafficSensors={trafficSensors}
                aqiSensors={aqiSensors}
                complaints={complaints}
                dispatches={dispatches}
                onSelectWard={setSelectedWard}
                onNavigateMap={() => navigate('/digital-twin')}
                onOpenFilters={() => setShowFilterPanel(true)}
              />
            } />

            <Route path="/digital-twin" element={
              <DigitalTwinMap
                wards={wards}
                facilities={facilities}
                trafficSensors={trafficSensors}
                accidentHotspots={ACCIDENT_HOTSPOTS}
                aqiSensors={aqiSensors}
                complaints={complaints}
                selectedWard={selectedWard}
                onSelectWard={setSelectedWard}
                isDarkMode={isDarkMode}
              />
            } />

            <Route path="/traffic" element={<TrafficDashboard sensors={trafficSensors} />} />
            <Route path="/road/:roadId" element={<TrafficRouteWrapper sensors={trafficSensors} />} />
            <Route path="/environment" element={<EnvironmentDashboard sensors={aqiSensors} />} />

            <Route path="/utilities" element={<UtilitiesView initialTab="water" />} />
            <Route path="/water" element={<UtilitiesView initialTab="water" />} />
            <Route path="/electricity" element={<UtilitiesView initialTab="electricity" />} />

            <Route path="/citizen-services" element={
              <CitizenServicesView
                complaints={complaints}
                onSubmitNewComplaint={handleCreateComplaint}
                wards={wards}
                onNavigateEmergency={() => navigate('/digital-twin')}
                initialTab="complaints"
              />
            } />
            <Route path="/complaints" element={
              <CitizenServicesView
                complaints={complaints}
                onSubmitNewComplaint={handleCreateComplaint}
                wards={wards}
                onNavigateEmergency={() => navigate('/digital-twin')}
                initialTab="complaints"
              />
            } />
            <Route path="/accidents" element={
              <CitizenServicesView
                complaints={complaints}
                onSubmitNewComplaint={handleCreateComplaint}
                wards={wards}
                onNavigateEmergency={() => navigate('/digital-twin')}
                initialTab="emergency"
              />
            } />

            <Route path="/complaint/:ticketId" element={
              <ComplaintRouteWrapper
                complaints={complaints}
                onSubmitNewComplaint={handleCreateComplaint}
                wards={wards}
              />
            } />

            <Route path="/reports" element={<ReportsView />} />
            <Route path="/report/:reportId" element={<ReportRouteWrapper />} />

            <Route path="/hospital/:facilityId" element={<FacilityRouteWrapper facilities={facilities} onSelectWard={setSelectedWard} />} />
            <Route path="/police-station/:facilityId" element={<FacilityRouteWrapper facilities={facilities} onSelectWard={setSelectedWard} />} />
            <Route path="/metro/:facilityId" element={<FacilityRouteWrapper facilities={facilities} onSelectWard={setSelectedWard} />} />
            <Route path="/fire-station/:facilityId" element={<FacilityRouteWrapper facilities={facilities} onSelectWard={setSelectedWard} />} />
            <Route path="/facility/:facilityId" element={<FacilityRouteWrapper facilities={facilities} onSelectWard={setSelectedWard} />} />

            <Route path="/smartcity-ai" element={
              <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
                <AIChatbot selectedWard={selectedWard} isDrawer={false} />
              </div>
            } />

            <Route path="/admin" element={
              <AdminCenter currentRole={userRole} onSelectRole={setUserRole} />
            } />

            <Route path="*" element={<NotFoundView />} />
          </Routes>
        </main>

        {/* Right AI Assistant Floating Drawer */}
        {showAIChatDrawer && (
          <aside className="fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] shadow-2xl animate-in slide-in-from-right duration-200">
            <AIChatbot
              selectedWard={selectedWard}
              isDrawer={true}
              onCloseDrawer={() => setShowAIChatDrawer(false)}
            />
          </aside>
        )}

      </div>

      {/* Floating Quick AI Button (Bottom Right) */}
      {!showAIChatDrawer && (
        <button
          onClick={() => setShowAIChatDrawer(true)}
          className="fixed bottom-6 right-6 z-30 px-4 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 font-bold text-xs"
        >
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>SmartCity AI</span>
        </button>
      )}

      {/* Role Switcher Modal */}
      {showAuthModal && (
        <AuthModal
          currentRole={userRole}
          onSelectRole={setUserRole}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Enterprise Global Cascading Filter Panel */}
      <GlobalFilterPanel
        filters={globalFilters}
        onChangeFilters={(newFilters) => {
          setGlobalFilters(newFilters);
          if (newFilters.location.wardId !== 'all') {
            const foundWard = wards.find(w => w.id === newFilters.location.wardId);
            if (foundWard) setSelectedWard(foundWard.name);
          }
        }}
        wards={wards}
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
      />

    </div>
  );
}

export default App;

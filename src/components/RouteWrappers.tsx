import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Ward, Facility, TrafficSensor, AQISensor, CitizenComplaint, EmergencyDispatch } from '../types';
import { WardIntelligenceDashboard } from './WardIntelligenceDashboard';
import { FacilityProfileView } from './FacilityProfileView';
import { CitizenComplaintsDashboard } from './CitizenComplaintsDashboard';
import { ReportsView } from './ReportsView';
import { TrafficDashboard } from './TrafficDashboard';
import { CityApi } from '../services/api';

interface WardRouteWrapperProps {
  wards: Ward[];
  facilities: Facility[];
  trafficSensors: TrafficSensor[];
  aqiSensors: AQISensor[];
  complaints: CitizenComplaint[];
  dispatches: EmergencyDispatch[];
  selectedWard?: string;
  onSelectWard: (wardName: string) => void;
  onOpenFilters: () => void;
}

export const WardRouteWrapper: React.FC<WardRouteWrapperProps> = ({
  wards,
  facilities,
  trafficSensors,
  aqiSensors,
  complaints,
  dispatches,
  selectedWard = 'Indiranagar',
  onSelectWard,
  onOpenFilters
}) => {
  const { wardName } = useParams<{ wardName: string }>();
  const navigate = useNavigate();
  const decoded = wardName ? decodeURIComponent(wardName) : selectedWard;

  useEffect(() => {
    if (decoded) {
      onSelectWard(decoded);
      // Fetch live ward details from backend API
      CityApi.getWardDetails(decoded).catch(err => console.warn('Ward details fetch warning:', err));
    }
  }, [decoded, onSelectWard]);

  return (
    <WardIntelligenceDashboard
      selectedWardId={decoded}
      wards={wards}
      facilities={facilities}
      trafficSensors={trafficSensors}
      aqiSensors={aqiSensors}
      complaints={complaints}
      dispatches={dispatches}
      onSelectWard={(w) => {
        onSelectWard(w);
        navigate(`/ward/${encodeURIComponent(w)}`);
      }}
      onNavigateMap={() => navigate('/digital-twin', { state: { wardName: decoded } })}
      onOpenFilters={onOpenFilters}
    />
  );
};

interface FacilityRouteWrapperProps {
  facilities: Facility[];
  onSelectWard: (wardName: string) => void;
}

export const FacilityRouteWrapper: React.FC<FacilityRouteWrapperProps> = ({
  facilities,
  onSelectWard
}) => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();
  const id = facilityId || '';

  return (
    <FacilityProfileView
      facilityId={id}
      facilities={facilities}
      onNavigateMap={(lat, lng) => navigate('/digital-twin', { state: { lat, lng, facilityId: id } })}
      onNavigateWard={(wName) => {
        onSelectWard(wName);
        navigate(`/ward/${encodeURIComponent(wName)}`);
      }}
      onBack={() => navigate(-1)}
    />
  );
};

interface ComplaintRouteWrapperProps {
  complaints: CitizenComplaint[];
  onSubmitNewComplaint: (comp: Partial<CitizenComplaint>) => void;
  wards: Ward[];
}

export const ComplaintRouteWrapper: React.FC<ComplaintRouteWrapperProps> = ({
  complaints,
  onSubmitNewComplaint,
  wards
}) => {
  const { ticketId } = useParams<{ ticketId: string }>();
  return (
    <CitizenComplaintsDashboard
      complaints={complaints}
      onSubmitNewComplaint={onSubmitNewComplaint}
      wards={wards}
      highlightTicket={ticketId}
    />
  );
};

export const ReportRouteWrapper: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  return <ReportsView selectedReportId={reportId} />;
};

interface TrafficRouteWrapperProps {
  sensors: TrafficSensor[];
}

export const TrafficRouteWrapper: React.FC<TrafficRouteWrapperProps> = ({ sensors }) => {
  const { roadId } = useParams<{ roadId: string }>();
  return <TrafficDashboard sensors={sensors} />;
};

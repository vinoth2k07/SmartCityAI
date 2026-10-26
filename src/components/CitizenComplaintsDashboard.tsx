import React, { useState } from 'react';
import { MessageSquare, Plus, CheckCircle2, Clock, AlertTriangle, Filter, Search } from 'lucide-react';
import { CitizenComplaint } from '../types';

interface CitizenComplaintsDashboardProps {
  complaints: CitizenComplaint[];
  onSubmitNewComplaint: (complaint: Partial<CitizenComplaint>) => void;
  wards: { id: string; name: string }[];
  highlightTicket?: string;
}

export const CitizenComplaintsDashboard: React.FC<CitizenComplaintsDashboardProps> = ({
  complaints,
  onSubmitNewComplaint,
  wards,
  highlightTicket
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(highlightTicket || '');

  // Update search query if highlightTicket prop changes
  React.useEffect(() => {
    if (highlightTicket) {
      setSearchQuery(highlightTicket.replace(/^c-/, ''));
    }
  }, [highlightTicket]);

  // Form State
  const [category, setCategory] = useState<CitizenComplaint['category']>('Pothole');
  const [description, setDescription] = useState<string>('');
  const [ward, setWard] = useState<string>('Indiranagar');
  const [priority, setPriority] = useState<CitizenComplaint['priority']>('High');
  const [reportedBy, setReportedBy] = useState<string>('');

  const filteredComplaints = complaints.filter((c) => {
    if (filterCategory !== 'All' && c.category !== filterCategory) return false;
    if (filterStatus !== 'All' && c.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        c.id.toLowerCase().includes(q) ||
        c.ticketNo.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.ward.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSubmitNewComplaint({
      category,
      description,
      ward,
      priority,
      reportedBy: reportedBy.trim() || 'Anonymous Citizen'
    });

    setShowModal(false);
    setDescription('');
    setReportedBy('');
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">BBMP Sahaaya Citizen Redressal Portal</h2>
            <p className="text-xs text-slate-500">Potholes, Garbage Dumps, Water Leaks, Streetlights & Encroachments</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Report New Civic Issue
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-bold text-slate-500 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {['All', 'Pothole', 'Water Leakage', 'Power Outage', 'Garbage Dump', 'Streetlight Off'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-semibold focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Complaints List Queue */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        {filteredComplaints.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center font-medium">No complaints match the selected filter criteria.</p>
        ) : (
          filteredComplaints.map((cmp) => {
            const isEmergency = cmp.priority === 'Emergency';
            const isHigh = cmp.priority === 'High';

            return (
              <div key={cmp.id} className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{cmp.ticketNo}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded">
                      {cmp.category}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      isEmergency ? 'bg-red-600 text-white' : isHigh ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {cmp.priority} Priority
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">{cmp.description}</p>
                  <p className="text-[11px] text-slate-500">
                    Ward: <b>{cmp.ward}</b> | Reported by: <b>{cmp.reportedBy}</b> | Assigned Dept: <b>{cmp.assignedDept}</b>
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Resolution SLA</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{cmp.estimatedResolution}</span>
                  </div>

                  <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    cmp.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : cmp.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {cmp.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4-LEVEL DOMAIN INTELLIGENCE FRAMEWORK FOR CITIZEN COMPLAINTS */}
      <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-500" /> 4-Level Citizen Grievance Domain Intelligence Framework
          </h3>
          <span className="text-[10px] font-mono bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded font-bold">
            NLP Intent Classifier & Clustering Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">1. What Happened?</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-1.5 py-0.5 rounded font-bold">Descriptive</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{complaints.length} Tickets Logged</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Most frequent issues: <strong>Potholes (38%)</strong>, Water Leaks (24%), Power Outages (18%). Average SLA resolution speed: 28 hours.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">2. Why Did It Happen?</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-1.5 py-0.5 rounded font-bold">Diagnostic</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Ward Clustering & Monsoon Wear</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Indiranagar and Koramangala wards show high complaint density due to ongoing underground utility digging and surface runoff erosion.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">3. What Is Likely Next?</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-1.5 py-0.5 rounded font-bold">Predictive</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">NLP Escalation Risk Prediction</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Without intervention, 12 pending tickets in Bellandur will breach SLA threshold in next 6 hours, triggering BBMP zonal manager alerts.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">4. What Should Be Considered?</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 px-1.5 py-0.5 rounded font-bold">Prescriptive</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Rapid Task-Force Auto-Assignment</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Consider auto-dispatching BBMP asphalt repair gang to Indiranagar Ward #80 and cross-notifying BWSSB water leak repair teams.
            </p>
          </div>

        </div>
      </div>

      {/* New Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">BBMP Sahaaya - Report Civic Issue</h3>
            <p className="text-xs text-slate-500 mb-4">Submit a citizen grievance to BBMP, BWSSB, or BESCOM field team.</p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
                >
                  <option value="Pothole">Pothole / Road Hazard</option>
                  <option value="Water Leakage">BWSSB Water Main Leakage</option>
                  <option value="Power Outage">BESCOM Power Outage / Transformer</option>
                  <option value="Garbage Dump">Solid Waste / Uncollected Garbage</option>
                  <option value="Streetlight Off">Street Light Non-functional</option>
                  <option value="Drainage Block">Stormwater Drain Overflow</option>
                  <option value="Encroachment">Footpath Encroachment</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Bengaluru Ward Location</label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
                >
                  {wards.map((w) => (
                    <option key={w.id} value={w.name}>{w.name} Ward</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Priority Level</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High', 'Emergency'].map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p as any)}
                      className={`flex-1 py-1.5 rounded-lg font-bold border transition-colors ${
                        priority === p
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Issue Description & Landmark</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe location, exact pillar/road name, hazard details..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Your Name / Contact</label>
                <input
                  type="text"
                  value={reportedBy}
                  onChange={(e) => setReportedBy(e.target.value)}
                  placeholder="Citizen Name (Optional)"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

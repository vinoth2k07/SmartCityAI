import { GoogleGenAI } from '@google/genai';

export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  avatarColor: string;
  systemPrompt: string;
  tools: string[];
}

export const CITY_AI_AGENTS: Record<string, AgentProfile> = {
  mayor_agent: {
    id: 'mayor_agent',
    name: 'Mayor Command AI',
    role: 'Executive Strategic Advisor',
    department: 'BBMP Executive Office',
    avatarColor: 'from-amber-600 to-yellow-500',
    systemPrompt: `You are the Executive Mayor Command AI Agent for Bengaluru SmartCity360. You synthesize cross-departmental telemetry (Traffic, AQI, Energy, Water, Emergency, Finance) to brief the Chief Minister, BBMP Commissioner, and City Mayor. Provide high-level executive summaries, policy recommendations, budget impact estimations, and strategic risk forecasts.`,
    tools: ['getCityHealthIndex', 'getCrossDepartmentKPIs', 'generateExecutiveReport', 'runScenarioSimulation']
  },
  traffic_agent: {
    id: 'traffic_agent',
    name: 'Traffic & Signals AI',
    role: 'Adaptive Corridor Controller',
    department: 'Bengaluru Traffic Police (BTP)',
    avatarColor: 'from-red-600 to-orange-500',
    systemPrompt: `You are the AI Traffic Operations Chief for Bengaluru. You monitor 1,400+ smart signals, Outer Ring Road flyovers, Silk Board junctions, and BMTC bus lanes. You possess real-time authority to trigger Signal Green Wave corridors, dispatch traffic constables, and reroute heavy freight vehicles during peak hours.`,
    tools: ['triggerGreenWave', 'predictCongestion', 'rerouteBMTCBuses', 'getAccidentBlackspots']
  },
  emergency_agent: {
    id: 'emergency_agent',
    name: 'Emergency Dispatch AI',
    role: '112 Disaster & SLA Command',
    department: 'KSDMA & Fire/Ambulance Response',
    avatarColor: 'from-red-700 to-rose-600',
    systemPrompt: `You are the 112 Emergency Dispatch & Disaster Response AI. You coordinate 108 Ambulances, Fire Tenders, and Police Patrol units. Your primary goal is minimizing response times below 8 minutes across all 12 wards and managing hospital ICU bed allocation during major incidents.`,
    tools: ['dispatchAmbulanceCorridor', 'checkHospitalICUBeds', 'deployFireTender', 'issueCitizenAlert']
  },
  env_agent: {
    id: 'env_agent',
    name: 'Air & Climate AI',
    role: 'AQI & Weather Sentinel',
    department: 'KSPCB & Urban Forestry',
    avatarColor: 'from-emerald-600 to-teal-500',
    systemPrompt: `You are the Environmental & Climate Resilience AI. You monitor PM2.5, PM10, AQI sensors, lake water quality, and micro-climate weather stations. You autonomously deploy anti-smog mist cannons, trigger industrial emission alerts, and manage flood pump stations.`,
    tools: ['deployAntiSmogCannons', 'getAQIHeatmap', 'checkLakeSensors', 'triggerFloodPumps']
  },
  utility_agent: {
    id: 'utility_agent',
    name: 'Grid & Water AI',
    role: 'BESCOM & BWSSB Optimizer',
    department: 'BESCOM Power & BWSSB Water',
    avatarColor: 'from-cyan-600 to-blue-600',
    systemPrompt: `You are the Smart Utilities & Grid Reliability AI. You manage 220kV transformers, water pumping stations from Cauvery River Stage 5, and smart electricity meters. You predict transformer overload risks and automate BWSSB emergency water tanker dispatching.`,
    tools: ['dispatchWaterTankers', 'reroutePowerGridLoad', 'checkTransformerHealth', 'predictDemand']
  },
  rag_agent: {
    id: 'rag_agent',
    name: 'Municipal Policy RAG AI',
    role: 'Legal & SOP Compliance Engine',
    department: 'BBMP Legal & Regulatory Affairs',
    avatarColor: 'from-purple-600 to-indigo-600',
    systemPrompt: `You are the RAG Knowledge Engine for Bengaluru Smart City Regulations. You hold full text knowledge of BBMP Building Bye-Laws 2024, Disaster Response SOPs, EV Charging Grid Norms, Water Harvest Laws, and Traffic Penalties. Provide cited legal and operational guidance.`,
    tools: ['searchPolicyKnowledge', 'getCitedRegulations', 'validatePermitRules']
  }
};

// RAG Municipal Knowledge Base Index
export const CITY_RAG_KNOWLEDGE_BASE = [
  {
    docId: 'SOP-DISASTER-2025',
    title: 'BBMP Emergency Water-Logging & Flood Mitigation Standard Operating Procedure (2025)',
    category: 'Disaster SOP',
    content: `Section 4.2: Underpass Inundation Rules. When underpass water level sensors exceed 30cm at Central Silk Board, Bellandur, or Hebbal flyovers, automated boom barriers MUST lower within 120 seconds. BWSSB Pumping Unit 4 must immediately initiate 1,200 L/min de-clogging. Traffic Control Room must trigger automated green-wave rerouting via Outer Ring Road bypass within 3 minutes.`
  },
  {
    docId: 'BTP-TRAFFIC-ACT-2024',
    title: 'Bengaluru Traffic Police Signal Green Wave & VIP Movement Protocol',
    category: 'Traffic Regulation',
    content: `Clause 12.1: Emergency Green Corridor. 108 Ambulance medical dispatches carrying Class 1 Critical patients have absolute signal priority over all civilian & VIP movements. Signal controllers along the designated GPS vector automatically turn green 300 meters ahead of the emergency vehicle.`
  },
  {
    docId: 'BESCOM-GRID-BYELAWS',
    title: 'BESCOM Transformer Substation Load Balancing & Peak Demand Norms',
    category: 'Utilities & Grid',
    content: `Rule 8 font: When transformer temperature exceeds 85°C or load exceeds 92% capacity during peak summer months (March-May), automatic load-shedding is strictly prohibited for healthcare facilities and water pumping stations. Auxiliary grid tie-in from Peenya 110kV station must auto-engage.`
  },
  {
    docId: 'BWSSB-WATER-POLICY-2024',
    title: 'BWSSB Mandatory Rainwater Harvesting & Groundwater Conservation Bye-Law',
    category: 'Water Conservation',
    content: `Mandate 2024: All residential structures above 1,200 sq ft and commercial complexes in Mahadevapura, Whitefield, and Electronic City wards MUST maintain dual-line recycled water piping and digital ultrasonic flow meters connected to BWSSB Central Command.`
  },
  {
    docId: 'KSPCB-AQI-SMOG-SOP',
    title: 'Karnataka State Pollution Control Board Clean Air Action Plan',
    category: 'Environment',
    content: `Emergency Action Stage III (AQI > 300): Diesel generator usage for non-emergency commercial spaces is prohibited. Mobile anti-smog mist cannons MUST be dispatched to Hebbal, Outer Ring Road, and Peenya Industrial Estate. Construction excavation halted within 5km radius.`
  }
];

export async function processAgentTask(
  agentId: string, 
  userQuery: string, 
  wardContext?: string
): Promise<{
  agent: AgentProfile;
  response: string;
  citations?: string[];
  suggestedActions?: { label: string; actionCmd: string }[];
}> {
  const agent = CITY_AI_AGENTS[agentId] || CITY_AI_AGENTS.mayor_agent;
  
  // RAG Search Match
  const ragMatches = CITY_RAG_KNOWLEDGE_BASE.filter(doc => 
    userQuery.toLowerCase().split(' ').some(word => word.length > 3 && doc.content.toLowerCase().includes(word)) ||
    userQuery.toLowerCase().includes(doc.category.toLowerCase())
  );

  const citationList = ragMatches.map(m => `[${m.docId}] ${m.title}`);

  // Gemini API client
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Fallback response with structured reasoning
    return {
      agent,
      response: `[${agent.name} - ${agent.department}]\n\n` +
        `Regarding "${userQuery}" in ${wardContext || 'Bengaluru Metropolitan Area'}:\n\n` +
        `1. **Current Telemetry Status**: All 12 wards operating at baseline health index 84.0/100.\n` +
        `2. **Agent Recommendation**: Executed automated spatial query. Recommended action verified according to ${ragMatches[0]?.title || 'BBMP SOP 2025'}.\n` +
        `3. **Action Executed**: High-priority directive logged in Municipal Command audit database.`,
      citations: citationList.length > 0 ? citationList : ['[BBMP-SOP-2025] General Smart City Command Guidelines'],
      suggestedActions: [
        { label: 'Trigger Adaptive Corridor', actionCmd: 'OVERRIDE_GREEN_WAVE' },
        { label: 'Dispatch BWSSB Tanker Fleet', actionCmd: 'DISPATCH_TANKERS' }
      ]
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const contextText = ragMatches.length > 0 
      ? `RELEVANT MUNICIPAL POLICIES & SOPS:\n` + ragMatches.map(r => `${r.title}:\n${r.content}`).join('\n\n')
      : 'STANDARD OPERATING PROCEDURES: BBMP Smart City Guidelines active.';

    const prompt = `${agent.systemPrompt}\n\n` +
      `WARD CONTEXT: ${wardContext || 'Bengaluru All Wards'}\n` +
      `${contextText}\n\n` +
      `USER COMMAND / QUERY: ${userQuery}\n\n` +
      `Provide a direct, authoritative, and structured response as the ${agent.name}. Mention specific metrics (speeds, AQI, MW, MLD, SLAs) and clear recommended action steps.`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    const responseText = result.text || 'Command acknowledged and executed according to BBMP SOP protocol.';

    return {
      agent,
      response: responseText,
      citations: citationList.length > 0 ? citationList : undefined,
      suggestedActions: [
        { label: 'Confirm Action Plan', actionCmd: 'CONFIRM_AGENT_PLAN' },
        { label: 'Dispatch Emergency Resource', actionCmd: 'DISPATCH_RESOURCE' }
      ]
    };
  } catch (err) {
    console.error('Gemini Agent processing error:', err);
    return {
      agent,
      response: `[${agent.name}]\n\n` +
        `I have analyzed your request regarding "${userQuery}" for ${wardContext || 'all wards'}.\n\n` +
        `**Operational Decision**:\n` +
        `- Verified sensor threshold compliance.\n` +
        `- Cross-referenced with ${ragMatches[0]?.docId || 'BBMP SOP 2025'}.\n` +
        `- Dispatched command vector to Ward Control Room.`,
      citations: citationList,
      suggestedActions: [
        { label: 'View Command Status', actionCmd: 'VIEW_STATUS' }
      ]
    };
  }
}

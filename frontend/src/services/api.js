import { useEffect, useState, useRef } from 'react';

// Use standard relative path for api since we're serving from same host via proxy or directly
export const API_BASE_URL = "https://scanners-victory-africa-trustee.trycloudflare.com/api";

const protocol = "wss:";

export const WS_BASE_URL = "wss://scanners-victory-africa-trustee.trycloudflare.com/api";

// --- HOOKS ---

export const useRealtimeUpdates = (jobId = null) => {
  const [lastMessage, setLastMessage] = useState(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const url = jobId 
      ? `${WS_BASE_URL}/status/${jobId}/ws`
      : `${WS_BASE_URL}/ws/global`;
      
    const connect = () => {
      wsRef.current = new WebSocket(url);
      
      wsRef.current.onopen = () => setConnected(true);
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (e) {
          console.error("Failed to parse websocket message", e);
        }
      };
      
      wsRef.current.onclose = () => {
        setConnected(false);
        // Attempt reconnect after delay
        setTimeout(connect, 3000);
      };
      
      wsRef.current.onerror = (err) => {
        console.error("Websocket error:", err);
      };
    };
    
    connect();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [jobId]);

  return { lastMessage, connected };
};

// --- API FUNCTIONS ---

export const fetchApi = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `API Error: ${response.status}`);
  }
  
  return response.json();
};

export const getProducts = (params = {}) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach(k => {
    if (params[k]) query.append(k, params[k]);
  });
  return fetchApi(`/products?${query.toString()}`);
};

export const getProduct = (id) => fetchApi(`/products/${id}`);
export const getProductSpecs = (id) => fetchApi(`/products/${id}/specifications`);
export const getProductSources = (id) => fetchApi(`/products/${id}/sources`);
export const getProductCompliance = (id) => fetchApi(`/products/${id}/compliance`);
export const getProductRelationships = (id) => fetchApi(`/products/${id}/relationships`);

export const getDashboardStats = () => fetchApi(`/dashboard/stats`);

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData, // Don't set content-type for formData, fetch does it automatically with boundary
  });
  if (!response.ok) throw new Error("Failed to upload document");
  return response.json();
};

export const getJobStatus = (jobId) => fetchApi(`/jobs/${jobId}`);
export const getJobSteps = (jobId) => fetchApi(`/jobs/${jobId}/steps`);

export const getReviews = () => fetchApi(`/reviews`);
export const postReviewAction = (id, action, body) => 
  fetchApi(`/reviews/${id}/${action}`, { method: 'POST', body: JSON.stringify(body) });

export const getKnowledgeGraph = () => fetchApi(`/knowledge-graph`);

export const getSettings = () => fetchApi(`/settings`);
export const updateSettings = (updates) => fetchApi(`/settings`, { method: 'PUT', body: JSON.stringify(updates) });

export const getChatHistory = () => fetchApi(`/chat/history`);
export const postChatMessage = (messages) => fetchApi(`/chat`, { method: 'POST', body: JSON.stringify({ messages }) });

export const loginUser = async (email, password) => {
  try {
    return await fetchApi(`/login`, { method: 'POST', body: JSON.stringify({ email, password }) });
  } catch (err) {
    if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
      console.warn("Vercel detected without backend. Mocking login response.");
      return { access_token: "mock-token", token_type: "bearer" };
    }
    throw err;
  }
};
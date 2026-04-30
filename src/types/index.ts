/**
 * Base types for SideProjectAPM
 */

// Project status enum
export type ProjectStatus = 'healthy' | 'degraded' | 'critical';

// Project type
export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  lastHeartbeat: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Error type
export interface TrackedError {
  id: string;
  projectId: string;
  message: string;
  stackTrace: string | null;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
  resolved: boolean;
}

// API Key type
export interface ApiKey {
  id: string;
  projectId: string;
  name: string;
  key: string; // Partially masked
  createdAt: Date;
  lastUsed: Date | null;
}

// Metric type
export interface Metric {
  id: string;
  projectId: string;
  endpoint: string;
  latencyP50: number;
  latencyP95: number;
  latencyP99: number;
  requestsPerMinute: number;
  timestamp: Date;
}

// Auth types
export interface User {
  id: string;
  username: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Chart data types
export interface ChartDataPoint {
  timestamp: Date;
  value: number;
}

export interface MetricChartData {
  label: string;
  data: ChartDataPoint[];
  color?: string;
}
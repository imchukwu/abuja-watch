import { OverviewStats } from "@/data/electionTypes";
import { WardSummary } from "@/data/mockElectionData";

// API Base URL (proxied by Vite)
const API_BASE = "/api";

export const api = {
    // Get aggregated dashboard stats
    getDashboardStats: async (): Promise<OverviewStats> => {
        const res = await fetch(`${API_BASE}/dashboard/stats`);
        if (!res.ok) throw new Error("Failed to fetch dashboard stats");
        return res.json();
    },

    // Get list of Area Councils
    getAreaCouncils: async () => {
        const res = await fetch(`${API_BASE}/area-councils`);
        if (!res.ok) throw new Error("Failed to fetch area councils");
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    },

    // Get Wards for an Area Council
    getWards: async (lgaId: string) => {
        const res = await fetch(`${API_BASE}/area-councils/${lgaId}/wards`);
        if (!res.ok) throw new Error("Failed to fetch wards");
        return res.json();
    },

    // Get Ward Details (including results)
    getWardDetails: async (wardId: string): Promise<WardSummary> => {
        const res = await fetch(`${API_BASE}/wards/${wardId}`);
        if (!res.ok) throw new Error("Failed to fetch ward details");
        return res.json();
    },

    // Submit Logistics
    submitLogistics: async (data: any) => {
        const res = await fetch(`${API_BASE}/submit/logistics`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to submit logistics");
    },

    // Submit Staffing
    submitStaffing: async (data: any) => {
        const res = await fetch(`${API_BASE}/submit/staffing`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to submit staffing");
    },

    // Submit Integrity
    submitIntegrity: async (data: any) => {
        const res = await fetch(`${API_BASE}/submit/integrity`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to submit integrity");
    },

    // Submit Results
    submitResults: async (data: any) => {
        const res = await fetch(`${API_BASE}/submit/results`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to submit results");
    },

    // Party Configuration
    getAreaCouncilParties: async (lgaId: string): Promise<string[]> => {
        const res = await fetch(`${API_BASE}/area-councils/${lgaId}/parties`);
        if (!res.ok) throw new Error("Failed to fetch party configuration");
        return res.json();
    },

    updateAreaCouncilParties: async (lgaId: string, parties: string[]) => {
        const res = await fetch(`${API_BASE}/area-councils/${lgaId}/parties`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(parties),
        });
        if (!res.ok) throw new Error("Failed to update party configuration");
    },

    // Auth & Admin
    login: async (username, password) => {
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        if (!res.ok) throw new Error("Login failed");
        return res.json();
    },

    getUsers: async () => {
        const res = await fetch(`${API_BASE}/users`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
    },

    createUser: async (user: any) => {
        const res = await fetch(`${API_BASE}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error("Failed to create user");
    },

    getAuditLogs: async () => {
        const res = await fetch(`${API_BASE}/audit-logs`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (!res.ok) throw new Error("Failed to fetch audit logs");
        return res.json();
    },
};

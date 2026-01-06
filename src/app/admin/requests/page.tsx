"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { toast } from "sonner";

export default function AdminRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/admin/requests");
            const data = await res.json();
            if (Array.isArray(data)) setRequests(data);
        } catch {
            toast.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch("/api/admin/requests", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) {
                toast.success("Status updated");
                fetchRequests();
            } else {
                toast.error("Failed to update");
            }
        } catch {
            toast.error("Error updating");
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW': return 'bg-blue-100 text-blue-800';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    const viewDetails = (req: any) => {
        // Basic alert for now to keep it simple as requested
        // In a real app complexity, we'd use a Modal component
        let details = `Service: ${req.service?.title}\nUser: ${req.user?.name} (${req.user?.email})\nBudget: ${req.budget}\nDeadline: ${req.deadline}\n\nRequirements:\n`;
        try {
            const reqObj = JSON.parse(req.requirements);
            details += JSON.stringify(reqObj, null, 2);
        } catch {
            details += req.requirements;
        }
        alert(details);
    }

    return (
        <div className="p-8 text-black dark:text-white">
            <h1 className="text-2xl font-bold mb-8">Service Requests</h1>

            {loading ? (
                <Loader2 className="animate-spin" />
            ) : (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Service</th>
                                <th className="px-6 py-3">Budget</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {requests.map((req) => (
                                <tr key={req.id} className="bg-white dark:bg-black/20 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-6 py-4">{new Date(req.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{req.user?.name || "Unknown"}</div>
                                        <div className="text-gray-500 text-xs">{req.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4">{req.service?.title}</td>
                                    <td className="px-6 py-4">{req.budget}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button onClick={() => viewDetails(req)} title="View Details" className="text-blue-500 hover:text-blue-700 p-1"><Eye size={18} /></button>
                                        {req.status !== 'COMPLETED' && (
                                            <button onClick={() => updateStatus(req.id, "COMPLETED")} title="Mark Completed" className="text-green-500 hover:text-green-700 p-1"><CheckCircle size={18} /></button>
                                        )}
                                        {req.status !== 'IN_PROGRESS' && req.status !== 'COMPLETED' && (
                                            <button onClick={() => updateStatus(req.id, "IN_PROGRESS")} title="Mark In Progress" className="text-yellow-500 hover:text-yellow-700 p-1"><Clock size={18} /></button>
                                        )}
                                        {req.status !== 'REJECTED' && req.status !== 'COMPLETED' && (
                                            <button onClick={() => updateStatus(req.id, "REJECTED")} title="Reject" className="text-red-500 hover:text-red-700 p-1"><XCircle size={18} /></button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

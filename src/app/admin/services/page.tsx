"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash, Edit } from "lucide-react";
import { toast } from "sonner";

export default function AdminServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Simple form state for creating
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: "", description: "", startingPrice: 0 });

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services");
            const data = await res.json();
            if (Array.isArray(data)) setServices(data);
        } catch {
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                toast.success("Service created");
                setShowForm(false);
                setFormData({ title: "", description: "", startingPrice: 0 });
                fetchServices();
            } else {
                toast.error("Failed to create");
            }
        } catch {
            toast.error("Error creating service");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`/api/services/${id}`, { method: "DELETE" });
            toast.success("Deleted");
            fetchServices();
        } catch {
            toast.error("Error deleting");
        }
    };

    return (
        <div className="p-8 text-black dark:text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Services Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={18} /> New Service
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8 space-y-4">
                    <h3 className="font-semibold">Add New Service</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <input
                            placeholder="Title"
                            className="p-2 rounded border"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Starting Price"
                            className="p-2 rounded border"
                            value={formData.startingPrice}
                            onChange={e => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
                            required
                        />
                    </div>
                    <textarea
                        placeholder="Description"
                        className="w-full p-2 rounded border"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                    </div>
                </form>
            )}

            {loading ? (
                <Loader2 className="animate-spin" />
            ) : (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {services.map((service) => (
                                <tr key={service.id} className="bg-white dark:bg-black/20 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium">{service.title}</td>
                                    <td className="px-6 py-4">${service.startingPrice}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {service.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button className="text-blue-500 hover:text-blue-700 p-1"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(service.id)} className="text-red-500 hover:text-red-700 p-1"><Trash size={16} /></button>
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

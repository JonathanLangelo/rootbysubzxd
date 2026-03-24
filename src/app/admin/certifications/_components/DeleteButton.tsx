"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
    id: string;
    title: string;
}

export default function DeleteButton({ id, title }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`ARE_YOU_SURE_YOU_WANT_TO_DELETE_CERT: "${title.toUpperCase()}"?`)) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/certifications/${id}`, {
                method: "DELETE",
                headers: {
                    "X-Requested-With": "XMLHttpRequest", // CSRF Protection
                },
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("DELETE_FAILED");
            }
        } catch {
            alert("SYSTEM_FAILURE: OFFLINE_MODE");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`text-gray-500 hover:text-red-500 transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="DELETE_CERT"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}

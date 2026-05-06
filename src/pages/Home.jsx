import React, { useState, useEffect } from 'react'
import { addLink, checkLink, getLinks, deleteLink} from '../services/api'
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Home() {
    const [url, setUrl] = useState("")
    const [links, setLinks] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const res = await getLinks()

                setLinks(
                    res.map(link => {
                        let status = "not_checked";

                        if (link.diff) {
                            let parsed = [];
                            try {
                                parsed = JSON.parse(link.diff || "[]");
                            } catch {}
                            status = parsed.length > 0 ? "changed" : "no_change";
                        }

                        return {
                            id: link.id,
                            url: link.url,
                            status,
                            loading: false
                        }
                    })
                )
            } catch (error) {
                console.error(error)
                toast.error("Failed to load links")
            }
        }
        fetchLinks()
    }, [])

    const handleAdd = async () => {
    if (!url) {
        toast.error("Please enter a URL");
        return;
    }

    try {
        new URL(url);
    } catch {
        toast.error("Invalid URL");
        return;
    }

    try {
        const res = await addLink(url);

        setLinks(prev => [...prev, {
            id: res.id,
            url,
            status: "not_checked",
            loading: false
        }]);

        toast.success("Link added!");
        setUrl("");
    } catch (error) {
        console.error(error)
        toast.error("Failed to add link");
    }
}

    const handleCheck = async (id) => {
        setLinks(prev =>
            prev.map(l =>
                l.id === id ? { ...l, loading: true } : l
            )
        );

        try {
            const res = await checkLink(id);

            setLinks(prev =>
                prev.map(l =>
                    l.id === id
                        ? {
                            ...l,
                            loading: false,
                            status: res.hasChanges ? "changed" : "no_change"
                        }
                        : l
                )
            );

            toast.success("Checked successfully");

        } catch (error) {
            console.error(error)
            toast.error("Check failed");

            setLinks(prev =>
                prev.map(l =>
                    l.id === id ? { ...l, loading: false } : l
                )
            );
        }
    }

    const handleDelete = async (id) => {
    try {
        await deleteLink(id);
        setLinks(prev => prev.filter(l => l.id !== id));
        toast.success("Link removed");
    } catch {
        toast.error("Delete failed");
    }
};

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-2xl mx-auto">

                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
                    Web Monitor
                </h1>

                <div className="flex flex-col sm:flex-row gap-2 mb-6">
                    <input
                        type="text"
                        className="border p-2 rounded flex-1"
                        placeholder="Enter URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />

                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded"
                    >
                        Add
                    </button>
                </div>


                {links.length === 0 && (
                    <p className="text-center text-gray-500">
                        No URLs added yet.
                    </p>
                )}


                <div className="space-y-3">
                    {links.map((link) => (
                        <div
                            key={link.id}
                            className="bg-white p-4 rounded shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
                        >
                            <span className="truncate text-sm sm:text-base">
                                {link.url}
                            </span>

                            <div className="flex flex-wrap gap-3 items-center">

                                <span className={`text-xs px-3 py-1 rounded ${
                                    link.status === "changed"
                                        ? "bg-red-100 text-red-600"
                                        : link.status === "no_change"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-gray-100 text-gray-600"
                                }`}>
                                    {link.status === "changed"
                                        ? "Changed"
                                        : link.status === "no_change"
                                        ? "No change"
                                        : "Not checked"}
                                </span>

                                <button
                                    onClick={() => navigate(`/status/${link.id}`)}
                                    className="bg-blue-500 text-sm text-white rounded px-3 py-1 hover:bg-blue-600"
                                >
                                    View
                                </button>

                                <button
                                    onClick={() => handleCheck(link.id)}
                                    disabled={link.loading}
                                    className={`text-sm px-3 py-1 rounded text-white ${
                                        link.loading
                                            ? "bg-gray-400"
                                            : "bg-green-500 hover:bg-green-600"
                                    }`}
                                >
                                    {link.loading ? "Checking..." : "Check"}
                                </button>

                                <button
                                    onClick={() => handleDelete(link.id)}
                                    className="rounded px-3 py-1 text-sm bg-red-500 text-white hover:bg-red-600"
                                >
                                    Delete
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home
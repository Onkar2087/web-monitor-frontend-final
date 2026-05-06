import React, { useEffect, useState } from 'react'
import { checkLink, getStatus, getHealth } from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import toast from "react-hot-toast";

function Status() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    const [health, setHealth] = useState(null)
    const [healthLoading, setHealthLoading] = useState(true)
    const [healthError, setHealthError] = useState(false)

    const [statusError, setStatusError] = useState(false)

    const fetchStatus = async () => {
        try {
            const res = await getStatus(id)
            setData(res)
            setStatusError(false)
        } catch {
            setStatusError(true)
            setData(null)
            toast.error("Backend not reachable")
        }
    }

    const fetchHealth = async () => {
        setHealthLoading(true)
        setHealthError(false)

        try {
            const res = await getHealth()
            setHealth(res)
        } catch {
            setHealthError(true)
            setHealth(null)
        } finally {
            setHealthLoading(false)
        }
    }

    const handleCheck = async () => {
        setLoading(true)

        try {
            await checkLink(id)
            setTimeout(fetchStatus, 300)
            toast.success("Checked successfully")
        } catch {
            toast.error("Check failed")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchStatus()
            fetchHealth()
        }
    }, [id])

    if (!data && !statusError) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-6">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/")}
                            className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-gray-400 text-white hover:bg-gray-500 transition shadow-sm"
                        >
                            Back
                        </button>

                        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                            {data?.url || "Status"}
                        </h1>
                    </div>

                    <button
                        disabled={loading}
                        onClick={handleCheck}
                        className={`px-4 py-2 text-sm rounded-md font-medium transition 
                        ${
                            loading
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    >
                        {loading ? "Checking..." : "Check Now"}
                    </button>
                </div>

                {statusError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md text-sm">
                        Backend not reachable. Please try again later.
                    </div>
                )}

                {!statusError && data && (
                    <>
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 h-56 overflow-auto font-mono text-sm">
                            <h2 className="text-sm font-semibold text-gray-700 mb-2">
                                Diff View
                            </h2>

                            {!data.latest?.diff || data.latest.diff.length === 0 ? (
                                <p className="text-gray-500">No changes detected</p>
                            ) : (
                                data.latest.diff.map((d, i) => (
                                    <div
                                        key={i}
                                        className={`px-2 py-1 rounded mb-1 whitespace-pre-wrap break-words ${
                                            d.added
                                                ? "bg-green-50 text-green-700"
                                                : d.removed
                                                ? "bg-red-50 text-red-700"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        <span className="font-bold mr-2">
                                            {d.added ? "+" : d.removed ? "-" : ""}
                                        </span>

                                        {d.value.trim().slice(0, 200)}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                                <h2 className="text-sm font-semibold text-gray-700 mb-2">
                                    Summary
                                </h2>

                                <p className="text-sm text-gray-600">
                                    {data.latest?.summary &&
                                    data.latest.summary !== "No changes detected"
                                        ? data.latest.summary
                                        : "No changes detected"}
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                                <h2 className="text-sm font-semibold text-gray-700 mb-2">
                                    Evidence
                                </h2>

                                {!data.latest?.evidence ||
                                data.latest.evidence.length === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        No changes detected
                                    </p>
                                ) : (
                                    <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
                                        {data.latest.evidence.map((e, i) => (
                                            <li key={i}>{e}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* FIXED HISTORY SECTION */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                            <h2 className="text-sm font-semibold text-gray-700 mb-2">
                                History
                            </h2>

                            {data.history?.length > 0 ? (
                                data.history.slice(0, 5).map((h, i) => (
                                    <div
                                        key={i}
                                        className="text-sm text-gray-600"
                                    >
                                        {h.created_at}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No history available
                                </p>
                            )}
                        </div>
                    </>
                )}

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">
                        System Health
                    </h2>

                    {healthLoading ? (
                        <p className="text-sm text-gray-500">
                            Loading...
                        </p>
                    ) : healthError ? (
                        <p className="text-sm text-red-500">
                            Health check failed
                        </p>
                    ) : (
                        <div className="space-y-2 text-sm">

                            <div
                                className={`flex justify-between ${
                                    health.backend === "Healthy"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                <span>Backend</span>
                                <span>{health.backend}</span>
                            </div>

                            <div
                                className={`flex justify-between ${
                                    health.database === "Connected"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                <span>Database</span>
                                <span>{health.database}</span>
                            </div>

                            <div
                                className={`flex justify-between ${
                                    health.llm === "Available"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                <span>LLM</span>
                                <span>{health.llm}</span>
                            </div>

                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Status

'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { redirect, useRouter } from 'next/navigation';

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (!userId) return;

        fetch(`http://127.0.0.1:5000/api/user?user_id=${userId}`)
            .then(res => res.json())
            .then(data => {
                fetch(`http://127.0.0.1:5000/api/submissions?team_id=${data.team}`)
                    .then(res => res.json())
                    .then(setSubmissions);
            });
    }, []);

    return (
        <>
            <Navbar />
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Previous Submissions</h2>
                {submissions.map((sub: any, idx: number) => (
                    <div key={idx} className="mb-4 p-4 border bg-gray-100">
                        <p className="text-sm text-gray-600">{new Date(sub.time).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{sub._id}</p>
                        <pre className="bg-white text-black p-2 overflow-x-auto text-sm">{sub.code}</pre>
                        <button
                            onClick={() => {
                                if (sub._id) {
                                    router.push(`/code-editor?id=${sub._id}`);
                                } else {
                                    alert('Submission ID missing!');
                                }
                            }}
                            className="mt-2 bg-blue-600 text-white px-3 py-1"
                        >
                            Edit & Re-submit
                        </button>

                    </div>
                ))}
            </div>
        </>
    );
}

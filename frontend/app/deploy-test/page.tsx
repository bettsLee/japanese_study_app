"use client";

import { useEffect, useState } from "react";

type BackendResult = {
  status: string;
  server: string;
  checkedAt: string;
} | null;

export default function DeployTestPage() {
  const [backend, setBackend] = useState<BackendResult>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

  useEffect(() => {
    fetch(`${apiUrl}/api/v1/check`)
      .then((res) => res.json())
      .then((data) => { setBackend(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-red-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg space-y-5">

        <div className="text-center">
          <span className="text-3xl">こ</span>
          <h1 className="text-xl font-bold text-gray-800 mt-1">Kotoba 배포 확인</h1>
          <p className="text-xs text-gray-400 mt-0.5">이 페이지는 테스트용이며 추후 삭제됩니다</p>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-green-700">프론트엔드</span>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Vercel ✅</span>
          </div>
          <div className="text-xs text-gray-500 space-y-0.5">
            <p>환경: <span className="font-mono">{process.env.NODE_ENV}</span></p>
            <p>API 주소: <span className="font-mono text-indigo-500">{apiUrl}</span></p>
          </div>
        </div>

        <div className={`rounded-xl border p-4 space-y-2 ${error ? "border-red-200 bg-red-50" : "border-blue-200 bg-blue-50"}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold ${error ? "text-red-700" : "text-blue-700"}`}>백엔드</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              loading ? "bg-gray-100 text-gray-500" :
              error ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
            }`}>
              {loading ? "확인 중..." : error ? "Render ❌" : "Render ✅"}
            </span>
          </div>
          {loading && <p className="text-xs text-gray-400">연결 중...</p>}
          {error && <p className="text-xs text-red-500">{error}</p>}
          {backend && (
            <div className="text-xs text-gray-500 space-y-0.5">
              <p>상태: <span className="font-semibold text-blue-600">{backend.status}</span></p>
              <p>서버: <span className="font-mono">{backend.server}</span></p>
              <p>응답 시각: <span className="font-mono">{backend.checkedAt}</span></p>
            </div>
          )}
        </div>

        <a
          href={`${apiUrl}/swagger-ui/index.html`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 w-full py-2.5 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-medium hover:bg-indigo-100 transition"
        >
          Swagger UI 열기 →
        </a>
      </div>
    </div>
  );
}

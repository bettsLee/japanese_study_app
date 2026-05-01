"use client";

import { useEffect, useState } from "react";

type BackendStatus = {
  message: string;
  timestamp: string;
  version: string;
} | null;

export default function DeployTestPage() {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
    fetch(`${apiUrl}/api/ping`)
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          배포 확인 페이지
        </h1>
        <p className="text-xs text-center text-gray-400">추후 삭제 예정</p>

        {/* 프론트엔드 */}
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-700 mb-1">프론트엔드 (Vercel)</p>
          <p className="text-green-600">배포 확인 완료 ✅</p>
          <p className="text-xs text-gray-400 mt-1">
            환경: {process.env.NODE_ENV}
          </p>
        </div>

        {/* 백엔드 */}
        <div className={`rounded-xl border p-4 ${
          error
            ? "border-red-200 bg-red-50"
            : "border-blue-200 bg-blue-50"
        }`}>
          <p className={`text-sm font-semibold mb-1 ${error ? "text-red-700" : "text-blue-700"}`}>
            백엔드 (Render)
          </p>
          {loading && <p className="text-gray-400 text-sm">연결 중...</p>}
          {error && <p className="text-red-500 text-sm">연결 실패 ❌<br />{error}</p>}
          {backendStatus && (
            <div className="space-y-1">
              <p className="text-blue-600">{backendStatus.message}</p>
              <p className="text-xs text-gray-400">버전: {backendStatus.version}</p>
              <p className="text-xs text-gray-400">시각: {backendStatus.timestamp}</p>
            </div>
          )}
        </div>

        {/* Swagger 링크 */}
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/swagger-ui/index.html`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-sm text-indigo-500 hover:text-indigo-700 underline"
        >
          Swagger UI 열기 →
        </a>
      </div>
    </div>
  );
}

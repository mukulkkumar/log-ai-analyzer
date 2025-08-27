"use client";

import { uploadLogFile } from "@/services/log";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

interface ErrorObject {
  error_message: string;
  explanation: string;
  possible_causes: string;
  suggested_fixes: string;
}

export default function LogFilePage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [mockResponse, setMockResponse] = useState<ErrorObject[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadLogFile(formData);
      // Parse and update state
      const parsed: ErrorObject[] = response.flatMap((item: string) => {
        const clean = item.replace(/```json\n?/g, "").replace(/```/g, "");
        return JSON.parse(clean) as ErrorObject[];
      });
      setMockResponse(parsed);
      setMessage("✅ File uploaded and analyzed.");
    } catch (err: any) {
      setMessage("❌ Error analyzing file");
      setMockResponse([]);
    }
  }

  return (
    <DashboardLayout>
      <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Upload log file
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose a file
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4M21 16v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m16 0l-4-4m4 4l-4 4"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-400">
                  TXT, LOG, CSV up to 10MB
                </p>
              </div>
              <input
                id="file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {file && (
              <p className="mt-3 text-sm text-gray-600">
                ✅ Selected:{" "}
                <span className="font-medium text-emerald-600">
                  {file.name}
                </span>
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition"
          >
            Submit
          </button>
        </form>
      </div>
      {/* Response text or analysis result can be shown here */}
      <div className="mt-6 w-full">
        {message && (
          <div className="mb-4 text-center font-medium font-semibold text-emerald-600">
            {message}
          </div>
        )}
        <div className="space-y-8 w-full">
          {mockResponse.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow w-full"
            >
              <div className="mb-2">
                <span className="font-semibold text-blue-700">
                  Error Message:
                </span>
                <div className="text-base text-blue-700">
                  {item.error_message}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-emerald-700">
                  Explanation:
                </span>
                <div className="text-base text-emerald-700">
                  {item.explanation}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-orange-700">
                  Possible Causes:
                </span>
                <div className="text-base text-orange-700">
                  {item.possible_causes}
                </div>
              </div>
              <div>
                <span className="font-semibold text-pink-700">
                  Suggested Fixes:
                </span>
                <div className="text-base text-pink-700">
                  {item.suggested_fixes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

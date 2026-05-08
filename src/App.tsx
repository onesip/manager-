/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Instructions } from "./components/Instructions";
import { HistoryList } from "./components/HistoryList";
import { InspectionForm } from "./components/InspectionForm";
import { scoringData } from "./data";
import { HistoryRecord } from "./types";
import { ClipboardList, History, FileText } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"form" | "history" | "instructions">("form");
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("onesip_scoring_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const saveRecord = (record: HistoryRecord) => {
    const updated = [...history, record];
    setHistory(updated);
    localStorage.setItem("onesip_scoring_history", JSON.stringify(updated));
    alert("评分已保存！");
    setActiveTab("history");
  };

  const clearHistory = () => {
    if (confirm("确定要清空所有历史记录吗？")) {
      setHistory([]);
      localStorage.removeItem("onesip_scoring_history");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-inner">
                <ClipboardList className="text-white w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                ONESIP 店长巡查评分
              </h1>
            </div>
            
            <nav className="flex space-x-1 bg-gray-100/80 p-1 rounded-lg border border-gray-200/60">
              <button
                onClick={() => setActiveTab("form")}
                className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "form" 
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                }`}
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                填表评分
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "history" 
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                }`}
              >
                <History className="w-4 h-4 mr-2" />
                历史记录
              </button>
              <button
                onClick={() => setActiveTab("instructions")}
                className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "instructions" 
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                使用说明
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "instructions" && <Instructions />}
        
        {activeTab === "history" && (
          <HistoryList history={history} onClear={clearHistory} />
        )}
        
        {activeTab === "form" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {scoringData.length > 0 ? (
              <>
                <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm inline-flex items-center">
                  <label className="text-sm font-medium text-gray-700 mr-4">
                    选择评分表:
                  </label>
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
                    value={selectedSheetIndex}
                    onChange={(e) => setSelectedSheetIndex(Number(e.target.value))}
                  >
                    {scoringData.map((sheet, idx) => (
                      <option key={idx} value={idx}>
                        {sheet.name}
                      </option>
                    ))}
                  </select>
                </div>

                <InspectionForm
                  sheet={scoringData[selectedSheetIndex]}
                  onSave={saveRecord}
                />
              </>
            ) : (
              <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 text-amber-800">
                <p className="font-medium text-lg mb-2">未找到评分表数据</p>
                <p>请在 src/data.ts 文件中填入 SCORING_DATA_BASE64 的值。</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}


import React, { useState } from "react";
import { HistoryRecord } from "../types";
import { Download, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { exportToCSV } from "../utils";

interface HistoryListProps {
  history: HistoryRecord[];
  onClear: () => void;
}

export function HistoryList({ history, onClear }: HistoryListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-lg">暂无历史记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">历史提交</h2>
        <div className="flex gap-3">
          <button
            onClick={() => exportToCSV(history)}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            下载 CSV
          </button>
          <button
            onClick={onClear}
            className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            清空记录
          </button>
        </div>
      </div>

      {history.map((record, idx) => (
        <div
          key={idx}
          className="bg-white border rounded-xl overflow-hidden transition-all hover:border-gray-300"
        >
          <div
            className="p-5 cursor-pointer flex justify-between items-center"
            onClick={() => setExpandedId(expandedId === idx ? null : idx)}
          >
            <div>
              <h3 className="font-semibold text-gray-900">{record.sheet}</h3>
              <div className="text-sm text-gray-500 flex gap-3 mt-1">
                <span>{record.date} {record.time}</span>
                <span>员工: {record.staff || "-"}</span>
                <span
                  className={
                    record.passFail.includes("不通过")
                      ? "text-red-500"
                      : "text-green-600"
                  }
                >
                  等级: {record.grade}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{record.totalScore}</div>
                <div className="text-xs text-gray-500">总分</div>
              </div>
              {expandedId === idx ? <ChevronUp /> : <ChevronDown />}
            </div>
          </div>

          {expandedId === idx && (
            <div className="p-6 bg-gray-50 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div><span className="text-gray-500 block">当班店员</span> <strong>{record.inspector || "-"}</strong></div>
                <div><span className="text-gray-500 block">班次</span> <strong>{record.shift || "-"}</strong></div>
                <div><span className="text-gray-500 block">状态</span> <strong>{record.status || "-"}</strong></div>
                <div><span className="text-gray-500 block">判定</span> <strong className={record.passFail.includes("不") ? "text-red-600" : "text-green-600"}>{record.passFail}</strong></div>
              </div>
              <div className="overflow-x-auto bg-white rounded border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2">模块</th>
                      <th className="p-2">项</th>
                      <th className="p-2">分</th>
                      <th className="p-2">红线</th>
                      <th className="p-2">备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.items.map((it, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2">{it.module}</td>
                        <td className="p-2">{it.item}</td>
                        <td className="p-2 font-medium">{it.score !== null ? it.score : "-"}</td>
                        <td className="p-2">{it.redTriggered}</td>
                        <td className="p-2 text-gray-500">{it.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

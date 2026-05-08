import React from "react";
import { dirEntries, usageInstructions } from "../data";

export function Instructions() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-semibold text-gray-800">使用说明</h2>
        </div>
        <div className="p-6">
          <ul className="space-y-3">
            {usageInstructions.map((instruction, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-600 leading-relaxed">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3" />
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-semibold text-gray-800">评分表目录</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-4">页面</th>
                <th className="px-6 py-4">适用场景</th>
                <th className="px-6 py-4">主要检查重点</th>
                <th className="px-6 py-4">建议使用频率</th>
                <th className="px-6 py-4">低分处理</th>
                <th className="px-6 py-4">红线处理</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {dirEntries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{entry.page}</td>
                  <td className="px-6 py-4">{entry.scene}</td>
                  <td className="px-6 py-4 whitespace-normal min-w-[200px]">{entry.focus}</td>
                  <td className="px-6 py-4">{entry.frequency}</td>
                  <td className="px-6 py-4">{entry.low}</td>
                  <td className="px-6 py-4 text-red-600">{entry.red}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

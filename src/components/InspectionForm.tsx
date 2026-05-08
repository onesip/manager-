import React, { useState, useEffect, useMemo } from "react";
import { ScoringSheet, FormState, HistoryRecord, ItemFormState } from "../types";
import { calculateSummary } from "../utils";

interface InspectionFormProps {
  sheet: ScoringSheet;
  onSave: (record: HistoryRecord) => void;
}

export function InspectionForm({ sheet, onSave }: InspectionFormProps) {
  const defaultItemValues: Record<number, ItemFormState> = {};
  sheet.items.forEach((_, idx) => {
    defaultItemValues[idx] = {
      score: null,
      redTriggered: "否",
      remark: "",
      responsible: "",
      correction: "无",
    };
  });

  const [formState, setFormState] = useState<FormState>({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().substring(0, 5),
    inspector: "",
    shift: "",
    status: "",
    staff: "",
    ownerFollow: "否",
    majorIssues: "",
    itemValues: defaultItemValues,
  });

  useEffect(() => {
    const newDefaults: Record<number, ItemFormState> = {};
    sheet.items.forEach((item, idx) => {
      newDefaults[idx] = {
        score: null,
        redTriggered: "否",
        remark: "",
        responsible: "",
        correction: "无",
      };
    });
    setFormState((prev) => ({
      ...prev,
      itemValues: newDefaults,
    }));
  }, [sheet]);

  const handleUpdateItem = (idx: number, updates: Partial<ItemFormState>) => {
    setFormState((prev) => ({
      ...prev,
      itemValues: {
        ...prev.itemValues,
        [idx]: {
          ...prev.itemValues[idx],
          ...updates,
        },
      },
    }));
  };

  const summary = useMemo(() => calculateSummary(sheet, formState), [sheet, formState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: HistoryRecord = {
      sheet: sheet.name,
      date: formState.date,
      time: formState.time,
      inspector: formState.inspector,
      shift: formState.shift,
      status: formState.status,
      staff: formState.staff,
      ownerFollow: formState.ownerFollow,
      redCount: summary.redCount,
      totalScore: summary.finalScore,
      grade: summary.grade,
      passFail: summary.passFail,
      majorIssues: formState.majorIssues,
      items: sheet.items.map((it, idx) => {
        const val = formState.itemValues[idx];
        const weighted = val.score !== null ? (val.score / 2) * it.weight : 0;
        return {
          module: it.module,
          item: it.item,
          score: val.score,
          redTriggered: val.redTriggered,
          remark: val.remark,
          responsible: val.responsible,
          correction: val.correction,
          weighted,
        };
      }),
      timestamp: new Date().toISOString(),
    };
    onSave(record);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in fade-in slide-in-from-bottom-2 duration-500"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-semibold text-gray-900">{sheet.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{sheet.description}</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">日期</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-md"
                value={formState.date}
                onChange={(e) => setFormState({ ...formState, date: e.target.value })}
              />
            </div>
            {/* Shortened input fields for brevity */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">时间</label>
              <input
                type="time"
                className="w-full px-3 py-2 border rounded-md"
                value={formState.time}
                onChange={(e) => setFormState({ ...formState, time: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">当班店员</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={formState.inspector}
                onChange={(e) =>
                  setFormState({ ...formState, inspector: e.target.value })
                }
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded-lg border text-center">
                <div className="text-xs text-gray-500 mb-1">红线触发</div>
                <div className={`text-2xl font-bold ${summary.redCount > 0 ? "text-red-600" : ""}`}>{summary.redCount}</div>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center">
                <div className="text-xs text-gray-500 mb-1">总分</div>
                <div className="text-2xl font-bold">{summary.finalScore}</div>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center">
                <div className="text-xs text-gray-500 mb-1">等级</div>
                <div className="text-xl font-bold">{summary.grade || "-"}</div>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center">
                <div className="text-xs text-gray-500 mb-1">判定</div>
                <div className="text-xl font-bold">{summary.passFail || "-"}</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3">模块</th>
                <th className="px-4 py-3">巡查项</th>
                <th className="px-4 py-3">标准</th>
                <th className="px-4 py-3">分数</th>
                <th className="px-4 py-3">红线</th>
                <th className="px-4 py-3">备注</th>
                <th className="px-4 py-3">纠正状态</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {sheet.items.map((item, idx) => {
                const val = formState.itemValues[idx] || {
                  score: null,
                  redTriggered: "否",
                  remark: "",
                  responsible: "",
                  correction: "无",
                };
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{item.module}</td>
                    <td className="px-4 py-3 font-medium">{item.item}</td>
                    <td className="px-4 py-3 whitespace-normal max-w-xs text-xs">{item.standard}</td>
                    <td className="px-4 py-3">
                      <select
                        className="border rounded p-1"
                        value={val.score === null ? "" : val.score}
                        onChange={(e) =>
                          handleUpdateItem(idx, {
                            score: e.target.value === "" ? null : Number(e.target.value),
                          })
                        }
                      >
                        <option value="">-</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="border rounded p-1"
                        value={val.redTriggered}
                        onChange={(e) =>
                          handleUpdateItem(idx, { redTriggered: e.target.value as any })
                        }
                      >
                        <option value="否">否</option>
                        <option value="是">是</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        className="border rounded p-1 w-full"
                        value={val.remark}
                        onChange={(e) => handleUpdateItem(idx, { remark: e.target.value })}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="border rounded p-1 w-full"
                        value={val.correction}
                        onChange={(e) =>
                          handleUpdateItem(idx, { correction: e.target.value as any })
                        }
                      >
                        <option value="无">无</option>
                        <option value="未纠正">未纠正</option>
                        <option value="已纠正">已纠正</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end sticky bottom-6 z-20">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        >
          提交评分记录
        </button>
      </div>
    </form>
  );
}

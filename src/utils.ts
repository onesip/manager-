import { FormState, ScoringSheet, ScoreSummary } from "./types";

export function calculateSummary(sheet: ScoringSheet, formState: FormState): ScoreSummary {
  let total = 0;
  let redCount = 0;
  let weightSum = 0;

  sheet.items.forEach((item, idx) => {
    const val = formState.itemValues[idx];
    if (!val) return;

    if (val.score !== null) {
      const w = (val.score / 2) * item.weight;
      total += w;
      weightSum += item.weight;
    }

    if (item.is_redline && val.redTriggered === "是") {
      redCount++;
    }
  });

  let finalScore = 0;
  const isPointBased = ["周中巡查评分", "周末高峰评分"].includes(sheet.name);

  if (isPointBased) {
    finalScore = total;
  } else {
    finalScore = weightSum > 0 ? (total / weightSum) * 100 : 0;
  }

  // Round to 1 decimal place
  finalScore = Math.round(finalScore * 10) / 10;

  let grade = "";
  if (isPointBased) {
    if (redCount > 0) grade = "红线待处理";
    else if (finalScore >= 90) grade = "A 优秀";
    else if (finalScore >= 80) grade = "B 稳定";
    else if (finalScore >= 70) grade = "C 需改进";
    else grade = "D 不达标";
  } else {
    if (redCount > 0) grade = "D 不达标";
    else if (finalScore >= 90) grade = "A 优秀";
    else if (finalScore >= 80) grade = "B 稳定";
    else if (finalScore >= 70) grade = "C 待加强";
    else grade = "D 不达标";
  }

  let passFail = "";
  if (isPointBased) {
    passFail = redCount > 0 ? "不通过" : finalScore >= 70 ? "通过" : "不通过";
  } else {
    passFail =
      redCount > 0 ? "不通过（红线）" : finalScore >= 70 ? "通过" : "不通过";
  }

  return {
    total,
    redCount,
    finalScore,
    grade,
    passFail,
  };
}

export function exportToCSV(history: any[]) {
  if (history.length === 0) {
    alert("没有历史记录可导出");
    return;
  }

  let csv =
    "页面,日期,时间,当班店员,班次/场景,门店状态,当班员工,Owner跟进,红线触发数,总分,等级,判定,主要问题\n";

  history.forEach((rec) => {
    const row = [
      rec.sheet,
      rec.date || "",
      rec.time || "",
      rec.inspector || "",
      rec.shift || "",
      rec.status || "",
      rec.staff || "",
      rec.ownerFollow || "",
      rec.redCount,
      rec.totalScore,
      rec.grade,
      rec.passFail,
      (rec.majorIssues || "").replace(/\n/g, " "),
    ];
    csv += row.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "scoring_history.csv";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

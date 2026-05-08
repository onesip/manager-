export interface ScoringItem {
  module: string;
  item: string;
  standard: string;
  is_redline: boolean;
  is_key: boolean;
  weight: number;
}

export interface ScoringSheet {
  name: string;
  title: string;
  description: string;
  items: ScoringItem[];
  total_weight: number;
  use_module_weight: boolean;
}

export interface ItemFormState {
  score: number | null;
  redTriggered: "否" | "是";
  remark: string;
  responsible: string;
  correction: "未纠正" | "已纠正" | "无";
}

export interface FormState {
  date: string;
  time: string;
  inspector: string;
  shift: string;
  status: string;
  staff: string;
  ownerFollow: "否" | "是";
  majorIssues: string;
  itemValues: Record<number, ItemFormState>;
}

export interface ScoreSummary {
  total: number;
  redCount: number;
  finalScore: number;
  grade: string;
  passFail: string;
}

export interface HistoryRecord {
  sheet: string;
  date: string;
  time: string;
  inspector: string;
  shift: string;
  status: string;
  staff: string;
  ownerFollow: string;
  redCount: number;
  totalScore: number;
  grade: string;
  passFail: string;
  majorIssues: string;
  items: {
    module: string;
    item: string;
    score: number | null;
    redTriggered: string;
    remark: string;
    responsible: string;
    correction: string;
    weighted: number;
  }[];
  timestamp: string;
}

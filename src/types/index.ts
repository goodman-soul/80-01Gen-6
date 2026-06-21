export type UserRole = "curator" | "warehouse" | "logistics" | "external";

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  museumId?: string;
}

export type ExhibitionStatus =
  | "pending_packing"
  | "packed"
  | "in_transit"
  | "delivered"
  | "signed"
  | "returning"
  | "completed";

export interface Museum {
  id: string;
  name: string;
  address: string;
  contact: string;
}

export interface PackingRecord {
  id: string;
  exhibitionId: string;
  packerName: string;
  packedAt: string;
  photos: string[];
  remark: string;
}

export interface EnvironmentLog {
  id: string;
  exhibitionId: string;
  temperature: number;
  humidity: number;
  recordedAt: string;
  operatorId: string;
  location: string;
}

export interface UnpackingRecord {
  id: string;
  exhibitionId: string;
  operatorName: string;
  reason: string;
  unpackedAt: string;
  photos: string[];
}

export interface SignRecord {
  id: string;
  exhibitionId: string;
  receiverName: string;
  signedAt: string;
  photos: string[];
  isGoodCondition: boolean;
  remark: string;
}

export interface Exhibition {
  id: string;
  artifactNo: string;
  artifactName: string;
  insuranceAmount: number;
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  humidityMax: number;
  startDate: string;
  endDate: string;
  status: ExhibitionStatus;
  curatorId: string;
  curatorName: string;
  museumId: string;
  museumName: string;
  remark: string;
  createdAt: string;
  packingRecord?: PackingRecord;
  environmentLogs: EnvironmentLog[];
  unpackingRecords: UnpackingRecord[];
  signRecord?: SignRecord;
}

export const STATUS_LABEL: Record<ExhibitionStatus, string> = {
  pending_packing: "待装箱",
  packed: "已装箱",
  in_transit: "运输中",
  delivered: "待签收",
  signed: "展期内",
  returning: "归还中",
  completed: "已完成",
};

export const STATUS_COLOR: Record<ExhibitionStatus, string> = {
  pending_packing: "bg-amber-100 text-amber-800",
  packed: "bg-blue-100 text-blue-800",
  in_transit: "bg-indigo-100 text-indigo-800",
  delivered: "bg-purple-100 text-purple-800",
  signed: "bg-emerald-100 text-emerald-800",
  returning: "bg-cyan-100 text-cyan-800",
  completed: "bg-parchment-200 text-ink-600",
};

export const ROLE_LABEL: Record<UserRole, string> = {
  curator: "策展人",
  warehouse: "库房管理员",
  logistics: "物流人员",
  external: "外部展馆",
};

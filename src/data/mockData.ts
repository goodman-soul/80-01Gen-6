import type {
  Exhibition,
  Museum,
  User,
} from "@/types";

export interface MockUser extends User {
  password: string;
}

export const mockUsers: MockUser[] = [
  {
    id: "u1",
    username: "curator",
    password: "curator123",
    name: "张明远",
    role: "curator",
  },
  {
    id: "u2",
    username: "warehouse",
    password: "warehouse123",
    name: "李守库",
    role: "warehouse",
  },
  {
    id: "u3",
    username: "logistics",
    password: "logistics123",
    name: "王承运",
    role: "logistics",
  },
  {
    id: "u4",
    username: "external",
    password: "external123",
    name: "苏馆长",
    role: "external",
    museumId: "m1",
  },
];

export const mockMuseums: Museum[] = [
  {
    id: "m1",
    name: "江南博物馆",
    address: "南京市玄武区中山路321号",
    contact: "苏馆长 13800001111",
  },
  {
    id: "m2",
    name: "巴蜀文化博物馆",
    address: "成都市锦江区文博路88号",
    contact: "陈主任 13900002222",
  },
  {
    id: "m3",
    name: "齐鲁历史博物馆",
    address: "济南市历下区文化东路168号",
    contact: "赵馆长 13700003333",
  },
];

const now = new Date();
const daysAgo = (d: number) => {
  const t = new Date(now);
  t.setDate(t.getDate() - d);
  return t.toISOString();
};
const daysLater = (d: number) => {
  const t = new Date(now);
  t.setDate(t.getDate() + d);
  return t.toISOString().split("T")[0];
};

export const mockExhibitions: Exhibition[] = [
  {
    id: "ex001",
    artifactNo: "BW-2018-0342",
    artifactName: "商代青铜饕餮纹方鼎",
    insuranceAmount: 5800000,
    tempMin: 18,
    tempMax: 22,
    humidityMin: 45,
    humidityMax: 55,
    startDate: daysLater(3),
    endDate: daysLater(63),
    status: "in_transit",
    curatorId: "u1",
    curatorName: "张明远",
    museumId: "m1",
    museumName: "江南博物馆",
    remark: "国家一级文物，需防震包装",
    createdAt: daysAgo(5),
    packingRecord: {
      id: "p001",
      exhibitionId: "ex001",
      packerName: "李守库",
      packedAt: daysAgo(3),
      photos: ["pack1", "pack2"],
      remark: "使用定制防震木箱，填充缓冲材料",
    },
    environmentLogs: [
      { id: "e1", exhibitionId: "ex001", temperature: 20, humidity: 50, recordedAt: daysAgo(2), operatorId: "u3", location: "出库检查" },
      { id: "e2", exhibitionId: "ex001", temperature: 19.5, humidity: 48, recordedAt: daysAgo(1.5), operatorId: "u3", location: "运输途中-徐州" },
      { id: "e3", exhibitionId: "ex001", temperature: 21, humidity: 52, recordedAt: daysAgo(0.5), operatorId: "u3", location: "运输途中-蚌埠" },
      { id: "e4", exhibitionId: "ex001", temperature: 24, humidity: 58, recordedAt: daysAgo(0.1), operatorId: "u3", location: "运输途中-南京近郊" },
    ],
    unpackingRecords: [
      {
        id: "up001",
        exhibitionId: "ex001",
        operatorName: "王承运",
        reason: "途中环境检查",
        unpackedAt: daysAgo(1),
        photos: ["chk1"],
      },
    ],
  },
  {
    id: "ex002",
    artifactNo: "BW-2020-1105",
    artifactName: "唐代彩绘陶俑一组",
    insuranceAmount: 2200000,
    tempMin: 16,
    tempMax: 24,
    humidityMin: 40,
    humidityMax: 60,
    startDate: daysLater(10),
    endDate: daysLater(70),
    status: "pending_packing",
    curatorId: "u1",
    curatorName: "张明远",
    museumId: "m2",
    museumName: "巴蜀文化博物馆",
    remark: "共8件陶俑，分别包装",
    createdAt: daysAgo(2),
    environmentLogs: [],
    unpackingRecords: [],
  },
  {
    id: "ex003",
    artifactNo: "BW-2015-0078",
    artifactName: "宋汝窑天青釉洗",
    insuranceAmount: 12000000,
    tempMin: 18,
    tempMax: 20,
    humidityMin: 48,
    humidityMax: 52,
    startDate: daysAgo(15),
    endDate: daysLater(45),
    status: "signed",
    curatorId: "u1",
    curatorName: "张明远",
    museumId: "m1",
    museumName: "江南博物馆",
    remark: "珍贵一级文物，温湿度需严格控制",
    createdAt: daysAgo(25),
    packingRecord: {
      id: "p003",
      exhibitionId: "ex003",
      packerName: "李守库",
      packedAt: daysAgo(23),
      photos: ["pack3"],
      remark: "锦盒+防震泡沫+定制恒温箱",
    },
    environmentLogs: Array.from({ length: 12 }, (_, i) => ({
      id: `el-${i}`,
      exhibitionId: "ex003",
      temperature: 18.5 + Math.random() * 1.5,
      humidity: 48 + Math.random() * 4,
      recordedAt: daysAgo(22 - i * 1.8),
      operatorId: "u3",
      location: i < 3 ? "运输途中" : "展馆展厅",
    })),
    unpackingRecords: [
      { id: "up3-1", exhibitionId: "ex003", operatorName: "苏馆长", reason: "到馆验收", unpackedAt: daysAgo(15), photos: ["a1", "a2"] },
    ],
    signRecord: {
      id: "s003",
      exhibitionId: "ex003",
      receiverName: "苏馆长",
      signedAt: daysAgo(15),
      photos: ["sign1"],
      isGoodCondition: true,
      remark: "文物完好，已入展柜",
    },
  },
  {
    id: "ex004",
    artifactNo: "BW-2019-0891",
    artifactName: "明宣德青花缠枝莲纹罐",
    insuranceAmount: 3600000,
    tempMin: 18,
    tempMax: 22,
    humidityMin: 45,
    humidityMax: 55,
    startDate: daysAgo(60),
    endDate: daysAgo(5),
    status: "completed",
    curatorId: "u1",
    curatorName: "张明远",
    museumId: "m3",
    museumName: "齐鲁历史博物馆",
    remark: "",
    createdAt: daysAgo(75),
    packingRecord: {
      id: "p004",
      exhibitionId: "ex004",
      packerName: "李守库",
      packedAt: daysAgo(73),
      photos: [],
      remark: "标准文物包装",
    },
    environmentLogs: [
      { id: "e4-1", exhibitionId: "ex004", temperature: 20, humidity: 50, recordedAt: daysAgo(70), operatorId: "u3", location: "运输途中" },
    ],
    unpackingRecords: [],
    signRecord: {
      id: "s004",
      exhibitionId: "ex004",
      receiverName: "赵馆长",
      signedAt: daysAgo(68),
      photos: [],
      isGoodCondition: true,
      remark: "完好签收",
    },
  },
  {
    id: "ex005",
    artifactNo: "BW-2021-0456",
    artifactName: "新石器时代玉琮",
    insuranceAmount: 8500000,
    tempMin: 16,
    tempMax: 25,
    humidityMin: 35,
    humidityMax: 65,
    startDate: daysLater(1),
    endDate: daysLater(31),
    status: "packed",
    curatorId: "u1",
    curatorName: "张明远",
    museumId: "m2",
    museumName: "巴蜀文化博物馆",
    remark: "良渚文化代表器物",
    createdAt: daysAgo(4),
    packingRecord: {
      id: "p005",
      exhibitionId: "ex005",
      packerName: "李守库",
      packedAt: daysAgo(1),
      photos: ["pk1"],
      remark: "锦盒包装，已称重记录",
    },
    environmentLogs: [],
    unpackingRecords: [],
  },
];

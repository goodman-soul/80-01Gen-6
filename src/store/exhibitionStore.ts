import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Exhibition,
  PackingRecord,
  EnvironmentLog,
  UnpackingRecord,
  SignRecord,
} from "@/types";
import { mockExhibitions } from "@/data/mockData";
import { genId, nowIso } from "@/utils/format";

interface NewExhibitionInput {
  artifactNo: string;
  artifactName: string;
  insuranceAmount: number;
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  humidityMax: number;
  startDate: string;
  endDate: string;
  museumId: string;
  museumName: string;
  curatorId: string;
  curatorName: string;
  remark: string;
}

interface ExhibitionState {
  exhibitions: Exhibition[];
  createExhibition: (input: NewExhibitionInput) => Exhibition;
  updateExhibition: (id: string, patch: Partial<Exhibition>) => void;
  confirmPacking: (
    exhibitionId: string,
    record: Omit<PackingRecord, "id" | "exhibitionId" | "packedAt">
  ) => void;
  addEnvironmentLog: (
    log: Omit<EnvironmentLog, "id" | "recordedAt">
  ) => void;
  addUnpackingRecord: (
    record: Omit<UnpackingRecord, "id" | "unpackedAt">
  ) => void;
  confirmSign: (
    exhibitionId: string,
    record: Omit<SignRecord, "id" | "exhibitionId" | "signedAt">
  ) => void;
  getById: (id: string) => Exhibition | undefined;
}

export const useExhibitionStore = create<ExhibitionState>()(
  persist(
    (set, get) => ({
      exhibitions: mockExhibitions,

      createExhibition: (input) => {
        const newItem: Exhibition = {
          id: genId("ex"),
          status: "pending_packing",
          createdAt: nowIso(),
          environmentLogs: [],
          unpackingRecords: [],
          ...input,
        };
        set((s) => ({ exhibitions: [newItem, ...s.exhibitions] }));
        return newItem;
      },

      updateExhibition: (id, patch) => {
        set((s) => ({
          exhibitions: s.exhibitions.map((e) =>
            e.id === id ? { ...e, ...patch } : e
          ),
        }));
      },

      confirmPacking: (exhibitionId, record) => {
        const packing: PackingRecord = {
          id: genId("p"),
          exhibitionId,
          packedAt: nowIso(),
          ...record,
        };
        set((s) => ({
          exhibitions: s.exhibitions.map((e) =>
            e.id === exhibitionId
              ? { ...e, status: "packed", packingRecord: packing }
              : e
          ),
        }));
      },

      addEnvironmentLog: (log) => {
        const full: EnvironmentLog = {
          id: genId("el"),
          recordedAt: nowIso(),
          ...log,
        };
        set((s) => ({
          exhibitions: s.exhibitions.map((e) =>
            e.id === log.exhibitionId
              ? {
                  ...e,
                  environmentLogs: [...e.environmentLogs, full],
                  status:
                    e.status === "packed" || e.status === "delivered"
                      ? "in_transit"
                      : e.status,
                }
              : e
          ),
        }));
      },

      addUnpackingRecord: (record) => {
        const full: UnpackingRecord = {
          id: genId("up"),
          unpackedAt: nowIso(),
          ...record,
        };
        set((s) => ({
          exhibitions: s.exhibitions.map((e) =>
            e.id === record.exhibitionId
              ? {
                  ...e,
                  unpackingRecords: [...e.unpackingRecords, full],
                }
              : e
          ),
        }));
      },

      confirmSign: (exhibitionId, record) => {
        const sign: SignRecord = {
          id: genId("s"),
          exhibitionId,
          signedAt: nowIso(),
          ...record,
        };
        set((s) => ({
          exhibitions: s.exhibitions.map((e) =>
            e.id === exhibitionId
              ? { ...e, status: "signed", signRecord: sign }
              : e
          ),
        }));
      },

      getById: (id) => get().exhibitions.find((e) => e.id === id),
    }),
    { name: "museum-exhibitions" }
  )
);

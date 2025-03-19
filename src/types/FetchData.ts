import { CalcRequestData } from "@/interfaces";

export type FetchData = Omit<CalcRequestData, 'pairId'>;
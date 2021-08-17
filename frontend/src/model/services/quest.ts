import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Quest {
  id: string;
  title: string;
  description: string;
  maxXp: number;
  xp: number | null;
  minLevel: number;
  disabled: boolean;
  archived: boolean;
  state: state;
  versions?: Version[];
}

export interface Version {
  id: number;
  quest_id: number;
  created_at: string;
  fields: any;
}

export type state = "open" | "closed" | "hidden";

export const questApi = createApi({
  reducerPath: "questApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (builder) => ({
    getQuest: builder.query<Quest, string>({
      query: (arg) => `quests/${arg}`
    })
  })
});

export const { useGetQuestQuery } = questApi;

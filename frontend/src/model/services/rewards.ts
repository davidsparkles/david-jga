import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Reward {
  id: number;
  title: string;
  description: string;
  minLevel: string;
  disabled: boolean;
  locked: boolean;
  img?: string;
}

export const rewardsApi = createApi({
  reducerPath: "rewardsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (builder) => ({
    getRewards: builder.query<Reward[], undefined>({
      query: () => "rewards"
    }),
    getReward: builder.query<Reward, string>({
      query: (arg) => `rewards/${arg}`
    })
  })
});

export const { useGetRewardsQuery, useGetRewardQuery } = rewardsApi;

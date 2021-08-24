import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Reward {
  id: number;
  title: string;
  description: string;
  minLevel: number;
  disabled: boolean;
  locked: boolean;
  img?: string;
}

export const rewardsApi = createApi({
  reducerPath: "rewardsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  tagTypes: ["Reward"],
  endpoints: (build) => ({
    getRewards: build.query<Reward[], undefined>({
      query: () => "rewards"
    }),
    getReward: build.query<Reward, string>({
      query: (arg) => `rewards/${arg}`
    }),
    updateReward: build.mutation<undefined, Partial<Reward> & Pick<Reward, 'id'>>({
      // note: an optional `queryFn` may be used in place of `query`
      query: ({ id, ...patch }) => ({
        url: `rewards/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ["Reward"],
    }),
  })
});

export const { useGetRewardsQuery, useGetRewardQuery, useUpdateRewardMutation } = rewardsApi;

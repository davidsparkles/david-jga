import React from "react";
import { useGetRewardsQuery } from "../../model/services/rewards";
import Loading from "../../components/Loading";
import NoData from "../../components/NoData";

export default function Rewards(props: { refetch: () => void }): JSX.Element {
  const { data, error, isLoading } = useGetRewardsQuery(undefined);

  return (
    <div className="rewards">
      <h2>Rewards</h2>
      {isLoading && <Loading />}
      {error && <span className="error">{JSON.stringify(error)}</span>}
      {
        data != null && data.length > 0 ? (
          <ul className="rewards-list">
            {
              data?.map((item, index) => (
                <li key={index}>
                  {JSON.stringify(item)}
                </li>
              ))
            }
          </ul>
        ) : (
          <NoData />
        )
      }
    </div>
  );
}

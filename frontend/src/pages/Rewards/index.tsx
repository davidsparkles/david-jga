import React from "react";
import { useGetRewardsQuery } from "../../model/services/rewards";
import Loading from "../../components/Loading";
import NoData from "../../components/NoData";
import "./styles.scss";

export default function Rewards(props: { refetch: () => void }): JSX.Element {
  const { data, error, isLoading } = useGetRewardsQuery(undefined);

  return (
    <div className="rewards">
      <h2>Belohnungen</h2>
      {isLoading && <Loading />}
      {error && <span className="error">{JSON.stringify(error)}</span>}
      {
        data != null && data.length > 0 ? (
          <ul className="rewards-list">
            {
              data?.map((item, index) => (
                <li key={index} className={`reward-item ${item.disabled === true ? "disabled" : "enabled"} ${item.locked === true ? "locked" : "unlocked"}`}>
                  <div className="title">
                    {item.title}
                  </div>
                  <div className="description">
                    {item.description}
                  </div>
                  <div className="min-level">
                    Ab Level {item.minLevel}
                  </div>
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

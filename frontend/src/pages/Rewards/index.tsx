import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading";
import NoData from "../../components/NoData";
import { useGetRewardsQuery } from "../../model/services/rewards";
import { selectPermission } from "../../model/permissionReducer";
import "./styles.scss";

export default function Rewards(props: { refetch: () => void }): JSX.Element {
  const permission = useSelector(selectPermission);
  const { data, error, isLoading, refetch } = useGetRewardsQuery(undefined);

  useEffect(() => refetch(), [refetch]);

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
                    {item.title}{permission === "edit" && <> ({item.id})</>}
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

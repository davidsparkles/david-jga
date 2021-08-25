import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../components/Loading";
import NoData from "../../components/NoData";
import { useGetRewardsQuery, useCreateRewardMutation } from "../../model/services/rewards";
import { selectPermission } from "../../model/permissionReducer";
import "./styles.scss";

export default function Rewards(props: { refetch: () => void }): JSX.Element {
  const permission = useSelector(selectPermission);
  const { data, error, isLoading, refetch } = useGetRewardsQuery(undefined);
  const [createReward] = useCreateRewardMutation();

  useEffect(() => refetch(), [refetch]);

  const history = useHistory();

  return (
    <div className="rewards">
      <h2>Belohnungen</h2>
      {isLoading && <Loading />}
      {error && <span className="error">{JSON.stringify(error)}</span>}
      {
        data != null && data.length > 0 ? (
          <ul className="rewards-list">
            {
              data?.filter((item) => !item.disabled || permission === "edit")
                .map((item, index) => (
                <li
                  key={index} className={`reward-item ${item.disabled === true ? "disabled" : "enabled"} ${item.locked === true ? "locked" : "unlocked"}`}
                  onClick={() => {
                    if (item.locked && permission === "none") return;
                    history.push(`/rewards/${item.id}`);
                  }}
                >
                  <div className="title">
                    {item.locked && permission === "none" ? "???" : item.title}{permission === "edit" && <> ({item.id})</>}
                  </div>
                  <div className="description">
                    {item.locked && permission === "none" ? "???" : item.description}
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
      {permission === "edit" && (
        <div className="createQuestContainer">
          <button onClick={async () => {
            createReward(undefined);
          }}>
            + Neue Belohnung
          </button>
        </div>
      )}
    </div>
  );
}

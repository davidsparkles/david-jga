import React, { useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { useHistory, useParams } from "react-router-dom";
import { Button, Error, Loading, NoData } from "../../components";
import { useAppSelector } from "../../model/hooks";
import { selectPermission } from "../../model/permissionReducer";
import { useGetRewardQuery } from "../../model/services/rewards";
import "./styles.scss";

export default function RewardDetails(props: object): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { data: reward, error, isLoading, refetch } = useGetRewardQuery(id);
  const permission = useAppSelector(selectPermission);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <Loading />;
  if (reward == null) return <NoData />;
  if (error) return <Error error={error} />

  return <div className="reward-detail">
    <div className="reward-header" >
      <BiArrowBack className="back-arrow" onClick={() => history.push("/rewards")} />
      <div className="reward-title">{reward.title ?? "-"}</div>
    </div>
    {reward.img && <img className="reward-image" src={`${reward.img}`} alt={reward.img} />}
    <div className="reward-description">{reward.description?.split(/\n/).map((part) => (<p>{part}</p>)) ?? "-"}</div>
    {
      permission === "edit" && (
        <Button onClick={() => history.push(`/rewards/${reward.id}/edit`)} >
          <AiFillEdit />
        </Button>
      )
    }
  </div>;
}
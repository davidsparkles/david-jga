import React, { useCallback, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useHistory, useParams } from "react-router-dom";
import { Button, Error, Loading, NoData } from "../../components";
import { useAppSelector } from "../../model/hooks";
import { selectPermission } from "../../model/permissionReducer";
import { Reward, useGetRewardQuery, useUpdateRewardMutation } from "../../model/services/rewards";
import "./styles.scss";

export default function RewardEdit(props: object): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { data: reward, error, isLoading, refetch } = useGetRewardQuery(id); 
  const [updateReward, { isLoading: isUpdating }] = useUpdateRewardMutation();
  const permission = useAppSelector(selectPermission);
  const [values, setValues] = useState<Partial<Reward>>(reward ?? {});

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const data = reward ?? {};
    setValues(data);
  }, [setValues, reward]);

  const onSave = useCallback(() => {
    if (reward == null) return;
    updateReward({ ...values, id: reward.id });
    refetch();
    history.push(`/rewards/${reward.id}`);
  }, [updateReward, history, refetch, reward, values]);

  if (isLoading) return <Loading />;
  if (reward == null) return <NoData />;
  if (error) return <Error error={error} />
  if (permission !== "edit") return <>Keine Berechtigung</>;

  return <div className="reward-edit">
    <div className="reward-header" >
      <BiArrowBack className="back-arrow" onClick={() => history.push("/rewards")} />
      <div className="reward-title">
        <input value={values.title} onChange={(evt) => setValues({ ...values, title: evt.target.value })} />
      </div>
    </div>
    Image: <input value={values.img} onChange={(evt) => setValues({ ...values, img: evt.target.value })} />
    <div className="reward-description">
      <textarea rows={10} value={values.description} onChange={(evt) => setValues({ ...values, description: evt.target.value })} />
    </div>
    Min-Level: <input type="number" value={values.minLevel} onChange={(evt) => setValues({ ...values, minLevel: parseInt(evt.target.value, 10) })} />
    Versteckt: <input type="checkbox" checked={values.disabled} onChange={(evt) => setValues({ ...values, disabled: evt.target.checked })} />
    <Button onClick={onSave} loading={isUpdating} >
      Speichern
    </Button>
  </div>;
}
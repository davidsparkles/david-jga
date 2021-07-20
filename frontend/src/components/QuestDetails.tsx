import React, { useCallback, useEffect, useState } from "react";
import { Quest } from "../api/useData";
import { usePostQuest } from "../api/usePostQuest";
import { Permission } from "../permission";
import "./QuestDetails.css";

interface Values {
  title: string;
  description: string;
  maxXp: number;
}

export default function QuestDetails(props: { quest: Quest; onBack: () => void; permission: Permission }): JSX.Element {
  const { quest, onBack, permission } = props;

  const [values, setValues] = useState<Values>({ title: "", description: "", maxXp: 0 })

  const { loading, error, post } = usePostQuest();

  useEffect(() => {
    if (quest != null) {
      setValues({
        title: quest.title ?? "",
        description: quest.description ?? "",
        maxXp: quest.maxXp 
      })
    }
  }, [quest]);

  const onSave = useCallback(async () => {
    await post({ id: quest.id, ...values });
    onBack();
  }, [onBack, post, quest, values]);

  return <div className="questDetails">
    <div className="backArrowContainer">
      <button className="backArrow" onClick={() => onBack()}>🠔 Zurück</button>
    </div>
    <div className="label">
      Titel
    </div>
    <div className="value">
      {
        permission === "edit"
        ?
        (<input value={values.title} onChange={(evt) => setValues({ ...values, title: evt.target.value })} />)
        :
        quest.title ?? "-"
      }
    </div>
    <div className="label">
      Beschreibung
    </div>
    <div className="value">
      {
        permission === "edit"
        ?
        (<textarea rows={10} value={values.description} onChange={(evt) => setValues({ ...values, description: evt.target.value })} />)
        :
        quest.description ?? "-"
      }
    </div>
    <div className="label">
      Maximale XP
    </div>
    <div className="value">
      {
        permission === "edit"
        ?
        (<input type="number" value={values.maxXp} onChange={(evt) => setValues({ ...values, maxXp: parseInt(evt.target.value, 10) })} />)
        :
        quest.maxXp
      }
    </div>
    <div className="label">
      Erreichte XP
    </div>
    <div className="value">
      {quest.state !== "closed" ? "-" : quest.reachedXp}
    </div>
    {permission === "edit" && (
      <div className="saveContainer">
        <button onClick={onSave}>Speichern</button> {loading ?? <>loading...</>} {error && <>{JSON.stringify(error)}</>}
      </div>
    )}
  </div>;
}
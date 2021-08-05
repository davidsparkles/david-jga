import React, { useCallback, useEffect, useState } from "react";
import { Quest } from "../api/useData";
import { usePostQuest } from "../api/usePostQuest";
import { Permission } from "../permission";
import "./QuestDetails.css";

interface Values {
  title: string;
  description: string;
  maxXp: number;
  minLevel: number;
  xp: number | null;
  disabled: boolean;
  archived: boolean;
}

export default function QuestDetails(props: { quest: Quest; onBack: () => void; permission: Permission }): JSX.Element {
  const { quest, onBack, permission } = props;

  const [values, setValues] = useState<Values>({ title: "", description: "", maxXp: 0, minLevel: 0, xp: null, disabled: false, archived: false });

  const { loading, error, post } = usePostQuest();

  useEffect(() => {
    if (quest != null) {
      setValues({
        title: quest.title ?? "",
        description: quest.description ?? "",
        maxXp: quest.maxXp,
        minLevel: quest.minLevel,
        xp: quest.xp,
        disabled: quest.disabled ?? false,
        archived: quest.archived ?? false
      })
    }
  }, [quest]);

  const onSave = useCallback(async () => {
    await post({ id: quest.id, ...values });
    onBack();
  }, [onBack, post, quest, values]);

  const onDelete = useCallback(async () => {
    await post({ delete: true, id: quest.id });
    onBack();
  }, [onBack, post, quest]);

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
      Mindestens Level
    </div>
    <div className="value">
      {
        permission === "edit"
        ?
        (<input type="number" value={values.minLevel} onChange={(evt) => setValues({ ...values, minLevel: parseInt(evt.target.value, 10) })} />)
        :
        quest.minLevel
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
      {
        permission === "edit"
        ?
        (<input type="number" value={values.xp ?? "-"} onChange={(evt) => {
          const xp = parseInt(evt.target.value, 10);
          setValues({ ...values, xp: xp < 0 ? null : xp })
        }} />)
        :
        quest.state !== "closed" ? "-" : quest.xp
      }
    </div>
    {
      permission === "edit" && (
        <>
          <div className="label">
            Ausblenden
          </div>
          <div className="value">
            <input type="checkbox" checked={values.disabled} onChange={(evt) => setValues({ ...values, disabled: evt.target.checked })} />
          </div>
          <div className="label">
            Archiviert
          </div>
          <div className="value">
            <input type="checkbox" checked={values.archived} onChange={(evt) => setValues({ ...values, archived: evt.target.checked })} />
          </div>
        <div className="buttonContainer">
          <div className="saveContainer">
            <button onClick={onSave}>Speichern</button>
          </div>
          {quest.archived && (
            <div className="deleteContainer">
              <button onClick={onDelete}>Quest löschen</button>
            </div>
          )}
          {loading ?? <>loading...</>}
          {error && <>{JSON.stringify(error)}</>}
        </div>
        <h4>Versionen</h4>
        <div className="versionList">
          {quest.versions?.map(({ id, created_at, fields }) => (
            <div className="versionItem">
              Version {id} vom {new Intl.DateTimeFormat("de").format(new Date(created_at))} {created_at.substring(11, 19)}{" "}
              <button onClick={() => setValues({ ...values, ...fields, maxXp: fields.max_xp, minLevel: fields.min_level })}>🔃</button>
            </div>
          ))}
        </div>
      </>
    )}
  </div>;
}
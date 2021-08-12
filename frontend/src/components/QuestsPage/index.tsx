import React, { useState } from "react";
import Cookies from "js-cookie";
import { Quest } from "../../api/useData";
import { usePostQuest } from "../../api/usePostQuest";
import { useAppSelector } from "../../model/hooks";
import { selectPermission } from "../../model/permissionReducer";
import QuestDetails from "./QuestDetails";

export default function QuestsPage(props: { quests: Quest[]; refetch: () => void }): JSX.Element {
  const permission = useAppSelector(selectPermission);

  const [filterList, setFilterList] = useState<boolean>(Cookies.get("filterList") != null ? Cookies.get("filterList") === "true" : true);
  const [filterArchivedList, setFilterArchivedList] = useState<boolean>(Cookies.get("filterArchivedList") != null ? Cookies.get("filterArchivedList") === "true" : false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const { loading, error, post } = usePostQuest();

  if (selectedQuest != null) {
    return <QuestDetails quest={selectedQuest} onBack={() => { setSelectedQuest(null); props.refetch() }} />;
  }

  return (
    <>
      <div className="questList">
        <div className="questFilter">
          <input type="checkbox" checked={filterList} onChange={(evt) => {
            setFilterList(evt.target.checked);
            Cookies.set("filterList", `${evt.target.checked}`);
          }} />Erledigte Quests
        </div>
        {permission === "edit" && (
          <div className="questFilter">
            <input type="checkbox" checked={filterArchivedList} onChange={(evt) => {
              setFilterArchivedList(evt.target.checked);
              Cookies.set("filterArchivedList", `${evt.target.checked}`);
            }} />Archivierte Quests
          </div>
        )}
        {props.quests
          .filter(({ state }) => filterList === true ? true : state !== "closed")
          .filter(({ archived }) => filterArchivedList === true ? true : archived === false)
          .filter(({ archived, disabled }) => (archived === false && disabled === false) || permission === "edit")
          .map((quest, index) => (
            <div
              key={index}
              className={`questBox ${quest.state} ${quest.disabled ? "disabled" : ""} ${quest.archived ? "archived" : ""}`}
              onClick={() => !(permission === "none" && quest.state === "hidden") && setSelectedQuest(quest)}
            >
              <div className="questHeader">
                <div className="questTitle">{(permission === "none" && quest.state === "hidden") || quest.title == null ? "🔒 ???" : `${quest.state === "hidden" ? "🔒 " : ""}${quest.title}`}</div>
                <div className="questPoints">
                  {
                    quest.state !== "closed" ? quest.maxXp : `${quest.xp} / ${quest.maxXp}`
                  } XP
                </div>
              </div>
              {
                !(permission === "none" && quest.state === "hidden") && <div className="questDescription">{formatDescription(quest.description ?? "???")}</div>
              }
              {
                quest.state === "hidden" && <div className="questDescription">Ab Level {quest.minLevel}</div>
              }
            </div>
        ))}
      </div>
      {permission === "edit" && (
        <div className="createQuestContainer">
          <button onClick={async () => {
            await post({ title: "Neue Quest", description: "", maxXp: 1, disabled: true, minLevel: 20, archived: false });
            props.refetch();
          }}>
            + Neue Quest
          </button>
        </div>
      )}
      {loading && "loading ..."}
      {error && <>Fehler: {JSON.stringify(error)}</>}
    </>
  );
}

function formatDescription(description?: string): string {
  if (description == null) return "???";
  if (description.length < 100) return description;
  return description.substring(0, 96) + " ...";
}

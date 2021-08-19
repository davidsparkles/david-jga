import React from "react";
import { useState } from "react";
import { MdSend } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";
import { useAppSelector, useAppDispatch } from "../../model/hooks";
import { selectToken, selectPermission, changeToken } from "../../model/permissionReducer";
import { PushPayload } from "../../push-notification/usePushNotifications";
import "./styles.scss";

export default function Settings(props: {
  userConsent: "default" | "denied" | "granted";
  onClickAskUserPermission: () => Promise<void>;
  onClickSusbribeToPushNotification: () => Promise<void>;
  onClickSendNotification: (payload: PushPayload) => Promise<void>;
  loading: boolean;
  error: any;
}): JSX.Element {
  const token = useAppSelector(selectToken);
  const permission = useAppSelector(selectPermission);
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("/quests");

  return (
    <div className="settings">
      <h2>Einstellungen</h2>
      <div className="push">
        <h3>Push-Benachrichtigungen</h3>
        <input className="push-permission" type="checkbox" checked={props.userConsent === "granted"} onChange={async () => {
          await props.onClickAskUserPermission();
          await props.onClickSusbribeToPushNotification();
        }} />Benachrichtigungen erlauben
        <Error error={props.error} />
        {
          permission === "edit" && (
            <div className="push-form">
              <h4 className="form-title">Benutzerdefinierte Benachrichtigung</h4>
              <div className="label">Titel</div>
              <div className="value">
                <input value={title} onChange={(evt) => setTitle(evt.target.value ?? "")} />
              </div>
              <div className="label">Text</div>
              <div className="value">
                <input value={text} onChange={(evt) => setText(evt.target.value ?? "")} />
              </div>
              <div className="label">Url</div>
              <div className="value">
                <input value={url} onChange={(evt) => setUrl(evt.target.value ?? "")} />
              </div>
              <div className="submit">
                <button onClick={() => props.onClickSendNotification({ title, text, url })}>Senden <MdSend /> {props.loading && <VscLoading />}</button>
              </div>
            </div>
          )
        }
      </div>
      <div className="permission">
        <h3>Berechtigung</h3>
        <span>Rolle: {permission}</span>
        <div className="token">
          Token: <input value={token} onChange={(evt) => dispatch(changeToken(evt.target.value))} />
        </div>
      </div>
    </div>
  )
}

const Error = ({ error }: { error: any }) =>
  error ? (
    <section className="app-error">
      <h2>{error.name}</h2>
      <p>Error message : {error.message}</p>
      <p>Error code : {error.code}</p>
    </section>
  ) : null;

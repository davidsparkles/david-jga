import React from "react";
import { Permission } from "../permission";

export default function Settings(props: {
  permission: Permission;
  userConsent: "default" | "denied" | "granted";
  onClickAskUserPermission: () => Promise<void>;
  onClickSusbribeToPushNotification: () => Promise<void>;
  onClickSendNotification: () => Promise<void>;
  loading: boolean;
  error: any;
}): JSX.Element {
  return (
    <div>
      <h2>Einstellungen</h2>
      <input type="checkbox" checked={props.userConsent === "granted"} onChange={async () => {
        await props.onClickAskUserPermission();
        await props.onClickSusbribeToPushNotification();
      }} />Push-Benachrichtigungen
      <Loading loading={props.loading} />
      <Error error={props.error} />
      {
        props.permission === "edit" && (
        <div>
          <button onClick={props.onClickSendNotification}>Send a notification</button>
        </div>
        )
      }
    </div>
  )
}

const Loading = ({ loading }: { loading: boolean }) => loading ? <span>Laden ...</span> : null;
const Error = ({ error }: { error: any }) =>
  error ? (
    <section className="app-error">
      <h2>{error.name}</h2>
      <p>Error message : {error.message}</p>
      <p>Error code : {error.code}</p>
    </section>
  ) : null;

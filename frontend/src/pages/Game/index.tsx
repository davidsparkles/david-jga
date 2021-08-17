import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useData } from "../../api/useData";
import GameHeader from "./GameHeader";
import GameFooter from "./GameFooter";
import usePushNotifications from "../../push-notification/usePushNotifications";
import Quests from "../Quests";
import Levels from "../Levels";
import Rewards from "../Rewards";
import Settings from "../Settings";
import "./styles.scss";
import QuestDetails from "../QuestDetail";

export default function Game(props: object): JSX.Element {
  const { data, error, loading, refetch } = useData();
  const {
    userConsent,
    userSubscription,
    onClickAskUserPermission,
    onClickSusbribeToPushNotification,
    onClickSendSubscriptionToPushServer,
    onClickSendNotification,
    loading: pushLoading,
    error: pushError
  } = usePushNotifications();

  useEffect(() => {
    console.log("update push subscription");
    if (userConsent === "granted" && userSubscription != null) onClickSendSubscriptionToPushServer();
  }, [userConsent, userSubscription, onClickSendSubscriptionToPushServer]);

  return (
    <div className="game">
      <GameHeader data={data} />
      <div className="game-main">
        {loading && <>Laden ...</>}
        {error && <>{typeof error === "string" ? error : JSON.stringify(error)}</>}
        {data && (
            <>
              <Switch>
                <Route path="/levels" exact>
                  <Levels levels={data.levels} />
                </Route>
                <Route path="/quests" exact>
                  <Quests quests={data.quests} refetch={refetch} />
                </Route>
                <Route path="/quests/:id" exact>
                  <QuestDetails />
                </Route>
                <Route path="/rewards">
                  <Rewards refetch={refetch} />
                </Route>
                <Route path="/settings">
                  <Settings
                    userConsent={userConsent}
                    onClickAskUserPermission={onClickAskUserPermission}
                    onClickSusbribeToPushNotification={onClickSusbribeToPushNotification}
                    onClickSendNotification={onClickSendNotification}
                    loading={pushLoading}
                    error={pushError}
                  />
                </Route>
              </Switch>
            </>
          )
        }
      </div>
      <Route path="/" component={GameFooter} />
    </div>
  );
}

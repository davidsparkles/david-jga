import { useState, useEffect, useCallback } from "react";
import http from "./http";

// https://itnext.io/react-push-notifications-with-hooks-d293d36f4836
// https://github.com/Spyna/push-notification-demo

import {
  isPushNotificationSupported,
  askUserPermission,
  registerServiceWorker,
  createNotificationSubscription,
  getUserSubscription
} from "./push-notifications";

const pushNotificationSupported = isPushNotificationSupported();

export interface PushPayload {
  title: string;
  text: string;
  url: string;
}

export default function usePushNotifications() {
  const [userConsent, setUserConsent] = useState(Notification.permission);
  const [userSubscription, setUserSubscription] = useState<PushSubscription | null>(null);
  const [pushServerSubscriptionId, setPushServerSubscriptionId] = useState();
  const [error, setError] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pushNotificationSupported) {
      setLoading(true);
      setError(false);
      registerServiceWorker().then(() => {
        setLoading(false);
      });
    }
  }, []);
  
  useEffect(() => {
    setLoading(true);
    setError(false);
    const getExixtingSubscription = async () => {
      const existingSubscription = await getUserSubscription();
      setUserSubscription(existingSubscription);
      setLoading(false);
    };
    getExixtingSubscription();
  }, []);

  const onClickAskUserPermission = useCallback(() => {
    setLoading(true);
    setError(false);
    return askUserPermission().then(consent => {
      setUserConsent(consent);
      if (consent !== "granted") {
        setError({
          name: "Consent denied",
          message: "You denied the consent to receive notifications",
          code: 0
        });
      }
      setLoading(false);
    });
  }, [setLoading, setError, setUserConsent]);

  const onClickSusbribeToPushNotification = useCallback(() => {
    setLoading(true);
    setError(false);
    return createNotificationSubscription()
      .then(function(subscrition) {
        setUserSubscription(subscrition);
        setLoading(false);
      })
      .catch(err => {
        console.error("Couldn't create the notification subscription", err, "name:", err.name, "message:", err.message, "code:", err.code);
        setError(err);
        setLoading(false);
      });
  }, [setLoading, setError, setUserSubscription]);

  const onClickSendSubscriptionToPushServer = useCallback(() => {
    if (userSubscription == null || userConsent !== "granted") {
      console.log("No userSubscription present or consent not given");
      return;
    }
    setLoading(true);
    setError(false);
    http
      .post("/api/subscription", userSubscription)
      .then((response: any) => {
        setPushServerSubscriptionId(response.id);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        setError(err);
      });
  }, [userSubscription, userConsent, setLoading, setError, setPushServerSubscriptionId]);

  const onClickSendNotification = useCallback(async (payload: PushPayload) => {
    setLoading(true);
    setError(false);
    await http
      .post(`/api/custom-subscription`, payload)
      .catch((err: any) => {
        setLoading(false);
        setError(err);
      });
    setLoading(false);
  }, [setLoading, setError]);

  return {
    onClickAskUserPermission,
    onClickSusbribeToPushNotification,
    onClickSendSubscriptionToPushServer,
    pushServerSubscriptionId,
    onClickSendNotification,
    userConsent,
    pushNotificationSupported,
    userSubscription,
    error,
    loading
  };
}

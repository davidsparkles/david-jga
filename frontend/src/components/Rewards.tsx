import React from "react";
import { useAppSelector } from "../model/hooks";
import { selectPermission } from "../model/permissionReducer";

export default function Rewards(props: { refetch: () => void }): JSX.Element {
  const permission = useAppSelector(selectPermission);

  return <>Belohnungen: todo. Permission <i>{permission}</i></>;
}

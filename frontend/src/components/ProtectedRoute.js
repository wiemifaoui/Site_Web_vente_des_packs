import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../Store";
//seuls les utilisateurs authentifiés et admin  peuvent accéder aux composants enfants spécifiés
export default function ProtectedRoute({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo ? children : <Navigate to="/signin" />;
}

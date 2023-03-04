import { env } from "@/env";
import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    sessionStorage.removeItem("access-token");

    fetch(`${env.auth_host}/logout`, {
      method: "GET",
      credentials: "include",
    }).then((res) => {
      window.location.href = "/";
    });
  }, []);
}

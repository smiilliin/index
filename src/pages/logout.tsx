import { authHost } from "@/static";
import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    sessionStorage.removeItem("access-token");

    fetch(`${authHost}/logout`, {
      method: "GET",
      credentials: "include",
    }).then((res) => {
      window.location.href = "/";
    });
  }, []);
}

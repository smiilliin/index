import { useEffect } from "react";

export default () => {
  useEffect(() => {
    fetch(`/api/logout`, {
      method: "GET",
      credentials: "include",
    }).then((res) => {
      window.location.href = "/";
    });
  }, []);
};

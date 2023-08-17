import { useEffect } from "react";

export default () => {
  useEffect(() => {
    fetch(`/api/logout`, {
      method: "GET",
      credentials: "include",
    }).then(() => {
      window.location.href = "/";
    });
  }, []);
};

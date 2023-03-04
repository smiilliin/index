import { authHost } from "@/static";

export default function Logout() {
  fetch(`${authHost}/logout`, {
    method: "GET",
    credentials: "include",
  }).then((res) => {
    window.location.href = "/";
  });
}

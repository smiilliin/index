interface IStatusResponse {
  status: boolean;
  reason: string;
}
import { jwtDecode } from "jwt-decode";
import { GlobalCtx } from "./App";

async function newAccessToken({ setAccessToken }: GlobalCtx): Promise<boolean> {
  try {
    const res = await fetch(
      `https://index-back.${process.env.REACT_APP_URL}/access`,
      {
        credentials: "include",
        method: "POST",
      }
    );
    const body = await res.json();

    if (!body.status) {
      return false;
    }

    setAccessToken(body.access);

    if (body.lifespan < 1000 * 60 * 60 * 24 * 3) {
      return refreshRefreshToken();
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
async function checkAccessToken(context: GlobalCtx): Promise<boolean> {
  const { accessToken } = context;

  try {
    if (
      !accessToken ||
      jwtDecode<{ expires: number }>(accessToken).expires - Date.now() <
        1000 * 60 * 15
    ) {
      return newAccessToken(context);
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
async function refreshRefreshToken(): Promise<boolean> {
  try {
    const res = await fetch(
      `https://index-back.${process.env.REACT_APP_URL}/access`,
      {
        credentials: "include",
        method: "POST",
      }
    );
    const data = await res.json();

    return data.status;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export { checkAccessToken, refreshRefreshToken, newAccessToken };

export type { IStatusResponse };

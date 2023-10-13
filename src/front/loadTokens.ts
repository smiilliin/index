import { NextPageContext } from "next";
import cookies from "next-cookies";
import { IAccessToken, IRefreshToken } from "token-generation";
import { serialize } from "cookie";
import { jwtParser } from "@/front/jwtParser";
import { AuthAPI } from "@smiilliin/auth-api";
import { cookieDomain, host } from "./static";

interface ITokens {
  refreshTokenData: IRefreshToken | undefined;
  accessTokenData: IAccessToken | undefined;
  refreshToken: string | undefined;
  accessToken: string | undefined;
}
const loadTokens = async (context: NextPageContext): Promise<ITokens> => {
  let { "access-token": accessToken, "refresh-token": refreshToken } =
    cookies(context);

  let refreshTokenData: IRefreshToken | undefined;
  let accessTokenData: IAccessToken | undefined;

  if (refreshToken) {
    refreshTokenData = jwtParser<IRefreshToken>(refreshToken);

    const refreshTokenExpired = (refreshTokenData?.expires || 0) < Date.now();
    if (refreshTokenExpired) {
      refreshToken = undefined;
    }
  }
  let needNewAccessToken: boolean = true;
  if (accessToken) {
    accessTokenData = jwtParser<IAccessToken>(accessToken);

    needNewAccessToken = (accessTokenData?.expires || 0) < Date.now();
  }

  try {
    if (needNewAccessToken && refreshToken) {
      const authAPI = new AuthAPI("https://smiilliin.com/api");

      accessToken = undefined;
      accessToken = await authAPI.getAccessToken({
        refreshToken: refreshToken,
      });

      accessTokenData = jwtParser<IAccessToken>(accessToken);

      context.res?.setHeader(
        "Set-Cookie",
        serialize("access-token", accessToken, {
          httpOnly: true,
          domain: cookieDomain,
          path: "/",
          secure: true,
          sameSite: "strict",
        })
      );
    }
  } catch (err) {
    console.error(err);
  }

  return {
    accessTokenData: accessTokenData,
    refreshTokenData: refreshTokenData,
    refreshToken: refreshToken,
    accessToken: accessToken,
  };
};

const requiredLoggedin = (
  context: NextPageContext,
  refreshToken: string | undefined
): any | undefined => {
  if (!refreshToken) {
    const url = new URL("https://smiilliin.com/login");
    url.searchParams.set("next", `${host}${context.req?.url || "/"}`);

    return {
      redirect: {
        permanent: false,
        destination: url.toString(),
      },
    };
  }
};

export { loadTokens, requiredLoggedin };

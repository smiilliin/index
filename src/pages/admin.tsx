import React from "react";
import Head from "next/head";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import CenterContainer from "@/components/centercontainer";
import { NextPageContext } from "next";
import cookies from "next-cookies";
import { ID, IDRank } from "@/components/navbar";
import { jwtParser } from "@/front/jwtParser";
import { AuthAPI, TokenKeeper } from "@smiilliin/auth-api";
import tripledotImage from "@/images/tripledot.svg";
import StringsManager, { IStrings } from "@/front/stringsManager";
import IndexAPI from "@/front/IndexAPI";
import Image from "next/image";

const GrantMenuContainer = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 1;
  width: 200px;
  height: auto;
  display: flex;
  flex-direction: column;
  background-color: var(--second-color);
  border-radius: 10px;
`;

const UserMenuContainer = styled.div`
  position: absolute;
  top: -10px;
  right: 10px;
  z-index: 1;
  width: 200px;
  height: auto;
  display: flex;
  flex-direction: column;
  background-color: var(--second-color);
  border-radius: 10px;
`;
interface IEMenuPosition {
  parent?: React.RefObject<HTMLElement>;
  target: React.RefObject<HTMLElement>;
  children: JSX.Element;
}
const MenuPosition = ({ parent, target, children }: IEMenuPosition) => {
  const [rect, setRect] = useState<DOMRect>(
    target.current?.getBoundingClientRect() ||
      ({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      } as DOMRect)
  );

  useEffect(() => {
    const eventListener = () => {
      if (!target.current) return;

      setRect(target.current.getBoundingClientRect());
    };
    window.addEventListener("resize", eventListener);
    return () => {
      window.removeEventListener("resize", eventListener);
    };
  }, [target]);
  const parentRect: DOMRect | undefined =
    parent?.current?.getBoundingClientRect();

  return (
    <div
      style={{
        top: rect.top - (parentRect?.top || 0),
        left: rect.left - (parentRect?.left || 0),
        right: rect.right - (parentRect?.right || 0),
        bottom: rect.bottom - (parentRect?.bottom || 0),
        width: rect.width,
        height: rect.height,
        position: "absolute",
      }}
    >
      {children}
    </div>
  );
};
interface IEUserMenu {
  id: string;
  stringsManager: StringsManager;
  indexAPI: IndexAPI;
  rank: Rank | null;
  rankStrings: Array<string>;
  userList: IUser[];
  setUserList: Dispatch<SetStateAction<IUser[]>>;
}
const UserMenu = ({
  id,
  stringsManager,
  indexAPI,
  rank,
  rankStrings,
  userList,
  setUserList,
}: IEUserMenu) => {
  const [grantMenu, setGrantMenu] = useState<boolean>(false);
  const [revokeMenu, setRevokeMenu] = useState<boolean>(false);
  const grantButtonRef = useRef<HTMLAnchorElement>(null);
  const revokeButtonRef = useRef<HTMLAnchorElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <UserMenuContainer ref={parentRef}>
      <Link
        onClick={(event) => {
          event.stopPropagation();
          console.log(id, "delete");
        }}
      >
        {stringsManager.getString("DELETE_USER")}
      </Link>
      <Link
        ref={grantButtonRef}
        onClick={(event) => {
          event.stopPropagation();
          setGrantMenu(true);
        }}
      >
        {stringsManager.getString("GRANT_USER")}
      </Link>

      <Link
        ref={revokeButtonRef}
        onClick={(event) => {
          event.stopPropagation();
          setRevokeMenu(true);
        }}
      >
        {stringsManager.getString("REVOKE_USER")}
      </Link>

      {grantMenu ? (
        <MenuPosition parent={parentRef} target={grantButtonRef}>
          <GrantMenu
            id={id}
            indexAPI={indexAPI}
            rank={rank}
            rankStrings={rankStrings}
            userList={userList}
            setUserList={setUserList}
          ></GrantMenu>
        </MenuPosition>
      ) : (
        <></>
      )}
      {revokeMenu ? (
        <MenuPosition parent={parentRef} target={revokeButtonRef}>
          <RevokeMenu
            id={id}
            indexAPI={indexAPI}
            rank={rank}
            rankStrings={rankStrings}
            userList={userList}
            setUserList={setUserList}
          ></RevokeMenu>
        </MenuPosition>
      ) : (
        <></>
      )}
    </UserMenuContainer>
  );
};

const RankRankname = styled.div`
  display: flex;
  gap: 10px;
`;
interface IEGrantMenu {
  id: string;
  indexAPI: IndexAPI;
  rank: Rank | null;
  rankStrings: Array<string>;
  userList: IUser[];
  setUserList: Dispatch<SetStateAction<IUser[]>>;
}
const GrantMenu = ({
  id,
  indexAPI,
  rank,
  rankStrings,
  userList,
  setUserList,
}: IEGrantMenu) => {
  return (
    <GrantMenuContainer>
      {allRankStrings
        .filter((allRankString) => rankStrings.indexOf(allRankString) == -1)
        .map((rankString) => (
          <Link
            key={rankString}
            onClick={(event) => {
              event.stopPropagation();
              const targetRank = Rank[rankString as keyof typeof Rank];
              indexAPI.grantRank(id, Rank[rankString as keyof typeof Rank]);

              const userIndex = userList.findIndex((user) => user.id == id);

              if (userIndex != -1) {
                userList[userIndex].rank = getRankFromBuffer(
                  orOperation(
                    Buffer.from([rank != null ? rank : 0x00]),
                    Buffer.from([targetRank])
                  )
                );
              }
              setUserList([...userList]);
            }}
          >
            <RankRankname>
              <Ranks rankStrings={new Array(rankString)}></Ranks>
              <ID>{rankString}</ID>
            </RankRankname>
          </Link>
        ))}
    </GrantMenuContainer>
  );
};
interface IERevoketMenu {
  id: string;
  indexAPI: IndexAPI;
  rank: Rank | null;
  rankStrings: Array<string>;
  userList: IUser[];
  setUserList: Dispatch<SetStateAction<IUser[]>>;
}
const RevokeMenu = ({
  id,
  indexAPI,
  rank,
  rankStrings,
  userList,
  setUserList,
}: IERevoketMenu) => {
  return (
    <GrantMenuContainer>
      {rankStrings.map((rankString) => (
        <Link
          key={rankString}
          onClick={(event) => {
            event.stopPropagation();
            const targetRank = Rank[rankString as keyof typeof Rank];

            indexAPI.revokeRank(id, targetRank);
            const userIndex = userList.findIndex((user) => user.id == id);

            if (userIndex != -1) {
              userList[userIndex].rank = getRankFromBuffer(
                offBits(
                  Buffer.from([rank != null ? rank : 0x00]),
                  Buffer.from([targetRank])
                )
              );
            }
            setUserList([...userList]);
          }}
        >
          <RankRankname>
            <Ranks rankStrings={new Array(rankString)}></Ranks>
            <ID>{rankString}</ID>
          </RankRankname>
        </Link>
      ))}
    </GrantMenuContainer>
  );
};

const UserContainer = styled.div`
  width: 100%;
  height: 50px;
  border: 2px var(--second-color) solid;
  border-radius: 10px;
  display: grid;
  padding-left: 10px;
  padding-right: 10px;
  grid-template-columns: 1fr 30px;
  align-items: center;
  gap: 20px;
  cursor: pointer;
`;

const currentCloseMenu: Array<() => void> = [];
interface IEUser {
  user: IUser;
  stringsManager: StringsManager;
  userList: IUser[];
  setUserList: Dispatch<SetStateAction<IUser[]>>;
  indexAPI: IndexAPI;
}
const User = ({
  user,
  stringsManager,
  userList,
  setUserList,
  indexAPI,
}: IEUser) => {
  const [userMenu, setUserMenu] = useState<boolean>(false);
  const buttonRef = useRef(null);
  const { id, rank } = user;
  let rankStrings: string[] = [];

  if (rank) {
    rankStrings = getRankStrings(rank);
  }

  return (
    <>
      <UserContainer
        onClick={() => {
          console.log(id);
        }}
      >
        <IDRank>
          <ID>{id}</ID>
          <Ranks rankStrings={rankStrings}></Ranks>
        </IDRank>

        <Image
          src={tripledotImage}
          width={30}
          alt="tripledot"
          ref={buttonRef}
          onClick={(event) => {
            event.stopPropagation();

            if (!userMenu) {
              currentCloseMenu.forEach((v) => v());
              setUserMenu(true);
              const closeMenu = () => {
                setUserMenu(false);
                currentCloseMenu.forEach((v) =>
                  document.removeEventListener("click", v)
                );
              };
              document.addEventListener("click", closeMenu);
              currentCloseMenu.push(closeMenu);
            }
          }}
        ></Image>
      </UserContainer>

      {userMenu ? (
        <MenuPosition target={buttonRef}>
          <UserMenu
            id={id}
            stringsManager={stringsManager}
            userList={userList}
            setUserList={setUserList}
            indexAPI={indexAPI}
            rank={rank}
            rankStrings={rankStrings}
          ></UserMenu>
        </MenuPosition>
      ) : (
        <></>
      )}
    </>
  );
};
const Container = styled.div`
  width: 80%;
  max-width: 500px;
  max-height: 80%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 15px;
    background-color: var(--second-color);
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--first-color);
  }
`;

interface IEAdmin {
  accessToken: string;
  refreshToken: string;
  language: string;
  strings: IStrings;
  id: string;
}
const Admin = ({
  accessToken: _accessToken,
  refreshToken,
  language,
  strings,
}: IEAdmin) => {
  const authAPI: AuthAPI = useMemo(() => new AuthAPI("/api"), []);
  const indexAPI: IndexAPI = useMemo(() => new IndexAPI("/api"), []);
  const [userList, setUserList] = useState<Array<IUser>>([]);
  const pageSize = useMemo(() => 15, []);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const stringsManager = new StringsManager(strings);
  const [accessToken, setAccessToken] = useState(_accessToken);

  useEffect(() => {
    (async () => {
      await authAPI.load(language);
      await indexAPI.load(language);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (!authAPI) return;
      if (!refreshToken || !accessToken) return;

      const tokenKeeper = new TokenKeeper(authAPI, refreshToken, accessToken);
      tokenKeeper.watchAccessToken = (_accessToken) => {
        setAccessToken(_accessToken);
      };

      tokenKeeper.setTokenInterval();
    })();
  }, [authAPI]);
  useEffect(() => {
    (async () => {
      if (!indexAPI) return;
      if (!accessToken) return;
      setUserList(await indexAPI.getUserList(page, pageSize));
      setPage(1);
    })();
  }, [indexAPI]);

  return (
    <>
      <Head>
        <title>Smile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <CenterContainer>
          <Container
            onScroll={async (event) => {
              currentCloseMenu.forEach((v) => v());

              if (
                !loading &&
                page != -1 &&
                event.currentTarget.scrollTop +
                  event.currentTarget.clientHeight >
                  event.currentTarget.scrollHeight - 20
              ) {
                setLoading(true);
                const loadedUserList = await indexAPI.getUserList(
                  page,
                  pageSize
                );
                userList.push(...loadedUserList);
                if (loadedUserList.length == 0) setPage(-1);
                else setPage(page + 1);
                setLoading(false);
              }
            }}
          >
            {userList.map((v) => (
              <User
                user={v}
                stringsManager={stringsManager}
                indexAPI={indexAPI}
                userList={userList}
                setUserList={setUserList}
                key={[v.id, v.rank].join(";")}
              ></User>
            ))}
          </Container>
        </CenterContainer>
      </main>
    </>
  );
};
export default Admin;
import { languageCache, languageListCache } from "@/front/languageCache";
import {
  Rank,
  allRanksString as allRankStrings,
  getRankFromBuffer,
  getRankStrings,
} from "@/front/ranks";
import Link from "@/components/link";
import Ranks from "@/components/ranks";
import { IUser } from "./api/user-list";
import { env } from "@/back/env";
import { IAccessToken, IRefreshToken } from "token-generation";
import { serialize } from "cookie";
import { offBits, orOperation } from "@/back/bit";

export async function getServerSideProps(context: NextPageContext) {
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
    if (needNewAccessToken) {
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
          domain: env.cookie_domain,
          path: "/",
          secure: true,
          sameSite: "strict",
        })
      );
    }
  } catch (err) {
    console.log(err);
  }
  const language =
    context.req?.headers["accept-language"]
      ?.split(";")?.[0]
      .split(",")?.[0]
      ?.split("-")?.[0] || "en";

  const id = accessTokenData?.id;

  if (!refreshToken) {
    const url = new URL("https://smiilliin.com/login");
    url.searchParams.set("next", `${env.host}${context.req?.url || "/"}`);

    return {
      redirect: {
        permanent: false,
        destination: url.toString(),
      },
    };
  }

  return {
    props: {
      accessToken: accessToken,
      refreshToken: refreshToken,
      language: language,
      id: id || null,
      strings: languageCache(
        languageListCache().findIndex((e) => e === language) !== -1
          ? language
          : "en"
      ),
    } as IEAdmin,
  };
}

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
import { ID, IDRank } from "@/components/navbar";
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
  const [rect, setRect] = useState<DOMRect | undefined>(
    target.current?.getBoundingClientRect()
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
        top: (rect?.top || 0) - (parentRect?.top || 0),
        left: (rect?.left || 0) - (parentRect?.left || 0),
        right: (rect?.right || 0) - (parentRect?.right || 0),
        bottom: (rect?.bottom || 0) - (parentRect?.bottom || 0),
        width: rect?.width || 0,
        height: rect?.height || 0,
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
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <UserMenuContainer ref={containerRef}>
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
        <MenuPosition parent={containerRef} target={grantButtonRef}>
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
        <MenuPosition parent={containerRef} target={revokeButtonRef}>
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
      if (!refreshToken || !accessToken) return;

      const tokenKeeper = new TokenKeeper(authAPI, refreshToken, accessToken);
      tokenKeeper.watchAccessToken = (_accessToken) => {
        setAccessToken(_accessToken);
      };

      tokenKeeper.setTokenInterval();
    })();
  }, [authAPI]);
  useEffect(() => {
    if (page != -1) {
      indexAPI
        .getUserList(page, pageSize)
        .then((newUserList) => {
          userList.push(...newUserList);
          setUserList([...userList]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [page]);

  return (
    <>
      <Head>
        <title>Smile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Admin" />
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
                setPage(page + 1);
              }
            }}
          >
            {userList.map((v, index) => (
              <User
                user={v}
                stringsManager={stringsManager}
                indexAPI={indexAPI}
                userList={userList}
                setUserList={setUserList}
                key={[v.id, index].join(";")}
              ></User>
            ))}
          </Container>
        </CenterContainer>
      </main>
    </>
  );
};
export default Admin;
import {
  getLanguage,
  languageCache,
  languageListCache,
} from "@/front/languageCache";
import {
  Rank,
  allRanksString as allRankStrings,
  getRankFromBuffer,
  getRankStrings,
} from "@/front/ranks";
import Link from "@/components/link";
import Ranks from "@/components/ranks";
import { IUser } from "./api/user-list";
import { offBits, orOperation } from "@/back/bit";
import { isAdmin } from "@/back/rank";
import { loadTokens, requiredLoggedin } from "@/front/loadTokens";

export async function getServerSideProps(context: NextPageContext) {
  const { accessTokenData, refreshToken, accessToken } = await loadTokens(
    context
  );
  const language = getLanguage(context);

  const id = accessTokenData?.id;

  let redirect;
  if ((redirect = requiredLoggedin(context, refreshToken))) {
    return redirect;
  }

  if (!id || !isAdmin(id)) {
    return {
      redirect: {
        permanent: false,
        destination: "https://smiilliin.com",
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

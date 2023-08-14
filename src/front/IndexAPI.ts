import { BaseAPI } from "fetchstrings";
import { Rank } from "./ranks";
import { IUser, IUserList } from "@/pages/api/user-list";
import { IRankData } from "@/pages/api/rank";

class IndexAPI extends BaseAPI {
  setRank(targetID: string, rank: Rank): Promise<void> {
    return this.put(
      "/rank",
      { id: targetID, rank: Buffer.from([rank]).toString("hex") },
      {}
    );
  }
  grantRank(targetID: string, rank: Rank): Promise<void> {
    return this.patch("/rank", { id: targetID, rank: rank });
  }
  revokeRank(targetID: string, rank: Rank): Promise<void> {
    return this.delete("/rank", { id: targetID, rank: rank });
  }
  async getUserRank(id: string): Promise<string> {
    const { rank } = await this.get<IRankData>("/rank", { id: id });
    return rank;
  }
  async getUserList(
    page: number,
    pageSize: number = 20
  ): Promise<Array<IUser>> {
    const { userList } = await this.get<IUserList>("/user-list", {
      page: page,
      pageSize: pageSize,
    });
    return userList;
  }
}

export default IndexAPI;

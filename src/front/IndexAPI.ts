import { andOperation, isEmpty } from "@/back/bit";
import { BaseAPI } from "fetchstrings";

interface IRank {
  rank: string;
}

enum Rank {
  ADMIN = 1 << 0,
  SUPERTHANKS = 1 << 1,
  NSOS = 1 << 2,
}
class IndexAPI extends BaseAPI {
  hasRank(userRank: string, rank: Rank) {
    return !isEmpty(
      andOperation(Buffer.from(userRank, "hex"), Buffer.from([rank]))
    );
  }
  setRank(accessToken: string, targetID: string, rank: Rank) {
    this.post(
      "/rank",
      { id: targetID, rank: rank },
      { headers: { authorization: accessToken } }
    );
  }
}

export default IndexAPI;
export { Rank };

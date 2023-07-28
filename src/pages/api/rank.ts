import { generation, idRegex, passwordRegex, pool } from "@/back/static";
import { NextApiRequest, NextApiResponse } from "next";
import en from "@/../public/api/strings/en.json";
import { PoolConnection } from "mysql";
import { Rank } from "@/front/IndexAPI";
import { getConnection, query } from "@/back/db";
import { andOperation } from "@/back/bit";
import { getRank, getRankDB } from "@/back/rank";

interface IError {
  reason: keyof typeof en;
}
interface IRankData {
  rank: string;
}
interface ISuccess {}

interface IRankQuery {
  rank: Buffer;
}

const isAdmin = async (
  connection: PoolConnection,
  id: string
): Promise<boolean> => {
  const rank = await getRankDB(connection, id);
  return isEmpty(andOperation(rank, Buffer.from([Rank.ADMIN])));
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<IError | IRankData | ISuccess>
) => {
  const accessToken = generation.verifyAccessToken(req.headers.authorization);
  if (!accessToken) {
    return res.status(400).send({
      reason: "TOKEN_WRONG",
    });
  }
  const { id } = accessToken;

  switch (req.method) {
    case "POST": {
      const { id: targetID, rank } = req.body;

      let connection: PoolConnection | undefined;

      try {
        connection = await getConnection(pool);

        if (!(await isAdmin(connection, id))) {
          res.status(400).send({ reason: "NO_ACCESS" });
        }

        if (!/[0-9a-fA-F]+/g.test(rank)) {
          res.status(400).send({ reason: "UNAVILABLE_RANK" });
        }

        await query(
          connection,
          "INSERT INTO userRank (id, rank) VALUES(?, ?) ON DUPLICATE KEY UPDATE rank=VALUES(rank)",
          [targetID, Buffer.from(rank, "hex")]
        );
        res.status(200).send({});
      } catch (err) {
        console.error(err);
        res.status(400).send({
          reason: "UNKNOWN_ERROR",
        });
      } finally {
        connection?.release();
      }
      // const { id: theID } = req.body;

      // const { rank } = req.body;

      // return pool.getConnection((err, connection) => {
      //   if (err) {
      //     console.error(err);

      //     return res.status(400).send({
      //       reason: "UNKNOWN_ERROR",
      //     });
      //   }

      //   try {
      //     connection.query(
      //       `INSERT INTO userRank (id, rank) VALUES(?, ?) ON DUPLICATE KEY UPDATE rank=VALUES(rank)`,
      //       [theID, rank],
      //       async (err) => {
      //         if (err) {
      //           return res.status(400).send({
      //             reason: "UNKNOWN_ERROR",
      //           });
      //         }

      //         return res.status(200).send({});
      //       }
      //     );
      //   } finally {
      //     connection.release();
      //   }
      // });
    }
    default: {
      return res.status(400).send({
        reason: "WRONG_ACCESS",
      });
    }
  }
};
function isEmpty(arg0: Buffer): boolean | PromiseLike<boolean> {
  throw new Error("Function not implemented.");
}

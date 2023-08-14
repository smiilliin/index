import { generation, idRegex, pool } from "@/back/static";
import { NextApiRequest, NextApiResponse } from "next";
import en from "@/../public/api/strings/en.json";
import { fromdb, query } from "@/back/db";
import { getRank, getRankDB, isAdminDB } from "@/back/rank";

interface IError {
  reason: keyof typeof en;
}
interface IRankData {
  rank: string;
}
interface ISuccess {}
interface IRank {
  rank: Buffer;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<IError | IRankData | ISuccess>
) => {
  const accessToken = generation.verifyAccessToken(
    req.headers.authorization || req.cookies["access-token"]
  );
  if (!accessToken) {
    return res.status(400).send({
      reason: "TOKEN_WRONG",
    });
  }
  const { id } = accessToken;

  switch (req.method) {
    case "GET": {
      const { id: targetID } = req.body;

      if (!idRegex(targetID)) {
        return res.status(400).send({
          reason: "UNAVAILABLE_ID",
        });
      }
      await fromdb(
        pool,
        async (connection) => {
          if (!(await isAdminDB(connection, id))) {
            return res.status(400).send({ reason: "NO_ACCESS" });
          }

          return res
            .status(200)
            .send({ rank: getRankDB(connection, targetID) });
        },
        () => {
          res.status(400).send({
            reason: "UNKNOWN_ERROR",
          });
        }
      )();

      return;
    }
    case "PUT": {
      const { id: targetID, rank } = req.body;

      if (!idRegex(targetID)) {
        return res.status(400).send({
          reason: "UNAVAILABLE_ID",
        });
      }
      await fromdb(
        pool,
        async (connection) => {
          if (!(await isAdminDB(connection, id))) {
            return res.status(400).send({ reason: "NO_ACCESS" });
          }

          if (typeof rank !== "number") {
            return res.status(400).send({ reason: "UNAVAILABLE_RANK" });
          }
          await query(
            connection,
            "INSERT INTO userRank (id, rank) VALUES(?, ?) ON DUPLICATE KEY UPDATE rank=?",
            [targetID, rank, rank]
          );
          return res.status(200).send({});
        },
        () => {
          res.status(400).send({
            reason: "UNKNOWN_ERROR",
          });
        }
      )();

      return;
    }
    case "PATCH": {
      const { id: targetID, rank } = req.body;

      if (!idRegex(targetID)) {
        return res.status(400).send({
          reason: "UNAVAILABLE_ID",
        });
      }
      await fromdb(
        pool,
        async (connection) => {
          if (!(await isAdminDB(connection, id))) {
            return res.status(400).send({ reason: "NO_ACCESS" });
          }

          if (typeof rank !== "number") {
            return res.status(400).send({ reason: "UNAVAILABLE_RANK" });
          }
          await query(
            connection,
            "INSERT INTO userRank (id, rank) VALUES(?, ?) ON DUPLICATE KEY UPDATE rank=(rank | ?)",
            [targetID, rank, rank]
          );
          return res.status(200).send({});
        },
        () => {
          res.status(400).send({
            reason: "UNKNOWN_ERROR",
          });
        }
      )();

      return;
    }
    case "DELETE": {
      const { id: targetID, rank } = req.body;

      if (!idRegex(targetID)) {
        return res.status(400).send({
          reason: "UNAVAILABLE_ID",
        });
      }
      await fromdb(
        pool,
        async (connection) => {
          if (!(await isAdminDB(connection, id))) {
            return res.status(400).send({ reason: "NO_ACCESS" });
          }

          if (typeof rank !== "number") {
            return res.status(400).send({ reason: "UNAVAILABLE_RANK" });
          }
          console.log(rank);
          await query(
            connection,
            "INSERT INTO userRank (id, rank) VALUES(?, ?) ON DUPLICATE KEY UPDATE rank=(VALUES(rank) & (~?))",
            [targetID, rank, rank]
          );

          return res.status(200).send({});
        },
        (err) => {
          console.error(err);
          res.status(400).send({
            reason: "UNKNOWN_ERROR",
          });
        }
      )();

      return;
    }
    default: {
      return res.status(400).send({
        reason: "WRONG_ACCESS",
      });
    }
  }
};

export type { IRankData };

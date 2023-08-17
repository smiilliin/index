/* eslint-disable no-var */
import { Pool } from "mysql";

declare global {
  var pool: Pool;
  var hmacKey: Buffer;
}
export default global;

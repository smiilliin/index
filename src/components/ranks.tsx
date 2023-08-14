import { Rank } from "@/front/ranks";
import styled from "styled-components";
import Image from "next/image";

const RanksContainer = styled.span`
  display: flex;
  gap: 5px;
`;

import admin from "@/images/admin.svg";
import superthanks from "@/images/superthanks.svg";
import cloud from "@/images/cloud.svg";

const ranksImage = new Map<keyof typeof Rank, any>();
ranksImage.set("ADMIN", admin);
ranksImage.set("SUPERTHANKS", superthanks);
ranksImage.set("CLOUD", cloud);

interface IERanks {
  rankStrings: Array<string>;
}
export default ({ rankStrings: ranks }: IERanks) => {
  return (
    <RanksContainer>
      {ranks.map((rank) => (
        <Image
          src={ranksImage.get(rank as keyof typeof Rank)}
          height={20}
          key={rank}
          alt={rank}
        ></Image>
      ))}
    </RanksContainer>
  );
};

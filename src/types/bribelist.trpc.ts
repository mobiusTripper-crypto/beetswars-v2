export interface SingleOffer {
  usdPer1000Vp: number;
  rewardAmount: number;
  percent: number;
  votes: number;
  usdPerVp: number;
  label: string;
  underminimum: boolean;
}

export interface BribeHeader {
  roundName: string;
  voteStart: number;
  voteEnd: number;
  timeRemaining: string;
  totalVotes: number;
  bribedVotes: number;
  totalVoter: number;
  bribedVoter: number;
  totalBribes: number;
  avgPer1000: number;
  proposal: string;
  voteState: string;
  bribefileVersion: string;
}

export interface BribeOffer extends SingleOffer {
  voteindex: number;
  poolname: string;
  poolurl: string;
  rewarddescription: string;
  assumption?: string;
}

export interface SpaceStrategy {
  name: string;
  network: string;
  params: Record<string, unknown>;
}

export interface BribeData {
  header: BribeHeader;
  bribelist: BribeOffer[];
  strategies: SpaceStrategy[];
  roundnumber: number;
}

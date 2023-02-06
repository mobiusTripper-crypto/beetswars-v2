export interface SnapVote {
  choice: {
    [key: string]: number; // key is string of pool voteindex + 1
  }; // number is the weight for this pool
  vp: number; // voting power
  voter: string; // evm address
}

export interface SnapVotePerPool {
  poolId: string; // string of pool voteindex + 1
  votes: number; // sum of votes
  percent: number; // percentage of all votes
}

export interface SnapSplitVote {
  poolId: string; // string of pool voteindex + 1
  votes: number; // votes per user per pool
  voter: string; // evm address
}

export interface SpaceStrategy {
  name: string;
  network: string;
  params: Record<string, unknown>;
}

export interface SnapProposal {
  start: number; // unix timestamp
  end: number; // unix timestamp
  state: string; // "pending"|"active"|"closed"
  snapshot: string; // ftm block number as string
  choices: string[]; // list of pools
  strategies: SpaceStrategy; // JSON object of all strategies
}

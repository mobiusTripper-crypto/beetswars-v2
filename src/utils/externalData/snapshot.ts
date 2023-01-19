import { request, gql } from "graphql-request";
import {
  SnapProposal,
  SnapSplitVote,
  SnapVote,
  SnapVotePerPool,
} from "types/snapshot.raw";

const queryUrl = "https://hub.snapshot.org/graphql";

export async function getSnapshotVotes(proposal: string): Promise<SnapVote[]> {
  // loop in chunks of 1000
  try {
    let allResults: SnapVote[] = [];
    const first = 1000;
    let skip = 0;
    let hasMore = true;
    while (hasMore) {
      const QUERY = gql`
    query Votes {
      votes(
        first: ${first}
        skip: ${skip}
        where: {
          proposal: "${proposal}"
        }
        ) {
          choice
          vp
          voter
        }
      }
      `;
      const result = await request(queryUrl, QUERY);
      allResults = [...allResults, ...result.votes];
      hasMore = result.votes.length === first;
      skip += first;
    }
    return allResults;
  } catch (error) {
    console.error("failed getSnapshotVotes: ", error);
    return [] as SnapVote[];
  }
}

// splits multiple choices to multiple lines single choice
export async function getSnapshotSplitVotes(
  proposal: string
): Promise<SnapSplitVote[]> {
  const votes = await getSnapshotVotes(proposal);
  const splitVotes = [] as SnapSplitVote[];
  votes.forEach(({ choice, vp, voter }) => {
    const total = Object.values(choice).reduce((a, b) => a + b);
    for (const [poolId, value] of Object.entries(choice)) {
      const votes = (vp * value) / total;
      splitVotes.push({ poolId, votes, voter });
    }
  });
  return splitVotes;
}

export async function getSnapshotVotesPerPool(
  proposal: string
): Promise<SnapVotePerPool[]> {
  const poolVotes: { [key: string]: number } = {};
  const votes = await getSnapshotVotes(proposal);
  votes.forEach(({ choice, vp }) => {
    const total = Object.values(choice).reduce((a, b) => a + b);
    for (const [key, value] of Object.entries(choice)) {
      poolVotes[key] = (poolVotes[key] || 0) + (vp * value) / total;
    }
  });
  const totalVotes = Math.round(
    Object.values(poolVotes).reduce((a, b) => a + b)
  );
  const result = Object.entries(poolVotes).map((x) => {
    const poolId = x[0];
    const votes = x[1];
    const percent = (votes / totalVotes) * 100;
    return { poolId, votes, percent };
  });
  return result;
}

export async function getSnapshotProposal(
  proposal: string
): Promise<SnapProposal | null> {
  const QUERY = gql`
    query Proposal {
      proposal(id:"${proposal}") {
        start
        end
        state
        snapshot
        choices
      }
    }
  `;
  try {
    const data = await request(queryUrl, QUERY);
    return data.proposal as SnapProposal;
  } catch (error) {
    console.error("failed getSnapshotProposal: ", error);
    return null;
  }
}

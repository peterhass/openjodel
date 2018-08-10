export const VOTE_POST = "VOTE_POST"

export function votePost({ id, score }) {
  return { type: VOTE_POST, id, score }
}

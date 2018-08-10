import { VOTE_POST } from '../actions/posts'

const DEFAULT_STATE = {
  byId: {
    1: {
      id: 1,
      message: "Das ist mein erster Post!",
      insertedAt: new Date(),
      score: 2,
      childrenIds: []
    },
    2: {
      id: 2,
      message: "Das ist mein zweiter Post",
      score: 2,
      insertedAt: new Date(),
      childrenIds: [3, 4]
    },
    3: {
      id: 3,
      message: "Das ist der erste Child vom zweiten Post",
      score: 2,
      insertedAt: new Date(),
      parentId: 2,
      childrenIds: []
    },

    4: {
      id: 4,
      message: "Das ist der zweite Child vom zweiten Post",
      score: 2,
      insertedAt: new Date(),
      parentId: 2,
      childrenIds: []
    },

  },
  allIds: [1,2,3,4]
}

const posts = (state = DEFAULT_STATE, action) => {
  const newState = {
    ...state,
    threadIds: Object.values(state.byId).filter(post => !post.parentId).map(post => post.id)
  }

  switch (action.type) {
    case VOTE_POST:
      const post = newState.byId[action.id]

      newState.byId[action.id] = { ...post, score: post.score + action.score }

      break;
  }

  return newState;
}

export default posts

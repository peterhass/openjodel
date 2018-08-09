const DEFAULT_STATE = {
  byId: {
    1: {
      id: 1,
      message: "Das ist mein erster Post!",
      insertedAt: new Date(),
      childrenIds: []
    },
    2: {
      id: 2,
      message: "Das ist mein zweiter Post",
      insertedAt: new Date(),
      childrenIds: [3]
    },
    3: {
      id: 3,
      message: "Das ist der erste Child vom zweiten Post",
      insertedAt: new Date(),
      parentId: 2,
      childrenIds: []
    }
  },
  allIds: [1,2,3]
}

const posts = (state = DEFAULT_STATE, action) => {

  return {
    ...state,
    threadIds: Object.values(state.byId).filter(post => !post.parentId).map(post => post.id)
  }
}

export default posts

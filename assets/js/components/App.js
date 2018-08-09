import React from 'react'
import ThreadList from '../containers/ThreadList'
import SingleThread from '../containers/SingleThread'
import { Link, Route, NavLink } from 'react-router-dom'

const App = () => (
  <div>
    <nav>
      <NavLink to="/threads">Threads</NavLink>
    </nav>
    <div>

      <Route exact path="/threads" component={ThreadList} />
      <Route path="/threads/:threadId" component={SingleThread} />
    </div>
  </div>
)

export default App

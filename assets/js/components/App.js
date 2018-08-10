import React from 'react'
import ThreadContainer from '../containers/ThreadContainer'
import ThreadListContainer from '../containers/ThreadListContainer'
import { Link, Route, NavLink } from 'react-router-dom'

const App = () => (
  <div className="container-fluid">
    <div className="row">
      <div className="col-12">
        <nav>
          <NavLink to="/threads">Threads</NavLink>
        </nav>
      </div>
      <div className="col-12">
        <Route exact path="/threads" component={ThreadListContainer} />
        <Route path="/threads/:threadId" component={ThreadContainer} />
      </div>
    </div>
  </div>
)

export default App

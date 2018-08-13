import React from 'react'
import ThreadContainer from '../containers/ThreadContainer'
import ThreadListContainer from '../containers/ThreadListContainer'
import { Link, Route, NavLink, Redirect } from 'react-router-dom'
import Login from '../components/Login'

const auth = {
  get isAuthenticated() { return !!localStorage.getItem('token') } 
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    auth.isAuthenticated === true
    ? <Component {...props} />
    : <Redirect to='/login' />
  )} />
)


const App = () => (
  <div className="container-fluid">
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <NavLink to="/threads" className="nav-link">Threads</NavLink>
          </li>
        </ul>
      </div>
    </nav>
    <div className="row content-box">
      <div className="col-12">
        <Route path="/login" component={Login} />
        <PrivateRoute exact path="/threads" component={ThreadListContainer} />
        <PrivateRoute path="/threads/:threadId" component={ThreadContainer} />
      </div>
    </div>
  </div>
)

export default App

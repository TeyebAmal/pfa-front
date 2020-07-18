import React from 'react';
import Login from './Authentication/auth';
import Register from './Register/register';
import Dashboard from './Dashboard/Dashboard';
import PrivateRoute from './utils/privateRoute'
import {Spin} from 'antd'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Axios from 'axios';

export default class App extends React.Component {

  state = {
    connected : false,
    loading : true
  }

  componentDidMount() {
    Axios.post('http://localhost:3030/auth/verify-token', {
      token: localStorage.getItem('token')
    }).then(data => {
      this.setState({connected : true , loading : false})
    }).catch(err =>  this.setState({connected : false , loading : false})    )
  }

  render() {
    const {connected,loading} = this.state;

    if(loading){
      return <Spin />
    }
    return (
      <Router>
        <Switch>
           <Route exact path="/login" component={Login} />
           <Route exact path="/register" component={Register} />
           <PrivateRoute isAuthenticated={connected} path='/' component={Dashboard} />
        </Switch>
      </Router>
    );
  }
}

import React from 'react';
import { Layout, Menu, Spin } from 'antd';
import {
    Switch,
    Route,
    Redirect,
    Link
} from "react-router-dom";
import Chatbot from './chatbot';
import Stat from './statistiques';
import AllStats from './AllStats';
import Users from './users/users';
import { getCookie , eraseCookie} from '../contants/cookies';
import EditUser from './users/editUser';

export default class login extends React.Component {

    state = {
        logout: false,
        loading : true,
        user : null,
    }

    handleLogout = () => {
        localStorage.clear();
        eraseCookie();
        this.setState({ logout: true, });
    }

    componentDidMount() {
        const user = JSON.parse(getCookie('user'));
        this.setState({user, loading : false})
    }

    render() {
        const { Content } = Layout;

        if (this.state.logout) {
            return <Redirect to="/login" />
        }

        if(this.state.loading) {
            return <Spin />
        }

        return (
            <Layout style={{ height: '100%' }}>
                <Menu mode="horizontal" theme="dark" >
                    <Menu.Item key="1"><Link to="/chat">Chatbot</Link></Menu.Item>
                    <Menu.Item key="2"><Link to="/statistiques">Statistics</Link></Menu.Item>
                    {this.state.user.type && this.state.user.type === "admin" &&
                    <Menu.Item key="4"><Link to="/users">Users</Link></Menu.Item>}
                    <Menu.Item style={{ float: 'right' }} key="3">
                        <div style={{ cursor: 'pointer' }} onClick={this.handleLogout}>Logout</div>
                    </Menu.Item>
                </Menu>
                <Layout>
                    <Layout style={{ padding: '0 24px 24px' }}>

                        <Switch>
                            <Route exact path="/chat" component={Chatbot} />
                            <Content
                                id="style-2"
                                style={{
                                    background: '#fff',
                                    padding: 24,
                                    margin: 16,
                                    overflow: 'auto',
                                    minHeight: 280,
                                }}
                            >
                                <Route exact path="/stat/:id" component={Stat} />
                                <Route exact path="/statistiques" component={AllStats} />
                                <Route exact path="/users" component={Users} />
                                <Route exact path="/users/:id" component={EditUser} />
                                </Content>
                            <Redirect to="/chat" />
                        </Switch>


                    </Layout>
                </Layout>
            </Layout>
        );
    }

}
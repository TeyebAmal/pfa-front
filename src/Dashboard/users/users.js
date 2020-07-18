import React from 'react';
import axios from 'axios';
import { Spin } from 'antd';
import Actions from '../../contants/Actions'
import { Table } from 'antd';
import { getCookie } from '../../contants/cookies'

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.user = { id: null };
        this.state = {
            users: [],
            loading: true
        }
    }


    componentDidMount() {
        this.user = JSON.parse(getCookie('user'));
        axios.get(`http://localhost:3030/user`)
            .then(users => {
                this.setState({ users: users.data.user, loading: false })
            }).catch(err => console.log(err));
    }

    render() {
        const { loading, users } = this.state;
        console.log(users)
        const columns = [
            {
                title: 'FirstName',
                render: (text, record) => (
                    <p>{record.firstName}</p>
                )
            },
            {
                title: 'LastName',
                render: (text, record) => (
                    <p>{record.lastName}</p>
                )
            },
            {
                title: 'Email',
                render: (text, record) => (
                    <p>{record.email}</p>
                )
            },
            {
                title: 'City',
                render: (text, record) => (
                    <p>{record.city}</p>
                )
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <Actions
                        onDelete={() => console.log('dsnqdn')}
                        showUpdate={record._id === this.user._id}
                        showDelete={false}
                        selectUrl={`/users/${record._id}`}
                    />
                )
            }

        ];
        if (loading) {
            return <Spin />
        }
        return (<div><h1 style={{ marginBottom: 15 }}>View all users </h1>
            <Table
                rowKey={'_id'}
                loading={loading}
                dataSource={users}
                columns={columns}
            /></div>)
    }
}
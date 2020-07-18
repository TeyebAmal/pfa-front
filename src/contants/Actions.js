import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Icon, Button, Popconfirm,  } from 'antd';
import {SelectOutlined, CloseCircleOutlined } from '@ant-design/icons';

const style = {
  icon: {
    fontSize: '1.2rem',
    background : 'bleu'
  }
};

const Actions = ({ selectUrl, onDelete, showDelete, showUpdate }) => (
  <Row
    className="actions"
    type="flex"
    gutter={12}
    style={{ flexWrap: 'nowrap' }}
  >
    {showUpdate && <Col>
      <Link to={selectUrl}>
        <SelectOutlined style={style.icon}/>
      </Link>
    </Col>}
    {showDelete && <Col>
      <div style={{cursor : 'pointer'}} onClick={onDelete}>
      <CloseCircleOutlined   style={style.icon}/>
      </div>
    </Col>}
     
  </Row>
);

export default Actions;

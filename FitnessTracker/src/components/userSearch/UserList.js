import React, {Component} from 'react';
import {Platform, StyleSheet, View, ScrollView, Text} from 'react-native';
import axios from 'axios';
import UserDetail from './UserDetail'


class UserList extends Component {

  constructor(props) {
    super(props);
  }


  renderUser () {
      return this.props.users.map(user =>
        <UserDetail key={user.Id} user={user} />
      );
  }

  render(){
    return (
      <ScrollView>
        { this.renderUser() }
      </ScrollView>
    );
  }
}

export default UserList;

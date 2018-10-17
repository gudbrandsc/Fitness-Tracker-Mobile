import React, {Component} from 'react';
import {Platform, StyleSheet, View, ScrollView, Text} from 'react-native';
import axios from 'axios';
import UserDetail from './UserDetail'


class UserList extends Component {

  constructor(props) {
    super(props);
  }


  renderAlbums () {
      return this.props.users.map(user =>
        <UserDetail key={user.id} user={user} />
      );

  }

  render(){
    return (
      <ScrollView>
        { this.renderAlbums() }
      </ScrollView>
    );
  }
}

export default UserList;

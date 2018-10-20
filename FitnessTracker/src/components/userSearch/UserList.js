import React, {Component} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import axios from 'axios';
import UserDetail from './UserDetail'


class UserList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: '',
    }
  }



  renderUser () {
    console.log(this.props.userId + ' from list ')
    return this.props.users.map(user =>
      <UserDetail key={user.id} user={user} userId={this.props.userId}/>
    );
  }

  render(){
    return (
      <View style={styles.v_container}>
      <ScrollView style={styles.container}>
        { this.renderUser() }
      </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  v_container: {
    flex: 1,
    flexDirection: 'column', // main axis
    justifyContent: 'center', // main axis
    alignItems: 'center', // cross axis
  },
  container: {
    marginTop: 14,
    alignSelf: "stretch",
  }
});


export default UserList;

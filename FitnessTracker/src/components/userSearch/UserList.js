import React, {Component} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import UserDetail from './UserDetail'
import { Button } from 'react-native-elements';


class UserList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: '',
    }
  }

  renderUser () {
    return this.props.users.map(user =>
      <UserDetail navigation={this.props.navigation} key={user.id} user={user} userId={this.props.userId}/>
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
    alignSelf: "stretch",
  }
});


export default UserList;

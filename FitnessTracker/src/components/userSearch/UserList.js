import React, {Component} from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import UserDetail from './UserDetail'

/**
 * Component that displays displays a scrollview of all the users that matches the search term. 
 * Each user are displayed as a userDetail component. 
 */
class UserList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: '',
    }
  }

  //Return a list of users 
  renderUser () {
    return this.props.users.map(user =>
      <UserDetail navigation={this.props.navigation} key={user.id} user={user} loggedInUserID={this.props.loggedInUserID}/>
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

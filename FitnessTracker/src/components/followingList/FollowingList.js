import React, {Component} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import FollowingDetail from './FollowingDetail'


/** 
 * Following list component, that are used to display a list of users.
 */
class FollowingList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: '',
    }
  }  
  

  /** Render a user detail component for each user object */
  renderUser () {
    if(this.props.followingRequest){
      return this.props.users.map(user =>
        <FollowingDetail key={user.FollowingId} followingRequest={this.props.followingRequest} user={user} userId={this.props.userId} resetDetail={this.props.resetComponent} navigation={this.props.navigation}/>
      );
      } else {
        return this.props.users.map(user =>
          <FollowingDetail key={user.FollowerId} followingRequest={this.props.followingRequest} user={user} userId={this.props.userId} resetDetail={this.props.resetComponent} navigation={this.props.navigation}/>
      );
    }
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


export default FollowingList;

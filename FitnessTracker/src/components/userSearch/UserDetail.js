import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Linking} from 'react-native';
import {Card, CardSection, Button} from '../common'


class UserDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {'follows': this.props.user.follows}
  }

  onFollowPress = () => {
    this.setState({
      follows: 'true'
    });
  }

  onUnfollowPress = () => {
    this.setState({
      follows: 'false'
    });
  }


  renderFollowingButton(){
    if(this.state.follows === 'true'){
      return <Button onPress={this.onUnfollowPress} type={'danger'} size={'small'} children={'Unfollow'} />;
    }
    return <Button onPress={this.onFollowPress} type={'primary'} size={'small'} children={'Follow'} />;
  }


  render(){
    return (
      <View style={styles.viewStyleOne}>
        <View style={styles.textStyle}>
          <Text > {this.props.user.FirstName} {this.props.user.LastName}</Text>
        </View>
        <View style={styles.textStyle3}>
          {this.renderFollowingButton()}
        </View>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyleOne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    padding: 5,
    borderColor: '#ddd',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  textStyle:{
    justifyContent: 'center',
    alignItems:'flex-start',
  },
  textStyle2:{
    alignItems:'center',
  },
  textStyle3:{
    alignItems:'flex-end',
  }

})

export default UserDetail;

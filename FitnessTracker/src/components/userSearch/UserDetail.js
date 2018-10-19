import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from '../common'
import {Avatar} from 'react-native-elements'

class UserDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'follows': this.props.user.follows}
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
    const {viewStyleOne, textStyle, textStyle3} = styles;
    const {FirstName, LastName, follows} = this.props.user;

    return (
      <View style={styles.viewStyleOne}>
          <Avatar
            small
            rounded
            source={{uri: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"}}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
          />
          <View style={textStyle}>
            <Text style={styles.title}> {FirstName} {LastName}</Text>
          </View>

          <View style={textStyle3}>
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
    borderWidth: 1,
    padding: 5,
    borderColor: '#ddd',
    elevation: 2,
  },
  textStyle:{
    alignItems:'flex-start',
  },
  textStyle2:{
    alignItems:'center',
  },
  textStyle3:{
    flex:0.4,
    alignItems:'flex-end',
  },
  container: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
  },
  wrapper: {
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontFamily:'HelveticaNeue',
    color: '#94989a',
  },
})

export default UserDetail;

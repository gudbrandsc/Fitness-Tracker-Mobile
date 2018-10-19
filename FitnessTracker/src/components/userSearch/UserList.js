import React, {Component} from 'react';
import {ScrollView, AsyncStorage} from 'react-native';
import axios from 'axios';
import UserDetail from './UserDetail'


class UserList extends Component {

  constructor(props) {
    super(props);
    this.state = {'error': '',
    'userId': ''
    }
  }

  componentDidMount() {
    this.retrieveDetails();
  }

  retrieveDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("login");
      this.setState({userId: id})
    } catch (error) {
      this.onFailure("Can't get Data. Please check internet connectivity.");
    }
  }

  renderUser () {
    return this.props.users.map(user =>
      <UserDetail key={user.id} user={user} />
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

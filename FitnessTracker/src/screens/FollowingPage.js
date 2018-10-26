import React, { Component } from "react";
import {
  AsyncStorage,
  View,
  Text,
} from "react-native";
import {
  Spinner,
  Header
} from "../components/common";
import axios from 'axios';
import FollowingList from '../components/followingList/FollowingList';



class FollowingPage extends Component {
  static navigationOptions = {
    headerTitle: "Following"
  };

  constructor(props) {
    super(props);
    this.state = {
      term: "",
      error: "",
      loading: true,
      users:[],
      userId: '',
    };
  }

  componentDidMount() {
    this.retrieveDetails();
  }

  retrieveDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("login");
      this.setState({userId: id}, this.fetchData(id))
    } catch (error) {
      this.setState({error: 'Unable to fetch data, try again later...'})
    }
    this.setState({loading: false})
  }

  fetchData(id){
    console.log(id + ' this is the userid in fetch data')
    axios.get('http://localhost:8000/api/listfollows/' + id).then(response => this.setState({ users: response.data })).then(this.checkSearchResp.bind(this));
  }

  checkSearchResp(){
    if((this.state.users && this.state.users.length > 0)){
      this.setState({error: '', loading: false })
    } else {
      this.setState({error: 'You are not following any users yet..', loading: false })
    }
  }

  checkResponse(users, loading){
    if (loading) {
      return <Spinner  size={"small"} />;
    }
    if((users && users.length > 0)){
      return  <FollowingList users={users} userId={this.state.userId}/>
    }
  }

  render() {
    const {users, loading} = this.state;

    return (
      <View style={{ flex: 1}}>
        {this.checkResponse(users, loading)}
        <Text>{this.state.error}</Text>
      </View>
    );
  }
}

export default FollowingPage;

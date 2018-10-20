import React, { Component } from "react";
import { Text, View, AsyncStorage } from "react-native";
import { Spinner, Header} from "../components/common";
import UserList from '../components/userSearch/UserList';
import axios from 'axios';
import {SearchBar} from 'react-native-elements'


export default class SearchUserPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      term: "",
      error: "",
      loading: false,
      users:[],
      userId: '',
    };
    this.onButtonPress = this.onButtonPress.bind(this)
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


  onButtonPress(term) {
    this.setState({error: '', loading: true })
    axios.get('http://localhost:8000/api/searchuser/' + term + '/'+ this.state.userId).then(response => this.setState({ users: response.data })).then(this.checkSearchResp.bind(this));
  }

  checkSearchResp(){
    if((this.state.users && this.state.users.length > 0)){
      this.setState({error: '', loading: false })

    } else {
      this.setState({error: 'No users matching search term...', loading: false })
    }
  }

  checkResponse(users, loading){
    if (loading) {
      return <Spinner  size={"small"} />;
    }
    if((users && users.length > 0)){
      console.log(this.state.userId + ' is the user id ')
      return  <UserList users={users} userId={this.state.userId} />
    }
  }

  render() {
    const {users, term, loading} = this.state;

    return (
      <View style={{ flex: 1}}>
        <Header headerText={'Search'} />
          <SearchBar
            lightTheme
            onChangeText={term => this.onButtonPress(term)}
            icon={{ type: 'font-awesome', name: 'search' }}
            placeholder='Search...' />

        <View style={{ flex: 1}}>
          {this.checkResponse(users, loading)}
          <Text>{this.state.error}</Text>
        </View>
      </View>
    );
  }
}

const styles = {
  viewStyle: {
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: "relative"
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#eff0f1',
  },
  searchIcon: {
    padding: 5,
  },
  input: {
    flex: 0.5,
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingLeft: 0,
    color: '#424242',
  },
}

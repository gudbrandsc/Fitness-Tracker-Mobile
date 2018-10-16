import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from 'react-navigation';

import Homepage from './screens/Homepage';
import ProfilePage from "./screens/ProfilePage";
import AnalyticsPage from './screens/AnalyticsPage';
import AddWorkoutPage from './screens/AddWorkoutPage';
import SearchUserPage from './screens/SearchUserPage'



export default createBottomTabNavigator(
  {
    Home: Homepage,
    Settings: ProfilePage,
    Analytics: AnalyticsPage,
    AddWorkout: AddWorkoutPage,
    SearchUser: SearchUserPage,
  },
);

import React from 'react';
import { View, SafeAreaView, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen, { screenOptions as loginScreenOptions } from '../screen/LoginScreen';
import SignupScreen, { screenOptions as signupScreenOptions } from '../screen/SignupScreen';
import HomePageScreen, { screenOptions as homeScreenOptions } from '../screen/HomePage';
import ChatScreen, { screenOptions as chatScreenOptions } from '../screen/ChatScreen';
import RecordFaceCamScreen, { screenOptions as recordFaceScreen } from '../screen/RecordFaceCamScreen';


import {
  createDrawerNavigator,
  DrawerItemList
} from '@react-navigation/drawer';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';


import * as authActions from '../store/actions/auth'
import ProfilePageScreen, { screenOptions as profilePageScreenOptions } from '../screen/ProfilePageScreen.js';
import EditProfilePageScreen, { screenOptions as editProfilePageScreenOptions } from '../screen/EditProfilePageScreen.js';



const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Colors.primary
  },
  headerTintColor: Colors.primary
};



//auth navigator
const AuthStackNavigator = createStackNavigator();
export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AuthStackNavigator.Screen
        name="Login"
        component={LoginScreen}
        options={loginScreenOptions}
      />
      <AuthStackNavigator.Screen
        name="Signup"
        component={SignupScreen}
        options={signupScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};





//homepage navigator
const MainNavigator = createStackNavigator();
export const MainPageNavigator = () => {

  return (
    <MainNavigator.Navigator screenOptions={defaultNavOptions}>
      <MainNavigator.Screen
        name="HomePage"
        component={HomePageScreen}
        options={homeScreenOptions}
      />

      <MainNavigator.Screen
        name="ChatRoom"
        component={ChatScreen}
        options={chatScreenOptions}
      />

      <MainNavigator.Screen
        name="Profile"
        component={ProfilePageScreen}
        options={profilePageScreenOptions}
      />

      <MainNavigator.Screen
        name="EditProfile"
        component={EditProfilePageScreen}
        options={editProfilePageScreenOptions}
      />

      <MainNavigator.Screen
        name="DetectFace"
        component={RecordFaceCamScreen}
        options={recordFaceScreen}
      />

    </MainNavigator.Navigator>
  );
};






const AppDrawerNavigator = createDrawerNavigator();

export const MainAppNavigator = () => {

  const dispatch = useDispatch();

  return (
    <AppDrawerNavigator.Navigator
      drawerContent={props => {
        return (
          <View style={{ flex: 1, paddingTop: 20 }}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
              <DrawerItemList {...props} />
              <Button
                title="Logout"
                color={Colors.primary}
                onPress={() => {
                  dispatch(authActions.logout());
                  // props.navigation.navigate('Auth');
                }}
              />
            </SafeAreaView>
          </View>
        );
      }}
      drawerContentOptions={{
        activeTintColor: Colors.primary
      }}
    >
      <AppDrawerNavigator.Screen
        name="HomeScreen"
        component={MainPageNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={'home'}
              size={30}
              color={props.color}
            />
          )
        }}
      />
      <AppDrawerNavigator.Screen
        name="Profile"
        component={MainPageNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={'person-circle'}
              size={30}
              color={props.color}
            />
          )
        }}
      />

    </AppDrawerNavigator.Navigator>


  );

};










import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';


import { AuthNavigator, MainAppNavigator } from './MainNavigator';


const AppNavigator = props => {


    const isAuth = useSelector(state => !!state.auth.token);

    return (
        <NavigationContainer>
            {isAuth && <MainAppNavigator/>}
            {!isAuth &&<AuthNavigator/>}
        </NavigationContainer>
    );
};

export default AppNavigator;



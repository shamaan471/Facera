import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
    ScrollView,
    View,
    KeyboardAvoidingView,
    StyleSheet,
    Button,
    ActivityIndicator,
    Alert,
    Image
  } from 'react-native';

import Colors from '../constants/Colors';
import Input from '../components/UI/Input'
import Card from '../components/UI/Card';
import {useDispatch} from 'react-redux';
import * as authActions from '../store/actions/auth';



const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const LoginScreen = props => {
    const [error, setError] = useState();

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
          email: '',
          password: ''
        },
        inputValidities: {
          email: false,
          password: false
        },
        //formIsValid: false
    });


    useEffect(() => {
        if (error) {
          Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
        }
    }, [error]);



    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
          dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
          });
        },
        [dispatchFormState]
    );



    const authHandler = async () => {
      let action;
      action = authActions.login(
          formState.inputValues.email,
          formState.inputValues.password
      );
      setError(null);
      setIsLoading(true);
      try {
          await dispatch(action);
          //props.navigation.navigate('Login');
      } 
      catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }

    const signupPageHandler = () => {
      props.navigation.navigate('Signup')
    }


    return (
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={50}
          style={styles.screen}
        >
            <Image style={styles.imgr} source={require('./Facera_logo.png')} />
            <Card style={styles.authContainer}>
            
                <ScrollView>
                    <Input
                        id="email"
                        label="E-Mail"
                        keyboardType="email-address"
                        required
                        email
                        autoCapitalize="none"
                        errorText="Please enter a valid email address."
                        onInputChange={inputChangeHandler}
                        initialValue=""
                    />
                    <Input 
                        id="password"
                        label="Password"
                        keyboardType="default"
                        secureTextEntry
                        required
                        minLength={5}
                        autoCapitalize="none"
                        errorText="Please enter a valid password."
                        onInputChange={inputChangeHandler}
                        initialValue=""
                    />
                    <View style={styles.buttonContainter}>
                        <Button
                          title = 'Login'
                          color={Colors.primary}
                          onPress={authHandler}
                        />
                    </View>
                    <View style={styles.buttonContainter}>
                      {!isLoading ?
                        (<Button
                            title = 'Signup'
                            color={Colors.primary}
                            onPress={signupPageHandler}
                        />)
                        :
                        (<ActivityIndicator size="small" color={Colors.primary} />)
                      }
                    </View>
                </ScrollView>
            </Card>
          
        </KeyboardAvoidingView>
    );

};


export const screenOptions = {
    headerTitle: 'Login'
};
  
const styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white'
    },
    gradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    authContainer: {
      width: '80%',
      maxWidth: 400,
      maxHeight: 600,
      padding: 20
    },
    buttonContainter: {
      marginTop: 10
    },
    imgr: {
      bottom: 45,
      margin: 30,
      right: 10,
    }
});

export default LoginScreen;
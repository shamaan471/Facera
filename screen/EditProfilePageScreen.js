import React, { useState, useEffect } from "react";
import { View, SafeAreaView, StyleSheet, ScrollView, TextInput } from "react-native";
import { firebase } from "../constants/Config";

import { Avatar, Text, Button } from "react-native";


const EditProfilePageScreen = (props) => {
  const [currentUser, setCurrentUser] = useState([]);
  const [user, setUser] = useState([]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState(['']);



  return (
    <SafeAreaView style={styles.container}>
         <ScrollView style={{flex: 1, flexDirection: "column", paddingVertical: 50, paddingHorizontal: 10,}}>
       
        <Button title="Change Username"  />

        <TextInput style={styles.textInput} value={newEmail}
          placeholder="New Email" autoCapitalize="none" keyboardType="email-address"
          onChangeText={(text) => { setNewEmail({newEmail: text}) }}
        />

        <Button title="Change Full Name" onPress={onChangeEmailPress} />

      </ScrollView>
      </SafeAreaView>

    
  );
};

export const screenOptions = {
  headerTitle: "EditProfile",
};

const styles = StyleSheet.create({
  text: { color: "white", fontWeight: "bold", textAlign: "center", fontSize: 20, },
  textInput: { borderWidth:1, borderColor:"gray", marginVertical: 20, padding:10, height:40, alignSelf: "stretch", fontSize: 18, },
});

export default EditProfilePageScreen;

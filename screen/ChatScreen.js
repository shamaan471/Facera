import React, { useState, useContext, useEffect } from 'react';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
  Actions
} from 'react-native-gifted-chat';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
//import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../constants/Config';
//import useStatsBar from '../utils/useStatusBar';


var myDB = firebase.firestore();

const  ChatScreen = (props) => {
  //useStatsBar('light-content');

  const [messages, setMessages] = useState([]);
  //const { thread } = props.route.params.chatId;
  const chatId = props.route.params.chatId;
  //const { user } = useContext(AuthContext);
  const currentUser = props.route.params.currUserId;
  //const currentUser = user.toJSON();

  async function handleSend(messages) {
    const text = messages[0].text;

    myDB
      .collection('Chats')
      .doc(chatId)
      .collection('Messages')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: currentUser,
          //email: currentUser.email
        }
      });

    await myDB
      .collection('Chats')
      .doc(chatId)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime()
          }
        },
        { merge: true }
      );
  }

  useEffect(() => {
    const messagesListener = myDB
      .collection('Chats')
      .doc(chatId)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData
          };

          // if (!firebaseData.system) {
          //   data.user = {
          //     ...firebaseData.user,
          //     name: firebaseData.user.email
          //   };
          // }

          return data;
        });

        setMessages(messages);
      });

    // Stop listening for updates whenever the component unmounts
    return () => messagesListener();
  }, []);

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#6646ee'
          }
        }}
        textStyle={{
          right: {
            color: '#fff'
          }
        }}
      />
    );
  }

  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#6646ee' />
      </View>
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon='send-circle' size={32} color='#085A2E' />
        </View>
      </Send>
    );
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon='chevron-double-down' size={36} color='#6646ee' />
      </View>
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  }

  function renderReocrdButton(props){
    return(
        <Actions {...props}>
          <View style={styles.sendingContainer}>
            <IconButton icon='camera' size={32} color='#085A2E' />
          </View>
        </Actions>
    );
  }

  function handleCamPress(){
    console.log("me pressed");
    props.navigation.navigate('DetectFace');
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={handleSend}
      // user={{ _id: currentUser.uid }}
      user = {{_id: currentUser}}
      placeholder='Type your message here...'
      alwaysShowSend
      showUserAvatar
      scrollToBottom
      renderBubble={renderBubble}
      renderLoading={renderLoading}
      renderSend={renderSend}
      scrollToBottomComponent={scrollToBottomComponent}
      renderSystemMessage={renderSystemMessage}
      renderActions ={renderReocrdButton}
      onPressActionButton = {handleCamPress}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  systemMessageWrapper: {
    backgroundColor: '#6646ee',
    borderRadius: 4,
    padding: 5
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  }
});

export const screenOptions = {
  headerTitle: 'Chat',
  headerTintColor: '#013220',
  headerTitleStyle: {
        fontWeight: 'bold',
      },
};

export default ChatScreen;
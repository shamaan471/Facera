import React, {useState, useEffect, useCallback} from 'react'
import { View, ScrollView, StyleSheet, ActivityIndicator , Text, FlatList, TouchableOpacity} from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import * as friendsActions from '../store/actions/friends';
import Colors from '../constants/Colors';
import ListItemName from '../components/UI/ListItemName'


//const myDB = firebase.firestore();



const HomePageScreen = props => {



  const [search , setSearch] = useState('');
  // const [userList, setUserList] = useState([
  //   {
  //     name: 'Amy Farha',
  //     avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
  //     subtitle: 'Vice President'
  //   },
  //   {
  //     name: 'Chris Jackson',
  //     avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
  //     subtitle: 'Vice Chairman'
  //   },
  //  // more items
  // ]);

  const friendsList = useSelector(state => state.friend.friendsList);
  const user = useSelector(state => state.auth.userId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  
  
  const dispatch = useDispatch();



  const searchHandler = text => {
    setSearch(text);
  };


  //function to fetch the friends list from the store
  const loadFriends = useCallback(
    async() => {
      setIsLoading(true);
      
      try{
        await dispatch(friendsActions.fetchFriends(user));

      }catch (err) {
        setError(err.message)
      }
      setIsLoading(false);
  },
  [dispatch, setIsLoading]);

 
  // const chatID = () => {
  //   const chatterID = this.props.authUser.uid;
  //   const chateeID = this.chateeUID;
  //   const chatIDpre = [];
  //   chatIDpre.push(chatterID);
  //   chatIDpre.push(chateeID);
  //   chatIDpre.sort();
  //   return chatIDpre.join('_');
  // };


  const selectPersonHandler = (userId, friendId) => {

    //generating distinct chat id for the chat room between these friends
    const chatterId = userId;
    const chateeID = friendId;
    const chatIDpre = [];
    chatIDpre.push(chatterId);
    chatIDpre.push(chateeID);
    chatIDpre.sort();
    const distinctChatId= chatIDpre.join('_');

    props.navigation.navigate('ChatRoom', {
      currUserId: userId,
      friendId: friendId,
      chatId : distinctChatId
    });
  };


  //runs on every rerender and calls func to fetch the friends
  useEffect(() => {
    setIsLoading(true);
    loadFriends().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadFriends]);
  
  if (isLoading){
    return(
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }


  //present the users in tile
  const Item = ({ title }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Item title={item.name} />
  );

  return (
    <View style={styles.screen}>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={searchHandler}
        value={search}
      />
      <ScrollView>
        {
          // friendsList.map((l, i) => (
          //   <ListItem key={i} bottomDivider>
          //     {console.log(l)}
          //     {console.log(typeof l.name)}
          //     <ListItem.Content>
          //       <ListItem.Title>{l.name}</ListItem.Title>  
          //     </ListItem.Content>
          //     onPress = {onPressUserHandler}






          //   </ListItem>
          // ))

        <FlatList
          data={friendsList}
          // renderItem={renderItem}
          keyExtractor={item => item.id}sc
          renderItem = { itemData => (
            <ListItemName style = {styles.item} onSelect = {() => {selectPersonHandler(user, itemData.item.id)}}>
              <Text style = {styles.title}>{itemData.item.name}</Text>
            </ListItemName>
          )
            
          }

        />
         
          
        }
      </ScrollView>
    </View>
    
  );

};


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center'
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export const screenOptions = {
  headerTitle: 'Home'
};


// export const screenOptions = navData => {
//   return {
//     headerTitle: 'Home Page',
//     // headerLeft: () => (
//     //   <HeaderButtons HeaderButtonComponent={HeaderButton}>
//     //     <Item
//     //       title="Menu"
//     //       iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
//     //       onPress={() => {
//     //         navData.navigation.toggleDrawer();
//     //       }}
//     //     />
//     //   </HeaderButtons>
//     // ),
//     headerRight: () => (
//       <HeaderButtons HeaderButtonComponent={HeaderButton}>
//         <Item
//           title="Cart"
//           iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
//           onPress={() => {
//             navData.navigation.navigate('Cart');
//           }}
//         />
//       </HeaderButtons>
//     )
//   };
// };


export default HomePageScreen;
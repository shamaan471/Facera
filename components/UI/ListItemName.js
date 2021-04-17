import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const ListItemName = props => {
    return (
        <TouchableOpacity style={{...styles.card, ...props.style}} onPress = {props.onSelect}>
            {props.children}
        </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    card: {
      shadowColor: 'black',
      shadowOpacity: 0.26,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 5,
      borderRadius: 10,
      backgroundColor: 'white'
    }
  });
  
  export default ListItemName;
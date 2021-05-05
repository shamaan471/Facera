import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';


const AvatarScreen = props => {
    const [toggleFresh, setToggleFresh] = useState(false);

    useEffect(() => {
        (async () => {
            console.log("in useEffect");
            const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.AUDIO_RECORDING, Permissions.MEDIA_LIBRARY);
            if (status === "granted") {
            }
            else {
                alert("Permission failed!!")
            }
        }
        )();
    }, []);
    return (
        <View style={styles.container}>
            {toggleFresh && (
                <View style={styles.webConatainer}>
                    <Button title={"Hide Avatar"}
                        onPress={() => { setToggleFresh(false) }}
                    />
                    <WebView source={{ uri: 'https://pose-animator-demo.firebaseapp.com/camera.html' }} ignoreSslError={true} scalesPageToFit={true} />
                </View>
            )}

            {!toggleFresh && (
                
                <View style={styles.middleContainer}>
                    <Button
                        style={styles.button}
                        title={"Show Avatar"}
                        onPress={() => { setToggleFresh(true) }}
                    />
                </View>
                
            )}

        </View>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    middleContainer: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    camera: {
        flex: 1,
        width: 900,
        height: 500
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#f3ff0f'
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    webConatainer: {
        flex: 1,
        marginTop: 5,
        width: 400
    }
});



export const screenOptions = {
    headerTintColor: '#013220',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerTitle: 'Avatar'
};


export default AvatarScreen;
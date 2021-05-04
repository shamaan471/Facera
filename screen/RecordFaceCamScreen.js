import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider, Vibration } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';


const landmarkSize = 4;

//cam flash
const flashModeOrder = {
    off: 'on',
    on: 'auto',
    auto: 'torch',
    torch: 'off',
};

const wbOrder = {
    auto: 'sunny',
    sunny: 'cloudy',
    cloudy: 'shadow',
    shadow: 'fluorescent',
    fluorescent: 'incandescent',
    incandescent: 'auto',
};

const RecordFaceCamScreen = (props) => {

    const [flash, setFlash] = useState('off');
    const [zoom, setZoom] = useState(0);
    const [autoFocus, setAutoFocus] = useState('on');
    const [depth, setDepth] = useState(0);
    const [type, setType] = useState('back');
    const [whiteBalance, setWhiteBalance] = useState('auto');
    const [ratio, setRatio] = useState('16:9');
    const [faces, setFaces] = useState([]);
    const [video, setVideo] = useState(null);
    const [recording, setRecording] = useState(null);
    const [camPermission, setCamPermission] = useState(false);
    const [audioPermission, setAudioPermission] = useState(false);

    const camera = useRef(null)


    useEffect(() => {
        (async () => {
            //asking perm to record audio and save to storage
            const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.AUDIO_RECORDING, Permissions.MEDIA_LIBRARY);
            if (status === "granted") {
                setCamPermission(true);
                setAudioPermission(true);
            }
            else {
                alert("Permission failed!!")
            }
        }
        )();
    }, []);


    //switch b/w fron  and back cam
    const toggleFacing = () => {
        setType(type === 'back' ? 'front' : 'back');
    }


    const toggleFlash = () => {
        setFlash(flashModeOrder[flash]);
    }


    //toggle white balance
    const toggleWB = () => {
        setWhiteBalance(wbOrder[whiteBalance]);
    }

    //toggle suto focus
    const toggleFocus = () => {
        setAutoFocus(autoFocus === 'on' ? 'off' : 'on');
    }

    const zoomOut = () => {
        setZoom(zoom - 0.1 < 0 ? 0 : zoom - 0.1);
    }

    const zoomIn = () => {
        setZoom(zoom + 0.1 > 1 ? 1 : zoom + 0.1);
    }

    const setFocusDepth = (depth) => {
        setDepth(depth);
    }

    /////////////////////////////////////////////
    //VIEDO RECORD LOGIC
    //////////////////////////////////////
    const stopVid = async () => {
        camera.current.stopRecording();
    }
    const _StopRecord = () => {
        if (camera) {
            setRecording(false);
            stopVid();
        }
    };

    const recordVid = async () => {
        const myVid = await camera.current.recordAsync();
        setVideo(myVid);
    }
    const _StartRecord = () => {
        if (camera) {
            setRecording(true);
            recordVid();
        }
    };


    const toggleRecord = () => {
        if (recording) {
            _StopRecord();
        } else {
            _StartRecord();
        }
    };


    const _saveVideo = async () => {
        //const { video } = video;
        const asset = await MediaLibrary.createAssetAsync(video.uri);
        if (asset) {
          //this.setState({ video: null });
          setVideo(null);
        }
    };

    const onFacesDetected = ({ faces }) => setFaces(faces);
    const onFaceDetectionError = () => console.log("Face Detection Error");

    const renderFace = ({ bounds, faceID, rollAngle, yawAngle, smilingProbability, leftEyeOpenProbability, rightEyeOpenProbability }) => {
        return (
            <View
                key={faceID}
                transform={[
                    { perspective: 600 },
                    { rotateZ: `${rollAngle.toFixed(0)}deg` },
                    { rotateY: `${yawAngle.toFixed(0)}deg` },
                ]}
                style={[
                    styles.face,
                    {
                        ...bounds.size,
                        left: bounds.origin.x,
                        top: bounds.origin.y,
                    },
                ]}>
                <Text style={styles.faceText}>ID: {faceID}</Text>
                <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
                <Text style={styles.faceText}>yawAngle: {yawAngle}</Text>
                <Text style={styles.faceText}>smilingProbability: {smilingProbability}</Text>
                <Text style={styles.faceText}>rightEyeOpenProbability: {leftEyeOpenProbability}</Text>
                <Text style={styles.faceText}>leftEyeOpenProbability: {rightEyeOpenProbability}</Text>
            </View>
        );
    }


    const renderLandmarksOfFace = face => {
        const renderLandmark = position =>
            position && (
                <View
                    style={[
                        styles.landmark,
                        {
                            left: position.x - landmarkSize / 2,
                            top: position.y - landmarkSize / 2,
                        },
                    ]}
                />
            );
        return (
            <View key={`landmarks-${face.faceID}`}>
                {renderLandmark(face.leftEyePosition)}
                {renderLandmark(face.rightEyePosition)}
                {renderLandmark(face.leftEarPosition)}
                {renderLandmark(face.rightEarPosition)}
                {renderLandmark(face.leftCheekPosition)}
                {renderLandmark(face.rightCheekPosition)}
                {renderLandmark(face.leftMouthPosition)}
                {renderLandmark(face.mouthPosition)}
                {renderLandmark(face.rightMouthPosition)}
                {renderLandmark(face.noseBasePosition)}
                {renderLandmark(face.bottomMouthPosition)}
            </View>
        );
    }

    const renderFaces = () => {
        return (
            <View style={styles.facesContainer} pointerEvents="none">
                {faces.map(renderFace)}
            </View>
        );
    }

    const renderLandmarks = () => {
        return (
            <View style={styles.facesContainer} pointerEvents="none">
                {faces.map(renderLandmarksOfFace)}
            </View>
        );
    }

    const renderCamera = () => {
        return (
            <Camera
                ref={camera}
                style={{
                    flex: 1,
                }}
                type={type}
                flashMode={flash}
                autoFocus={autoFocus}
                zoom={zoom}
                whiteBalance={whiteBalance}
                ratio={ratio}
                onFacesDetected={onFacesDetected}
                onFaceDetectionError={onFaceDetectionError}
                focusDepth={depth}
                faceDetectorSettings={{
                    mode: FaceDetector.Constants.Mode.fast,
                    detectLandmarks: FaceDetector.Constants.Landmarks.all,
                    runClassifications: FaceDetector.Constants.Classifications.all,
                    minDetectionInterval: 100,
                    tracking: true,
                }}
            >
                <View
                    style={{
                        flex: 0.5,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                    }}>
                    <TouchableOpacity style={styles.flipButton} onPress={toggleFacing.bind(this)}>
                        <Text style={styles.flipText}> FLIP </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.flipButton} onPress={toggleFlash.bind(this)}>
                        <Text style={styles.flipText}> FLASH: {flash} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.flipButton} onPress={toggleWB.bind(this)}>
                        <Text style={styles.flipText}> WB: {whiteBalance} </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flex: 0.4,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                    }}>
                    <Slider
                        style={{ width: 150, marginTop: 15, alignSelf: 'flex-end' }}
                        onValueChange={setFocusDepth.bind(this)}
                        step={0.1}
                        disabled={autoFocus === 'on'}
                    />
                </View>
                <View
                    style={{
                        flex: 0.1,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                    }}>
                    <TouchableOpacity
                        style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
                        onPress={zoomIn.bind(this)}>
                        <Text style={styles.flipText}> + </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
                        onPress={zoomOut.bind(this)}>
                        <Text style={styles.flipText}> - </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.flipButton, { flex: 0.25, alignSelf: 'flex-end' }]}
                        onPress={toggleFocus.bind(this)}>
                        <Text style={styles.flipText}> AF : {autoFocus} </Text>
                    </TouchableOpacity>
                    {video && (
                        <TouchableOpacity
                            onPress={_saveVideo}
                            style={[styles.flipButton, styles.picButton, {
                                flex: 0.3,
                                alignSelf: 'flex-end'
                            }]}
                        >
                            <Text style={styles.flipText}>Save</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={toggleRecord.bind(this)}
                        style={[styles.flipButton, styles.picButton, {
                            flex: 0.25,
                            alignSelf: 'flex-end'
                        }]}
                    >
                        <Text style={styles.flipText}>
                            {recording ? "Stop" : "Record"}
                        </Text>
                    </TouchableOpacity>
                </View>
                {renderFaces()}
                {renderLandmarks()}
            </Camera>
        );
    }


    return (
        <View style={styles.container}>
            {renderCamera()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#000',
    },
    navigation: {
        flex: 1,
    },
    gallery: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    flipButton: {
        flex: 0.3,
        height: 40,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 20,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flipText: {
        color: 'white',
        fontSize: 15,
    },
    item: {
        margin: 4,
        backgroundColor: 'indianred',
        height: 35,
        width: 80,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    picButton: {
        backgroundColor: 'darkseagreen',
    },
    galleryButton: {
        backgroundColor: 'indianred',
    },
    facesContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
    },
    face: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: 'absolute',
        borderColor: '#FFD700',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    landmark: {
        width: landmarkSize,
        height: landmarkSize,
        position: 'absolute',
        backgroundColor: 'red',
    },
    faceText: {
        color: '#FFD700',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        backgroundColor: 'transparent',
    },
    row: {
        flexDirection: 'row',
    },
});


export const screenOptions = {
    headerTitle: 'Cam',
    headerTintColor: '#013220',
    headerTitleStyle: {
          fontWeight: 'bold',
    },
};

export default RecordFaceCamScreen;
import * as React from 'react';
import {TouchableOpacity, View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {AudioUtil} from 'react-native-pytorch-core';

export default function PTLAudioRecorder(props) {
  const onRecordingStartedCallback = props.onRecordingStarted;
  const onRecordingCompleteCallback = props.onRecordingComplete;
  const [isAudioRecording, setIsAudioRecording] = React.useState(false);


  function startRecording() {
    console.log("start button pressed!")
    AudioUtil.startRecord();
    setIsAudioRecording(true);
    if (onRecordingStartedCallback) {
      onRecordingStartedCallback();
    }
  }

  async function stopRecording() {
    console.log("stop button pressed!")
    const audio = await AudioUtil.stopRecord();
    setIsAudioRecording(false);
    if (onRecordingCompleteCallback) {
      onRecordingCompleteCallback(audio);
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, { opacity: isAudioRecording ? 1 : 0 }]}>
        <ActivityIndicator size="large" />
      </View>
      <TouchableOpacity
        onPress={!isAudioRecording ? startRecording : stopRecording}>
        <View style={styles.startButton}>
          <Text style={styles.startButtonText}>
            {isAudioRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 10,
  },
  indicator: {
    marginTop: 10,
    marginBottom: 10,
  },
  startButton: {
    width: 260,
    height: 40,
    marginTop: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4c2c',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
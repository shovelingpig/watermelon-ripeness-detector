import * as React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import PTLAudioRecorder from './PTLAudioRecorder'
import useAudioModelInference from './useAudioModelInference';

export default function App() {
  const {answer, metrics, setAnswer, setMetrics, processAudio} = useAudioModelInference();

  const handleRecordingStarted = React.useCallback(
    () => {
      setAnswer(null);
      setMetrics(null);
    }, [setAnswer, setMetrics]
  );

  const handleRecordingComplete = React.useCallback(
    async (audio) => {
      await processAudio(audio);
    },
    [processAudio],
  );

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.largeText}>
          Watermelon Ripeness Detector
        </Text>
        <Image 
          source={require('./assets/watermelon.jpeg')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <PTLAudioRecorder
        onRecordingStarted={handleRecordingStarted}
        onRecordingComplete={handleRecordingComplete}
      />

      <View style={styles.textContainer}>
        <Text style={styles.smallText}>
          Detected Ripeness: {answer ? answer : '?'}
        </Text>
        <Text style={styles.smallText}>
          Inference Time: { metrics ? metrics.totalTime + 'ms' : '?'}
        </Text>
      </View>

      <View style={styles.developerContainer}>
        <Text style={styles.developerText}>
          Incheon Academy of science and Arts
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 230,
    height: 230,
    marginTop: 50,
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  largeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'Courier New',
    alignItems: 'center',
    marginTop: 70,
  },
  smallText: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  developerContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 60,
    alignItems: 'center',
  },
  developerText: {
    fontSize: 14,
    color: 'gray',
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    alignItems: 'center',
    marginTop: 20,
  },
});
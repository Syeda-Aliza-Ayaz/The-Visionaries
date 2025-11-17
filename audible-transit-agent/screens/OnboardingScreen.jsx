// // screens/OnboardingScreen.jsx
// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, StyleSheet, Alert, Pressable } from 'react-native';
// import * as Speech from 'expo-speech';
// import * as Haptics from 'expo-haptics';
// import { Audio } from 'expo-av';
// import axios from 'axios';

// const questions = [
//   { key: 'crowdTolerance', text: 'On a scale of 1 to 10, what is your comfort level with large, noisy crowds?' },
//   { key: 'seatingPreference', text: 'When you board a bus, which area do you prefer: front, middle, or rear?' },
//   { key: 'travelTriggers', text: 'Any specific triggers like smells or broken seats?' },
//   { key: 'timeTolerance', text: 'Max wait time before rerouting?' },
// ];

// const IP = '192.168.0.105';
// const GOOGLE_API_KEY = 'AIzaSyCFOLP0EfP2OgqU6NHLjjUpktvO4fE8xGE'; // PASTE HERE

// export default function OnboardingScreen({ navigation, route }) {
//   const userId = route.params?.userId ?? 'test-user';
//   const [idx, setIdx] = useState(0);
//   const [answer, setAnswer] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [recording, setRecording] = useState(null);

//   useEffect(() => {
//     Speech.speak(questions[idx].text, { rate: 0.9 });
//   }, [idx]);

//   const startRecording = async () => {
//     try {
//       const { status } = await Audio.requestPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Mic', 'Allow in Settings');
//         return;
//       }

//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });

//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RecordingOptionsPresets.HIGH_QUALITY
//       );
//       setRecording(recording);
//       setIsRecording(true);
//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//     } catch (err) {
//       Alert.alert('Error', 'Recording failed');
//     }
//   };

//   const stopRecording = async () => {
//     if (!recording) return;
//     setIsRecording(false);
//     await recording.stopAndUnloadAsync();
//     const uri = recording.getURI();

//     try {
//       const response = await fetch(uri);
//       const blob = await response.blob();
//       const reader = new FileReader();
//       reader.onloadend = async () => {
//         const base64 = reader.result.split(',')[1];
//         const res = await fetch(
//           `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
//           {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               config: {
//                 encoding: 'WEBM_OPUS',
//                 sampleRateHertz: 48000,
//                 languageCode: 'en-US',
//               },
//               audio: { content: base64 },
//             }),
//           }
//         );
//         const data = await res.json();
//         const text = data.results?.[0]?.alternatives?.[0]?.transcript || 'Nothing heard';
//         setAnswer(text);
//         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//       };
//       reader.readAsDataURL(blob);
//     } catch (e) {
//       Alert.alert('STT Error', 'Using fallback');
//       const mockResponses = ['2', 'rear', 'none', '10 minutes'];
//       setAnswer(mockResponses[idx] || '7');
//     }
//     setRecording(null);
//   };

//   const saveAndNext = async () => {
//     const q = questions[idx];
//     try {
//       await axios.post(`http://${IP}:8000/store-preference`, {
//         userId,
//         key: q.key,
//         value: answer || 'skipped',
//       }, {
//         headers: { 'Content-Type': 'application/json' }
//       });
//     } catch (e) {
//       Alert.alert('Save Failed', e.message);
//     }

//     if (idx < questions.length - 1) {
//       setIdx(idx + 1);
//       setAnswer('');
//     } else {
//       Speech.speak('Welcome to VisionaryGuide!');
//       navigation.replace('Landing');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.q}>{questions[idx].text}</Text>
//       <TextInput
//         style={styles.input}
//         value={answer}
//         onChangeText={setAnswer}
//         placeholder="Type here..."
//       />

//       <Pressable
//         style={({ pressed }) => [
//           styles.micButton,
//           pressed && styles.micPressed,
//           isRecording && styles.micRecording
//         ]}
//         onLongPress={startRecording}
//         onPressOut={stopRecording}
//         disabled={isRecording}
//       >
//         <Text style={styles.micText}>
//           {isRecording ? 'Recording...' : 'Hold to Speak'}
//         </Text>
//       </Pressable>

//       <Pressable
//         style={({ pressed }) => [styles.nextButton, pressed && styles.nextPressed]}
//         onPress={saveAndNext}
//       >
//         <Text style={styles.nextText}>Next</Text>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 24 },
//   q: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
//   input: { borderWidth: 1, padding: 12, marginVertical: 12, borderRadius: 8 },
//   micButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 50, marginVertical: 10 },
//   micPressed: { backgroundColor: '#0056b3', transform: [{ scale: 0.95 }] },
//   micRecording: { backgroundColor: '#FF3B30' },
//   micText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
//   nextButton: { backgroundColor: '#34C759', padding: 16, borderRadius: 50, marginTop: 10 },
//   nextPressed: { backgroundColor: '#2a9d4f', transform: [{ scale: 0.95 }] },
//   nextText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
// });

// screens/OnboardingScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable, ScrollView, AccessibilityInfo } from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import axios from 'axios';

const questions = [
  { key: 'crowdTolerance', text: 'On a scale of 1 to 10, what is your comfort level with large, noisy crowds?' },
  { key: 'seatingPreference', text: 'When you board a bus, which area do you prefer: front, middle, or rear?' },
  { key: 'travelTriggers', text: 'Any specific triggers like smells or broken seats?' },
  { key: 'timeTolerance', text: 'Max wait time before rerouting?' },
];

const IP = '192.168.0.105';
const GOOGLE_API_KEY = 'AIzaSyCFOLP0EfP2OgqU6NHLjjUpktvO4fE8xGE';

export default function OnboardingScreen({ navigation, route }) {
  const userId = route.params?.userId ?? 'test-user';
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);

  useEffect(() => {
    Speech.speak(questions[idx].text, { rate: 0.9 });
    // Announce progress for screen readers
    AccessibilityInfo.announceForAccessibility(
      `Question ${idx + 1} of ${questions.length}. ${questions[idx].text}`
    );
  }, [idx]);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Microphone Access', 'Please allow microphone access in Settings to use voice input.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      AccessibilityInfo.announceForAccessibility('Recording started');
    } catch (err) {
      Alert.alert('Error', 'Recording failed. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(',')[1];
        const res = await fetch(
          `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              config: {
                encoding: 'WEBM_OPUS',
                sampleRateHertz: 48000,
                languageCode: 'en-US',
              },
              audio: { content: base64 },
            }),
          }
        );
        const data = await res.json();
        const text = data.results?.[0]?.alternatives?.[0]?.transcript || 'Nothing heard';
        setAnswer(text);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        AccessibilityInfo.announceForAccessibility(`Recognized: ${text}`);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      Alert.alert('Speech Recognition Error', 'Using fallback response');
      const mockResponses = ['2', 'rear', 'none', '10 minutes'];
      setAnswer(mockResponses[idx] || '7');
    }
    setRecording(null);
  };

  const saveAndNext = async () => {
    const q = questions[idx];
    
    if (!answer.trim()) {
      Alert.alert('Answer Required', 'Please provide an answer or say "skip" to continue.');
      return;
    }

    try {
      await axios.post(`http://${IP}:8000/store-preference`, {
        userId,
        key: q.key,
        value: answer || 'skipped',
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      Alert.alert('Save Failed', e.message);
      return;
    }

    if (idx < questions.length - 1) {
      setIdx(idx + 1);
      setAnswer('');
    } else {
      Speech.speak('Welcome to VisionaryGuide! Setup complete.');
      navigation.replace('Landing');
    }
  };

  const progress = ((idx + 1) / questions.length) * 100;

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      accessible={true}
      accessibilityLabel="Onboarding questionnaire"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text 
            style={styles.logo}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel="VisionaryGuide Setup"
          >
            VisionaryGuide
          </Text>
          <Text 
            style={styles.subtitle}
            accessible={true}
            accessibilityLabel={`Setting up your preferences. Question ${idx + 1} of ${questions.length}`}
          >
            Let's personalize your experience
          </Text>
        </View>

        {/* Progress Bar */}
        <View 
          style={styles.progressContainer}
          accessible={true}
          accessibilityRole="progressbar"
          accessibilityLabel={`Progress: ${Math.round(progress)}% complete`}
          accessibilityValue={{ now: progress, min: 0, max: 100 }}
        >
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {idx + 1} / {questions.length}
          </Text>
        </View>

        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text 
            style={styles.questionLabel}
            accessible={true}
            accessibilityRole="text"
          >
            Question {idx + 1}
          </Text>
          <Text 
            style={styles.questionText}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={questions[idx].text}
          >
            {questions[idx].text}
          </Text>
        </View>

        {/* Answer Input */}
        <View style={styles.inputContainer}>
          <Text 
            style={styles.inputLabel}
            accessible={true}
          >
            Your Answer
          </Text>
          <TextInput
            style={styles.input}
            value={answer}
            onChangeText={setAnswer}
            placeholder="Type your answer here..."
            placeholderTextColor="#999"
            accessible={true}
            accessibilityLabel="Answer input field"
            accessibilityHint="Enter your answer or use voice input below"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Voice Input Button */}
        <Pressable
          style={({ pressed }) => [
            styles.micButton,
            pressed && styles.micPressed,
            isRecording && styles.micRecording
          ]}
          onLongPress={startRecording}
          onPressOut={stopRecording}
          disabled={isRecording}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isRecording ? 'Recording in progress' : 'Hold to record voice answer'}
          accessibilityHint="Press and hold to speak your answer, release when done"
          accessibilityState={{ disabled: isRecording }}
        >
          <View style={styles.micButtonContent}>
            <View style={styles.micIcon}>
              <Text style={styles.micIconText}>🎤</Text>
            </View>
            <Text style={styles.micText}>
              {isRecording ? 'Recording...' : 'Hold to Speak'}
            </Text>
          </View>
        </Pressable>

        {/* Navigation Buttons */}
        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [
              styles.nextButton,
              pressed && styles.nextPressed
            ]}
            onPress={saveAndNext}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={idx < questions.length - 1 ? 'Next question' : 'Complete setup'}
            accessibilityHint="Saves your answer and continues"
          >
            <Text style={styles.nextText}>
              {idx < questions.length - 1 ? 'Next' : 'Complete'}
            </Text>
          </Pressable>
        </View>

        {/* Helper Text */}
        <Text 
          style={styles.helperText}
          accessible={true}
          accessibilityRole="text"
        >
          💡 Tip: Hold the microphone button and speak naturally
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    fontWeight: '600',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  questionLabel: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  questionText: {
    fontSize: 20,
    color: '#1A1A1A',
    lineHeight: 28,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#1A1A1A',
  },
  micButton: {
    backgroundColor: '#FF9500',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  micPressed: {
    backgroundColor: '#CC7700',
    transform: [{ scale: 0.97 }],
  },
  micRecording: {
    backgroundColor: '#FF3B30',
    shadowColor: '#FF3B30',
  },
  micButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  micIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  micIconText: {
    fontSize: 20,
  },
  micText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#34C759',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextPressed: {
    backgroundColor: '#2a9d4f',
    transform: [{ scale: 0.97 }],
  },
  nextText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
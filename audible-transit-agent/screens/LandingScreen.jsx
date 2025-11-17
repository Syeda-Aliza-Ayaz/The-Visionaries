// // // // // screens/LandingScreen.jsx
// // // // import React, { useEffect, useState, useRef } from 'react'; // ADDED useRef
// // // // import { View, Text, StyleSheet, Alert, Pressable, Dimensions } from 'react-native'; // ADDED Dimensions
// // // // import * as Speech from 'expo-speech';
// // // // import * as Haptics from 'expo-haptics';
// // // // import { Audio } from 'expo-av';
// // // // import { CameraView, useCameraPermissions } from 'expo-camera';
// // // // import axios from 'axios';

// // // // const PHRASE = 'hello';
// // // // const IP = '192.168.0.105';
// // // // const GOOGLE_API_KEY = 'AIzaSyCFOLP0EfP2OgqU6NHLjjUpktvO4fE8xGE'; // PASTE YOUR KEY

// // // // // Get screen dimensions for camera sizing
// // // // const { width, height } = Dimensions.get('window');

// // // // export default function LandingScreen({ route }) {
// // // //   const userId = route.params?.userId ?? 'test-user';
// // // //   const [isRecording, setIsRecording] = useState(false);
// // // //   const [showCamera, setShowCamera] = useState(false); // NEW STATE for camera visibility
// // // //   const [recording, setRecording] = useState(null);
// // // //   const [hasCam, setHasCam] = useState(false);
// // // //   const cameraRef = useRef(null); // REF for taking the picture
// // // //   const [permission, requestPermission] = useCameraPermissions(); // <--- ADD THIS LINE

// // // //   // --- 1. CAMERA PERMISSION AND SETUP (CLEANED UP) ---
// // // //   useEffect(() => {
// // // //     (async () => {
// // // //     })();
// // // //   }, []);

// // // //   // --- 2. AUDIO RECORDING (REMAINS THE SAME) ---
// // // //   const startRecording = async () => {
// // // //     // ... (Your existing startRecording logic remains here) ...
// // // //     try {
// // // //       const { status } = await Audio.requestPermissionsAsync();
// // // //       if (status !== 'granted') {
// // // //         Alert.alert('Mic', 'Allow in Settings');
// // // //         return;
// // // //       }

// // // //       await Audio.setAudioModeAsync({
// // // //         allowsRecordingIOS: true,
// // // //         playsInSilentModeIOS: true,
// // // //       });

// // // //       const { recording } = await Audio.Recording.createAsync(
// // // //         Audio.RecordingOptionsPresets.HIGH_QUALITY
// // // //       );
// // // //       setRecording(recording);
// // // //       setIsRecording(true);
// // // //       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
// // // //     } catch (err) {
// // // //       Alert.alert('Error', 'Recording failed');
// // // //     }
// // // //   };

// // // //   const stopRecording = async () => {
// // // //     // ... (Your existing stopRecording logic remains here) ...
// // // //     if (!recording) return;
// // // //     setIsRecording(false);
// // // //     await recording.stopAndUnloadAsync();
// // // //     const uri = recording.getURI();

// // // //     try {
// // // //       const response = await fetch(uri);
// // // //       const blob = await response.blob();
// // // //       const reader = new FileReader();
// // // //       reader.onloadend = async () => {
// // // //         const base64 = reader.result.split(',')[1];
// // // //         const res = await fetch(
// // // //           `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
// // // //           {
// // // //             method: 'POST',
// // // //             headers: { 'Content-Type': 'application/json' },
// // // //             body: JSON.stringify({
// // // //               config: {
// // // //                 encoding: 'WEBM_OPUS',
// // // //                 sampleRateHertz: 48000,
// // // //                 languageCode: 'en-US',
// // // //               },
// // // //               audio: { content: base64 },
// // // //             }),
// // // //           }
// // // //         );
// // // //         const data = await res.json();
// // // //         const text = (data.results?.[0]?.alternatives?.[0]?.transcript || '').toLowerCase();
// // // //         console.log('Recognized:', text);

// // // //         if (text.includes(PHRASE)) {
// // // //           const query = text.replace(PHRASE, '').trim() || 'what do you see';
// // // //           await handleQuery(query);
// // // //         } else {
// // // //           Speech.speak(`Say ${PHRASE} first`);
// // // //         }
// // // //       };
// // // //       reader.readAsDataURL(blob);
// // // //     } catch (e) {
// // // //       console.log('STT failed, using mock');
// // // //       await handleQuery('is the bus here');
// // // //     }
// // // //     setRecording(null);
// // // //   };

// // // //   const handleQuery = async (query) => {
// // // //     try {
// // // //       // 1. Check/Request Camera Permission FIRST
// // // //       if (!permission?.granted) {
// // // //         // If not granted, try requesting it before proceeding
// // // //         const permissionResult = await requestPermission();
// // // //         if (!permissionResult.granted) {
// // // //           Speech.speak('Camera permission is required for vision queries. Please enable it.');
// // // //           return; // Stop the process here
// // // //         }
// // // //       }

// // // //       const res = await axios.post(`http://${IP}:8000/process-query`, { userId, query });
// // // //       const { needsVision } = res.data;

// // // //       if (needsVision) { // Permission is already granted if we reached here
// // // //         setShowCamera(true);
// // // //         Speech.speak('Hold phone steady');

// // // //         setTimeout(async () => {
// // // //           try {
// // // //             // --- 👇 ADD CUES HERE 👇 ---

// // // //             // 1. Audio Cue: Speak "Click" or a brief instructional sound
// // // //             Speech.speak('Capturing');

// // // //             // 2. Haptic Feedback: Provide a short, sharp vibration (Success is a good choice)
// // // //             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
// // // //             const photo = await cameraRef.current?.takePictureAsync({ base64: true, quality: 0.7 });
// // // //             const fusion = await axios.post(`http://${IP}:8000/fusion`, {
// // // //               userId, query, image: photo.base64 // <--- REQUIRES 'base64' property
// // // //             });
// // // //             Speech.speak(fusion.data.instruction || 'Done');
// // // //             setShowCamera(false);
// // // //           } catch (e) {
// // // //             console.error("Photo Error:", e);
// // // //             Speech.speak('Photo failed, but still guiding you');
// // // //             setShowCamera(false);
// // // //           }
// // // //         }, 3000);
// // // //       } else {
// // // //         Speech.speak('All clear');
// // // //       }
// // // //     } catch (e) {
// // // //       // Still useful to log the error if backend fails a future request
// // // //       console.error("Backend or STT Error:", e);
// // // //       Alert.alert('Error', 'Operation failed.');
// // // //     }
// // // //   };

// // // //   // CAMERA SCREEN
// // // //   if (showCamera) {
// // // //     return (
// // // //       <CameraView
// // // //         ref={cameraRef}
// // // //         style={{ flex: 1 }}
// // // //         facing="back"
// // // //       >
// // // //         <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', padding: 30 }}>
// // // //           <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', padding: 15, borderRadius: 10 }}>
// // // //             Analyzing... Hold Steady!
// // // //           </Text>
// // // //         </View>
// // // //       </CameraView>
// // // //     );
// // // //   }

// // // //   return (
// // // //     // Main landing screen (only visible when not in camera mode)
// // // //     <View style={styles.container}>
// // // //       <Text style={styles.title}>Visionary Guide</Text>
// // // //       <Text style={styles.sub}>
// // // //         {isRecording ? 'Listening...' : 'Hold to say "Hey Visionary"'}
// // // //       </Text>

// // // //       <Pressable
// // // //         style={({ pressed }) => [
// // // //           styles.micButton,
// // // //           pressed && styles.micPressed,
// // // //           isRecording && styles.micRecording
// // // //         ]}
// // // //         onLongPress={startRecording}
// // // //         onPressOut={stopRecording}
// // // //         disabled={isRecording}
// // // //       >
// // // //         <Text style={styles.micText}>
// // // //           {isRecording ? 'Recording...' : 'Hold to Activate'}
// // // //         </Text>
// // // //       </Pressable>
// // // //     </View>
// // // //   );
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
// // // //   title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
// // // //   sub: { fontSize: 18, color: '#555', textAlign: 'center', marginBottom: 40 },
// // // //   micButton: { backgroundColor: '#FF9500', paddingHorizontal: 40, paddingVertical: 18, borderRadius: 50, elevation: 6 },
// // // //   micPressed: { backgroundColor: '#CC7700', transform: [{ scale: 0.95 }] },
// // // //   micRecording: { backgroundColor: '#FF3B30' },
// // // //   micText: { color: 'white', fontWeight: 'bold', fontSize: 18, textAlign: 'center' },

// // // //   // NEW STYLES FOR CAMERA VIEW
// // // //   cameraContainer: {
// // // //     flex: 1,
// // // //     backgroundColor: 'black',
// // // //   },
// // // //   camera: {
// // // //     width: width,
// // // //     height: height, // Full screen camera preview
// // // //     justifyContent: 'flex-end',
// // // //     alignItems: 'center',
// // // //   },
// // // //   overlay: {
// // // //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// // // //     padding: 10,
// // // //     borderRadius: 8,
// // // //     marginBottom: 50,
// // // //   },
// // // //   overlayText: {
// // // //     color: 'white',
// // // //     fontSize: 18,
// // // //     fontWeight: 'bold',
// // // //     textAlign: 'center',
// // // //   },
// // // // });
// // // // screens/LandingScreen.jsx
// // // import React, { useEffect, useState, useRef } from 'react';
// // // import { View, Text, StyleSheet, Alert, Pressable, Dimensions } from 'react-native';
// // // import * as Speech from 'expo-speech';
// // // import * as Haptics from 'expo-haptics';
// // // import { Audio } from 'expo-av';
// // // import { CameraView, useCameraPermissions } from 'expo-camera';
// // // import axios from 'axios';

// // // const PHRASE = 'hello';
// // // const IP = '192.168.0.105';
// // // const GOOGLE_API_KEY = 'AIzaSyCFOLP0EfP2OgqU6NHLjjUpktvO4fE8xGE'; // PASTE YOUR KEY

// // // // Get screen dimensions for camera sizing
// // // const { width, height } = Dimensions.get('window');

// // // export default function LandingScreen({ route }) {
// // //     const userId = route.params?.userId ?? 'test-user';
// // //     const [isRecording, setIsRecording] = useState(false);
// // //     const [showCamera, setShowCamera] = useState(false);
// // //     const [recording, setRecording] = useState(null);
// // //     const [hasCam, setHasCam] = useState(false);
// // //     const cameraRef = useRef(null);
// // //     const [permission, requestPermission] = useCameraPermissions();

// // //     // --- 1. CAMERA PERMISSION AND SETUP (CLEANED UP) ---
// // //     useEffect(() => {
// // //         (async () => {
// // //         })();
// // //     }, []);

// // //     // --- 2. AUDIO RECORDING (REMAINS THE SAME) ---
// // //     const startRecording = async () => {
// // //         // ... (Your existing startRecording logic remains here) ...
// // //         try {
// // //             const { status } = await Audio.requestPermissionsAsync();
// // //             if (status !== 'granted') {
// // //                 Alert.alert('Mic', 'Allow in Settings');
// // //                 return;
// // //             }

// // //             await Audio.setAudioModeAsync({
// // //                 allowsRecordingIOS: true,
// // //                 playsInSilentModeIOS: true,
// // //             });

// // //             const { recording } = await Audio.Recording.createAsync(
// // //                 Audio.RecordingOptionsPresets.HIGH_QUALITY
// // //             );
// // //             setRecording(recording);
// // //             setIsRecording(true);
// // //             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
// // //         } catch (err) {
// // //             Alert.alert('Error', 'Recording failed');
// // //         }
// // //     };

// // //     const stopRecording = async () => {
// // //         // ... (Your existing stopRecording logic remains here) ...
// // //         if (!recording) return;
// // //         setIsRecording(false);
// // //         await recording.stopAndUnloadAsync();
// // //         const uri = recording.getURI();

// // //         try {
// // //             const response = await fetch(uri);
// // //             const blob = await response.blob();
// // //             const reader = new FileReader();
// // //             reader.onloadend = async () => {
// // //                 const base64 = reader.result.split(',')[1];
// // //                 const res = await fetch(
// // //                     `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
// // //                     {
// // //                         method: 'POST',
// // //                         headers: { 'Content-Type': 'application/json' },
// // //                         body: JSON.stringify({
// // //                             config: {
// // //                                 encoding: 'WEBM_OPUS',
// // //                                 sampleRateHertz: 48000,
// // //                                 languageCode: 'en-US',
// // //                             },
// // //                             audio: { content: base64 },
// // //                         }),
// // //                     }
// // //                 );
// // //                 const data = await res.json();
// // //                 const text = (data.results?.[0]?.alternatives?.[0]?.transcript || '').toLowerCase();
// // //                 console.log('Recognized:', text);

// // //                 if (text.includes(PHRASE)) {
// // //                     const query = text.replace(PHRASE, '').trim() || 'what do you see';
// // //                     await handleQuery(query);
// // //                 } else {
// // //                     Speech.speak(`Say ${PHRASE} first`);
// // //                 }
// // //             };
// // //             reader.readAsDataURL(blob);
// // //         } catch (e) {
// // //             console.log('STT failed, using mock');
// // //             await handleQuery('is the bus here');
// // //         }
// // //         setRecording(null);
// // //     };

// // //     const handleQuery = async (query) => {
// // //         try {
// // //             // 1. Check/Request Camera Permission FIRST
// // //             if (!permission?.granted) {
// // //                 // If not granted, try requesting it before proceeding
// // //                 const permissionResult = await requestPermission();
// // //                 if (!permissionResult.granted) {
// // //                     Speech.speak('Camera permission is required for vision queries. Please enable it.');
// // //                     return; // Stop the process here
// // //                 }
// // //             }

// // //             const res = await axios.post(`http://${IP}:8000/process-query`, { userId, query });
// // //             const { needsVision } = res.data;

// // //             if (needsVision) { // Permission is already granted if we reached here
// // //                 setShowCamera(true);
// // //                 Speech.speak('Hold phone steady');

// // //                 setTimeout(async () => {
// // //                     try {
// // //                         // --- 👇 ADD CUES HERE 👇 ---

// // //                         // 1. Audio Cue: Speak "Click" or a brief instructional sound
// // //                         Speech.speak('Capturing');

// // //                         // 2. Haptic Feedback: Provide a short, sharp vibration (Success is a good choice)
// // //                         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
// // //                         const photo = await cameraRef.current?.takePictureAsync({ base64: true, quality: 0.7 });
// // //                         const fusion = await axios.post(`http://${IP}:8000/fusion`, {
// // //                             userId, query, image: photo.base64 // <--- REQUIRES 'base64' property
// // //                         });
// // //                         Speech.speak(fusion.data.instruction || 'Done');
// // //                         setShowCamera(false);
// // //                     } catch (e) {
// // //                         console.error("Photo Error:", e);
// // //                         Speech.speak('Photo failed, but still guiding you');
// // //                         setShowCamera(false);
// // //                     }
// // //                 }, 3000); // Increased delay for better usability
// // //             } else {
// // //                 Speech.speak('All clear');
// // //             }
// // //         } catch (e) {
// // //             // Still useful to log the error if backend fails a future request
// // //             console.error("Backend or STT Error:", e);
// // //             Alert.alert('Error', 'Operation failed.');
// // //         }
// // //     };

// // //     // --- 3. CAMERA SCREEN (FIXED) ---
// // //     if (showCamera) {
// // //         return (
// // //             // Use a parent View for stacking CameraView and the overlay
// // //             <View style={styles.cameraContainer}>
// // //                 <CameraView
// // //                     ref={cameraRef}
// // //                     style={StyleSheet.absoluteFillObject} // Ensures CameraView fills the container
// // //                     facing="back"
// // //                 />
// // //                 {/* Overlay content is now outside CameraView and positioned absolutely */}
// // //                 <View style={[StyleSheet.absoluteFillObject, styles.cameraOverlay]}>
// // //                     <Text style={styles.overlayText}>
// // //                         Analyzing... Hold Steady!
// // //                     </Text>
// // //                 </View>
// // //             </View>
// // //         );
// // //     }

// // //     return (
// // //         // Main landing screen (only visible when not in camera mode)
// // //         <View style={styles.container}>
// // //             <Text style={styles.title}>Visionary Guide</Text>
// // //             <Text style={styles.sub}>
// // //                 {isRecording ? 'Listening...' : 'Hold to say "Hey Visionary"'}
// // //             </Text>

// // //             <Pressable
// // //                 style={({ pressed }) => [
// // //                     styles.micButton,
// // //                     pressed && styles.micPressed,
// // //                     isRecording && styles.micRecording
// // //                 ]}
// // //                 onLongPress={startRecording}
// // //                 onPressOut={stopRecording}
// // //                 disabled={isRecording}
// // //             >
// // //                 <Text style={styles.micText}>
// // //                     {isRecording ? 'Recording...' : 'Hold to Activate'}
// // //                 </Text>
// // //             </Pressable>
// // //         </View>
// // //     );
// // // }

// // // const styles = StyleSheet.create({
// // //     container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
// // //     title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
// // //     sub: { fontSize: 18, color: '#555', textAlign: 'center', marginBottom: 40 },
// // //     micButton: { backgroundColor: '#FF9500', paddingHorizontal: 40, paddingVertical: 18, borderRadius: 50, elevation: 6 },
// // //     micPressed: { backgroundColor: '#CC7700', transform: [{ scale: 0.95 }] },
// // //     micRecording: { backgroundColor: '#FF3B30' },
// // //     micText: { color: 'white', fontWeight: 'bold', fontSize: 18, textAlign: 'center' },

// // //     // NEW & MODIFIED STYLES FOR CAMERA VIEW
// // //     cameraContainer: {
// // //         flex: 1, // Must take up full space to allow absolute positioning
// // //         backgroundColor: 'black',
// // //     },
// // //     cameraOverlay: {
// // //         // Aligns content to the bottom center, on top of the camera
// // //         justifyContent: 'flex-end',
// // //         alignItems: 'center',
// // //         padding: 30,
// // //     },
// // //     overlayText: {
// // //         color: 'white',
// // //         fontSize: 20,
// // //         fontWeight: 'bold',
// // //         backgroundColor: 'rgba(0,0,0,0.7)', // Slightly darker background for text
// // //         padding: 15,
// // //         borderRadius: 10,
// // //         marginBottom: 50, // Move text up slightly from the bottom edge
// // //     },
// // //     // Note: StyleSheet.absoluteFillObject is used inline for CameraView
// // // });

// // // // screens/LandingScreen.jsx
// // // import React, { useEffect, useState, useRef } from 'react';
// // // import { View, Text, StyleSheet, Alert, Pressable, Dimensions, AccessibilityInfo, Animated } from 'react-native';
// // // import * as Speech from 'expo-speech';
// // // import * as Haptics from 'expo-haptics';
// // // import { Audio } from 'expo-av';
// // // import { CameraView, useCameraPermissions } from 'expo-camera';
// // // import axios from 'axios';

// // // const PHRASE = 'hello';
// // // const IP = '192.168.0.105';
// // // const GOOGLE_API_KEY = 'AIzaSyCFOLP0EfP2OgqU6NHLjjUpktvO4fE8xGE';

// // // const { width, height } = Dimensions.get('window');

// // // export default function LandingScreen({ route }) {
// // //   const userId = route.params?.userId ?? 'test-user';
// // //   const [isRecording, setIsRecording] = useState(false);
// // //   const [showCamera, setShowCamera] = useState(false);
// // //   const [recording, setRecording] = useState(null);
// // //   const [hasCam, setHasCam] = useState(false);
// // //   const [isProcessing, setIsProcessing] = useState(false);
// // //   const cameraRef = useRef(null);
// // //   const [permission, requestPermission] = useCameraPermissions();
// // //   const pulseAnim = useRef(new Animated.Value(1)).current;
// // //   const [touchStartTime, setTouchStartTime] = useState(null);  // ← NEW
// // //   const LONG_PRESS_DURATION = 300; // 0.3 sec = long press

// // //   useEffect(() => {
// // //     // Announce app ready state
// // //     AccessibilityInfo.announceForAccessibility(
// // //       'VisionaryGuide is ready. Hold the activation button and say: Hey Visionary, followed by your question.'
// // //     );
// // //   }, []);

// // //   // Pulse animation for recording state
// // //   useEffect(() => {
// // //     if (isRecording) {
// // //       Animated.loop(
// // //         Animated.sequence([
// // //           Animated.timing(pulseAnim, {
// // //             toValue: 1.1,
// // //             duration: 800,
// // //             useNativeDriver: true,
// // //           }),
// // //           Animated.timing(pulseAnim, {
// // //             toValue: 1,
// // //             duration: 800,
// // //             useNativeDriver: true,
// // //           }),
// // //         ])
// // //       ).start();
// // //     } else {
// // //       pulseAnim.setValue(1);
// // //     }
// // //   }, [isRecording]);

// // //   const startRecording = async () => {
// // //     try {
// // //       const { status } = await Audio.requestPermissionsAsync();
// // //       if (status !== 'granted') {
// // //         Alert.alert('Microphone Access', 'Please allow microphone access in Settings to use voice commands.');
// // //         AccessibilityInfo.announceForAccessibility('Microphone permission denied. Please enable in settings.');
// // //         return;
// // //       }

// // //       await Audio.setAudioModeAsync({
// // //         allowsRecordingIOS: true,
// // //         playsInSilentModeIOS: true,
// // //       });

// // //       const { recording } = await Audio.Recording.createAsync(
// // //         Audio.RecordingOptionsPresets.HIGH_QUALITY
// // //       );
// // //       setRecording(recording);
// // //       setIsRecording(true);
// // //       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
// // //       AccessibilityInfo.announceForAccessibility('Recording started. Speak your command.');
// // //     } catch (err) {
// // //       Alert.alert('Error', 'Recording failed. Please try again.');
// // //       AccessibilityInfo.announceForAccessibility('Recording failed.');
// // //     }
// // //   };

// // //   const stopRecording = async () => {
// // //     if (!recording) return;
// // //     setIsRecording(false);
// // //     setIsProcessing(true);
// // //     await recording.stopAndUnloadAsync();
// // //     const uri = recording.getURI();

// // //     AccessibilityInfo.announceForAccessibility('Processing your command...');

// // //     try {
// // //       const response = await fetch(uri);
// // //       const blob = await response.blob();
// // //       const reader = new FileReader();
// // //       reader.onloadend = async () => {
// // //         const base64 = reader.result.split(',')[1];
// // //         const res = await fetch(
// // //           `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
// // //           {
// // //             method: 'POST',
// // //             headers: { 'Content-Type': 'application/json' },
// // //             body: JSON.stringify({
// // //               config: {
// // //                 encoding: 'WEBM_OPUS',
// // //                 sampleRateHertz: 48000,
// // //                 languageCode: 'en-US',
// // //               },
// // //               audio: { content: base64 },
// // //             }),
// // //           }
// // //         );
// // //         const data = await res.json();
// // //         const text = (data.results?.[0]?.alternatives?.[0]?.transcript || '').toLowerCase();
// // //         console.log('Recognized:', text);

// // //         if (text.includes(PHRASE)) {
// // //           const query = text.replace(PHRASE, '').trim() || 'what do you see';
// // //           AccessibilityInfo.announceForAccessibility(`Command recognized: ${query}`);
// // //           await handleQuery(query);
// // //         } else {
// // //           Speech.speak(`Please say ${PHRASE} first, followed by your question`);
// // //           AccessibilityInfo.announceForAccessibility(`Activation phrase not detected. Say: ${PHRASE}`);
// // //         }
// // //         setIsProcessing(false);
// // //       };
// // //       reader.readAsDataURL(blob);
// // //     } catch (e) {
// // //       console.log('STT failed, using mock');
// // //       AccessibilityInfo.announceForAccessibility('Using demo mode');
// // //       await handleQuery('is the bus here');
// // //       setIsProcessing(false);
// // //     }
// // //     setRecording(null);
// // //   };

// // //   const handleQuery = async (query) => {
// // //     try {
// // //       if (!permission?.granted) {
// // //         const permissionResult = await requestPermission();
// // //         if (!permissionResult.granted) {
// // //           Speech.speak('Camera permission is required for vision queries. Please enable it in settings.');
// // //           AccessibilityInfo.announceForAccessibility('Camera permission required. Please enable in settings.');
// // //           return;
// // //         }
// // //       }

// // //       const res = await axios.post(`http://${IP}:8000/process-query`, { userId, query });
// // //       const { needsVision } = res.data;

// // //       if (needsVision) {
// // //         setShowCamera(true);
// // //         Speech.speak('Hold phone steady. Capturing image in 3 seconds.');
// // //         AccessibilityInfo.announceForAccessibility('Camera activated. Hold phone steady. Capturing in 3 seconds.');

// // //         setTimeout(async () => {
// // //           try {
// // //             Speech.speak('Capturing now');
// // //             AccessibilityInfo.announceForAccessibility('Capturing image');
// // //             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// // //             const photo = await cameraRef.current?.takePictureAsync({ base64: true, quality: 0.7 });

// // //             AccessibilityInfo.announceForAccessibility('Analyzing image...');
// // //             const fusion = await axios.post(`http://${IP}:8000/fusion`, {
// // //               userId, query, image: photo.base64
// // //             });

// // //             const instruction = fusion.data.instruction || 'Analysis complete';
// // //             Speech.speak(instruction);
// // //             AccessibilityInfo.announceForAccessibility(instruction);
// // //             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
// // //             setShowCamera(false);
// // //           } catch (e) {
// // //             console.error("Photo Error:", e);
// // //             Speech.speak('Photo capture failed, but continuing with available information');
// // //             AccessibilityInfo.announceForAccessibility('Image capture failed');
// // //             setShowCamera(false);
// // //           }
// // //         }, 3000);
// // //       } else {
// // //         Speech.speak('All clear. No obstacles detected.');
// // //         AccessibilityInfo.announceForAccessibility('All clear');
// // //         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
// // //       }
// // //     } catch (e) {
// // //       console.error("Backend or STT Error:", e);
// // //       Alert.alert('Error', 'Operation failed. Please try again.');
// // //       AccessibilityInfo.announceForAccessibility('Operation failed. Please try again.');
// // //     }
// // //   };

// // //   // Camera Screen with enhanced accessibility
// // //   if (showCamera) {
// // //     return (
// // //       <View
// // //         style={styles.cameraContainer}
// // //         accessible={true}
// // //         accessibilityLabel="Camera view active. Hold phone steady."
// // //       >
// // //         <CameraView
// // //           ref={cameraRef}
// // //           style={StyleSheet.absoluteFillObject}
// // //           facing="back"
// // //         />
// // //         <View style={[StyleSheet.absoluteFillObject, styles.cameraOverlay]}>
// // //           <View style={styles.cameraTopBar}>
// // //             <View style={styles.statusIndicator} />
// // //             <Text
// // //               style={styles.cameraTopText}
// // //               accessible={true}
// // //               accessibilityRole="text"
// // //               accessibilityLiveRegion="polite"
// // //             >
// // //               ANALYZING
// // //             </Text>
// // //           </View>

// // //           <View style={styles.cameraCenterGuide}>
// // //             <View style={styles.guideBorder} />
// // //           </View>

// // //           <View style={styles.cameraBottomInfo}>
// // //             <Text
// // //               style={styles.overlayText}
// // //               accessible={true}
// // //               accessibilityRole="text"
// // //               accessibilityLiveRegion="assertive"
// // //             >
// // //               📸 Hold Steady
// // //             </Text>
// // //             <Text style={styles.overlaySubtext}>
// // //               Capturing scene for navigation guidance
// // //             </Text>
// // //           </View>
// // //         </View>
// // //       </View>
// // //     );
// // //   }

// // //   // Main Landing Screen
// // //   return (
// // //     <View style={styles.container}>

// // //       {/* FULL SCREEN TOUCH DETECTOR (INVISIBLE) */}
// // //       <Pressable
// // //         style={StyleSheet.absoluteFillObject}  // ← Covers entire screen
// // //         onPressIn={(e) => {
// // //           // Start timing when finger touches anywhere
// // //           setTouchStartTime(Date.now());
// // //           // Optional: small haptic on touch start
// // //           Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
// // //         }}
// // //         onPressOut={async (e) => {
// // //           if (!touchStartTime) return;
// // //           const duration = Date.now() - touchStartTime;

// // //           if (duration >= LONG_PRESS_DURATION && !isRecording && !isProcessing) {
// // //             // Long press anywhere → start recording
// // //             await startRecording();
// // //           } else if (isRecording) {
// // //             // Release while recording → stop
// // //             await stopRecording();
// // //           }
// // //           setTouchStartTime(null);
// // //         }}
// // //         // Allow long press even if button is disabled
// // //         disabled={false}
// // //       >
// // //         <View style={{ flex: 1 }} />
// // //       </Pressable>

// // //       {/* Your beautiful UI (unchanged) */}
// // //       <View style={styles.header}>
// // //         <Text style={styles.appName} accessible={true} accessibilityRole="header">
// // //           Visionary <Text style={styles.appNameAccent}>Guide</Text>
// // //         </Text>
// // //         <Text style={styles.tagline}>Your intelligent navigation companion</Text>
// // //       </View>

// // //       <View style={styles.statusCard}>
// // //         <View style={styles.statusIconContainer}>
// // //           <Text style={styles.statusIcon}>Checkmark</Text>
// // //         </View>
// // //         <Text style={styles.statusText}>System Ready</Text>
// // //         <Text style={styles.statusSubtext}>
// // //           {isRecording ? 'Listening to your command...' :
// // //             isProcessing ? 'Processing your request...' :
// // //               'Touch and hold anywhere to activate'}
// // //         </Text>
// // //       </View>

// // //       <View style={styles.actionSection}>
// // //         <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
// // //           <Pressable
// // //             style={({ pressed }) => [
// // //               styles.micButton,
// // //               pressed && styles.micPressed,
// // //               isRecording && styles.micRecording,
// // //               isProcessing && styles.micProcessing,
// // //             ]}
// // //             onLongPress={startRecording}
// // //             onPressOut={stopRecording}
// // //             disabled={isRecording || isProcessing}
// // //             accessible={true}
// // //             accessibilityRole="button"
// // //             accessibilityLabel="Voice activation"
// // //             accessibilityHint="You can also touch and hold anywhere on screen"
// // //           >
// // //             <View style={styles.micButtonInner}>
// // //               <View style={styles.micIconWrapper}>
// // //                 <Text style={styles.micIconLarge}>
// // //                   {isRecording ? 'Microphone' : isProcessing ? 'Gear' : 'Microphone'}
// // //                 </Text>
// // //               </View>
// // //               <Text style={styles.micButtonText}>
// // //                 {isRecording ? 'Listening...' : isProcessing ? 'Processing...' : 'Hold to Speak'}
// // //               </Text>
// // //             </View>
// // //           </Pressable>
// // //         </Animated.View>
// // //       </View>

// // //       {/* Instructions Section */}
// // //       <View style={styles.instructionsCard}>
// // //         <Text
// // //           style={styles.instructionsTitle}
// // //           accessible={true}
// // //           accessibilityRole="header"
// // //         >
// // //           How to Use
// // //         </Text>
// // //         <View style={styles.instructionRow}>
// // //           <Text style={styles.instructionNumber}>1</Text>
// // //           <Text
// // //             style={styles.instructionText}
// // //             accessible={true}
// // //           >
// // //             Press and hold the button above
// // //           </Text>
// // //         </View>
// // //         <View style={styles.instructionRow}>
// // //           <Text style={styles.instructionNumber}>2</Text>
// // //           <Text
// // //             style={styles.instructionText}
// // //             accessible={true}
// // //           >
// // //             Say "Hey Visionary" followed by your question
// // //           </Text>
// // //         </View>
// // //         <View style={styles.instructionRow}>
// // //           <Text style={styles.instructionNumber}>3</Text>
// // //           <Text
// // //             style={styles.instructionText}
// // //             accessible={true}
// // //           >
// // //             Release the button when finished speaking
// // //           </Text>
// // //         </View>
// // //       </View>

// // //       {/* Examples Section */}
// // //       <View style={styles.examplesCard}>
// // //         <Text
// // //           style={styles.examplesTitle}
// // //           accessible={true}
// // //           accessibilityRole="header"
// // //         >
// // //           Example Commands
// // //         </Text>
// // //         <Text style={styles.exampleText} accessible={true}>
// // //           • "Hey Visionary, is the bus here?"
// // //         </Text>
// // //         <Text style={styles.exampleText} accessible={true}>
// // //           • "Hey Visionary, what's in front of me?"
// // //         </Text>
// // //         <Text style={styles.exampleText} accessible={true}>
// // //           • "Hey Visionary, describe my surroundings"
// // //         </Text>
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#F8F9FA',
// // //     padding: 24,
// // //     paddingTop: 60,
// // //   },
// // //   header: {
// // //     alignItems: 'center',
// // //     marginBottom: 32,
// // //   },
// // //   appName: {
// // //     fontSize: 42,
// // //     fontWeight: '900',
// // //     color: '#1A1A1A',
// // //     marginBottom: 8,
// // //     letterSpacing: -1,
// // //   },
// // //   appNameAccent: {
// // //     color: '#007AFF',
// // //   },
// // //   tagline: {
// // //     fontSize: 16,
// // //     color: '#666',
// // //     textAlign: 'center',
// // //     fontWeight: '500',
// // //   },
// // //   statusCard: {
// // //     backgroundColor: '#FFFFFF',
// // //     borderRadius: 20,
// // //     padding: 24,
// // //     marginBottom: 32,
// // //     alignItems: 'center',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 12,
// // //     elevation: 5,
// // //   },
// // //   statusIconContainer: {
// // //     width: 60,
// // //     height: 60,
// // //     borderRadius: 30,
// // //     backgroundColor: '#34C759',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     marginBottom: 16,
// // //   },
// // //   statusIcon: {
// // //     fontSize: 32,
// // //     color: '#FFFFFF',
// // //     fontWeight: 'bold',
// // //   },
// // //   statusText: {
// // //     fontSize: 20,
// // //     fontWeight: '700',
// // //     color: '#1A1A1A',
// // //     marginBottom: 8,
// // //   },
// // //   statusSubtext: {
// // //     fontSize: 14,
// // //     color: '#666',
// // //     textAlign: 'center',
// // //     lineHeight: 20,
// // //   },
// // //   actionSection: {
// // //     alignItems: 'center',
// // //     marginBottom: 32,
// // //   },
// // //   micButton: {
// // //     width: 160,
// // //     height: 160,
// // //     borderRadius: 80,
// // //     backgroundColor: '#007AFF',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     shadowColor: '#007AFF',
// // //     shadowOffset: { width: 0, height: 8 },
// // //     shadowOpacity: 0.4,
// // //     shadowRadius: 16,
// // //     elevation: 10,
// // //   },
// // //   micPressed: {
// // //     backgroundColor: '#0056b3',
// // //     transform: [{ scale: 0.95 }],
// // //   },
// // //   micRecording: {
// // //     backgroundColor: '#FF3B30',
// // //     shadowColor: '#FF3B30',
// // //   },
// // //   micProcessing: {
// // //     backgroundColor: '#FF9500',
// // //     shadowColor: '#FF9500',
// // //   },
// // //   micButtonInner: {
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   micIconWrapper: {
// // //     marginBottom: 8,
// // //   },
// // //   micIconLarge: {
// // //     fontSize: 48,
// // //   },
// // //   micButtonText: {
// // //     color: '#FFFFFF',
// // //     fontWeight: '700',
// // //     fontSize: 16,
// // //     textAlign: 'center',
// // //   },
// // //   instructionsCard: {
// // //     backgroundColor: '#FFFFFF',
// // //     borderRadius: 16,
// // //     padding: 20,
// // //     marginBottom: 16,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.06,
// // //     shadowRadius: 8,
// // //     elevation: 3,
// // //   },
// // //   instructionsTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     color: '#1A1A1A',
// // //     marginBottom: 16,
// // //   },
// // //   instructionRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   instructionNumber: {
// // //     width: 28,
// // //     height: 28,
// // //     borderRadius: 14,
// // //     backgroundColor: '#007AFF',
// // //     color: '#FFFFFF',
// // //     textAlign: 'center',
// // //     lineHeight: 28,
// // //     fontWeight: '700',
// // //     marginRight: 12,
// // //     fontSize: 14,
// // //   },
// // //   instructionText: {
// // //     flex: 1,
// // //     fontSize: 15,
// // //     color: '#333',
// // //     lineHeight: 22,
// // //   },
// // //   examplesCard: {
// // //     backgroundColor: '#E8F4FF',
// // //     borderRadius: 16,
// // //     padding: 20,
// // //     borderWidth: 2,
// // //     borderColor: '#007AFF',
// // //   },
// // //   examplesTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '700',
// // //     color: '#007AFF',
// // //     marginBottom: 12,
// // //   },
// // //   exampleText: {
// // //     fontSize: 14,
// // //     color: '#1A1A1A',
// // //     marginBottom: 8,
// // //     lineHeight: 20,
// // //   },

// // //   // Camera Styles
// // //   cameraContainer: {
// // //     flex: 1,
// // //     backgroundColor: 'black',
// // //   },
// // //   cameraOverlay: {
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     padding: 30,
// // //   },
// // //   cameraTopBar: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: 'rgba(255, 59, 48, 0.9)',
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 12,
// // //     borderRadius: 25,
// // //     marginTop: 20,
// // //   },
// // //   statusIndicator: {
// // //     width: 12,
// // //     height: 12,
// // //     borderRadius: 6,
// // //     backgroundColor: '#FFFFFF',
// // //     marginRight: 10,
// // //   },
// // //   cameraTopText: {
// // //     color: '#FFFFFF',
// // //     fontSize: 16,
// // //     fontWeight: '800',
// // //     letterSpacing: 1,
// // //   },
// // //   cameraCenterGuide: {
// // //     width: 200,
// // //     height: 200,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   guideBorder: {
// // //     width: '100%',
// // //     height: '100%',
// // //     borderWidth: 3,
// // //     borderColor: '#FFFFFF',
// // //     borderRadius: 20,
// // //     borderStyle: 'dashed',
// // //   },
// // //   cameraBottomInfo: {
// // //     backgroundColor: 'rgba(0, 0, 0, 0.8)',
// // //     paddingHorizontal: 24,
// // //     paddingVertical: 20,
// // //     borderRadius: 16,
// // //     alignItems: 'center',
// // //     marginBottom: 40,
// // //     minWidth: '80%',
// // //   },
// // //   overlayText: {
// // //     color: '#FFFFFF',
// // //     fontSize: 24,
// // //     fontWeight: '800',
// // //     marginBottom: 8,
// // //     textAlign: 'center',
// // //   },
// // //   overlaySubtext: {
// // //     color: '#CCCCCC',
// // //     fontSize: 14,
// // //     textAlign: 'center',
// // //     lineHeight: 20,
// // //   },
// // // });

// // // // screens/LandingScreen.jsx
// // // import React, { useEffect, useState, useRef } from 'react';
// // // import { View, Text, StyleSheet, Pressable, Dimensions, AccessibilityInfo, Animated, Alert } from 'react-native';
// // // import * as Speech from 'expo-speech';
// // // import * as Haptics from 'expo-haptics';
// // // import { Audio } from 'expo-av';
// // // import { CameraView, useCameraPermissions } from 'expo-camera';
// // // import axios from 'axios';
// // // import { LinearGradient } from 'expo-linear-gradient'; // 👈 USING EXPO'S LINEAR GRADIENT

// // // const PHRASE = 'hello';
// // // const IP = '192.168.0.105';
// // // const GOOGLE_API_KEY = 'AIzaSyCFOLP0EfP2OgqU6NHLjjUpktvO4fE8xGE';
// // // const { width, height } = Dimensions.get('window');

// // // export default function LandingScreen({ route }) {
// // //   const userId = route.params?.userId ?? 'test-user';
// // //   const [isRecording, setIsRecording] = useState(false);
// // //   const [showCamera, setShowCamera] = useState(false);
// // //   const [recording, setRecording] = useState(null);
// // //   const [isProcessing, setIsProcessing] = useState(false);
// // //   const cameraRef = useRef(null);
// // //   const [permission, requestPermission] = useCameraPermissions();
// // //   const [touchStartTime, setTouchStartTime] = useState(null);
// // //   const LONG_PRESS_DURATION = 300;

// // //   const rippleAnim = useRef(new Animated.Value(0)).current;
// // //   const pulseAnim = useRef(new Animated.Value(1)).current;

// // //   useEffect(() => {
// // //     AccessibilityInfo.announceForAccessibility('VisionaryGuide ready. Hold anywhere to speak.');
// // //   }, []);

// // //   useEffect(() => {
// // //     if (isRecording) {
// // //       Animated.loop(
// // //         Animated.sequence([
// // //           Animated.timing(pulseAnim, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
// // //           Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
// // //         ])
// // //       ).start();
// // //     } else {
// // //       pulseAnim.setValue(1);
// // //     }
// // //   }, [isRecording]);

// // //   const startRecording = async () => {
// // //     // Only start if not already recording or processing
// // //     if (isRecording || isProcessing) return;

// // //     try {
// // //       const { status } = await Audio.requestPermissionsAsync();
// // //       if (status !== 'granted') {
// // //         Alert.alert('Mic Access', 'Microphone permission denied.');
// // //         return;
// // //       }

// // //       await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
// // //       const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
// // //       setRecording(recording);
// // //       setIsRecording(true);
// // //       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
// // //       AccessibilityInfo.announceForAccessibility('Recording started. Speak your command.');


// // //       // Ripple effect on start
// // //       rippleAnim.setValue(0);
// // //       Animated.timing(rippleAnim, {
// // //         toValue: 1,
// // //         duration: 2000,
// // //         useNativeDriver: true,
// // //       }).start();
// // //     } catch (err) {
// // //       console.error("Recording error:", err);
// // //       Alert.alert('Error', 'Recording failed.');
// // //     }
// // //   };

// // //   const stopRecording = async () => {
// // //     if (!recording) return;
// // //     setIsRecording(false);
// // //     setIsProcessing(true);
// // //     await recording.stopAndUnloadAsync();
// // //     const uri = recording.getURI();

// // //     try {
// // //       const response = await fetch(uri);
// // //       const blob = await response.blob();
// // //       const reader = new FileReader();
// // //       reader.onloadend = async () => {
// // //         const base64 = reader.result.split(',')[1];
// // //         const res = await fetch(
// // //           `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
// // //           {
// // //             method: 'POST',
// // //             headers: { 'Content-Type': 'application/json' },
// // //             body: JSON.stringify({
// // //               config: {
// // //                 encoding: 'WEBM_OPUS',
// // //                 sampleRateHertz: 48000,
// // //                 languageCode: 'en-US',
// // //               },
// // //               audio: { content: base64 },
// // //             }),
// // //           }
// // //         );
// // //         const data = await res.json();
// // //         const text = (data.results?.[0]?.alternatives?.[0]?.transcript || '').toLowerCase();

// // //         if (text.includes(PHRASE)) {
// // //           const query = text.replace(PHRASE, '').trim() || 'what do you see';
// // //           await handleQuery(query);
// // //         } else {
// // //           Speech.speak(`Please say ${PHRASE} first.`);
// // //         }
// // //       }
// // //       reader.readAsDataURL(blob);
// // //     } catch (e) {
// // //       console.log('STT failed, using mock');
// // //       // MOCK RESPONSE TIMEOUT is now inside this catch for simple demo
// // //       setTimeout(() => {
// // //         handleQuery('is the bus here');
// // //       }, 500);
// // //     }
// // //     setIsProcessing(false);
// // //     setRecording(null);
// // //   };

// // //   const handleQuery = async (query) => {
// // //     try {
// // //       // Mocking the backend decision for now
// // //       const needsVision = true;

// // //       if (needsVision) {
// // //         if (!permission?.granted) await requestPermission();

// // //         setShowCamera(true);
// // //         Speech.speak('Hold steady, capturing in 3 seconds');

// // //         // This is the mock vision step. Ali/Fatima's work will replace this.
// // //         setTimeout(async () => {
// // //           // Mock capturing a photo (replace with cameraRef.current?.takePictureAsync in real integration)
// // //           console.log("MOCK: Taking photo...");

// // //           Speech.speak('Bus 101 is here. Rear seats available. Avoiding front due to crowd anxiety. Safe to board.');
// // //           setShowCamera(false);
// // //         }, 4000);
// // //       } else {
// // //         Speech.speak('All clear, the path is open.');
// // //       }
// // //     } catch (e) {
// // //       console.error("Query error:", e);
// // //       Alert.alert('Error', 'Query processing failed.');
// // //     }
// // //   };

// // //   // --- CAMERA SCREEN ---
// // //   if (showCamera) {
// // //     return (
// // //       <View style={styles.cameraContainer}>
// // //         <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing="back" />
// // //         {/* Semi-transparent overlay to ensure text is visible */}
// // //         <LinearGradient
// // //           colors={['transparent', 'rgba(0,0,0,0.8)']}
// // //           style={StyleSheet.absoluteFillObject}
// // //           locations={[0.5, 1]}
// // //         />
// // //         <View style={styles.geminiCameraOverlay}>
// // //           <Text style={styles.geminiAnalyzing}>Analyzing scene...</Text>
// // //           <Text style={styles.geminiHold}>Hold Steady</Text>
// // //         </View>
// // //       </View>
// // //     );
// // //   }

// // //   // --- MAIN UI SCREEN ---
// // //   return (
// // //     <View style={styles.container}>
// // //       {/* GEMINI RAINBOW RADIAL BACKGROUND */}
// // //       <LinearGradient
// // //         colors={['#4285F4', '#34A853', '#FBBC05', '#EA4335']}
// // //         start={{ x: 0, y: 0 }}
// // //         end={{ x: 1, y: 1 }}
// // //         style={StyleSheet.absoluteFillObject}
// // //       >
// // //         <View style={styles.gradientOverlay} />
// // //       </LinearGradient>

// // //       {/* RIPPLE EFFECT ON TOUCH */}
// // //       <Animated.View
// // //         style={[
// // //           styles.ripple,
// // //           {
// // //             opacity: rippleAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
// // //             transform: [{ scale: rippleAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 3] }) }],
// // //           },
// // //         ]}
// // //       />

// // //       {/* FULL SCREEN TOUCH DETECTOR */}
// // //       <Pressable
// // //         style={StyleSheet.absoluteFillObject}
// // //         onPressIn={() => {
// // //           setTouchStartTime(Date.now());
// // //           Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // //         }}
// // //         onPressOut={async () => {
// // //           if (!touchStartTime || isProcessing) return;
// // //           const duration = Date.now() - touchStartTime;
// // //           setTouchStartTime(null);

// // //           if (duration >= LONG_PRESS_DURATION && !isRecording) {
// // //             await startRecording();
// // //           } else if (isRecording) {
// // //             await stopRecording();
// // //           }
// // //         }}
// // //         disabled={isProcessing}
// // //         accessible={true}
// // //         accessibilityLabel={isRecording ? "Stop recording" : "Hold anywhere to start recording"}
// // //       />

// // //       {/* GEMINI STYLE CONTENT */}
// // //       <View style={styles.content}>
// // //         <View>
// // //           <Text style={styles.geminiTitle}>Visionary Guide</Text>
// // //           <Text style={styles.geminiSubtitle}>Your AI companion for navigation</Text>
// // //         </View>

// // //         <View style={styles.geminiCenter}>
// // //           <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
// // //             <View style={[styles.geminiMicCircle,
// // //             isRecording && styles.micRecording,
// // //             isProcessing && styles.micProcessing
// // //             ]}>
// // //               <Text style={styles.geminiMicIcon}>
// // //                 {isRecording ? '🎤' : isProcessing ? '⚙️' : '✨'}
// // //               </Text>
// // //             </View>
// // //           </Animated.View>

// // //           <Text style={styles.geminiHint}>
// // //             {isRecording ? 'Listening...' : isProcessing ? 'Thinking...' : 'Hold anywhere to speak'}
// // //           </Text>
// // //         </View>

// // //         <View style={styles.geminiExamples}>
// // //           <Text style={styles.exampleText}>“Hey Visionary, is the bus here?”</Text>
// // //           <Text style={styles.exampleText}>“What’s in front of me?”</Text>
// // //           <Text style={styles.exampleText}>“Describe my surroundings”</Text>
// // //         </View>
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1 },
// // //   gradientOverlay: {
// // //     ...StyleSheet.absoluteFillObject,
// // //     backgroundColor: 'rgba(255,255,255,0.1)',
// // //   },
// // //   ripple: {
// // //     position: 'absolute',
// // //     width: 300,
// // //     height: 300,
// // //     borderRadius: 150,
// // //     backgroundColor: 'rgba(255,255,255,0.4)',
// // //     top: height / 2 - 150,
// // //     left: width / 2 - 150,
// // //   },
// // //   content: {
// // //     flex: 1,
// // //     justifyContent: 'space-between',
// // //     paddingTop: 80,
// // //     paddingBottom: 60,
// // //     paddingHorizontal: 30,
// // //   },
// // //   geminiTitle: {
// // //     fontSize: 42,
// // //     fontWeight: '900',
// // //     color: 'white',
// // //     textAlign: 'center',
// // //     letterSpacing: -1,
// // //     textShadowColor: 'rgba(0,0,0,0.3)',
// // //     textShadowOffset: { width: 0, height: 2 },
// // //     textShadowRadius: 10,
// // //   },
// // //   geminiSubtitle: {
// // //     fontSize: 18,
// // //     color: 'rgba(255,255,255,0.9)',
// // //     textAlign: 'center',
// // //     marginTop: 10,
// // //     fontWeight: '500',
// // //   },
// // //   geminiCenter: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   geminiMicCircle: {
// // //     width: 160,
// // //     height: 160,
// // //     borderRadius: 80,
// // //     backgroundColor: 'rgba(255,255,255,0.25)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 4,
// // //     borderColor: 'rgba(255,255,255,0.4)',
// // //     // Note: backdropFilter is a web/iOS CSS property and might not work in all RN environments.
// // //   },
// // //   micRecording: {
// // //     borderColor: '#FF0000', // Red border when recording
// // //   },
// // //   micProcessing: {
// // //     borderColor: '#FBBC05', // Yellow border when processing
// // //   },
// // //   geminiMicIcon: {
// // //     fontSize: 70,
// // //   },
// // //   geminiHint: {
// // //     marginTop: 30,
// // //     fontSize: 18,
// // //     color: 'white',
// // //     fontWeight: '600',
// // //     opacity: 0.9,
// // //   },
// // //   geminiExamples: {
// // //     backgroundColor: 'rgba(0,0,0,0.2)', // Use a darker background for better contrast
// // //     padding: 20,
// // //     borderRadius: 20,
// // //     // backdropFilter: 'blur(10px)', // Removed due to compatibility
// // //   },
// // //   exampleText: {
// // //     color: 'white',
// // //     fontSize: 16,
// // //     marginBottom: 12,
// // //     fontWeight: '500',
// // //   },
// // //   cameraContainer: {
// // //     flex: 1,
// // //     backgroundColor: 'black',
// // //   },
// // //   geminiCameraOverlay: {
// // //     ...StyleSheet.absoluteFillObject,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     backgroundColor: 'rgba(0,0,0,0.4)',
// // //   },
// // //   geminiAnalyzing: {
// // //     color: 'white',
// // //     fontSize: 24,
// // //     fontWeight: '800',
// // //     marginBottom: 20,
// // //   },
// // //   geminiHold: {
// // //     color: '#34A853',
// // //     fontSize: 32,
// // //     fontWeight: '900',
// // //   },
// // // });

// // // screens/LandingScreen.jsx
// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, StyleSheet, Pressable, Dimensions, AccessibilityInfo, Animated, Alert } from 'react-native';
// import * as Speech from 'expo-speech';
// import * as Haptics from 'expo-haptics';
// import { Audio } from 'expo-av';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import axios from 'axios';
// import { LinearGradient } from 'expo-linear-gradient'; // Ensure you have installed 'expo-linear-gradient'

// const PHRASE = 'hello';
// const IP = '192.168.0.105';
// const GOOGLE_API_KEY = 'AIzaSyCFOLP0EfP2OgqU6NHLjjUpktvO4fE8xGE';
// const { width, height } = Dimensions.get('window');
// const LONG_PRESS_DURATION = 300;

// // Component to handle the colorful, pulsing glow effect
// const AnimatedGlow = ({ isRecording, isProcessing, pulseAnim }) => {
//     // Interpolate the scale for both gentle (idle) and strong (listening) pulse
//     const gentleScale = pulseAnim.interpolate({
//         inputRange: [1, 1.15],
//         outputRange: [1, 1.05],
//     });
//     const strongScale = pulseAnim.interpolate({
//         inputRange: [1, 1.15],
//         outputRange: [1.1, 1.25],
//     });

//     return (
//         <Animated.View
//             style={[
//                 styles.glowWrapper,
//                 {
//                     // Scale based on state
//                     transform: [{ scale: isRecording ? strongScale : gentleScale }],
//                     // Opacity based on state
//                     opacity: isRecording ? 0.8 : 0.6,
//                 },
//             ]}
//         >
//             <LinearGradient
//                 colors={['rgba(66, 133, 244, 0.4)', 'rgba(52, 168, 83, 0.4)', 'rgba(251, 188, 5, 0.4)', 'rgba(234, 67, 53, 0.4)']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.glowGradient}
//             />
//         </Animated.View>
//     );
// };

// export default function LandingScreen({ route }) {
//     const userId = route.params?.userId ?? 'test-user';
//     const [isRecording, setIsRecording] = useState(false);
//     const [showCamera, setShowCamera] = useState(false);
//     const [recording, setRecording] = useState(null);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const cameraRef = useRef(null);
//     const [permission, requestPermission] = useCameraPermissions();
//     const [touchStartTime, setTouchStartTime] = useState(null);

//     const pulseAnim = useRef(new Animated.Value(1)).current;

//     useEffect(() => {
//         AccessibilityInfo.announceForAccessibility('VisionaryGuide ready. Hold anywhere to speak.');
//     }, []);

//     useEffect(() => {
//         // Stop any existing animation
//         pulseAnim.stopAnimation();

//         if (isRecording) {
//             // Strong pulse for listening state
//             Animated.loop(
//                 Animated.sequence([
//                     Animated.timing(pulseAnim, { toValue: 1.15, duration: 750, useNativeDriver: true }),
//                     Animated.timing(pulseAnim, { toValue: 1, duration: 750, useNativeDriver: true }),
//                 ])
//             ).start();
//         } else {
//             // Gentle pulse for idle state
//             Animated.loop(
//                 Animated.sequence([
//                     Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
//                     Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
//                 ])
//             ).start();
//         }

//         // Cleanup function to stop animation on unmount
//         return () => pulseAnim.stopAnimation();
//     }, [isRecording, pulseAnim]);

//     const startRecording = async () => {
//         if (isRecording || isProcessing) return;

//         try {
//             const { status } = await Audio.requestPermissionsAsync();
//             if (status !== 'granted') {
//                 Alert.alert('Mic Access', 'Microphone permission denied.');
//                 return;
//             }

//             await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
//             const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
//             setRecording(recording);
//             setIsRecording(true);
//             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
//             // 🚨 REQUIRED ACCESSIBILITY ANNOUNCEMENT
//             Speech.speak('You can speak now.');
//             AccessibilityInfo.announceForAccessibility('You can speak now.');

//         } catch (err) {
//             console.error("Recording error:", err);
//             Alert.alert('Error', 'Recording failed.');
//         }
//     };

//     const stopRecording = async () => {
//         if (!recording) return;
//         setIsRecording(false);
//         setIsProcessing(true);
//         await recording.stopAndUnloadAsync();
//         const uri = recording.getURI();

//         // The rest of your existing backend logic for STT and query processing remains intact...
//         try {
//             const response = await fetch(uri);
//             const blob = await response.blob();
//             const reader = new FileReader();
//             reader.onloadend = async () => {
//                 const base64 = reader.result.split(',')[1];
//                 const res = await fetch(
//                     `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
//                     {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify({
//                             config: {
//                                 encoding: 'WEBM_OPUS',
//                                 sampleRateHertz: 48000,
//                                 languageCode: 'en-US',
//                             },
//                             audio: { content: base64 },
//                         }),
//                     }
//                 );
//                 const data = await res.json();
//                 const text = (data.results?.[0]?.alternatives?.[0]?.transcript || '').toLowerCase();

//                 if (text.includes(PHRASE)) {
//                     const query = text.replace(PHRASE, '').trim() || 'what do you see';
//                     await handleQuery(query);
//                 } else {
//                     Speech.speak(`Please say ${PHRASE} first.`);
//                 }
//             }
//             reader.readAsDataURL(blob);
//         } catch (e) {
//             console.log('STT failed, using mock');
//             setTimeout(() => {
//                 handleQuery('is the bus here');
//             }, 500);
//         }
//         setIsProcessing(false);
//         setRecording(null);
//     };

//     const handleQuery = async (query) => {
//         try {
//             const needsVision = true;

//             if (needsVision) {
//                 if (!permission?.granted) await requestPermission();

//                 setShowCamera(true);
//                 Speech.speak('Hold steady, capturing in 3 seconds');

//                 setTimeout(async () => {
//                     console.log("MOCK: Taking photo...");
//                     Speech.speak('Bus 101 is here. Rear seats available. Avoiding front due to crowd anxiety. Safe to board.');
//                     setShowCamera(false);
//                 }, 4000);
//             } else {
//                 Speech.speak('All clear, the path is open.');
//             }
//         } catch (e) {
//             console.error("Query error:", e);
//             Alert.alert('Error', 'Query processing failed.');
//         }
//     };

//     // --- CAMERA SCREEN (Unchanged) ---
//     if (showCamera) {
//         return (
//             <View style={styles.cameraContainer}>
//                 <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing="back" />
//                 <LinearGradient
//                     colors={['transparent', 'rgba(0,0,0,0.9)']}
//                     style={StyleSheet.absoluteFillObject}
//                     locations={[0.5, 1]}
//                 />
//                 <View style={styles.geminiCameraOverlay}>
//                     <Text style={styles.geminiAnalyzing}>Analyzing scene...</Text>
//                     <Text style={styles.geminiHold}>Hold Steady</Text>
//                 </View>
//             </View>
//         );
//     }

//     // --- MAIN UI SCREEN (Merged New UI) ---
//     return (
//         <View style={styles.container}>
            
//             {/* FULL SCREEN TOUCH DETECTOR */}
//             <Pressable
//                 style={StyleSheet.absoluteFillObject}
//                 onPressIn={() => {
//                     setTouchStartTime(Date.now());
//                     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//                 }}
//                 onPressOut={async () => {
//                     if (!touchStartTime || isProcessing) return;
//                     const duration = Date.now() - touchStartTime;
//                     setTouchStartTime(null);

//                     if (duration >= LONG_PRESS_DURATION && !isRecording) {
//                         await startRecording();
//                     } else if (isRecording) {
//                         await stopRecording();
//                     }
//                 }}
//                 disabled={isProcessing}
//                 accessible={true}
//                 accessibilityLabel={isRecording ? "Stop recording" : "Hold anywhere to start recording"}
//             />

//             {/* COLORFUL GLOW / RADIAL SHADOW EFFECT (Merged) */}
//             <AnimatedGlow isRecording={isRecording} isProcessing={isProcessing} pulseAnim={pulseAnim} />
            
//             {/* MAIN CONTENT */}
//             <View style={styles.content}>
//                 <View style={styles.header}>
//                     <Text style={styles.geminiTitle}>Visionary Guide</Text>
//                     <Text style={styles.geminiSubtitle}>Your AI companion for navigation</Text>
//                 </View>

//                 <View style={styles.geminiCenter}>
//                     {/* Microphone Icon Container (Merged Styles) */}
//                     <View 
//                         style={[
//                             styles.geminiMicCircle,
//                             isRecording && styles.micRecording,
//                             isProcessing && styles.micProcessing
//                         ]}
//                     >
//                         <Text style={[
//                             styles.geminiMicIcon,
//                             isRecording && styles.micIconListening
//                         ]}>
//                             {isRecording ? '🎤' : isProcessing ? '⚙️' : '✨'}
//                         </Text>
//                     </View>

//                     {/* Hint Text (Merged Styles) */}
//                     <Text style={[
//                         styles.geminiHint,
//                         isRecording && styles.hintListening
//                     ]}>
//                         {isRecording ? 'Listening...' : isProcessing ? 'Thinking...' : 'Hold anywhere to speak'}
//                     </Text>
//                 </View>

//                 {/* Example Prompts Section (Merged Styles) */}
//                 <View style={styles.geminiExamples}>
//                     <Text style={styles.exampleText}>“Hey Visionary, is the bus here?”</Text>
//                     <Text style={styles.exampleText}>“What’s in front of me?”</Text>
//                     <Text style={styles.exampleText}>“Describe my surroundings”</Text>
//                 </View>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     // --- CONTAINER & BACKGROUND ---
//     container: { 
//         flex: 1, 
//         backgroundColor: '#1C1C1E', // Dark background from new UI
//     },
//     // --- GLOW EFFECT STYLES (New) ---
//     glowWrapper: {
//         position: 'absolute',
//         width: 300, // Fixed size for the glow area
//         height: 300,
//         alignSelf: 'center',
//         top: height / 2 - 150, // Center vertically
//         left: width / 2 - 150, // Center horizontally
//         borderRadius: 150,
//         overflow: 'hidden',
//         zIndex: 0, // Ensure glow is behind the content
//     },
//     glowGradient: {
//         ...StyleSheet.absoluteFillObject,
//         opacity: 0.9, // Make the gradient slightly visible
//     },
//     // --- CONTENT & HEADER ---
//     content: {
//         flex: 1,
//         justifyContent: 'space-between',
//         paddingTop: 80,
//         paddingBottom: 60,
//         paddingHorizontal: 30,
//         zIndex: 1,
//     },
//     header: {
//         paddingTop: 12,
//         paddingBottom: 8,
//     },
//     geminiTitle: {
//         fontSize: 42,
//         fontWeight: '900',
//         color: 'white',
//         textAlign: 'center',
//         letterSpacing: -1,
//     },
//     geminiSubtitle: {
//         fontSize: 18,
//         color: '#A0A0A0', // Gray color from new UI
//         textAlign: 'center',
//         marginTop: 10,
//         fontWeight: '500',
//     },
//     // --- CENTER MIC AREA ---
//     geminiCenter: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     geminiMicCircle: {
//         width: 200, // Larger size from new UI
//         height: 200,
//         borderRadius: 100,
//         backgroundColor: 'rgba(255, 255, 255, 0.08)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderWidth: 3,
//         borderColor: 'rgba(255, 255, 255, 0.3)', // Default border
//         // Added shadow from new UI (React Native shadows are different)
//         shadowColor: 'rgba(255, 255, 255, 0.1)',
//         shadowOffset: { width: 0, height: 0 },
//         shadowOpacity: 1,
//         shadowRadius: 10,
//         elevation: 5, 
//     },
//     micRecording: {
//         borderColor: '#FB923C', // Orange-500 from Tailwind/New UI
//         shadowColor: '#FB923C', // Orange glow when listening
//         shadowRadius: 20,
//     },
//     micProcessing: {
//         borderColor: '#FBBC05', // Yellow border when processing (retained)
//     },
//     geminiMicIcon: {
//         fontSize: 70, // Slightly smaller font to fit icon
//         color: 'white',
//     },
//     micIconListening: {
//         color: '#FB923C', // Orange icon when listening
//     },
//     geminiHint: {
//         marginTop: 30,
//         fontSize: 18,
//         color: '#A0A0A0', // Gray color from new UI
//         fontWeight: '600',
//     },
//     hintListening: {
//         color: '#FB923C', // Orange hint text when listening
//     },
//     // --- BOTTOM EXAMPLES ---
//     geminiExamples: {
//         backgroundColor: 'rgba(255,255,255,0.05)',
//         padding: 20,
//         borderRadius: 20,
//     },
//     exampleText: {
//         color: 'white',
//         fontSize: 16,
//         marginBottom: 12,
//         fontWeight: '500',
//     },
//     // --- CAMERA STYLES (Unchanged) ---
//     cameraContainer: {
//         flex: 1,
//         backgroundColor: 'black',
//     },
//     geminiCameraOverlay: {
//         ...StyleSheet.absoluteFillObject,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.4)',
//     },
//     geminiAnalyzing: {
//         color: 'white',
//         fontSize: 24,
//         fontWeight: '800',
//         marginBottom: 20,
//     },
//     geminiHold: {
//         color: '#34A853',
//         fontSize: 32,
//         fontWeight: '900',
//     },
// });

// // screens/LandingScreen.jsx //grok
// // import React, { useEffect, useState, useRef } from 'react';
// // import { View, Text, StyleSheet, Pressable, Dimensions, AccessibilityInfo, Animated } from 'react-native';
// // import * as Speech from 'expo-speech';
// // import * as Haptics from 'expo-haptics';
// // import { Audio } from 'expo-av'; // ya expo-audio agar migrate kiya ho
// // import { CameraView, useCameraPermissions } from 'expo-camera';
// // import axios from 'axios';

// // const PHRASE = 'hello';
// // const IP = '192.168.0.105';
// // const GOOGLE_API_KEY = 'AIzaSyCFOLP0EfP2OgqU6NHLjjUpktvO4fE8xGE';
// // const { width, height } = Dimensions.get('window');

// // export default function LandingScreen({ route }) {
// //   const userId = route.params?.userId ?? 'test-user';
// //   const [isRecording, setIsRecording] = useState(false);
// //   const [showCamera, setShowCamera] = useState(false);
// //   const [recording, setRecording] = useState(null);
// //   const [isProcessing, setIsProcessing] = useState(false);
// //   const cameraRef = useRef(null);
// //   const [permission, requestPermission] = useCameraPermissions();
// //   const [touchStartTime, setTouchStartTime] = useState(null);
// //   const LONG_PRESS_DURATION = 300;

// //   const glowAnim = useRef(new Animated.Value(0)).current;
// //   const pulseAnim = useRef(new Animated.Value(1)).current;

// //   useEffect(() => {
// //     AccessibilityInfo.announceForAccessibility('VisionaryGuide ready. Hold anywhere to speak.');
// //   }, []);

// //   useEffect(() => {
// //     if (isRecording) {
// //       Speech.speak('I am listening. Please speak now.');
// //       AccessibilityInfo.announceForAccessibility('Listening');

// //       Animated.loop(
// //         Animated.sequence([
// //           Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
// //           Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
// //         ])
// //       ).start();

// //       Animated.timing(glowAnim, {
// //         toValue: 1,
// //         duration: 300,
// //         useNativeDriver: true,
// //       }).start();
// //     } else {
// //       pulseAnim.stopAnimation();
// //       pulseAnim.setValue(1);
// //       glowAnim.setValue(0);
// //     }
// //   }, [isRecording]);

// //   const startRecording = async () => {
// //     try {
// //       const { status } = await Audio.requestPermissionsAsync();
// //       if (status !== 'granted') {
// //         Alert.alert('Mic Access', 'Please allow microphone in Settings');
// //         return;
// //       }
// //       await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
// //       const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
// //       setRecording(recording);
// //       setIsRecording(true);
// //       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
// //     } catch (err) {
// //       Alert.alert('Error', 'Recording failed');
// //     }
// //   };

// //   const stopRecording = async () => {
// //     if (!recording) return;
// //     setIsRecording(false);
// //     setIsProcessing(true);
// //     await recording.stopAndUnloadAsync();
// //     const uri = recording.getURI();

// //     try {
// //       const response = await fetch(uri);
// //       const blob = await response.blob();
// //       const reader = new FileReader();
// //       reader.onloadend = async () => {
// //         const base64 = reader.result.split(',')[1];
// //         const res = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`, {
// //           method: 'POST',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify({
// //             config: { encoding: 'WEBM_OPUS', sampleRateHertz: 48000, languageCode: 'en-US' },
// //             audio: { content: base64 },
// //           }),
// //         });
// //         const data = await res.json();
// //         const text = (data.results?.[0]?.alternatives?.[0]?.transcript || '').toLowerCase();

// //         if (text.includes(PHRASE)) {
// //           const query = text.replace(PHRASE, '').trim() || 'what do you see';
// //           await handleQuery(query);
// //         } else {
// //           Speech.speak('Please say hello first');
// //         }
// //         setIsProcessing(false);
// //       };
// //       reader.readAsDataURL(blob);
// //     } catch (e) {
// //       await handleQuery('is the bus here');
// //       setIsProcessing(false);
// //     }
// //     setRecording(null);
// //   };

// //   const handleQuery = async (query) => {
// //     try {
// //       if (!permission?.granted) await requestPermission();
// //       const res = await axios.post(`http://${IP}:8000/process-query`, { userId, query });
// //       const { needsVision } = res.data;

// //       if (needsVision) {
// //         setShowCamera(true);
// //         Speech.speak('Hold phone steady. Capturing in 3 seconds');
// //         setTimeout(async () => {
// //           try {
// //             const photo = await cameraRef.current?.takePictureAsync({ base64: true });
// //             const fusion = await axios.post(`http://${IP}:8000/fusion`, { userId, query, image: photo.base64 });
// //             Speech.speak(fusion.data.instruction || 'Done');
// //             setShowCamera(false);
// //           } catch (e) {
// //             Speech.speak('Photo failed, but still guiding you');
// //             setShowCamera(false);
// //           }
// //         }, 3000);
// //       } else {
// //         Speech.speak('All clear');
// //       }
// //     } catch (e) {
// //       Alert.alert('Error', 'Backend off?');
// //     }
// //   };

// //   if (showCamera) {
// //     return (
// //       <View style={styles.cameraContainer}>
// //         <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing="back" />
// //         <View style={styles.cameraOverlay}>
// //           <Text style={styles.analyzingText}>ANALYZING</Text>
// //           <Text style={styles.holdText}>Hold Steady</Text>
// //         </View>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       {/* FULL SCREEN TOUCH DETECTOR */}
// //       <Pressable
// //         style={StyleSheet.absoluteFillObject}
// //         onPressIn={() => {
// //           setTouchStartTime(Date.now());
// //           Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// //         }}
// //         onPressOut={async () => {
// //           if (!touchStartTime) return;
// //           const duration = Date.now() - touchStartTime;
// //           if (duration >= LONG_PRESS_DURATION && !isRecording && !isProcessing) {
// //             await startRecording();
// //           } else if (isRecording) {
// //             await stopRecording();
// //           }
// //           setTouchStartTime(null);
// //         }}
// //       />

// //       {/* GEMINI RAINBOW GLOW BACKGROUND */}
// //       <Animated.View
// //         style={[
// //           styles.glowBackground,
// //           {
// //             opacity: glowAnim,
// //             transform: [{ scale: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }],
// //           },
// //         ]}
// //       />

// //       {/* MAIN CONTENT */}
// //       <View style={styles.content}>
// //         <Text style={styles.title}>Visionary Guide</Text>
// //         <Text style={styles.subtitle}>Your AI companion for navigation</Text>

// //         <View style={styles.centerArea}>
// //           <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
// //             <View style={[styles.micCircle, isRecording && styles.micCircleActive]}>
// //               <Text style={styles.micIcon}>
// //                 {isRecording ? 'Microphone' : 'Sparkles'}
// //               </Text>
// //             </View>
// //           </Animated.View>

// //           <Text style={[styles.hintText, isRecording && styles.hintTextActive]}>
// //             {isRecording ? 'Listening...' : 'Hold anywhere to speak'}
// //           </Text>
// //         </View>

// //         <View style={styles.examplesCard}>
// //           {["Hey Visionary, is the bus here?", "What's in front of me?", "Describe my surroundings"].map((text, i) => (
// //             <Text key={i} style={styles.exampleText}>"{text}"</Text>
// //           ))}
// //         </View>
// //       </View>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: 'black' },
// //   glowBackground: {
// //     ...StyleSheet.absoluteFillObject,
// //     backgroundColor: 'transparent',
// //     shadowColor: '#4285F4',
// //     shadowOffset: { width: 0, height: 0 },
// //     shadowOpacity: 0.6,
// //     shadowRadius: 100,
// //     elevation: 20,
// //   },
// //   content: {
// //     flex: 1,
// //     justifyContent: 'space-between',
// //     paddingTop: 80,
// //     paddingBottom: 60,
// //     paddingHorizontal: 30,
// //   },
// //   title: {
// //     fontSize: 42,
// //     fontWeight: '900',
// //     color: 'white',
// //     textAlign: 'center',
// //     letterSpacing: -1,
// //   },
// //   subtitle: {
// //     fontSize: 17,
// //     color: '#AAAAAA',
// //     textAlign: 'center',
// //     marginTop: 8,
// //   },
// //   centerArea: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   micCircle: {
// //     width: 200,
// //     height: 200,
// //     borderRadius: 100,
// //     backgroundColor: 'rgba(255,255,255,0.08)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 3,
// //     borderColor: 'rgba(255,255,255,0.3)',
// //   },
// //   micCircleActive: {
// //     borderColor: '#FBBC05',
// //     shadowColor: '#FBBC05',
// //     shadowOpacity: 0.8,
// //     shadowRadius: 40,
// //     elevation: 20,
// //   },
// //   micIcon: {
// //     fontSize: 80,
// //     color: 'white',
// //   },
// //   hintText: {
// //     marginTop: 30,
// //     fontSize: 18,
// //     color: '#888888',
// //     fontWeight: '600',
// //   },
// //   hintTextActive: {
// //     color: '#FBBC05',
// //   },
// //   examplesCard: {
// //     backgroundColor: 'rgba(255,255,255,0.05)',
// //     padding: 24,
// //     borderRadius: 24,
// //     borderWidth: 1,
// //     borderColor: 'rgba(255,255,255,0.1)',
// //   },
// //   exampleText: {
// //     color: '#CCCCCC',
// //     fontSize: 16,
// //     textAlign: 'center',
// //     marginBottom: 12,
// //   },
// //   cameraContainer: { flex: 1, backgroundColor: 'black' },
// //   cameraOverlay: {
// //     ...StyleSheet.absoluteFillObject,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   analyzingText: {
// //     color: 'white',
// //     fontSize: 28,
// //     fontWeight: '800',
// //     marginBottom: 20,
// //   },
// //   holdText: {
// //     color: '#34A853',
// //     fontSize: 36,
// //     fontWeight: '900',
// //   },
// // });

// // screens/LandingScreen.jsx
// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, StyleSheet, Pressable, Dimensions, AccessibilityInfo, Animated, Alert } from 'react-native';
// import * as Speech from 'expo-speech';
// import * as Haptics from 'expo-haptics';
// import { Audio } from 'expo-av';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Feather } from '@expo/vector-icons'; // 👈 NEW: Importing Feather icons

// const PHRASE = 'hello';
// const GOOGLE_API_KEY = 'AIzaSyCFOLP0EfP2OgqU6NHLjjUpktvO4fE8xGE';
// const { width, height } = Dimensions.get('window');

// // Component to handle the colorful, pulsing glow effect
// const AnimatedGlow = ({ isRecording, pulseAnim }) => {
//     // Interpolate the scale for both gentle (idle) and strong (listening) pulse
//     const gentleScale = pulseAnim.interpolate({
//         inputRange: [1, 1.15],
//         outputRange: [1, 1.05],
//     });
//     const strongScale = pulseAnim.interpolate({
//         inputRange: [1, 1.15],
//         outputRange: [1.1, 1.25],
//     });

//     return (
//         <Animated.View
//             style={[
//                 styles.glowWrapper,
//                 {
//                     // Scale based on state
//                     transform: [{ scale: isRecording ? strongScale : gentleScale }],
//                     // Opacity based on state
//                     opacity: isRecording ? 0.8 : 0.6,
//                 },
//             ]}
//         >
//             <LinearGradient
//                 colors={['rgba(66, 133, 244, 0.4)', 'rgba(52, 168, 83, 0.4)', 'rgba(251, 188, 5, 0.4)', 'rgba(234, 67, 53, 0.4)']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.glowGradient}
//             />
//         </Animated.View>
//     );
// };

// export default function LandingScreen({ route }) {
//     const userId = route.params?.userId ?? 'test-user';
//     const [isRecording, setIsRecording] = useState(false);
//     const [showCamera, setShowCamera] = useState(false);
//     const [recording, setRecording] = useState(null);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const cameraRef = useRef(null);
//     const [permission, requestPermission] = useCameraPermissions();

//     const pulseAnim = useRef(new Animated.Value(1)).current;

//     useEffect(() => {
//         AccessibilityInfo.announceForAccessibility('VisionaryGuide ready. Hold anywhere to speak.');
//     }, []);

//     useEffect(() => {
//         pulseAnim.stopAnimation();

//         if (isRecording || isProcessing) {
//             // Strong pulse for listening/processing state
//             Animated.loop(
//                 Animated.sequence([
//                     Animated.timing(pulseAnim, { toValue: 1.15, duration: 750, useNativeDriver: true }),
//                     Animated.timing(pulseAnim, { toValue: 1, duration: 750, useNativeDriver: true }),
//                 ])
//             ).start();
//         } else {
//             // Gentle pulse for idle state
//             Animated.loop(
//                 Animated.sequence([
//                     Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
//                     Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
//                 ])
//             ).start();
//         }

//         return () => pulseAnim.stopAnimation();
//     }, [isRecording, isProcessing, pulseAnim]);

//     const startRecording = async () => {
//         if (isRecording || isProcessing) return;

//         try {
//             const { status } = await Audio.requestPermissionsAsync();
//             if (status !== 'granted') {
//                 Alert.alert('Mic Access', 'Microphone permission denied.');
//                 return;
//             }

//             await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
//             const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
//             setRecording(recording);
//             setIsRecording(true);
//             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
//             Speech.speak('Recording started. Speak your command.');
//             AccessibilityInfo.announceForAccessibility('Recording started. Speak your command.');

//         } catch (err) {
//             console.error("Recording error:", err);
//             Alert.alert('Error', 'Recording failed.');
//         }
//     };

//     const stopRecording = async () => {
//         if (!recording) return;
        
//         setIsRecording(false);
//         setIsProcessing(true); // Set processing state immediately after stop
        
//         await recording.stopAndUnloadAsync();
//         const uri = recording.getURI();

//         // The rest of your existing backend logic for STT and query processing remains intact...
//         try {
//             const response = await fetch(uri);
//             const blob = await response.blob();
//             const reader = new FileReader();
//             reader.onloadend = async () => {
//                 const base64 = reader.result.split(',')[1];
//                 const res = await fetch(
//                     `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
//                     {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify({
//                             config: {
//                                 encoding: 'WEBM_OPUS',
//                                 sampleRateHertz: 48000,
//                                 languageCode: 'en-US',
//                             },
//                             audio: { content: base64 },
//                         }),
//                     }
//                 );
//                 const data = await res.json();
//                 const text = (data.results?.[0]?.alternatives?.[0]?.transcript || '').toLowerCase();

//                 if (text.includes(PHRASE)) {
//                     const query = text.replace(PHRASE, '').trim() || 'what do you see';
//                     await handleQuery(query);
//                 } else {
//                     Speech.speak(`Please say ${PHRASE} first.`);
//                 }
//             }
//             reader.readAsDataURL(blob);
//         } catch (e) {
//             console.log('STT failed, using mock');
//             setTimeout(() => {
//                 handleQuery('is the bus here');
//             }, 500);
//         }
//         setIsProcessing(false);
//         setRecording(null);
//     };

//     const handleQuery = async (query) => {
//         try {
//             const needsVision = true;

//             if (needsVision) {
//                 if (!permission?.granted) await requestPermission();

//                 setShowCamera(true);
//                 Speech.speak('Hold steady, capturing in 3 seconds');

//                 setTimeout(async () => {
//                     console.log("MOCK: Taking photo...");
//                     Speech.speak('Bus 101 is here. Rear seats available. Avoiding front due to crowd anxiety. Safe to board.');
//                     setShowCamera(false);
//                 }, 4000);
//             } else {
//                 Speech.speak('All clear, the path is open.');
//             }
//         } catch (e) {
//             console.error("Query error:", e);
//             Alert.alert('Error', 'Query processing failed.');
//         }
//     };

//     // --- CAMERA SCREEN (Unchanged) ---
//     if (showCamera) {
//         return (
//             <View style={styles.cameraContainer}>
//                 <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing="back" />
//                 <LinearGradient
//                     colors={['transparent', 'rgba(0,0,0,0.9)']}
//                     style={StyleSheet.absoluteFillObject}
//                     locations={[0.5, 1]}
//                 />
//                 <View style={styles.geminiCameraOverlay}>
//                     <Text style={styles.geminiAnalyzing}>Analyzing scene...</Text>
//                     <Text style={styles.geminiHold}>Hold Steady</Text>
//                 </View>
//             </View>
//         );
//     }

//     // --- MAIN UI SCREEN (Merged New UI) ---
//     return (
//         <View style={styles.container}>
            
//             {/* FULL SCREEN TOUCH DETECTOR - FIXED LOGIC */}
//             <Pressable
//                 style={StyleSheet.absoluteFillObject}
//                 onPressIn={startRecording}
//                 onPressOut={stopRecording()}
//                 disabled={isProcessing}
//                 accessible={true}
//                 accessibilityLabel={isRecording ? "Stop recording" : "Hold anywhere to start recording"}
//             />

//             {/* COLORFUL GLOW / RADIAL SHADOW EFFECT (Merged) */}
//             {/* <AnimatedGlow isRecording={isRecording || isProcessing} pulseAnim={pulseAnim} /> */}
            
//             {/* MAIN CONTENT */}
//             <View style={styles.content}>
//                 <View style={styles.header}>
//                     <Text style={styles.geminiTitle}>Visionary Guide</Text>
//                     <Text style={styles.geminiSubtitle}>Your AI companion for navigation</Text>
//                 </View>

//                 <View style={styles.geminiCenter}>
//                     {/* Microphone Icon Container (Merged Styles) */}
//                     <View 
//                         style={[
//                             styles.geminiMicCircle,
//                             isRecording && styles.micRecording,
//                             isProcessing && styles.micProcessing
//                         ]}
//                     >
//                         {/* 🚨 ICON REPLACEMENT */}
//                         {isRecording ? (
//                             <Feather name="mic" size={80} color={styles.micIconListening.color} />
//                         ) : isProcessing ? (
//                             <Feather name="loader" size={80} color={styles.micProcessing.borderColor} style={styles.loaderAnimation} />
//                         ) : (
//                             <Feather name="zap" size={80} color={styles.geminiMicIcon.color} />
//                         )}
//                     </View>

//                     {/* Hint Text (Merged Styles) */}
//                     <Text style={[
//                         styles.geminiHint,
//                         isRecording && styles.hintListening
//                     ]}>
//                         {isRecording ? 'Listening...' : isProcessing ? 'Thinking...' : 'Hold anywhere to speak'}
//                     </Text>
//                 </View>

//                 {/* Example Prompts Section (Merged Styles) */}
//                 <View style={styles.geminiExamples}>
//                     <Text style={styles.exampleText}>“Hey Visionary, is the bus here?”</Text>
//                     <Text style={styles.exampleText}>“What’s in front of me?”</Text>
//                     <Text style={styles.exampleText}>“Describe my surroundings”</Text>
//                 </View>
//             </View>
            
//             {/* Animation for the Loader icon */}
//             <Animated.View style={styles.animatedLoaderStyle} />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     // --- CONTAINER & BACKGROUND ---
//     container: { 
//         flex: 1, 
//         backgroundColor: '#1C1C1E', // Dark background from new UI
//     },
//     // --- GLOW EFFECT STYLES (New) ---
//     glowWrapper: {
//         position: 'absolute',
//         width: 300, 
//         height: 300,
//         alignSelf: 'center',
//         top: height / 2 - 150, 
//         left: width / 2 - 150, 
//         borderRadius: 150,
//         overflow: 'hidden',
//         zIndex: 0, 
//     },
//     glowGradient: {
//         ...StyleSheet.absoluteFillObject,
//         opacity: 0.9, 
//     },
//     // --- CONTENT & HEADER ---
//     content: {
//         flex: 1,
//         justifyContent: 'space-between',
//         paddingTop: 80,
//         paddingBottom: 60,
//         paddingHorizontal: 30,
//         zIndex: 1,
//     },
//     header: {
//         paddingTop: 12,
//         paddingBottom: 8,
//     },
//     geminiTitle: {
//         fontSize: 42,
//         fontWeight: '900',
//         color: 'white',
//         textAlign: 'center',
//         letterSpacing: -1,
//     },
//     geminiSubtitle: {
//         fontSize: 18,
//         color: '#A0A0A0', 
//         textAlign: 'center',
//         marginTop: 10,
//         fontWeight: '500',
//     },
//     // --- CENTER MIC AREA ---
//     geminiCenter: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     geminiMicCircle: {
//         width: 200, 
//         height: 200,
//         borderRadius: 100,
//         backgroundColor: 'rgba(255, 255, 255, 0.08)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderWidth: 3,
//         borderColor: 'rgba(255, 255, 255, 0.3)', 
//         shadowColor: 'rgba(255, 255, 255, 0.1)',
//         shadowOffset: { width: 0, height: 0 },
//         shadowOpacity: 1,
//         shadowRadius: 10,
//         elevation: 5, 
//     },
//     micRecording: {
//         borderColor: '#FB923C', 
//         shadowColor: '#FB923C', 
//         shadowRadius: 20,
//     },
//     micProcessing: {
//         borderColor: '#FBBC05', 
//     },
//     geminiMicIcon: {
//         // This style is now mainly used for the Idle/Zap icon color
//         color: 'white',
//     },
//     micIconListening: {
//         color: '#FB923C', // Orange icon when listening
//     },
//     geminiHint: {
//         marginTop: 30,
//         fontSize: 18,
//         color: '#A0A0A0', 
//         fontWeight: '600',
//     },
//     hintListening: {
//         color: '#FB923C', 
//     },
//     // --- BOTTOM EXAMPLES ---
//     geminiExamples: {
//         backgroundColor: 'rgba(255,255,255,0.05)',
//         padding: 20,
//         borderRadius: 20,
//     },
//     exampleText: {
//         color: 'white',
//         fontSize: 16,
//         marginBottom: 12,
//         fontWeight: '500',
//     },
//     // --- CAMERA STYLES (Unchanged) ---
//     cameraContainer: {
//         flex: 1,
//         backgroundColor: 'black',
//     },
//     geminiCameraOverlay: {
//         ...StyleSheet.absoluteFillObject,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.4)',
//     },
//     geminiAnalyzing: {
//         color: 'white',
//         fontSize: 24,
//         fontWeight: '800',
//         marginBottom: 20,
//     },
//     geminiHold: {
//         color: '#34A853',
//         fontSize: 32,
//         fontWeight: '900',
//     },
//     // Simple rotation animation for the loader icon
//     loaderAnimation: {
//         transform: [{ rotate: '360deg' }],
//         animation: 'spin 2s linear infinite',
//     },
//     animatedLoaderStyle: {
//         // Required for web but might need to be implemented using Animated.loop for RN
//     }
// });

// screens/LandingScreen.jsx (FIXED)
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, AccessibilityInfo, Animated, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons'; 

const PHRASE = 'hello';
const GOOGLE_API_KEY = 'AIzaSyCFOLP0EfP2OgqU6NHLjjUpktvO4fE8xGE';
const { width, height } = Dimensions.get('window');

// Component to handle the colorful, pulsing glow effect
const AnimatedGlow = ({ isRecording, pulseAnim }) => {
    // Interpolate the scale for both gentle (idle) and strong (listening) pulse
    const gentleScale = pulseAnim.interpolate({
        inputRange: [1, 1.15],
        outputRange: [1, 1.05],
    });
    const strongScale = pulseAnim.interpolate({
        inputRange: [1, 1.15],
        outputRange: [1.1, 1.25],
    });

    return (
        <Animated.View
            style={[
                styles.glowWrapper,
                {
                    // Scale based on state
                    transform: [{ scale: isRecording ? strongScale : gentleScale }],
                    // Opacity based on state
                    opacity: isRecording ? 0.8 : 0.6,
                },
            ]}
        >
            <LinearGradient
                colors={['rgba(66, 133, 244, 0.4)', 'rgba(52, 168, 83, 0.4)', 'rgba(251, 188, 5, 0.4)', 'rgba(234, 67, 53, 0.4)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glowGradient}
            />
        </Animated.View>
    );
};

export default function LandingScreen({ route }) {
    const userId = route.params?.userId ?? 'test-user';
    const [isRecording, setIsRecording] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [recording, setRecording] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const cameraRef = useRef(null);
    const [permission, requestPermission] = useCameraPermissions();

    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        AccessibilityInfo.announceForAccessibility('VisionaryGuide ready. Hold the microphone to speak.');
    }, []);

    useEffect(() => {
        pulseAnim.stopAnimation();

        if (isRecording || isProcessing) {
            // Strong pulse for listening/processing state
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.15, duration: 750, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 750, useNativeDriver: true }),
                ])
            ).start();
        } else {
            // Gentle pulse for idle state
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
                ])
            ).start();
        }

        return () => pulseAnim.stopAnimation();
    }, [isRecording, isProcessing, pulseAnim]);

    const startRecording = async () => {
        if (isRecording || isProcessing) return;

        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Mic Access', 'Microphone permission denied.');
                return;
            }

            await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            setRecording(recording);
            setIsRecording(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
            // Reduced speech volume/duration to make it less intrusive when holding the button
            Speech.speak('Recording...');
            AccessibilityInfo.announceForAccessibility('Recording started.');

        } catch (err) {
            console.error("Recording error:", err);
            Alert.alert('Error', 'Recording failed.');
        }
    };

    const stopRecording = async () => {
        if (!recording) return;
        
        setIsRecording(false);
        setIsProcessing(true); // Set processing state immediately after stop
        
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        // The rest of your existing backend logic for STT and query processing remains intact...
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
                const text = (data.results?.[0]?.alternatives?.[0]?.transcript || '').toLowerCase();

                if (text.includes(PHRASE)) {
                    const query = text.replace(PHRASE, '').trim() || 'what do you see';
                    await handleQuery(query);
                } else {
                    Speech.speak(`Please say ${PHRASE} first.`);
                }
            }
            reader.readAsDataURL(blob);
        } catch (e) {
            console.log('STT failed, using mock');
            setTimeout(() => {
                handleQuery('is the bus here');
            }, 500);
        }
        setIsProcessing(false);
        setRecording(null);
    };

    const handleQuery = async (query) => {
        try {
            const needsVision = true;

            if (needsVision) {
                if (!permission?.granted) await requestPermission();

                setShowCamera(true);
                Speech.speak('Hold steady, capturing in 3 seconds');

                setTimeout(async () => {
                    console.log("MOCK: Taking photo...");
                    Speech.speak('Bus 101 is here. Rear seats available. Avoiding front due to crowd anxiety. Safe to board.');
                    setShowCamera(false);
                }, 4000);
            } else {
                Speech.speak('All clear, the path is open.');
            }
        } catch (e) {
            console.error("Query error:", e);
            Alert.alert('Error', 'Query processing failed.');
        }
    };

    // --- CAMERA SCREEN (Unchanged) ---
    if (showCamera) {
        return (
            <View style={styles.cameraContainer}>
                <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing="back" />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={StyleSheet.absoluteFillObject}
                    locations={[0.5, 1]}
                />
                <View style={styles.geminiCameraOverlay}>
                    <Text style={styles.geminiAnalyzing}>Analyzing scene...</Text>
                    <Text style={styles.geminiHold}>Hold Steady</Text>
                </View>
            </View>
        );
    }

    // --- MAIN UI SCREEN (Fixed Logic) ---
    return (
        <View style={styles.container}>
            
            {/* NO FULL-SCREEN PRESSABLE HERE */}
            <AnimatedGlow isRecording={isRecording || isProcessing} pulseAnim={pulseAnim} />
            
            {/* MAIN CONTENT */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.geminiTitle}>Visionary Guide</Text>
                    <Text style={styles.geminiSubtitle}>Your AI companion for navigation</Text>
                </View>

                <View style={styles.geminiCenter}>
                    {/* 👇 ATTACH PRESSABLE TO THE MICROPHONE CIRCLE ONLY 👇 */}
                    <Pressable
                        onLongPress={startRecording}
                        onPressOut={stopRecording} // ✅ CORRECT: Pass the function reference, NOT the result of a call
                        // Setting a hit-slop ensures the touch area is forgiving even for a fast press-out
                        hitSlop={20} 
                        disabled={isProcessing}
                        accessible={true}
                        accessibilityLabel={isRecording ? "Stop recording" : "Hold microphone button to start recording"}
                    >
                        {/* Microphone Icon Container */}
                        <View 
                            style={[
                                styles.geminiMicCircle,
                                isRecording && styles.micRecording,
                                isProcessing && styles.micProcessing
                            ]}
                        >
                            {/* 🚨 ICON REPLACEMENT */}
                            {isRecording ? (
                                <Feather name="mic" size={80} color={styles.micIconListening.color} />
                            ) : isProcessing ? (
                                <Feather name="loader" size={80} color={styles.micProcessing.borderColor} style={styles.loaderAnimation} />
                            ) : (
                                <Feather name="zap" size={80} color={styles.geminiMicIcon.color} />
                            )}
                        </View>
                    </Pressable>

                    {/* Hint Text */}
                    <Text style={[
                        styles.geminiHint,
                        isRecording && styles.hintListening
                    ]}>
                        {isRecording ? 'Listening...' : isProcessing ? 'Thinking...' : 'Hold microphone to speak'}
                    </Text>
                </View>

                {/* Example Prompts Section */}
                <View style={styles.geminiExamples}>
                    <Text style={styles.exampleText}>“Hey Visionary, is the bus here?”</Text>
                    <Text style={styles.exampleText}>“What’s in front of me?”</Text>
                    <Text style={styles.exampleText}>“Describe my surroundings”</Text>
                </View>
            </View>
            
            <Animated.View style={styles.animatedLoaderStyle} />
        </View>
    );
}

const styles = StyleSheet.create({
    // --- STYLES (Unchanged) ---
    container: { 
        flex: 1, 
        backgroundColor: '#1C1C1E', 
    },
    glowWrapper: {
        position: 'absolute',
        width: 300, 
        height: 300,
        alignSelf: 'center',
        top: height / 2 - 150, 
        left: width / 2 - 150, 
        borderRadius: 150,
        overflow: 'hidden',
        zIndex: 0, 
    },
    glowGradient: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.9, 
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 80,
        paddingBottom: 60,
        paddingHorizontal: 30,
        zIndex: 1,
    },
    header: {
        paddingTop: 12,
        paddingBottom: 8,
    },
    geminiTitle: {
        fontSize: 42,
        fontWeight: '900',
        color: 'white',
        textAlign: 'center',
        letterSpacing: -1,
    },
    geminiSubtitle: {
        fontSize: 18,
        color: '#A0A0A0', 
        textAlign: 'center',
        marginTop: 10,
        fontWeight: '500',
    },
    geminiCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    geminiMicCircle: {
        width: 200, 
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)', 
        shadowColor: 'rgba(255, 255, 255, 0.1)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5, 
    },
    micRecording: {
        borderColor: '#FB923C', 
        shadowColor: '#FB923C', 
        shadowRadius: 20,
    },
    micProcessing: {
        borderColor: '#FBBC05', 
    },
    geminiMicIcon: {
        color: 'white',
    },
    micIconListening: {
        color: '#FB923C', 
    },
    geminiHint: {
        marginTop: 30,
        fontSize: 18,
        color: '#A0A0A0', 
        fontWeight: '600',
    },
    hintListening: {
        color: '#FB923C', 
    },
    geminiExamples: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        borderRadius: 20,
    },
    exampleText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 12,
        fontWeight: '500',
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    geminiCameraOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    geminiAnalyzing: {
        color: 'white',
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 20,
    },
    geminiHold: {
        color: '#34A853',
        fontSize: 32,
        fontWeight: '900',
    },
    loaderAnimation: {
        transform: [{ rotate: '360deg' }],
        animation: 'spin 2s linear infinite',
    },
    animatedLoaderStyle: {
    }
});
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router'; // ✅ This is what you should use
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const Index = () => {
  const handleDone = () => {
    router.replace('/auth/signup'); // ✅ Navigates to your home screen
  };
  return (
   <SafeAreaView style={styles.container}>
     <View style={styles.container} >
      <Onboarding
      onDone={handleDone}
    onSkip={handleDone}
       containerStyles={{
        paddingHorizontal:15,

       }}
  pages={[
    {
      backgroundColor: '#B3DBFF',
      image: (
        <View style={styles.lottie}>
             <LottieView source={require('../../assets/animations/studentHover.json')} autoPlay
              loop
              style={styles.lottie} 
             />
        </View>
      ),
      title: 'Boost Productivity',
      subtitle: 'Welcome to Learnable',
    },
    {
      backgroundColor: '#FFD8A8',
      image: (
        <View style={styles.lottie}>
             <LottieView source={require('../../assets/animations/lottieAnimation1.json')} autoPlay
              loop
              style={styles.lottie} 
             />
        </View>
      ),
      title: 'Work Seamlessly',
      subtitle: 'Get warmed up as we delve into matters',
    },
      {
      backgroundColor: '#E3C6FF',
      image: (
       <View style={styles.lottie}>
             <LottieView source={require('../../assets/animations/teaching.json')} autoPlay
              loop
              style={styles.lottie} 
             />
        </View>
      ),
      title: 'Achieve Higher Goals',
      subtitle: 'We are prepared to help you attain all your goals',
    },
  ]}
/>
    </View>
   </SafeAreaView>
  )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'white'
    },
   lottie: {
  width: width * 0.9,
  height: height * 0.5, 
  alignSelf: 'center',
},
})
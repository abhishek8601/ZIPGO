import Colors from '@/constants/colors';
import { Asset } from 'expo-asset';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';


export default function SplashScreen() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function preloadAssets() {
      try {
        await Asset.loadAsync([
          require('../../assets/images/splash-screen-background.png'),
          require('../../assets/images/zipgo-logo.svg'),
        ]);
        setIsReady(true);
      } catch (e) {
        console.warn('Asset loading failed', e);
      }
    }
    preloadAssets();
  }, []);

  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="gold" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/splash-screen-background.png')}
      style={{
        flex: 1,            
        width: '100%',     
        height: '100%',     
        alignItems: 'center', // center children horizontally
        justifyContent: 'center', // center children vertically
      }}
      resizeMode="cover"
    >
      <View className="flex-1 justify-center items-center px-10">
        <Image
          source={require('../../assets/images/zipgo-logo.png')}
          className="mt-32"          
        style={{ width: 150, height: 140 }}
          resizeMode="contain"
        />
     <Text className="text-yellow-500 font-bold text-4xl text-center h-[100px]">
  ZIPGO
</Text>

        <TouchableOpacity
           className="bg-[#E8B639] py-[18px] px-[40px] rounded-[30px] self-center mt-[200px] ml-[5px]"
          onPress={() => router.push('/screens/LocationPermissionScreen')}
        >
          <Text className="text-black font-medium text-lg text-center w-[200px]">
            Get Started →
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

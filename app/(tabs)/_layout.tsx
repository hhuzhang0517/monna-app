
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: 'image-generation',
      route: '/(tabs)/image-generation',
      icon: 'image',
      label: '图片生成',
    },
    {
      name: 'video-generation',
      route: '/(tabs)/video-generation',
      icon: 'videocam',
      label: '视频生成',
    },
    {
      name: 'movie-production',
      route: '/(tabs)/movie-production',
      icon: 'movie',
      label: '电影制作',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="image-generation" name="image-generation" />
        <Stack.Screen key="video-generation" name="video-generation" />
        <Stack.Screen key="movie-production" name="movie-production" />
        <Stack.Screen key="home" name="(home)" options={{ href: null }} />
        <Stack.Screen key="profile" name="profile" options={{ href: null }} />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}

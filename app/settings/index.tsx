import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoPlayVideos, setAutoPlayVideos] = useState(true);

  const handleSignOut = async () => {
    Alert.alert(
      '确认登出',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/welcome');
            } catch (error) {
              console.error('登出失败:', error);
              Alert.alert('错误', '登出失败，请重试');
            }
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      '清除缓存',
      '确定要清除应用缓存吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            // TODO: 实现清除缓存功能
            Alert.alert('提示', '缓存已清除');
          },
        },
      ]
    );
  };

  const renderSection = (title: string, items: React.ReactNode[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item}
            {index < items.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );

  const renderMenuItem = (
    icon: string,
    title: string,
    onPress: () => void,
    rightElement?: React.ReactNode,
    danger?: boolean
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon as any} size={22} color={danger ? '#FF3B30' : '#333'} />
        <Text style={[styles.menuItemText, danger && styles.menuItemTextDanger]}>
          {title}
        </Text>
      </View>
      {rightElement || <Ionicons name="chevron-forward" size={20} color="#999" />}
    </TouchableOpacity>
  );

  const renderSwitchItem = (
    icon: string,
    title: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon as any} size={22} color="#333" />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#e5e5e5', true: colors.orange }}
        thumbColor="#fff"
      />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>设置</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* 账号设置 */}
        {renderSection('账号设置', [
          renderMenuItem('person-outline', '个人信息', () => router.push('/profile/edit')),
          renderMenuItem('key-outline', '修改密码', () => {
            Alert.alert('提示', '密码修改功能开发中');
          }),
          renderMenuItem('shield-checkmark-outline', '账号安全', () => {
            Alert.alert('提示', '账号安全功能开发中');
          }),
        ])}

        {/* 通知设置 */}
        {renderSection('通知设置', [
          renderSwitchItem('notifications-outline', '推送通知', notificationsEnabled, setNotificationsEnabled),
          renderSwitchItem('mail-outline', '邮件通知', autoPlayVideos, setAutoPlayVideos),
        ])}

        {/* 应用设置 */}
        {renderSection('应用设置', [
          renderMenuItem('language-outline', '语言设置', () => {
            Alert.alert('提示', '语言设置功能开发中');
          }, <Text style={styles.menuItemValue}>简体中文</Text>),
          renderMenuItem('color-palette-outline', '主题设置', () => {
            Alert.alert('提示', '主题设置功能开发中');
          }, <Text style={styles.menuItemValue}>自动</Text>),
          renderSwitchItem('play-outline', '自动播放视频', autoPlayVideos, setAutoPlayVideos),
        ])}

        {/* 其他 */}
        {renderSection('其他', [
          renderMenuItem('trash-outline', '清除缓存', handleClearCache, 
            <Text style={styles.menuItemValue}>0 MB</Text>
          ),
          renderMenuItem('information-circle-outline', '关于我们', () => {
            Alert.alert('关于 Monna AI', 'Version 1.0.0\n\n一个强大的 AI 创作工具');
          }),
          renderMenuItem('document-text-outline', '用户协议', () => {
            Alert.alert('提示', '用户协议功能开发中');
          }),
          renderMenuItem('shield-outline', '隐私政策', () => {
            Alert.alert('提示', '隐私政策功能开发中');
          }),
        ])}

        {/* 危险区域 */}
        {renderSection('危险区域', [
          renderMenuItem('log-out-outline', '退出登录', handleSignOut, undefined, true),
        ])}

        {/* 版本信息 */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Monna AI v1.0.0</Text>
          <Text style={styles.versionSubText}>© 2024 All Rights Reserved</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  menuItemTextDanger: {
    color: '#FF3B30',
  },
  menuItemValue: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 50,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  versionSubText: {
    fontSize: 12,
    color: '#ccc',
  },
});


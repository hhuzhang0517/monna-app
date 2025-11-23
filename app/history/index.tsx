import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { colors } from '@/styles/commonStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getApiUrl } from '@/config/api';

interface Generation {
  id: string;
  type: 'image' | 'video';
  prompt: string;
  result_url: string;
  created_at: string;
  status: string;
}

export default function HistoryScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadGenerations();
    }
  }, [user]);

  const loadGenerations = async (isRefresh = false) => {
    if (!user) {
      router.replace('/welcome');
      return;
    }

    try {
      if (!isRefresh) {
        setLoading(true);
      }

      // 获取当前会话令牌
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        Alert.alert('提示', '请先登录');
        router.replace('/welcome');
        return;
      }

      // 调用 API 获取生成历史
      const response = await fetch(getApiUrl('api/user/generations'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('获取历史记录失败');
      }

      const data = await response.json();
      setGenerations(data || []);
    } catch (error) {
      console.error('加载生成历史失败:', error);
      Alert.alert('错误', '加载失败，请重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadGenerations(true);
  };

  const handleCleanup = () => {
    Alert.alert(
      '确认清理',
      '确定要清理所有历史记录吗？此操作不可恢复。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              
              if (!session) {
                Alert.alert('提示', '请先登录');
                return;
              }

              const response = await fetch(getApiUrl('api/user/generations'), {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${session.access_token}`,
                },
              });

              if (!response.ok) {
                throw new Error('清理失败');
              }

              const result = await response.json();
              Alert.alert('成功', `已清理 ${result.deleted || 0} 条记录`);
              loadGenerations();
            } catch (error) {
              console.error('清理失败:', error);
              Alert.alert('错误', '清理失败，请重试');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  const truncatePrompt = (prompt: string, maxLength: number = 50) => {
    return prompt.length > maxLength ? `${prompt.substring(0, maxLength)}...` : prompt;
  };

  const renderItem = ({ item }: { item: Generation }) => (
    <View style={styles.itemContainer}>
      {/* 缩略图 */}
      <View style={styles.thumbnailContainer}>
        {item.type === 'image' ? (
          <Image
            source={{ uri: item.result_url }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbnail}>
            <Ionicons name="videocam" size={32} color="#999" />
          </View>
        )}
        <View style={styles.typeBadge}>
          <Ionicons
            name={item.type === 'image' ? 'image' : 'videocam'}
            size={12}
            color="#fff"
          />
        </View>
      </View>

      {/* 信息区域 */}
      <View style={styles.infoContainer}>
        <View style={styles.typeRow}>
          <Ionicons
            name={item.type === 'image' ? 'image-outline' : 'videocam-outline'}
            size={16}
            color="#666"
          />
          <Text style={styles.typeText}>
            {item.type === 'image' ? '图片生成' : '视频生成'}
          </Text>
        </View>
        <Text style={styles.promptText} numberOfLines={2}>
          {truncatePrompt(item.prompt)}
        </Text>
        <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
      </View>

      {/* 下载按钮 */}
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => {
          // TODO: 实现下载功能
          Alert.alert('提示', '下载功能开发中');
        }}
      >
        <Ionicons name="download-outline" size={20} color={colors.orange} />
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="time-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>暂无生成记录</Text>
      <Text style={styles.emptyHint}>开始创作你的第一个作品吧！</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/(tabs)/image-generation')}
      >
        <Text style={styles.createButtonText}>立即创作</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>生成历史</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.orange} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>生成历史</Text>
        {generations.length > 0 && (
          <TouchableOpacity style={styles.cleanupButton} onPress={handleCleanup}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        )}
        {generations.length === 0 && <View style={styles.placeholder} />}
      </View>

      {/* 列表 */}
      <FlatList
        data={generations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.orange]}
          />
        }
      />
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
  cleanupButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  promptText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  downloadButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  createButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: colors.orange,
    borderRadius: 24,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});


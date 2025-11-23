
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { TopNavigationBar } from '@/components/TopNavigationBar';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 3;

interface VideoTemplate {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
}

const videoTemplates: VideoTemplate[] = [
  {
    id: 'vid1',
    title: '切换到冬天',
    thumbnail: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400',
    category: '特效',
  },
  {
    id: 'vid2',
    title: '切换到秋天',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    category: '特效',
  },
  {
    id: 'vid3',
    title: '切换到春天',
    thumbnail: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400',
    category: '特效',
  },
  {
    id: 'vid4',
    title: '花瓣消散',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
    category: '幻想',
  },
  {
    id: 'vid5',
    title: '换衣服',
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    category: '幻想',
  },
  {
    id: 'vid6',
    title: '老照片动起来',
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
    category: '幻想',
  },
  {
    id: 'vid7',
    title: '人物特写',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    category: '角色',
  },
  {
    id: 'vid8',
    title: '动作场景',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    category: '角色',
  },
  {
    id: 'vid9',
    title: '情感表达',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    category: '角色',
  },
];

type Category = '特效' | '角色' | '幻想';

export default function VideoGenerationScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('特效');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const filteredTemplates = videoTemplates.filter(
    (template) => template.category === selectedCategory
  );

  return (
    <View style={styles.container}>
      <TopNavigationBar />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === '特效' && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory('特效')}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === '特效' && styles.categoryButtonTextActive,
              ]}
            >
              特效
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === '角色' && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory('角色')}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === '角色' && styles.categoryButtonTextActive,
              ]}
            >
              角色
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === '幻想' && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory('幻想')}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === '幻想' && styles.categoryButtonTextActive,
              ]}
            >
              幻想
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.templatesGrid}>
          {filteredTemplates.map((template, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.templateCard,
                selectedTemplate === template.id && styles.templateCardSelected,
              ]}
              onPress={() => setSelectedTemplate(template.id)}
            >
              <Image
                source={{ uri: template.thumbnail }}
                style={styles.templateImage}
              />
              <View style={styles.playIconContainer}>
                <View style={styles.playIconBackground}>
                  <IconSymbol
                    ios_icon_name="play.fill"
                    android_material_icon_name="play-arrow"
                    size={28}
                    color="rgba(255, 255, 255, 0.95)"
                  />
                </View>
              </View>
              <View style={styles.templateInfo}>
                <Text style={styles.templateTitle} numberOfLines={1}>
                  {template.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10, // Increased by 50px to avoid status bar overlap
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  categoryButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  categoryButtonTextActive: {
    color: colors.card,
    fontWeight: '600',
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  templateCard: {
    width: cardWidth,
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  templateCardSelected: {
    borderColor: colors.orange,
  },
  templateImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  playIconContainer: {
    position: 'absolute',
    top: 50,
    left: '50%',
    marginLeft: -22,
  },
  playIconBackground: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateInfo: {
    padding: 10,
    alignItems: 'center',
  },
  templateTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
});

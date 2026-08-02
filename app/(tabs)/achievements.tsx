import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Screen } from '@/components/common/Screen';
import {
  ACHIEVEMENT_DEFINITIONS,
  AchievementDefinition,
} from '@/constants/achievements';
import { colors, palette } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

export default function AchievementsScreen() {
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementDefinition | null>(null);

  const renderIcon = (iconName: string, itemId?: string) => {
    if (itemId === 'speed-strike') {
      return (
        <Image
          source={require('@/assets/images/speed_strike.png')}
          style={{ width: 46, height: 46, borderRadius: 23 }}
          resizeMode="cover"
        />
      );
    }
    if (itemId === 'titan-force') {
      return (
        <Image
          source={require('@/assets/images/titan_force.png')}
          style={{ width: 46, height: 46, borderRadius: 23 }}
          resizeMode="cover"
        />
      );
    }
    if (itemId === 'phoenix-heart') {
      return (
        <Image
          source={require('@/assets/images/phoenix_heart.png')}
          style={{ width: 46, height: 46, borderRadius: 23 }}
          resizeMode="cover"
        />
      );
    }
    if (itemId === 'stealth-shadow') {
      return (
        <Image
          source={require('@/assets/images/stealth_shadow.png')}
          style={{ width: 46, height: 46, borderRadius: 23 }}
          resizeMode="cover"
        />
      );
    }
    if (itemId === 'vanguard-shield') {
      return (
        <Image
          source={require('@/assets/images/vanguard_shield.png')}
          style={{ width: 46, height: 46, borderRadius: 23 }}
          resizeMode="cover"
        />
      );
    }
    if (itemId === 'viper-strike') {
      return (
        <Image
          source={require('@/assets/images/viper_strike.png')}
          style={{ width: 46, height: 46, borderRadius: 23 }}
          resizeMode="cover"
        />
      );
    }
    switch (iconName) {
      case 'barbell':
        return <MaterialCommunityIcons name="dumbbell" size={26} color="#E4E4E7" />;
      case 'skull':
        return <Ionicons name="skull" size={26} color="#E4E4E7" />;
      case 'heart':
        return <Ionicons name="heart" size={26} color="#E4E4E7" />;
      case 'shield-checkmark':
        return <Ionicons name="shield-checkmark" size={26} color="#E4E4E7" />;
      case 'pulse':
        return <Ionicons name="pulse" size={26} color="#E4E4E7" />;
      case 'flash':
      default:
        return <Ionicons name="flash" size={26} color="#E4E4E7" />;
    }
  };

  return (
    <Screen style={styles.screen}>
      {/* Top Sci-Fi Header */}
      <View style={styles.topBar}>
        <View style={styles.titleWrap} />

        {/* Top HUD Nav */}
        <View style={styles.hudNav}>
          <TouchableOpacity style={styles.hudItem} onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="person-outline" size={14} color="#71717A" />
            <Text style={styles.hudItemText}>PROFILE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.hudItem} onPress={() => setSelectedAchievement(ACHIEVEMENT_DEFINITIONS[0])}>
            <Ionicons name="clipboard-outline" size={14} color="#71717A" />
            <Text style={styles.hudItemText}>MISSIONS</Text>
          </TouchableOpacity>

          <View style={[styles.hudItem, styles.hudItemActive]}>
            <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
            <Text style={[styles.hudItemText, styles.hudItemTextActive]}>BADGES</Text>
          </View>

          <TouchableOpacity style={styles.hudItem} onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="settings-outline" size={14} color="#71717A" />
            <Text style={styles.hudItemText}>SETTINGS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Beveled Metallic Hub Canvas */}
        <View style={styles.hubCanvas}>
          {/* Tech Grid Background Lines */}
          <View style={styles.techLineTop} />
          <View style={styles.techLineBottom} />

          {/* Hexagon Badges Grid (2 columns x 3 rows for mobile) */}
          <View style={styles.grid}>
            {ACHIEVEMENT_DEFINITIONS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.hexagonCard}
                activeOpacity={0.82}
                onPress={() => setSelectedAchievement(item)}
              >
                {/* Outer Beveled Frame */}
                <View style={styles.hexOuterBorder}>
                  <View style={styles.hexInnerBorder}>
                    {/* Emblem Icon Area */}
                    <View style={styles.emblemContainer}>
                      <View style={styles.emblemGlowRing} />
                      {renderIcon(item.iconName, item.id)}
                    </View>

                    {/* Title */}
                    <Text style={styles.badgeTitle} numberOfLines={1}>
                      {item.title}
                    </Text>

                    {/* Level and Subtier Row */}
                    <View style={styles.statsRow}>
                      <Text style={styles.levelText}>{item.level}</Text>
                      <View style={styles.verticalDivider} />
                      <Text style={styles.subtierText} numberOfLines={1}>
                        {item.subtier}
                      </Text>
                    </View>

                    {/* Bottom Emblem Tab */}
                    <View style={styles.ariseTag}>
                      <Text style={styles.ariseTagText}>HUNTERX</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Achievement Detail Modal */}
      <Modal
        visible={selectedAchievement !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedAchievement(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedAchievement(null)}>
          {selectedAchievement && (
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalCode}>DATABANK // {selectedAchievement.id.toUpperCase()}</Text>
                <TouchableOpacity onPress={() => setSelectedAchievement(null)}>
                  <Ionicons name="close" size={20} color="#A1A1AA" />
                </TouchableOpacity>
              </View>

              {/* Large Emblem Display */}
              <View style={styles.largeEmblemBox}>
                <View style={styles.largeEmblemRing}>
                  {renderIcon(selectedAchievement.iconName, selectedAchievement.id)}
                </View>
              </View>

              <Text style={styles.modalTitle}>{selectedAchievement.title}</Text>
              <View style={styles.modalTagRow}>
                <View style={styles.modalTag}>
                  <Text style={styles.modalTagText}>{selectedAchievement.level}</Text>
                </View>
                <View style={[styles.modalTag, styles.modalTagGold]}>
                  <Text style={[styles.modalTagText, styles.modalTagGoldText]}>
                    {selectedAchievement.subtier}
                  </Text>
                </View>
              </View>

              <Text style={styles.modalDesc}>{selectedAchievement.description}</Text>

              {/* Reward Row */}
              <View style={styles.rewardRow}>
                <Text style={styles.rewardLabel}>XP YIELD:</Text>
                <Text style={styles.rewardValue}>+{selectedAchievement.xpReward} XP</Text>
              </View>

              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.equipBtn}
                  onPress={() => setSelectedAchievement(null)}
                >
                  <Text style={styles.equipBtnText}>EQUIP EMBLEM</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelectedAchievement(null)}
                >
                  <Text style={styles.closeBtnText}>CLOSE</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#050507',
  },
  topBar: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#0A0A0D',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F24',
    gap: 8,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hubTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 1.2,
    flexShrink: 1,
  },
  hudNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  hudItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    backgroundColor: '#121216',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  hudItemActive: {
    backgroundColor: '#272730',
    borderColor: '#52525B',
  },
  hudItemText: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 0.8,
  },
  hudItemTextActive: {
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 32,
  },

  /* Hub Canvas */
  hubCanvas: {
    backgroundColor: '#0C0C0F',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#27272E',
    padding: 6,
    position: 'relative',
  },
  singleImageContainer: {
    width: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  singleHubImage: {
    width: '100%',
    height: 250,
    borderRadius: 6,
  },
  techLineTop: {
    position: 'absolute',
    top: 6,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  techLineBottom: {
    position: 'absolute',
    bottom: 6,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },

  /* Badges Grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  hexagonCard: {
    width: '48%',
  },
  hexOuterBorder: {
    backgroundColor: '#16161C',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#3F3F46',
    padding: 2,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  hexInnerBorder: {
    backgroundColor: '#0E0E12',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#27272A',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  emblemContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#1E1E24',
    borderWidth: 2,
    borderColor: '#71717A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  emblemGlowRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  badgeTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: '#F4F4F5',
    letterSpacing: 0.8,
    textAlign: 'center',
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#18181B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#27272A',
    marginBottom: 8,
  },
  levelText: {
    fontFamily: fontFamilies.bold,
    fontSize: 8,
    color: '#A1A1AA',
  },
  verticalDivider: {
    width: 1,
    height: 8,
    backgroundColor: '#3F3F46',
  },
  subtierText: {
    fontFamily: fontFamilies.bold,
    fontSize: 8,
    color: '#E4E4E7',
    maxWidth: 90,
  },
  ariseTag: {
    borderWidth: 1,
    borderColor: '#52525B',
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 2,
    backgroundColor: '#141418',
  },
  ariseTagText: {
    fontFamily: fontFamilies.bold,
    fontSize: 7,
    color: '#A1A1AA',
    letterSpacing: 1.2,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#0F0F14',
    borderWidth: 1.5,
    borderColor: '#52525B',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalCode: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 1,
  },
  largeEmblemBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E1E26',
    borderWidth: 2,
    borderColor: '#A1A1AA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  largeEmblemRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  modalTagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  modalTag: {
    backgroundColor: '#27272A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
  },
  modalTagText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: '#E4E4E7',
  },
  modalTagGold: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  modalTagGoldText: {
    color: '#FFD700',
  },
  modalDesc: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  rewardLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: '#71717A',
  },
  rewardValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: '#FFD700',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  equipBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  equipBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: '#000000',
    letterSpacing: 1,
  },
  closeBtn: {
    flex: 1,
    backgroundColor: '#1E1E24',
    borderWidth: 1,
    borderColor: '#3F3F46',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  closeBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: '#A1A1AA',
    letterSpacing: 1,
  },
});

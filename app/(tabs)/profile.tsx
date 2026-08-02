import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { LevelUpRewardModal } from '@/components/features/rewards/LevelUpRewardModal';
import { DailyRewardModal } from '@/components/features/rewards/DailyRewardModal';
import { colors, palette } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const AVATAR_OPTIONS = [
  require('@/assets/images/anime_avatar_1.png'),
  require('@/assets/images/anime_avatar_2.png'),
  require('@/assets/images/anime_avatar_3.png'),
  require('@/assets/images/anime_avatar_4.png'),
];

const ACCOUNT_MENU_ITEMS = [
  {
    id: 'EDIT PROFILE',
    title: 'Edit Profile',
    subtitle: 'Manage personal information & hunter name',
    icon: 'person-outline',
  },
  {
    id: 'MY GOALS',
    title: 'My Goals',
    subtitle: 'Track active workout objectives & targets',
    icon: 'flame-outline',
  },
  {
    id: 'ACHIEVEMENTS',
    title: 'Achievements',
    subtitle: 'View unlocked 3D badges & medals',
    icon: 'ribbon-outline',
    badge: 'NEW',
  },
  {
    id: 'SYSTEM SETTINGS',
    title: 'System Settings',
    subtitle: 'App preferences, audio & security config',
    icon: 'settings-outline',
  },
  {
    id: 'REWARDS',
    title: 'Rewards',
    subtitle: 'Claim loot boxes, bonuses & rank perks',
    icon: 'gift-outline',
  },
  {
    id: 'SIGN OUT',
    title: 'Sign Out',
    subtitle: 'Disconnect from hunter network',
    icon: 'log-out-outline',
    isDanger: true,
  },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const setUser = useAuthStore((state) => state.setUser);

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementDefinition | null>(null);

  const [editNameModalVisible, setEditNameModalVisible] = useState(false);
  const [editNameInput, setEditNameInput] = useState('');
  const [avatarPickerModalVisible, setAvatarPickerModalVisible] = useState(false);
  const [rewardModalVisible, setRewardModalVisible] = useState(false);
  const [dailyRewardModalVisible, setDailyRewardModalVisible] = useState(false);
  const [activeAccountItem, setActiveAccountItem] = useState('EDIT PROFILE');

  // Mild Breathing & Expanding Glow Pulse Animation for Avatar Circle
  const glowAnim = useRef(new Animated.Value(0.45)).current;
  const glowScale = useRef(new Animated.Value(1.0)).current;

  // Dynamic profile image inward press & rise-up float animation
  const imageScale = useRef(new Animated.Value(1.0)).current;
  const imageTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.9,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.45,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glowScale, {
            toValue: 1.15,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(glowScale, {
            toValue: 1.0,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(imageScale, {
            toValue: 0.93,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(imageScale, {
            toValue: 1.0,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(imageTranslateY, {
            toValue: 3,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(imageTranslateY, {
            toValue: -3,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ])
    ).start();
  }, [glowAnim, glowScale, imageScale, imageTranslateY]);

  const getAvatarSource = (avatar?: any) => {
    if (!avatar) {
      return AVATAR_OPTIONS[0];
    }
    if (typeof avatar === 'string' && avatar.startsWith('http')) {
      return { uri: avatar };
    }
    return avatar;
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSignOut = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const handleItemPress = (title: string) => {
    if (title === 'SIGN OUT') {
      handleSignOut();
      return;
    }
    if (title === 'EDIT PROFILE') {
      setEditNameInput(user?.displayName || 'Sunil');
      setEditNameModalVisible(true);
      return;
    }
    if (title === 'ACHIEVEMENTS') {
      router.push('/(tabs)/achievements');
      return;
    }
    if (title === 'REWARDS') {
      setRewardModalVisible(true);
      return;
    }
    setModalMessage(`${title} clicked`);
    setModalVisible(true);
  };

  const handleSaveName = () => {
    const trimmed = editNameInput.trim();
    if (trimmed) {
      if (user) {
        setUser({ ...user, displayName: trimmed });
      } else {
        setUser({
          id: '1',
          displayName: trimmed,
          email: 'hunter@arise.com',
          avatarUrl: AVATAR_OPTIONS[0],
          level: 12,
          xp: 14250,
          currentStreak: 14,
          longestStreak: 30,
          createdAt: new Date().toISOString(),
        });
      }
    }
    setEditNameModalVisible(false);
  };

  const handleSelectAvatar = (imgSrc: any) => {
    if (user) {
      setUser({ ...user, avatarUrl: imgSrc });
    } else {
      setUser({
        id: '1',
        displayName: 'Sunil',
        email: 'hunter@arise.com',
        avatarUrl: imgSrc,
        level: 12,
        xp: 14250,
        currentStreak: 14,
        longestStreak: 30,
        createdAt: new Date().toISOString(),
      });
    }
    setAvatarPickerModalVisible(false);
  };

  const handleDebrief = () => {
    setModalMessage('Operational Excellence Confirmed!\n+1,200 XP Credited to your account.');
    setModalVisible(true);
  };

  const renderIcon = (iconName: string, itemId?: string) => {
    if (itemId === 'speed-strike') {
      return (
        <Image
          source={require('@/assets/images/speed_strike.png')}
          style={{ width: 44, height: 44, borderRadius: 22 }}
          resizeMode="cover"
        />
      );
    }
    if (itemId === 'titan-force') {
      return (
        <Image
          source={require('@/assets/images/titan_force.png')}
          style={{ width: 44, height: 44, borderRadius: 22 }}
          resizeMode="cover"
        />
      );
    }
    if (itemId === 'phoenix-heart') {
      return (
        <Image
          source={require('@/assets/images/phoenix_heart.png')}
          style={{ width: 44, height: 44, borderRadius: 22 }}
          resizeMode="cover"
        />
      );
    }
    if (itemId === 'stealth-shadow') {
      return (
        <Image
          source={require('@/assets/images/stealth_shadow.png')}
          style={{ width: 44, height: 44, borderRadius: 22 }}
          resizeMode="cover"
        />
      );
    }
    if (itemId === 'vanguard-shield') {
      return (
        <Image
          source={require('@/assets/images/vanguard_shield.png')}
          style={{ width: 44, height: 44, borderRadius: 22 }}
          resizeMode="cover"
        />
      );
    }
    if (itemId === 'viper-strike') {
      return (
        <Image
          source={require('@/assets/images/viper_strike.png')}
          style={{ width: 44, height: 44, borderRadius: 22 }}
          resizeMode="cover"
        />
      );
    }
    switch (iconName) {
      case 'barbell':
        return <MaterialCommunityIcons name="dumbbell" size={24} color="#E4E4E7" />;
      case 'skull':
        return <Ionicons name="skull" size={24} color="#E4E4E7" />;
      case 'heart':
        return <Ionicons name="heart" size={24} color="#E4E4E7" />;
      case 'shield-checkmark':
        return <Ionicons name="shield-checkmark" size={24} color="#E4E4E7" />;
      case 'pulse':
        return <Ionicons name="pulse" size={24} color="#E4E4E7" />;
      case 'flash':
      default:
        return <Ionicons name="flash" size={24} color="#E4E4E7" />;
    }
  };

  return (
    <Screen style={styles.screen}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={palette.white} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>PROFILE</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} onPress={() => handleItemPress('SYSTEM SETTINGS')}>
          <Ionicons name="settings-outline" size={22} color={palette.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={palette.cyberGold}
            colors={[palette.cyberGold]}
          />
        }
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            activeOpacity={0.85}
            onPress={() => setAvatarPickerModalVisible(true)}
          >
            {/* Mild Circular Glowing Halo Layer */}
            <Animated.View
              style={[
                styles.circularGlowHalo,
                {
                  opacity: glowAnim,
                  shadowOpacity: glowAnim,
                  transform: [{ scale: glowScale }],
                },
              ]}
            />

            {/* Profile Image Ring with Smooth Matching Glow */}
            <Animated.View
              style={[
                styles.avatarRingWrapper,
                {
                  shadowOpacity: glowAnim,
                  transform: [
                    { scale: imageScale },
                    { translateY: imageTranslateY },
                  ],
                },
              ]}
            >
              <View style={styles.avatarHexRing}>
                <Image
                  source={getAvatarSource(user?.avatarUrl)}
                  style={styles.avatarImg}
                />
              </View>
            </Animated.View>
          </TouchableOpacity>

          {/* Editable User Name */}
          <TouchableOpacity
            style={styles.userNameRow}
            activeOpacity={0.8}
            onPress={() => {
              setEditNameInput(user?.displayName || 'Sunil');
              setEditNameModalVisible(true);
            }}
          >
            <Text style={styles.userNameText}>{user?.displayName || 'Sunil'}</Text>
            <Ionicons name="create-outline" size={14} color="#E5A93C" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        {/* Stats 2-Column Cards */}
        <View style={styles.statsRow}>
          {/* Rank Status Card */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>RANK_STATUS</Text>
            <Text style={styles.rankValue}>LVL 12</Text>
            <View style={styles.progressBarBackground}>
              <View style={styles.progressBarFill} />
            </View>
          </View>

          {/* Net Power Card */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>NET_POWER</Text>
            <View style={styles.xpRow}>
              <Text style={styles.powerValue}>14,250</Text>
              <Text style={styles.xpLabel}> XP</Text>
            </View>
            <Text style={styles.vanguardText}>VANGUARD_CLASS</Text>
          </View>
        </View>

        {/* ASCENDED Card */}
        <View style={styles.ascendedCardContainer}>
          <ImageBackground
            source={require('@/assets/images/ascended_bg.jpg')}
            style={styles.ascendedBg}
            imageStyle={styles.ascendedImgStyle}
          >
            <View style={styles.ascendedOverlay}>
              {/* Header row */}
              <View style={styles.ascendedHeaderRow}>
                <Text style={styles.ascendedTitle}>ASCENDED</Text>
              </View>

              {/* Description */}
              <Text style={styles.ascendedDesc}>
                No pain, No XP. Smash this task, claim your reward, and level up your beast mode.
              </Text>

              {/* Footer row */}
              <View style={styles.ascendedFooterRow}>
                <Text style={styles.ascendedXp}>+1,200 XP</Text>
                <TouchableOpacity style={styles.debriefBtn} onPress={handleDebrief} activeOpacity={0.8}>
                  <Text style={styles.debriefBtnText}>DEBRIEF</Text>
                  <Ionicons name="chevron-forward" size={14} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* COLLECTION_OVERVIEW Section */}
        <View style={styles.collectionSection}>
          <Text style={styles.sectionMonoLabel}>COLLECTION_OVERVIEW</Text>

          <View style={styles.collectionHubCard}>
            <TouchableOpacity
              style={styles.hubHeaderTouch}
              onPress={() => router.push('/(tabs)/achievements')}
            />

            <View style={styles.badgesGrid}>
              {ACHIEVEMENT_DEFINITIONS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.hexagonCard}
                  activeOpacity={0.82}
                  onPress={() => setSelectedAchievement(item)}
                >
                  {/* 3D Metallic Hexagon Badge */}
                  <View style={styles.hexOuterBorder}>
                    <View style={styles.hexInnerBorder}>
                      <View style={styles.emblemContainer}>
                        <View style={styles.emblemGlowRing} />
                        {renderIcon(item.iconName, item.id)}
                      </View>
                      <Text style={styles.badgeTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <View style={styles.badgeStatsRow}>
                        <Text style={styles.levelText}>{item.level}</Text>
                        <View style={styles.verticalDivider} />
                        <Text style={styles.subtierText} numberOfLines={1}>
                          {item.subtier}
                        </Text>
                      </View>
                      <View style={styles.ariseTag}>
                        <Text style={styles.ariseTagText}>HUNTERX</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ACCOUNT DETAILS Section (Redesigned matching reference image) */}
        <View style={styles.accountSection}>
          <Text style={styles.accountTitle}>ACCOUNT DETAILS</Text>

          {ACCOUNT_MENU_ITEMS.map((item, index) => {
            const isSelected = activeAccountItem === item.id;
            const isLast = index === ACCOUNT_MENU_ITEMS.length - 1;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                style={[
                  styles.accountMenuItem,
                  isSelected ? styles.accountMenuItemSelected : !isLast ? styles.accountMenuItemDivider : null,
                ]}
                onPress={() => {
                  setActiveAccountItem(item.id);
                  handleItemPress(item.id);
                }}
              >
                {/* Left Icon */}
                <View style={styles.menuIconWrapper}>
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={isSelected ? '#E5A93C' : item.isDanger ? palette.red : '#A1A1AA'}
                  />
                </View>

                {/* Middle Title & Subtitle */}
                <View style={styles.menuTextGroup}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.menuTitleText, item.isDanger && styles.signOutText]}>
                      {item.title}
                    </Text>
                    {item.badge ? (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>{item.badge}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.menuSubtitleText}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* System Info Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>SYSTEM NOTIFICATION</Text>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalBtnText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Edit Name Modal */}
      <Modal
        visible={editNameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditNameModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setEditNameModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>EDIT HUNTER NAME</Text>
            <TextInput
              style={styles.nameInput}
              value={editNameInput}
              onChangeText={setEditNameInput}
              placeholder="Enter hunter name"
              placeholderTextColor="#71717A"
              autoFocus
            />
            <View style={styles.nameModalActionRow}>
              <TouchableOpacity style={styles.modalBtn} onPress={handleSaveName}>
                <Text style={styles.modalBtnText}>SAVE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#27272A' }]}
                onPress={() => setEditNameModalVisible(false)}
              >
                <Text style={[styles.modalBtnText, { color: '#FFF' }]}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Avatar Picker Modal */}
      <Modal
        visible={avatarPickerModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAvatarPickerModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setAvatarPickerModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>SELECT ANIME HUNTER AVATAR</Text>
            <View style={styles.avatarGrid}>
              {AVATAR_OPTIONS.map((imgSrc, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.avatarOptionRing,
                    getAvatarSource(user?.avatarUrl) === imgSrc && styles.avatarOptionRingSelected,
                  ]}
                  onPress={() => handleSelectAvatar(imgSrc)}
                >
                  <Image source={imgSrc} style={styles.avatarOptionImg} />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: '#27272A', marginTop: 16 }]}
              onPress={() => setAvatarPickerModalVisible(false)}
            >
              <Text style={[styles.modalBtnText, { color: '#FFF' }]}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Level Up Reward Modal */}
      <LevelUpRewardModal
        visible={rewardModalVisible}
        onClose={() => setRewardModalVisible(false)}
        onClaim={() => {
          setRewardModalVisible(false);
          setDailyRewardModalVisible(true);
        }}
      />

      {/* Daily Reward Modal */}
      <DailyRewardModal
        visible={dailyRewardModalVisible}
        onClose={() => setDailyRewardModalVisible(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#050505',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#161618',
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: '#E5A93C',
    letterSpacing: 1.5,
  },
  headerSubTitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 9,
    color: palette.slate500,
    letterSpacing: 1.2,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  /* Avatar Section */
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circularGlowHalo: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(229, 169, 60, 0.04)',
    shadowColor: '#E5A93C',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 36,
    elevation: 8,
    zIndex: 1,
  },
  avatarRingWrapper: {
    shadowColor: '#E5A93C',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 18,
    elevation: 6,
    zIndex: 2,
  },
  avatarHexRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2.5,
    borderColor: '#E5A93C',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E0E10',
    padding: 3,
  },
  avatarImg: {
    width: 94,
    height: 94,
    borderRadius: 47,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  userNameText: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: palette.white,
    letterSpacing: 1,
  },

  /* Avatar Picker Grid */
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    marginVertical: 12,
  },
  avatarOptionRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#27272A',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOptionRingSelected: {
    borderColor: '#E5A93C',
    shadowColor: '#E5A93C',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarOptionImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  /* Stats Row */
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#141416',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 6,
    padding: 14,
    justifyContent: 'space-between',
  },
  statLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: palette.slate300,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  rankValue: {
    fontFamily: fontFamilies.boldItalic,
    fontSize: 18,
    color: palette.white,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: '#27272A',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    width: '65%',
    backgroundColor: '#E5A93C',
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  powerValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: palette.white,
  },
  xpLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#E5A93C',
  },
  vanguardText: {
    fontFamily: fontFamilies.regular,
    fontSize: 9,
    color: palette.slate500,
    letterSpacing: 0.8,
    marginTop: 6,
  },

  /* ASCENDED Card */
  ascendedCardContainer: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C5A059',
    overflow: 'hidden',
    marginBottom: 20,
  },
  ascendedBg: {
    width: '100%',
  },
  ascendedImgStyle: {
    resizeMode: 'cover',
  },
  ascendedOverlay: {
    backgroundColor: 'rgba(5, 5, 5, 0.78)',
    padding: 18,
  },
  ascendedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ascendedTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    color: palette.white,
    letterSpacing: 1.5,
  },
  ascendedDesc: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    color: '#D4D4D8',
    lineHeight: 19,
    marginVertical: 14,
  },
  ascendedFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ascendedXp: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: '#E5A93C',
    letterSpacing: 0.5,
  },
  debriefBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  debriefBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#000000',
    letterSpacing: 1,
  },

  /* Collection Overview */
  collectionSection: {
    marginBottom: 24,
  },
  sectionMonoLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: palette.slate500,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  collectionHubCard: {
    backgroundColor: '#0C0C0F',
    borderWidth: 1.5,
    borderColor: '#27272E',
    borderRadius: 8,
    padding: 12,
  },
  hubHeaderTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 14,
  },
  hubTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: palette.white,
    letterSpacing: 1,
    textAlign: 'center',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  hexagonCard: {
    width: '48%',
  },
  hexOuterBorder: {
    backgroundColor: '#16161C',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#3F3F46',
    padding: 2,
  },
  hexInnerBorder: {
    backgroundColor: '#0E0E12',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272A',
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  emblemContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E1E24',
    borderWidth: 2,
    borderColor: '#71717A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emblemGlowRing: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  badgeTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    color: '#F4F4F5',
    letterSpacing: 0.6,
    textAlign: 'center',
    marginBottom: 6,
  },
  badgeStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#18181B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#27272A',
    marginBottom: 6,
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
    maxWidth: 75,
  },
  ariseTag: {
    borderWidth: 1,
    borderColor: '#52525B',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 2,
    backgroundColor: '#141418',
  },
  ariseTagText: {
    fontFamily: fontFamilies.bold,
    fontSize: 7,
    color: '#A1A1AA',
    letterSpacing: 1,
  },

  /* Account Details (Redesigned matching reference image) */
  accountSection: {
    marginBottom: 20,
  },
  accountTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: palette.white,
    letterSpacing: 2,
    marginBottom: 14,
  },
  accountMenuCard: {
    backgroundColor: '#09090B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E1E22',
    padding: 6,
  },
  accountMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  accountMenuItemSelected: {
    backgroundColor: '#12110D',
    borderWidth: 1.5,
    borderColor: '#E5A93C',
    marginVertical: 2,
    shadowColor: '#E5A93C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  accountMenuItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#18181C',
  },
  menuIconWrapper: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextGroup: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuTitleText: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: palette.white,
    letterSpacing: 0.2,
  },
  menuSubtitleText: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
    lineHeight: 16,
  },
  menuRightIndicator: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBadge: {
    backgroundColor: '#E5A93C',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  newBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 8,
    color: '#000000',
  },
  signOutText: {
    color: palette.red,
  },
  bottomSpacer: {
    height: 40,
  },

  /* Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#141416',
    borderWidth: 1,
    borderColor: '#E5A93C',
    borderRadius: 6,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: '#E5A93C',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  modalText: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: palette.white,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalBtn: {
    backgroundColor: '#E5A93C',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 3,
  },
  modalBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#000',
    letterSpacing: 1,
  },
  nameInput: {
    width: '100%',
    backgroundColor: '#0E0E10',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  nameModalActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
});

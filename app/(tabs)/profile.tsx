import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Screen } from '@/components/common/Screen';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { fontFamilies } from '@/theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface AnimeAvatarItem {
  id: string;
  name: string;
  tag: string;
  rarity: 'LEGENDARY' | 'EPIC' | 'RARE';
  assetKey: string;
  source: any;
}

export interface RecentActivityItem {
  id: string;
  day: number;
  title: string;
  xpReward: string;
  timeLabel: string;
}

const GAMIFIED_ANIME_AVATARS: AnimeAvatarItem[] = [
  {
    id: 'naruto',
    name: 'Naruto Uzumaki',
    tag: 'HIDDEN LEAF NINJA',
    rarity: 'LEGENDARY',
    assetKey: 'char_naruto',
    source: require('@/assets/images/naruto.jpg'),
  },
  {
    id: 'luffy',
    name: 'Monkey D. Luffy',
    tag: 'STRAW HAT CAPTAIN',
    rarity: 'LEGENDARY',
    assetKey: 'char_luffy',
    source: require('@/assets/images/luffy.jpg'),
  },
  {
    id: 'gojo',
    name: 'Satoru Gojo',
    tag: 'SIX EYES SORCERER',
    rarity: 'LEGENDARY',
    assetKey: 'char_gojo',
    source: require('@/assets/images/gojo.jpg'),
  },
  {
    id: 'itachi',
    name: 'Itachi Uchiha',
    tag: 'SHARINGAN MASTER',
    rarity: 'LEGENDARY',
    assetKey: 'char_itachi',
    source: require('@/assets/images/itachi.jpg'),
  },
  {
    id: 'goku',
    name: 'Son Goku',
    tag: 'SUPER SAIYAN WARRIOR',
    rarity: 'LEGENDARY',
    assetKey: 'char_goku',
    source: require('@/assets/images/goku.jpg'),
  },
  {
    id: 'jinwoo',
    name: 'Sung Jin-Woo',
    tag: 'SHADOW MONARCH',
    rarity: 'LEGENDARY',
    assetKey: 'char_jinwoo',
    source: require('@/assets/images/jinwoo.jpg'),
  },
];

const RECENT_ACTIVITIES: RecentActivityItem[] = [
  { id: '1', day: 17, title: 'Wake up early', xpReward: '+10 XP', timeLabel: 'Today' },
  { id: '2', day: 13, title: 'Wake up early', xpReward: '+10 XP', timeLabel: 'Yesterday' },
  { id: '3', day: 13, title: 'Drink water', xpReward: '+10 XP', timeLabel: 'Yesterday' },
  { id: '4', day: 13, title: 'Social media limit', xpReward: '+10 XP', timeLabel: 'Yesterday' },
  { id: '5', day: 12, title: 'Wake up early', xpReward: '+10 XP', timeLabel: '2d ago' },
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS_LIST = Array.from({ length: 81 }, (_, i) => 1950 + i);

export const getAvatarSource = (avatarUrl: string | null | undefined) => {
  if (!avatarUrl || avatarUrl === 'char_naruto' || avatarUrl === 'naruto.jpg') {
    return require('@/assets/images/naruto.jpg');
  }
  if (avatarUrl === 'char_luffy' || avatarUrl === 'luffy.jpg') {
    return require('@/assets/images/luffy.jpg');
  }
  if (avatarUrl === 'char_gojo' || avatarUrl === 'gojo.jpg') {
    return require('@/assets/images/gojo.jpg');
  }
  if (avatarUrl === 'char_itachi' || avatarUrl === 'itachi.jpg') {
    return require('@/assets/images/itachi.jpg');
  }
  if (avatarUrl === 'char_goku' || avatarUrl === 'goku.jpg') {
    return require('@/assets/images/goku.jpg');
  }
  if (avatarUrl === 'char_jinwoo' || avatarUrl === 'jinwoo.jpg') {
    return require('@/assets/images/jinwoo.jpg');
  }
  const found = GAMIFIED_ANIME_AVATARS.find(
    (a) => a.assetKey === avatarUrl || a.id === avatarUrl
  );
  if (found) return found.source;
  if (typeof avatarUrl === 'string' && avatarUrl.startsWith('http')) {
    return { uri: avatarUrl };
  }
  return require('@/assets/images/naruto.jpg');
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const setUser = useAuthStore((state) => state.setUser);

  const userAny = user as any;

  // Modals State
  const [isEditNameModalVisible, setIsEditNameModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(userAny?.name ?? user?.displayName ?? 'Seymen');

  // Full Edit Profile Modal State
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: userAny?.name ?? user?.displayName ?? 'Seymen',
    gender: userAny?.gender ? (userAny.gender === 'MALE' ? 'Male' : userAny.gender === 'FEMALE' ? 'Female' : userAny.gender) : 'Male',
    birthday: userAny?.date_of_birth ? '07/08/02' : '15/08/03',
    units: 'cm/kg',
    height: userAny?.height_cm ? `${userAny.height_cm} cm` : '181 cm',
    weight: userAny?.weight_kg ? `${userAny.weight_kg} kg` : '75.0 kg',
  });

  // Invite Friends Modal State
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const referralCode = userAny?.referral_code ?? '45JLFI17';
  const referralLink = `https://join.hunterx.app/guestpass/${referralCode}`;

  // Calendar Date Picker Modal State
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'DAY' | 'MONTH' | 'YEAR'>('DAY');
  const [pickerDay, setPickerDay] = useState(15);
  const [pickerMonthIndex, setPickerMonthIndex] = useState(7); // August (0-indexed)
  const [pickerYear, setPickerYear] = useState(2003);

  // Avatar Selection Modal State
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  // Recent Activity Modal State
  const [isRecentActivityModalVisible, setIsRecentActivityModalVisible] = useState(false);

  // My Goals Modal State
  const [isGoalsModalVisible, setIsGoalsModalVisible] = useState(false);

  // Rate HunterX Modal State
  const [isRateModalVisible, setIsRateModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [rateFeedbackText, setRateFeedbackText] = useState('');
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);

  // System Settings Modal State
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [questRemindersEnabled, setQuestRemindersEnabled] = useState(true);
  const [streakAlertsEnabled, setStreakAlertsEnabled] = useState(true);
  const [healthSyncEnabled, setHealthSyncEnabled] = useState(true);
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('dark');

  // Generic Menu Modals State
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleSaveName = () => {
    if (!editedName.trim()) return;
    if (user) {
      setUser({ ...user, displayName: editedName.trim() });
    }
    setIsEditNameModalVisible(false);
  };

  const handleSaveProfileForm = () => {
    if (user && profileForm.name.trim()) {
      setUser({ ...user, displayName: profileForm.name.trim() });
    }
    setIsEditProfileModalVisible(false);
    Alert.alert('Profile Saved', 'Your profile details have been updated successfully!');
  };

  const handleConfirmDate = () => {
    const formattedDay = pickerDay < 10 ? `0${pickerDay}` : `${pickerDay}`;
    const monthNum = pickerMonthIndex + 1;
    const formattedMonth = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
    const shortYear = `${pickerYear}`.slice(-2);

    setProfileForm({
      ...profileForm,
      birthday: `${formattedDay}/${formattedMonth}/${shortYear}`,
    });
    setPickerMode('DAY');
    setIsDatePickerVisible(false);
  };

  const handleCopyLink = () => {
    setIsCopied(true);
    Alert.alert('Link Copied!', 'Your unique referral link has been copied to clipboard.');
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleSendInvitation = async () => {
    try {
      await Share.share({
        message: `Claim a free week of HunterX with my Guest Pass! ${referralLink}`,
        url: referralLink,
        title: 'HunterX Guest Pass',
      });
    } catch (error) {
      console.log('Error sharing invitation:', error);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleMenuPress = (key: string) => {
    switch (key) {
      case 'edit_profile':
        setIsEditProfileModalVisible(true);
        break;
      case 'invite':
        setIsInviteModalVisible(true);
        break;
      case 'activity':
        setIsRecentActivityModalVisible(true);
        break;
      case 'goals':
        setIsGoalsModalVisible(true);
        break;
      case 'achievements':
        router.push('/(tabs)/achievements');
        break;
      case 'settings':
        setIsSettingsModalVisible(true);
        break;
      case 'rewards':
        router.push('/rewards');
        break;
      case 'rate_app':
        setIsRateModalVisible(true);
        break;
      case 'send_feedback':
        Linking.openURL('mailto:support@hunterx.com?subject=HunterX%20App%20Feedback');
        break;
      case 'instagram':
        Linking.openURL('https://instagram.com');
        break;
      case 'facebook':
        Linking.openURL('https://facebook.com');
        break;
      case 'x':
        Linking.openURL('https://x.com');
        break;
      case 'signout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const displayName = userAny?.name ?? user?.displayName ?? profileForm.name ?? 'Seymen';
  const level = user?.level ?? 12;

  // Find currently equipped avatar item
  const currentAvatarSource = getAvatarSource(user?.avatarUrl);

  return (
    <Screen style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Hunter Profile</Text>
        </View>

        {/* TOP PROFILE SECTION (NO OUTER CARD BOX) */}
        <View style={styles.profileCard}>
          {/* Character Artwork Background on Right */}
          <Image
            source={require('@/assets/images/profileright.png')}
            style={styles.watermarkBg}
            resizeMode="cover"
          />

          <View style={styles.cardHeader}>
            {/* Avatar Section (Pressable to open Avatar Selector) */}
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={() => setIsAvatarModalVisible(true)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#FF9500', '#F97316', '#EA580C']}
                style={styles.avatarGlowRing}
              >
                <View style={styles.avatarCircleFrame}>
                  <Image
                    source={currentAvatarSource}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                </View>
              </LinearGradient>

              {/* LVL Badge */}
              <View style={styles.levelBadgeContainer}>
                <Text style={styles.levelLabelText}>LVL</Text>
                <Text style={styles.levelNumberText}>{level}</Text>
              </View>
            </TouchableOpacity>

            {/* Profile Info Section */}
            <View style={styles.userInfoContainer}>
              <View style={styles.nameRow}>
                <View style={styles.nameLeftGroup}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {displayName}
                  </Text>
                  <TouchableOpacity
                    style={styles.editIconBtn}
                    onPress={() => setIsEditNameModalVisible(true)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="pencil" size={13} color="#D4D4D8" />
                  </TouchableOpacity>
                </View>

                {/* Invite Icon-Only Button on Right Side Top Straight to Hunter Name */}
                <TouchableOpacity
                  style={styles.inviteIconOnlyBtn}
                  onPress={() => handleMenuPress('invite')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="paper-plane-outline" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Class / Title */}
              <View style={styles.classRow}>
                <MaterialCommunityIcons
                  name="shield-outline"
                  size={14}
                  color="#F97316"
                />
                <Text style={styles.classText}>VANGUARD</Text>
              </View>
            </View>
          </View>

          {/* EXPERIENCE TRACKER SECTION */}
          <View style={styles.xpSection}>
            <View style={styles.xpHeaderRow}>
              <Text style={styles.xpTitleText}>EXPERIENCE TRACKER</Text>
              <Text style={styles.xpPercentText}>97%</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarTrack}>
              <LinearGradient
                colors={['#EA580C', '#F97316', '#FBBF24']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: '97%' }]}
              />
            </View>

            {/* XP Subtext */}
            <Text style={styles.xpSubtext}>
              4,750 XP until <Text style={styles.xpBoldText}>next rank</Text>
            </Text>
          </View>
        </View>

        {/* MAIN MENU OPTIONS CARD */}
        <View style={styles.menuContainer}>
          <MenuItem
            icon="create-outline"
            label="Edit Profile"
            onPress={() => handleMenuPress('edit_profile')}
          />
          <MenuItem
            icon="time-outline"
            label="Your Activity"
            onPress={() => handleMenuPress('activity')}
          />
          <MenuItem
            icon="flag-outline"
            label="My Goals"
            onPress={() => handleMenuPress('goals')}
          />
          <MenuItem
            icon="trophy-outline"
            label="Achievements"
            onPress={() => handleMenuPress('achievements')}
          />
          <MenuItem
            icon="settings-outline"
            label="System Settings"
            onPress={() => handleMenuPress('settings')}
          />
          <MenuItem
            icon="gift-outline"
            label="Rewards"
            onPress={() => handleMenuPress('rewards')}
            isLast
          />
        </View>

        {/* WE LOVE FEEDBACK! SECTION */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>We Love Feedback!</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="star-outline"
              label="Rate HunterX"
              onPress={() => handleMenuPress('rate_app')}
            />
            <MenuItem
              icon="chatbubble-ellipses-outline"
              label="Send Feedback"
              subtitle="What can we improve?"
              onPress={() => handleMenuPress('send_feedback')}
              isLast
            />
          </View>
        </View>

        {/* FOLLOW US SECTION */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Follow Us</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="logo-instagram"
              label="Instagram"
              onPress={() => handleMenuPress('instagram')}
            />
            <MenuItem
              icon="logo-facebook"
              label="Facebook"
              onPress={() => handleMenuPress('facebook')}
            />
            <MenuItem
              icon="close-outline"
              label="X"
              onPress={() => handleMenuPress('x')}
              isLast
            />
          </View>
        </View>

        {/* STANDALONE LOG OUT CARD */}
        <View style={styles.menuContainer}>
          <MenuItem
            icon="exit-outline"
            label="Log Out"
            onPress={() => handleMenuPress('signout')}
            isDestructive
            isLast
          />
        </View>

        {/* FOOTER METADATA SECTION */}
        <View style={styles.footerSection}>
          <Text style={styles.footerHeading}>Made with ❤️ in Tamil Nadu, India</Text>
          <Text style={styles.footerSubheading}>To make the world a healthier place.</Text>

          <View style={styles.footerLinksRow}>
            <TouchableOpacity onPress={() => setActiveModal('Terms of Service')}>
              <Text style={styles.footerLinkText}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.footerDotText}>•</Text>
            <TouchableOpacity onPress={() => setActiveModal('Privacy Policy')}>
              <Text style={styles.footerLinkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.footerDotText}>•</Text>
            <TouchableOpacity onPress={() => setActiveModal('Disclaimer')}>
              <Text style={styles.footerLinkText}>Disclaimer</Text>
            </TouchableOpacity>
            <Text style={styles.footerDotText}>•</Text>
            <TouchableOpacity onPress={() => setActiveModal('Disclaimer (AI)')}>
              <Text style={styles.footerLinkText}>Disclaimer (AI)</Text>
            </TouchableOpacity>
            <Text style={styles.footerDotText}>•</Text>
            <TouchableOpacity onPress={() => setActiveModal('Acknowledgements')}>
              <Text style={styles.footerLinkText}>Acknowledgements</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => Alert.alert('Restore Purchases', 'Your purchases have been synced successfully!')}>
            <Text style={styles.footerRestoreText}>Restore Purchases</Text>
          </TouchableOpacity>

          <Text style={styles.footerVersionText}>Version: 1.130.0 (9548)</Text>
        </View>
      </ScrollView>

      {/* FULL REVAMPED ANIME INVITE FRIENDS MODAL */}
      <Modal
        visible={isInviteModalVisible}
        animationType="slide"
        onRequestClose={() => setIsInviteModalVisible(false)}
      >
        <Screen style={styles.screen}>
          {/* Header Bar */}
          <View style={styles.inviteHeaderBar}>
            <TouchableOpacity
              style={styles.editBackBtn}
              onPress={() => setIsInviteModalVisible(false)}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.inviteHeaderTitle}>Invite Friends</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.inviteScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Main Headline */}
            <View style={styles.inviteHeadlineGroup}>
              <Text style={styles.inviteHeadlineText}>
                Share HunterX Access with Your Friends
              </Text>
              <Text style={styles.inviteSubheadlineText}>
                Unlock legendary workouts & level up together!
              </Text>
            </View>

            {/* REVAMPED ANIME HERO GUEST PASS CARD */}
            <View style={styles.guestPassCardWrapper}>
              <Image
                source={require('@/assets/images/guest_pass_anime.png')}
                style={styles.guestPassAnimeArtBg}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(24, 24, 27, 0.85)', 'rgba(194, 65, 12, 0.75)', 'rgba(249, 115, 22, 0.55)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.guestPassGradientOverlay}
              >
                {/* Top Badge Row */}
                <View style={styles.guestPassTopRow}>
                  <View style={styles.guestPassRarityBadge}>
                    <Ionicons name="sparkles" size={12} color="#FBBF24" />
                    <Text style={styles.guestPassRarityText}>LEGENDARY GUEST PASS</Text>
                  </View>
                </View>

                {/* Card Main Title */}
                <View style={styles.guestPassCenterContent}>
                  <Text style={styles.guestPassMainTitle}>Guest Pass</Text>
                  <Text style={styles.guestPassSubTitle}>ALL-ACCESS HUNTER PASS</Text>
                </View>

                {/* Card Footer Row */}
                <View style={styles.guestPassFooterRow}>
                  <View style={styles.guestPassBrandGroup}>
                    <View style={styles.guestPassIconBadge}>
                      <Text style={styles.guestPassIconText}>⚔️</Text>
                    </View>
                    <Text style={styles.guestPassBrandText}>HunterX.</Text>
                  </View>
                  <View style={styles.guestPassIssuerBadge}>
                    <Text style={styles.guestPassIssuerText}>
                      ISSUED BY {displayName.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Unique Referral Link Section */}
            <View style={styles.referralSectionContainer}>
              <Text style={styles.referralSectionHeader}>Your unique referral link</Text>

              <View style={styles.referralDottedInputBox}>
                <Text style={styles.referralUrlText} numberOfLines={1}>
                  {referralLink}
                </Text>
                <TouchableOpacity
                  style={styles.copyPillBtn}
                  onPress={handleCopyLink}
                  activeOpacity={0.8}
                >
                  <Text style={styles.copyPillText}>{isCopied ? 'Copied!' : 'Copy'}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.referralSubtext}>
                Recipient must be a new HunterX customer
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Send Invitation Action Button */}
          <View style={styles.bottomInviteBtnWrapper}>
            <TouchableOpacity
              style={styles.sendInvitePillBtn}
              onPress={handleSendInvitation}
              activeOpacity={0.85}
            >
              <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
              <Text style={styles.sendInviteBtnText}>Send Invitation</Text>
            </TouchableOpacity>
          </View>
        </Screen>
      </Modal>

      {/* FULL REVAMPED MY GOALS MODAL SCREEN */}
      <Modal
        visible={isGoalsModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={() => setIsGoalsModalVisible(false)}
      >
        <Screen style={styles.screen}>
          {/* Header Bar */}
          <View style={styles.goalsHeaderBar}>
            <TouchableOpacity
              style={styles.editBackBtn}
              onPress={() => setIsGoalsModalVisible(false)}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.goalsHeaderTitle}>My Goals</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.goalsScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* MAIN QUEST HERO CARD */}
            <View style={styles.mainQuestHeroCard}>
              <View style={styles.mainQuestHeaderRow}>
                <View style={styles.mainQuestCrownBadge}>
                  <Text style={styles.mainQuestCrownIcon}>👑</Text>
                  <Text style={styles.mainQuestLabelText}>MAIN QUEST</Text>
                </View>
                <Text style={styles.mainQuestPercentText}>66%</Text>
              </View>

              <Text style={styles.mainQuestTitleText}>Weight Transformation</Text>

              <View style={styles.mainQuestValueRow}>
                <Text style={styles.mainQuestCurrentVal}>75.0 kg</Text>
                <Text style={styles.mainQuestTargetVal}>/ target 70.0 kg</Text>
              </View>

              {/* Progress Bar Track */}
              <View style={styles.mainQuestTrack}>
                <LinearGradient
                  colors={['#EA580C', '#F97316', '#FBBF24']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.mainQuestFill, { width: '66%' }]}
                />
              </View>

              <Text style={styles.mainQuestSubtext}>5.0 kg lost - 5.0 kg to go</Text>
            </View>

            {/* ACTIVE QUESTS SECTION HEADER */}
            <Text style={styles.questsSectionHeader}>ACTIVE QUESTS</Text>

            {/* ACTIVE QUEST CARDS */}
            <View style={styles.activeQuestsContainer}>
              {/* Quest 1: Build Strength */}
              <View style={styles.questItemCard}>
                <View style={styles.questHeaderRow}>
                  <View style={styles.questIconCircle}>
                    <Ionicons name="barbell-outline" size={16} color="#F97316" />
                  </View>
                  <View style={styles.questTitleBlock}>
                    <Text style={styles.questTitle}>Build Strength</Text>
                    <Text style={styles.questSubtitle}>12 / 20 workouts - 60% complete</Text>
                  </View>
                  <Text style={styles.questXpRewardText}>+500 XP</Text>
                </View>
                <View style={styles.questProgressBarTrack}>
                  <View style={[styles.questProgressBarFill, { width: '60%', backgroundColor: '#F97316' }]} />
                </View>
              </View>

              {/* Quest 2: Daily Hydration */}
              <View style={styles.questItemCard}>
                <View style={styles.questHeaderRow}>
                  <View style={styles.questIconCircle}>
                    <Ionicons name="water-outline" size={16} color="#F97316" />
                  </View>
                  <View style={styles.questTitleBlock}>
                    <Text style={styles.questTitle}>Daily Hydration</Text>
                    <Text style={styles.questSubtitle}>3.0 / 3.5 L - 85% complete</Text>
                  </View>
                  <Text style={styles.questXpRewardText}>+120 XP</Text>
                </View>
                <View style={styles.questProgressBarTrack}>
                  <View style={[styles.questProgressBarFill, { width: '85%', backgroundColor: '#F97316' }]} />
                </View>
              </View>

              {/* Quest 3: Quality Sleep */}
              <View style={styles.questItemCard}>
                <View style={styles.questHeaderRow}>
                  <View style={styles.questIconCircle}>
                    <Ionicons name="moon-outline" size={16} color="#F97316" />
                  </View>
                  <View style={styles.questTitleBlock}>
                    <Text style={styles.questTitle}>Quality Sleep</Text>
                    <Text style={styles.questSubtitle}>7.5 / 8.0 hrs - 93% complete</Text>
                  </View>
                  <Text style={styles.questXpRewardText}>+90 XP</Text>
                </View>
                <View style={styles.questProgressBarTrack}>
                  <View style={[styles.questProgressBarFill, { width: '93%', backgroundColor: '#F97316' }]} />
                </View>
              </View>

              {/* Quest 4: Hunter Rank Ascension */}
              <View style={[styles.questItemCard, { opacity: 0.7 }]}>
                <View style={styles.questHeaderRow}>
                  <View style={[styles.questIconCircle, { backgroundColor: '#1A1A1E', borderColor: '#2A2A30' }]}>
                    <Ionicons name="lock-closed-outline" size={15} color="#71717A" />
                  </View>
                  <View style={styles.questTitleBlock}>
                    <Text style={[styles.questTitle, { color: '#A1A1AA' }]}>Hunter Rank Ascension</Text>
                    <Text style={styles.questSubtitle}>Rank 12 / 20 · unlocks at Lv.15</Text>
                  </View>
                  <Text style={[styles.questXpRewardText, { color: '#71717A' }]}>+2000 XP</Text>
                </View>
                <View style={styles.questProgressBarTrack}>
                  <View style={[styles.questProgressBarFill, { width: '30%', backgroundColor: '#3F3F46' }]} />
                </View>
              </View>
            </View>

            {/* DASHED ADD NEW GOAL BUTTON */}
            <TouchableOpacity
              style={styles.dashedAddGoalBtn}
              onPress={() => Alert.alert('Add New Goal', 'Customize your fitness targets!')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color="#F97316" />
              <Text style={styles.dashedAddGoalText}>Add New Goal</Text>
            </TouchableOpacity>

            {/* COMPLETED QUESTS SECTION HEADER */}
            <View style={styles.completedHeaderRow}>
              <Text style={styles.questsSectionHeader}>COMPLETED QUESTS</Text>
              <Text style={styles.completedCountText}>2 total</Text>
            </View>

            {/* COMPLETED QUEST CARDS */}
            <View style={styles.completedQuestsContainer}>
              {/* Completed Item 1 */}
              <View style={styles.completedItemCard}>
                <View style={styles.completedCheckCircle}>
                  <Ionicons name="checkmark" size={14} color="#FBBF24" />
                </View>
                <View style={styles.completedTitleBlock}>
                  <Text style={styles.completedTitle}>10K Steps Streak</Text>
                  <Text style={styles.completedSubtitle}>Completed Aug 3</Text>
                </View>
                <Text style={styles.completedXpText}>+300 XP</Text>
              </View>

              {/* Completed Item 2 */}
              <View style={styles.completedItemCard}>
                <View style={styles.completedCheckCircle}>
                  <Ionicons name="checkmark" size={14} color="#FBBF24" />
                </View>
                <View style={styles.completedTitleBlock}>
                  <Text style={styles.completedTitle}>No Sugar — 14 Days</Text>
                  <Text style={styles.completedSubtitle}>Completed Jul 28</Text>
                </View>
                <Text style={styles.completedXpText}>+450 XP</Text>
              </View>
            </View>
          </ScrollView>
        </Screen>
      </Modal>

      {/* FULL SCREEN YOUR ACTIVITY MODAL (WITH OLD CONTENT & ITEM DESIGN) */}
      <Modal
        visible={isRecentActivityModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={() => setIsRecentActivityModalVisible(false)}
      >
        <Screen style={styles.screen}>
          {/* Header Bar */}
          <View style={styles.goalsHeaderBar}>
            <TouchableOpacity
              style={styles.editBackBtn}
              onPress={() => setIsRecentActivityModalVisible(false)}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.goalsHeaderTitle}>Your Activity</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.goalsScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 2X2 STATS GRID CARD */}
            <View style={styles.activityStatsGridCard}>
              {/* Top Row */}
              <View style={styles.activityGridRow}>
                {/* Cell 1: Member Since */}
                <View style={styles.activityGridCell}>
                  <Text style={styles.activityGridLabel}>MEMBER SINCE</Text>
                  <Text style={styles.activityGridValue}>Aug 2024</Text>
                </View>
                <View style={styles.activityGridVertDivider} />
                {/* Cell 2: Current Streak */}
                <View style={styles.activityGridCell}>
                  <Text style={styles.activityGridLabel}>CURRENT STREAK</Text>
                  <View style={styles.activityStreakRow}>
                    <Text style={styles.activityGridValue}>8</Text>
                    <Text style={styles.activityFlameIcon}>🔥</Text>
                  </View>
                </View>
              </View>

              {/* Horizontal Divider */}
              <View style={styles.activityGridHorizDivider} />

              {/* Bottom Row */}
              <View style={styles.activityGridRow}>
                {/* Cell 3: Tasks Today */}
                <View style={styles.activityGridCell}>
                  <Text style={styles.activityGridLabel}>TASKS TODAY</Text>
                  <Text style={styles.activityGridValue}>3</Text>
                </View>
                <View style={styles.activityGridVertDivider} />
                {/* Cell 4: Season XP */}
                <View style={styles.activityGridCell}>
                  <Text style={styles.activityGridLabel}>SEASON XP</Text>
                  <Text style={styles.activityGridValue}>1,064</Text>
                </View>
              </View>
            </View>

            {/* RECENT LOGS SECTION HEADER */}
            <Text style={styles.questsSectionHeader}>RECENT TASKS</Text>

            {/* RECENT TASKS CONTAINER (OLD ITEM DESIGN) */}
            <View style={styles.recentTasksListContainer}>
              {RECENT_ACTIVITIES.map((item, index) => {
                const isLast = index === RECENT_ACTIVITIES.length - 1;
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.recentTaskItemRow,
                      !isLast && styles.recentTaskItemBorder,
                    ]}
                  >
                    {/* Day Badge */}
                    <View style={styles.recentDayBox}>
                      <Text style={styles.recentDayLabel}>DAY</Text>
                      <Text style={styles.recentDayNumber}>{item.day}</Text>
                    </View>

                    {/* Task Title */}
                    <Text style={styles.recentTaskTitle} numberOfLines={1}>
                      {item.title}
                    </Text>

                    {/* XP Badge & Time */}
                    <View style={styles.recentRightCol}>
                      <View style={styles.recentXpBadge}>
                        <Text style={styles.recentXpText}>{item.xpReward}</Text>
                      </View>
                      <Text style={styles.recentTimeText}>{item.timeLabel}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </Screen>
      </Modal>

      {/* FULL SYSTEM SETTINGS MODAL SCREEN */}
      <Modal
        visible={isSettingsModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={() => setIsSettingsModalVisible(false)}
      >
        <Screen style={styles.screen}>
          {/* Header Bar */}
          <View style={styles.goalsHeaderBar}>
            <TouchableOpacity
              style={styles.editBackBtn}
              onPress={() => setIsSettingsModalVisible(false)}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.goalsHeaderTitle}>System Settings</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.goalsScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* SECTION 1: APPEARANCE & THEME MODE */}
            <Text style={styles.questsSectionHeader}>APPEARANCE & THEME</Text>
            <View style={styles.settingsGroupCard}>
              <View style={styles.themeSelectorRow}>
                {[
                  { mode: 'dark', label: 'Dark Mode', icon: 'moon' },
                  { mode: 'light', label: 'Light Mode', icon: 'sunny' },
                  { mode: 'system', label: 'System', icon: 'hardware-chip' },
                ].map((item) => {
                  const isSelected = themeMode === item.mode;
                  return (
                    <TouchableOpacity
                      key={item.mode}
                      style={[
                        styles.themeModeCard,
                        isSelected && styles.themeModeCardSelected,
                      ]}
                      onPress={() => setThemeMode(item.mode as any)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={isSelected ? '#F97316' : '#A1A1AA'}
                      />
                      <Text
                        style={[
                          styles.themeModeText,
                          isSelected && styles.themeModeTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* SECTION 2: AUDIO & HAPTIC FEEDBACK */}
            <Text style={styles.questsSectionHeader}>AUDIO & HAPTICS</Text>
            <View style={styles.settingsGroupCard}>
              {/* Setting Item 1 */}
              <View style={styles.settingRow}>
                <View style={styles.settingLeftGroup}>
                  <View style={styles.settingIconBox}>
                    <Ionicons name="volume-high" size={18} color="#F97316" />
                  </View>
                  <View style={styles.settingTextGroup}>
                    <Text style={styles.settingTitle}>Sound Effects</Text>
                    <Text style={styles.settingSubtitle}>Quest completion chimes & level up audio</Text>
                  </View>
                </View>
                <Switch
                  value={soundEffectsEnabled}
                  onValueChange={setSoundEffectsEnabled}
                  trackColor={{ false: '#27272A', true: '#EA580C' }}
                  thumbColor={soundEffectsEnabled ? '#FFFFFF' : '#A1A1AA'}
                />
              </View>

              <View style={styles.settingItemDivider} />

              {/* Setting Item 2 */}
              <View style={styles.settingRow}>
                <View style={styles.settingLeftGroup}>
                  <View style={styles.settingIconBox}>
                    <Ionicons name="phone-portrait" size={18} color="#F97316" />
                  </View>
                  <View style={styles.settingTextGroup}>
                    <Text style={styles.settingTitle}>Haptic Feedback</Text>
                    <Text style={styles.settingSubtitle}>Tactile vibration on task completion</Text>
                  </View>
                </View>
                <Switch
                  value={hapticsEnabled}
                  onValueChange={setHapticsEnabled}
                  trackColor={{ false: '#27272A', true: '#EA580C' }}
                  thumbColor={hapticsEnabled ? '#FFFFFF' : '#A1A1AA'}
                />
              </View>
            </View>

            {/* SECTION 3: HUNTER NOTIFICATIONS */}
            <Text style={styles.questsSectionHeader}>HUNTER NOTIFICATIONS</Text>
            <View style={styles.settingsGroupCard}>
              {/* Setting Item 3 */}
              <View style={styles.settingRow}>
                <View style={styles.settingLeftGroup}>
                  <View style={styles.settingIconBox}>
                    <Ionicons name="notifications" size={18} color="#F97316" />
                  </View>
                  <View style={styles.settingTextGroup}>
                    <Text style={styles.settingTitle}>Daily Quest Reminders</Text>
                    <Text style={styles.settingSubtitle}>Morning & evening training notifications</Text>
                  </View>
                </View>
                <Switch
                  value={questRemindersEnabled}
                  onValueChange={setQuestRemindersEnabled}
                  trackColor={{ false: '#27272A', true: '#EA580C' }}
                  thumbColor={questRemindersEnabled ? '#FFFFFF' : '#A1A1AA'}
                />
              </View>

              <View style={styles.settingItemDivider} />

              {/* Setting Item 4 */}
              <View style={styles.settingRow}>
                <View style={styles.settingLeftGroup}>
                  <View style={styles.settingIconBox}>
                    <Ionicons name="flame" size={18} color="#F97316" />
                  </View>
                  <View style={styles.settingTextGroup}>
                    <Text style={styles.settingTitle}>Streak Preservation Alert</Text>
                    <Text style={styles.settingSubtitle}>Warning alert before active day streak breaks</Text>
                  </View>
                </View>
                <Switch
                  value={streakAlertsEnabled}
                  onValueChange={setStreakAlertsEnabled}
                  trackColor={{ false: '#27272A', true: '#EA580C' }}
                  thumbColor={streakAlertsEnabled ? '#FFFFFF' : '#A1A1AA'}
                />
              </View>
            </View>

            {/* SECTION 4: HEALTH INTEGRATIONS */}
            <Text style={styles.questsSectionHeader}>HEALTH INTEGRATIONS</Text>
            <View style={styles.settingsGroupCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeftGroup}>
                  <View style={styles.settingIconBox}>
                    <Ionicons name="fitness" size={18} color="#F97316" />
                  </View>
                  <View style={styles.settingTextGroup}>
                    <Text style={styles.settingTitle}>Google Fit / Health Sync</Text>
                    <Text style={styles.settingSubtitle}>Auto-sync daily steps & workout calories</Text>
                  </View>
                </View>
                <Switch
                  value={healthSyncEnabled}
                  onValueChange={setHealthSyncEnabled}
                  trackColor={{ false: '#27272A', true: '#EA580C' }}
                  thumbColor={healthSyncEnabled ? '#FFFFFF' : '#A1A1AA'}
                />
              </View>
            </View>
          </ScrollView>
        </Screen>
      </Modal>



      {/* FULL RATE HUNTERX MODAL SCREEN */}
      <Modal
        visible={isRateModalVisible}
        animationType="slide"
        onRequestClose={() => setIsRateModalVisible(false)}
      >
        <Screen style={styles.screen}>
          <ScrollView
            contentContainerStyle={styles.rateScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Anime Banner Header */}
            <View style={styles.rateBannerWrapper}>
              <Image
                source={require('@/assets/images/rate_hunterx_bg.png')}
                style={styles.rateBannerBg}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(12,12,14,0.4)', '#0C0C0E']}
                locations={[0, 0.6, 1.0]}
                style={styles.rateBannerGradientOverlay}
              >
                {/* Top Left Back Button */}
                <TouchableOpacity
                  style={styles.editBackBtn}
                  onPress={() => setIsRateModalVisible(false)}
                >
                  <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Rate Branding Titles */}
                <View style={styles.rateBrandingBlock}>
                  <Text style={styles.rateTitleTag}>RATE</Text>
                  <Text style={styles.rateMainBrandTitle}>
                    HUNTER<Text style={{ color: '#F97316' }}>X</Text>
                  </Text>
                  <Text style={styles.rateSubBrandTitle}>—— ARISE HUNTER ——</Text>
                </View>
              </LinearGradient>
            </View>

            {/* Interactive Rating Card */}
            <View style={styles.rateCardContainer}>
              {/* Emblem Overlap Badge */}
              <View style={styles.rateEmblemCircle}>
                <Ionicons name="shield-checkmark" size={20} color="#F97316" />
              </View>

              <Text style={styles.rateQuestionTitle}>
                How's it <Text style={styles.rateQuestionHighlight}>going so far?</Text>
              </Text>

              <Text style={styles.rateQuestionSubtext}>
                Honest stars help us build what matters.{'\n'}
                <Text style={{ color: '#F97316', fontWeight: '800' }}>4+</Text> takes you to the App Store.
              </Text>

              {/* 5 Interactive Stars */}
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((starNum) => {
                  const isSelected = selectedRating >= starNum;
                  return (
                    <TouchableOpacity
                      key={starNum}
                      style={[
                        styles.starBox,
                        isSelected && styles.starBoxSelected,
                      ]}
                      onPress={() => {
                        setSelectedRating(starNum);
                        setIsRatingSubmitted(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={isSelected ? 'star' : 'star-outline'}
                        size={26}
                        color={isSelected ? '#F97316' : '#F97316'}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Feedback / Submit Section */}
              {selectedRating > 0 && (
                <View style={styles.rateActionSection}>
                  {selectedRating >= 4 ? (
                    <TouchableOpacity
                      style={styles.rateSubmitPillBtn}
                      onPress={() => {
                        setIsRatingSubmitted(true);
                        Linking.openURL('https://play.google.com/store/apps/details?id=com.hunterx.app').catch(() => { });
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.rateSubmitPillText}>Rate 5 Stars on App Store ✨</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.feedbackInputBlock}>
                      <TextInput
                        style={styles.rateTextInput}
                        placeholder="Tell us what we can improve..."
                        placeholderTextColor="#71717A"
                        value={rateFeedbackText}
                        onChangeText={setRateFeedbackText}
                        multiline
                      />
                      <TouchableOpacity
                        style={styles.rateSubmitPillBtn}
                        onPress={() => {
                          setIsRatingSubmitted(true);
                          Alert.alert('Thank You!', 'Your feedback has been received to help us improve HunterX!');
                        }}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.rateSubmitPillText}>Submit Feedback</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Footer Bottom Ornament Text */}
            <View style={styles.rateFooterOrnamentRow}>
              <Text style={styles.rateFooterOrnamentText}>——  THANK YOU, HUNTER!  ——</Text>
            </View>
          </ScrollView>
        </Screen>
      </Modal>

      {/* FULL EDIT PROFILE MODAL */}
      <Modal
        visible={isEditProfileModalVisible}
        animationType="slide"
        onRequestClose={() => setIsEditProfileModalVisible(false)}
      >
        <Screen style={styles.screen}>
          {/* Header Bar */}
          <View style={styles.editProfileHeaderBar}>
            <TouchableOpacity
              style={styles.editBackBtn}
              onPress={() => setIsEditProfileModalVisible(false)}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.editProfileTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSaveProfileForm}>
              <Text style={styles.saveActionText}>SAVE</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.editProfileContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Avatar Header */}
            <View style={styles.editAvatarCenterSection}>
              <TouchableOpacity
                style={styles.editAvatarCircleWrapper}
                onPress={() => {
                  setIsEditProfileModalVisible(false);
                  setIsAvatarModalVisible(true);
                }}
                activeOpacity={0.85}
              >
                <View style={styles.editAvatarCircleFrame}>
                  <Image
                    source={currentAvatarSource}
                    style={styles.editAvatarImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.editPencilBadge}>
                  <Ionicons name="pencil" size={12} color="#000000" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Form Fields Card */}
            <View style={styles.formCardContainer}>
              <View style={styles.formItemRow}>
                <Text style={styles.formItemLabel}>Name</Text>
                <TextInput
                  style={styles.formItemInput}
                  value={profileForm.name}
                  onChangeText={(val) => setProfileForm({ ...profileForm, name: val })}
                  placeholderTextColor="#71717A"
                />
              </View>

              <View style={styles.formItemRow}>
                <Text style={styles.formItemLabel}>Gender</Text>
                <TextInput
                  style={styles.formItemInput}
                  value={profileForm.gender}
                  onChangeText={(val) => setProfileForm({ ...profileForm, gender: val })}
                  placeholderTextColor="#71717A"
                />
              </View>

              {/* Birthday Row with Calendar Picker Trigger */}
              <TouchableOpacity
                style={styles.formItemRow}
                onPress={() => setIsDatePickerVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.formItemLabel}>Birthday</Text>
                <View style={styles.datePickerTriggerRow}>
                  <Ionicons name="calendar-outline" size={16} color="#F97316" />
                  <Text style={styles.datePickerTriggerText}>{profileForm.birthday}</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.formItemRow}>
                <Text style={styles.formItemLabel}>Units</Text>
                <TextInput
                  style={styles.formItemInput}
                  value={profileForm.units}
                  onChangeText={(val) => setProfileForm({ ...profileForm, units: val })}
                  placeholderTextColor="#71717A"
                />
              </View>

              <View style={styles.formItemRow}>
                <Text style={styles.formItemLabel}>Height</Text>
                <TextInput
                  style={styles.formItemInput}
                  value={profileForm.height}
                  onChangeText={(val) => setProfileForm({ ...profileForm, height: val })}
                  placeholderTextColor="#71717A"
                />
              </View>

              <View style={[styles.formItemRow, styles.noBorderRow]}>
                <Text style={styles.formItemLabel}>Weight</Text>
                <TextInput
                  style={styles.formItemInput}
                  value={profileForm.weight}
                  onChangeText={(val) => setProfileForm({ ...profileForm, weight: val })}
                  placeholderTextColor="#71717A"
                />
              </View>
            </View>

            {/* Email & Google Account Footer */}
            <View style={styles.accountEmailRow}>
              <Text style={styles.accountEmailText}>{user?.email ?? 's8668072255@gmail.com'}</Text>
              <Ionicons name="logo-google" size={16} color="#A1A1AA" />
            </View>

            <TouchableOpacity
              style={styles.deleteAccountContainer}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteAccountText}>Delete Account</Text>
            </TouchableOpacity>
          </ScrollView>
        </Screen>
      </Modal>

      {/* CALENDAR DATE PICKER MODAL */}
      <Modal
        visible={isDatePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setPickerMode('DAY');
          setIsDatePickerVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarCard}>
            {/* Header Title */}
            <Text style={styles.calendarTitle}>
              {pickerMode === 'DAY'
                ? 'SELECT BIRTHDAY'
                : pickerMode === 'MONTH'
                  ? 'SELECT MONTH'
                  : 'SELECT YEAR'}
            </Text>

            {/* Navigation Header Row */}
            {pickerMode === 'DAY' ? (
              <View style={styles.calendarHeaderRow}>
                <TouchableOpacity
                  onPress={() => {
                    if (pickerMonthIndex === 0) {
                      setPickerMonthIndex(11);
                      setPickerYear(pickerYear - 1);
                    } else {
                      setPickerMonthIndex(pickerMonthIndex - 1);
                    }
                  }}
                  style={styles.calNavBtn}
                >
                  <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Clickable Month & Year Headers */}
                <View style={styles.calMonthYearClickableGroup}>
                  <TouchableOpacity
                    onPress={() => setPickerMode('MONTH')}
                    style={styles.calPillBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.calMonthYearText}>
                      {MONTH_NAMES[pickerMonthIndex]}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPickerMode('YEAR')}
                    style={styles.calPillBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.calMonthYearText}>{pickerYear}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    if (pickerMonthIndex === 11) {
                      setPickerMonthIndex(0);
                      setPickerYear(pickerYear + 1);
                    } else {
                      setPickerMonthIndex(pickerMonthIndex + 1);
                    }
                  }}
                  style={styles.calNavBtn}
                >
                  <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.calBackToDayBtn}
                onPress={() => setPickerMode('DAY')}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={16} color="#F97316" />
                <Text style={styles.calBackToDayText}>
                  Back to {MONTH_NAMES[pickerMonthIndex]} {pickerYear}
                </Text>
              </TouchableOpacity>
            )}

            {/* DAY VIEW */}
            {pickerMode === 'DAY' && (
              <View style={styles.daysGrid}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                  const isSelected = d === pickerDay;
                  return (
                    <TouchableOpacity
                      key={d}
                      style={[
                        styles.dayCell,
                        isSelected && styles.selectedDayCell,
                      ]}
                      onPress={() => setPickerDay(d)}
                    >
                      <Text
                        style={[
                          styles.dayCellText,
                          isSelected && styles.selectedDayCellText,
                        ]}
                      >
                        {d}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* MONTH VIEW */}
            {pickerMode === 'MONTH' && (
              <View style={styles.monthsGrid}>
                {MONTH_NAMES.map((mName, idx) => {
                  const isSelected = idx === pickerMonthIndex;
                  return (
                    <TouchableOpacity
                      key={mName}
                      style={[
                        styles.monthCell,
                        isSelected && styles.selectedMonthCell,
                      ]}
                      onPress={() => {
                        setPickerMonthIndex(idx);
                        setPickerMode('DAY');
                      }}
                    >
                      <Text
                        style={[
                          styles.monthCellText,
                          isSelected && styles.selectedMonthCellText,
                        ]}
                      >
                        {mName.slice(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* YEAR VIEW */}
            {pickerMode === 'YEAR' && (
              <ScrollView
                style={styles.yearsScrollContainer}
                contentContainerStyle={styles.yearsGrid}
                showsVerticalScrollIndicator={false}
              >
                {YEARS_LIST.map((y) => {
                  const isSelected = y === pickerYear;
                  return (
                    <TouchableOpacity
                      key={y}
                      style={[
                        styles.yearCell,
                        isSelected && styles.selectedYearCell,
                      ]}
                      onPress={() => {
                        setPickerYear(y);
                        setPickerMode('DAY');
                      }}
                    >
                      <Text
                        style={[
                          styles.yearCellText,
                          isSelected && styles.selectedYearCellText,
                        ]}
                      >
                        {y}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* Action Row */}
            <View style={styles.calendarActionRow}>
              <TouchableOpacity
                style={[styles.calBtn, styles.calCancelBtn]}
                onPress={() => {
                  setPickerMode('DAY');
                  setIsDatePickerVisible(false);
                }}
              >
                <Text style={styles.calCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.calBtn, styles.calConfirmBtn]}
                onPress={handleConfirmDate}
              >
                <Text style={styles.calConfirmText}>SET DATE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>



      {/* EXACT GAMIFIED ANIME AVATAR SELECTION MODAL */}
      <Modal
        visible={isAvatarModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAvatarModalVisible(false)}
      >
        <View style={styles.avatarModalOverlay}>
          <View style={styles.avatarModalCard}>
            {/* Modal Title */}
            <Text style={styles.avatarModalTitle}>SELECT ANIME HUNTER AVATAR</Text>

            {/* Horizontal Circular Avatar List */}
            <View style={styles.avatarCarouselWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.avatarCarouselContent}
              >
                {GAMIFIED_ANIME_AVATARS.map((item) => {
                  const isSelected = user?.avatarUrl
                    ? user.avatarUrl === item.assetKey || user.avatarUrl === item.id
                    : item.id === 'naruto';

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.circularAvatarWrapper,
                        isSelected
                          ? styles.circularAvatarSelected
                          : styles.circularAvatarUnselected,
                      ]}
                      onPress={() => {
                        if (user) {
                          setUser({ ...user, avatarUrl: item.assetKey });
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.circularAvatarFrame}>
                        <Image
                          source={item.source}
                          style={styles.circularAvatarImage}
                          resizeMode="cover"
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.cancelActionBtn}
              onPress={() => setIsAvatarModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelActionText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* EDIT NAME MODAL */}
      <Modal
        visible={isEditNameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditNameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Display Name</Text>
            <TextInput
              style={styles.modalInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter your hunter name"
              placeholderTextColor="#71717A"
              autoFocus
            />
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setIsEditNameModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleSaveName}
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* GENERIC DETAILS MODAL */}
      <Modal
        visible={!!activeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{activeModal}</Text>
            <Text style={styles.modalBodyText}>
              Feature active and synced with system records.
            </Text>
            <TouchableOpacity
              style={styles.centeredCloseBtn}
              onPress={() => setActiveModal(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.centeredCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

// Menu Item Component
interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  onPress: () => void;
  isDestructive?: boolean;
  isLast?: boolean;
}

function MenuItem({
  icon,
  label,
  subtitle,
  onPress,
  isDestructive,
  isLast,
}: MenuItemProps) {
  const iconColor = isDestructive ? '#EF4444' : '#E4E4E7';
  const textColor = isDestructive ? '#EF4444' : '#F4F4F5';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemPressed,
        !isLast && styles.menuItemBorder,
      ]}
      onPress={onPress}
    >
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={22} color={iconColor} />
        <View style={styles.menuTextGroup}>
          <Text style={[styles.menuLabel, { color: textColor }]}>{label}</Text>
          {!!subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={isDestructive ? '#EF4444' : '#71717A'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  container: {
    padding: 16,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  topRightInviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E1E24',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  topRightInviteBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* TOP PROFILE SECTION (NO OUTER CARD BOX) */
  profileCard: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    position: 'relative',
  },
  watermarkBg: {
    position: 'absolute',
    right: -10,
    top: 0,
    bottom: 0,
    width: '55%',
    height: '100%',
    opacity: 0.4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* Avatar & Glow */
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGlowRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    padding: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircleFrame: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: '#16161A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    resizeMode: 'cover',
  },
  levelBadgeContainer: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    backgroundColor: '#0C0C0E',
    borderWidth: 1.5,
    borderColor: '#F97316',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 38,
  },
  levelLabelText: {
    fontFamily: fontFamilies.bold,
    fontSize: 8,
    fontWeight: '900',
    color: '#F97316',
    letterSpacing: 0.5,
    lineHeight: 10,
  },
  levelNumberText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 15,
  },

  /* User Info */
  userInfoContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nameLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  userName: {
    fontFamily: fontFamilies.bold,
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  editIconBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#222226',
    borderWidth: 1,
    borderColor: '#3F3F46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  classText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    fontWeight: '800',
    color: '#F97316',
    letterSpacing: 1.1,
  },
  inviteIconOnlyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E1E24',
    borderWidth: 1,
    borderColor: '#3F3F46',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Experience Tracker */
  xpSection: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  xpHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpTitleText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    fontWeight: '800',
    color: '#A1A1AA',
    letterSpacing: 1,
  },
  xpPercentText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    fontWeight: '900',
    color: '#F97316',
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: '#222226',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  xpSubtext: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    fontWeight: '500',
    color: '#A1A1AA',
  },
  xpBoldText: {
    fontFamily: fontFamilies.bold,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* SECTION CONTAINERS */
  sectionContainer: {
    gap: 6,
  },
  sectionHeaderTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    fontWeight: '700',
    color: '#A1A1AA',
    marginLeft: 4,
  },

  /* MENU CONTAINERS & ITEMS */
  menuContainer: {
    backgroundColor: '#121215',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#242428',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemPressed: {
    backgroundColor: '#1A1A1F',
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  menuTextGroup: {
    flex: 1,
  },
  menuLabel: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 16,
    fontWeight: '600',
  },
  menuSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
  },

  /* INVITE FRIENDS MODAL STYLES */
  inviteHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#242428',
  },
  inviteHeaderTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* MY GOALS MODAL STYLES (MATCHING REFERENCE SAMPLE) */
  goalsHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#242428',
  },
  goalsHeaderTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  goalsScrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 60,
  },
  mainQuestHeroCard: {
    backgroundColor: '#121215',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.35)',
    padding: 18,
    gap: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  mainQuestHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  /* SYSTEM SETTINGS STYLES */
  settingsGroupCard: {
    width: '100%',
    backgroundColor: '#121215',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#242428',
    padding: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  settingLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTextGroup: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  settingSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#71717A',
    marginTop: 2,
  },
  settingItemDivider: {
    height: 1,
    backgroundColor: '#242428',
    marginVertical: 10,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeModeCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#18181C',
    borderWidth: 1.5,
    borderColor: '#2A2A30',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  themeModeCardSelected: {
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    borderColor: '#F97316',
  },
  themeModeText: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: '#A1A1AA',
  },
  themeModeTextSelected: {
    fontFamily: fontFamilies.bold,
    color: '#F97316',
    fontWeight: '800',
  },



  mainQuestCrownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mainQuestCrownIcon: {
    fontSize: 14,
  },
  mainQuestLabelText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    fontWeight: '800',
    color: '#F97316',
    letterSpacing: 1,
  },
  mainQuestPercentText: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    fontWeight: '900',
    color: '#F97316',
  },
  mainQuestTitleText: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  mainQuestValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  mainQuestCurrentVal: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  mainQuestTargetVal: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#71717A',
  },
  mainQuestTrack: {
    height: 6,
    backgroundColor: '#222226',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  mainQuestFill: {
    height: '100%',
    borderRadius: 3,
  },
  mainQuestSubtext: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: '#A1A1AA',
    marginTop: 2,
  },
  questsSectionHeader: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    fontWeight: '800',
    color: '#71717A',
    letterSpacing: 1,
    marginTop: 4,
    marginLeft: 2,
  },
  activeQuestsContainer: {
    gap: 10,
  },
  questItemCard: {
    backgroundColor: '#121215',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#242428',
    padding: 14,
    gap: 10,
  },
  questHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  questIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1C1C22',
    borderWidth: 1,
    borderColor: '#2E2E36',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questTitleBlock: {
    flex: 1,
  },
  questTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  questSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#A1A1AA',
    marginTop: 2,
  },
  questXpRewardText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    fontWeight: '800',
    color: '#F97316',
  },
  questProgressBarTrack: {
    height: 5,
    backgroundColor: '#1C1C22',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  questProgressBarFill: {
    height: '100%',
    borderRadius: 2.5,
  },

  /* 2X2 STATS GRID CARD STYLES */
  activityStatsGridCard: {
    width: '100%',
    backgroundColor: '#121215',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#242428',
    overflow: 'hidden',
    marginBottom: 8,
  },
  activityGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityGridCell: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 6,
  },
  activityGridVertDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#242428',
  },
  activityGridHorizDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#242428',
  },
  activityGridLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    fontWeight: '800',
    color: '#A1A1AA',
    letterSpacing: 1.2,
  },
  activityGridValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  activityStreakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activityFlameIcon: {
    fontSize: 20,
  },

  /* RECENT ACTIVITY MODAL STYLES (ORIGINAL DESIGN) */
  recentActivityCard: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#121215',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#242428',
    padding: 20,
    gap: 16,
  },
  recentActivityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentActivityHeaderLeft: {
    gap: 2,
  },
  recentActivityTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  recentActivitySubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#71717A',
  },
  recentTasksListContainer: {
    backgroundColor: '#18181C',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#27272A',
    overflow: 'hidden',
  },
  recentTaskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  recentTaskItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  recentDayBox: {
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 38,
  },
  recentDayLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 8,
    fontWeight: '900',
    color: '#F97316',
    lineHeight: 9,
  },
  recentDayNumber: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 15,
  },
  recentTaskTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  recentRightCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  recentXpBadge: {
    backgroundColor: '#27272A',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  recentXpText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    fontWeight: '800',
    color: '#FBBF24',
  },
  recentTimeText: {
    fontFamily: fontFamilies.regular,
    fontSize: 10,
    color: '#71717A',
  },

  dashedAddGoalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#121215',
    borderWidth: 1.5,
    borderColor: '#F97316',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 6,
  },
  dashedAddGoalText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '800',
    color: '#F97316',
  },
  completedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginHorizontal: 2,
  },
  completedCountText: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: '#71717A',
  },
  completedQuestsContainer: {
    gap: 10,
  },
  completedItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121215',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#242428',
    padding: 14,
    gap: 12,
  },
  completedCheckCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedTitleBlock: {
    flex: 1,
  },
  completedTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  completedSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#71717A',
    marginTop: 2,
  },
  completedXpText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    fontWeight: '800',
    color: '#FBBF24',
  },

  /* RATE HUNTERX MODAL STYLES (MATCHING REFERENCE SAMPLE) */
  rateScrollContent: {
    paddingBottom: 60,
    alignItems: 'center',
  },
  rateBannerWrapper: {
    width: '100%',
    height: 380,
    position: 'relative',
  },
  rateBannerBg: {
    width: '100%',
    height: '100%',
  },
  rateBannerGradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: 20,
    justifyContent: 'space-between',
  },
  rateBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(18, 18, 21, 0.85)',
    borderWidth: 1,
    borderColor: '#242428',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateBrandingBlock: {
    marginBottom: 20,
  },
  rateTitleTag: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '800',
    color: '#A1A1AA',
    letterSpacing: 2,
  },
  rateMainBrandTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginTop: -2,
  },
  rateSubBrandTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    fontWeight: '800',
    color: '#F97316',
    letterSpacing: 2.5,
    marginTop: 4,
  },
  rateCardContainer: {
    width: '90%',
    backgroundColor: '#121215',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#242428',
    padding: 24,
    alignItems: 'center',
    marginTop: -40,
    position: 'relative',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  rateEmblemCircle: {
    position: 'absolute',
    top: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1C1C22',
    borderWidth: 1.5,
    borderColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateQuestionTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 14,
  },
  rateQuestionHighlight: {
    color: '#F97316',
  },
  rateQuestionSubtext: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    width: '100%',
  },
  starBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#1A1A1F',
    borderWidth: 1.5,
    borderColor: '#3F3F46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starBoxSelected: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: '#F97316',
  },
  rateActionSection: {
    width: '100%',
    marginTop: 20,
  },
  rateSubmitPillBtn: {
    width: '100%',
    backgroundColor: '#F97316',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateSubmitPillText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  feedbackInputBlock: {
    width: '100%',
    gap: 12,
  },
  rateTextInput: {
    width: '100%',
    backgroundColor: '#16161C',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#3F3F46',
    padding: 12,
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    color: '#FFFFFF',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  rateFooterOrnamentRow: {
    marginTop: 40,
    alignItems: 'center',
  },
  rateFooterOrnamentText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    fontWeight: '800',
    color: '#F97316',
    letterSpacing: 2,
    opacity: 0.6,
  },
  rewardTopBadge: {
    backgroundColor: '#1E1B4B',
    borderWidth: 1,
    borderColor: '#6366F1',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rewardTopBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    fontWeight: '800',
    color: '#A5B4FC',
  },
  inviteScrollContent: {
    padding: 20,
    alignItems: 'center',
    gap: 20,
    paddingBottom: 110,
  },
  inviteHeadlineGroup: {
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  inviteHeadlineText: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 12,
  },
  inviteSubheadlineText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },

  /* REVAMPED ANIME HERO GUEST PASS CARD STYLES */
  guestPassCardWrapper: {
    width: '100%',
    height: 210,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#F97316',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  guestPassAnimeArtBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  guestPassGradientOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  guestPassTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestPassRarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: '#FBBF24',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  guestPassRarityText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: 0.8,
  },
  guestPassValBadge: {
    backgroundColor: '#F97316',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  guestPassValText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  guestPassCenterContent: {
    marginVertical: 4,
  },
  guestPassMainTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  guestPassSubTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    fontWeight: '800',
    color: '#FDBA74',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  guestPassFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestPassBrandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guestPassIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F97316',
  },
  guestPassIconText: {
    fontSize: 13,
  },
  guestPassBrandText: {
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  guestPassIssuerBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  guestPassIssuerText: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    fontWeight: '800',
    color: '#E2E8F0',
    letterSpacing: 0.5,
  },

  /* REWARD BANNER STYLES */
  rewardBannerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#18181C',
    borderWidth: 1,
    borderColor: '#F97316',
    borderRadius: 16,
    padding: 14,
  },
  rewardIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardTextGroup: {
    flex: 1,
  },
  rewardTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    fontWeight: '800',
    color: '#F97316',
    letterSpacing: 0.3,
  },
  rewardSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#D4D4D8',
    marginTop: 2,
    lineHeight: 16,
  },
  rewardHighlight: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  referralSectionContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  referralSectionHeader: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  referralDottedInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#16161C',
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#3F3F46',
    borderStyle: 'dashed',
    paddingVertical: 8,
    paddingLeft: 18,
    paddingRight: 8,
  },
  referralUrlText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#A1A1AA',
    flex: 1,
    marginRight: 10,
  },
  copyPillBtn: {
    backgroundColor: '#E4E4E7',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  copyPillText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '800',
    color: '#09090B',
  },
  referralSubtext: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#71717A',
    textAlign: 'center',
  },
  bottomInviteBtnWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  sendInvitePillBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  sendInviteBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 0.3,
  },

  /* EDIT PROFILE MODAL STYLES */
  editProfileHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#242428',
  },
  editBackBtn: {
    padding: 4,
  },
  editProfileTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  saveActionText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '800',
    color: '#F97316',
    letterSpacing: 0.5,
  },
  editProfileContainer: {
    padding: 16,
    gap: 20,
    paddingBottom: 40,
  },
  editAvatarCenterSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  editAvatarCircleWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarCircleFrame: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    resizeMode: 'cover',
  },
  editPencilBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  formCardContainer: {
    backgroundColor: '#16161C',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2B2B34',
    overflow: 'hidden',
  },
  formItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  noBorderRow: {
    borderBottomWidth: 0,
  },
  formItemLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  formItemInput: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    fontWeight: '500',
    color: '#A1A1AA',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  datePickerTriggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  datePickerTriggerText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
  },
  accountEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  accountEmailText: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    fontWeight: '500',
    color: '#A1A1AA',
  },
  deleteAccountContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  deleteAccountText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 14,
    fontWeight: '600',
    color: '#A1A1AA',
    textDecorationLine: 'underline',
  },

  /* CALENDAR PICKER MODAL STYLES */
  calendarCard: {
    width: '100%',
    backgroundColor: '#16161C',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#F97316',
    padding: 20,
    alignItems: 'center',
  },
  calendarTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    fontWeight: '800',
    color: '#F97316',
    letterSpacing: 1,
    marginBottom: 16,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  calNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calMonthYearClickableGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calPillBtn: {
    backgroundColor: '#24242B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  calMonthYearText: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  calBackToDayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#222228',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  calBackToDayText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    fontWeight: '700',
    color: '#F97316',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 6,
    width: '100%',
    marginBottom: 20,
  },
  dayCell: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#222226',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayCell: {
    backgroundColor: '#F97316',
  },
  dayCellText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 13,
    fontWeight: '600',
    color: '#D4D4D8',
  },
  selectedDayCellText: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  /* MONTHS GRID */
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    marginBottom: 20,
  },
  monthCell: {
    width: '28%',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#222226',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMonthCell: {
    backgroundColor: '#F97316',
  },
  monthCellText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '700',
    color: '#D4D4D8',
  },
  selectedMonthCellText: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  /* YEARS SCROLL GRID */
  yearsScrollContainer: {
    maxHeight: 220,
    width: '100%',
    marginBottom: 20,
  },
  yearsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  yearCell: {
    width: '22%',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#222226',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedYearCell: {
    backgroundColor: '#F97316',
  },
  yearCellText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '700',
    color: '#D4D4D8',
  },
  selectedYearCellText: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  calendarActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  calBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calCancelBtn: {
    backgroundColor: '#27272A',
  },
  calCancelText: {
    fontFamily: fontFamilies.bold,
    color: '#D4D4D8',
    fontWeight: '700',
    fontSize: 13,
  },
  calConfirmBtn: {
    backgroundColor: '#F97316',
  },
  calConfirmText: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },

  /* RECENT ACTIVITY MODAL STYLES */
  recentActivityCard: {
    width: '100%',
    backgroundColor: '#121215',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#242428',
    padding: 18,
  },
  recentActivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentActivityHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  recentActivityTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  recentActivitySubtitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 12,
    fontWeight: '600',
    color: '#A1A1AA',
  },
  recentTasksListContainer: {
    backgroundColor: '#16161B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    overflow: 'hidden',
  },
  recentTaskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  recentTaskItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#242428',
  },
  recentDayBox: {
    width: 48,
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3F3F46',
    backgroundColor: '#1C1C22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentDayLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    fontWeight: '900',
    color: '#71717A',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  recentDayNumber: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  recentTaskTitle: {
    fontFamily: fontFamilies.bold,
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recentRightCol: {
    alignItems: 'flex-end',
  },
  recentXpBadge: {
    backgroundColor: '#1C1C22',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  recentXpText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  recentTimeText: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    fontWeight: '500',
    color: '#71717A',
    marginTop: 4,
  },

  /* FOOTER SECTION */
  footerSection: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerHeading: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  footerSubheading: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#A1A1AA',
    textAlign: 'center',
    marginBottom: 6,
  },
  footerLinksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  footerLinkText: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#A1A1AA',
    textDecorationLine: 'underline',
  },
  footerDotText: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#52525B',
  },
  footerRestoreText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 12,
    fontWeight: '600',
    color: '#F97316',
    marginTop: 6,
    textDecorationLine: 'underline',
  },
  footerVersionText: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#71717A',
    marginTop: 4,
  },

  /* EXACT MATCH AVATAR SELECTION MODAL STYLES */
  avatarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  avatarModalCard: {
    width: '100%',
    backgroundColor: '#16161B',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5A93C',
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#E5A93C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarModalTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    fontWeight: '800',
    color: '#E5A93C',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 24,
  },
  avatarCarouselWrapper: {
    width: '100%',
    marginVertical: 4,
  },
  avatarCarouselContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 14,
  },
  circularAvatarWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularAvatarSelected: {
    borderWidth: 2.5,
    borderColor: '#FF9500',
    backgroundColor: '#FF9500',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  circularAvatarUnselected: {
    borderWidth: 1.5,
    borderColor: '#2B3856',
    backgroundColor: '#1F2432',
  },
  circularAvatarFrame: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: '#16161A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
    resizeMode: 'cover',
  },
  cancelActionBtn: {
    backgroundColor: '#F97316',
    borderRadius: 10,
    paddingHorizontal: 36,
    paddingVertical: 12,
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  cancelActionText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  /* EDIT & GENERIC MODALS */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#16161A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3F3F46',
    padding: 20,
  },
  modalTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  modalBodyText: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: '#A1A1AA',
    lineHeight: 20,
  },
  modalInput: {
    fontFamily: fontFamilies.regular,
    backgroundColor: '#222226',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3F3F46',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancelBtn: {
    backgroundColor: '#27272A',
  },
  cancelBtnText: {
    fontFamily: fontFamilies.semiBold,
    color: '#D4D4D8',
    fontWeight: '600',
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: '#F97316',
  },
  saveBtnText: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#222228',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredCloseBtn: {
    backgroundColor: '#F97316',
    borderRadius: 10,
    paddingHorizontal: 36,
    paddingVertical: 12,
    marginTop: 18,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  centeredCloseBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

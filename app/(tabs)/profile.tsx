import React, { useState, useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Clipboard,
  Dimensions,
  Image,
  Linking,
  Modal,
  Platform,
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
import Constants from 'expo-constants';
import { Asset } from 'expo-asset';
import ViewShot from '@/components/common/ViewShotCompat';
import RNShare from '@/services/share/RNShare';

import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Screen } from '@/components/common/Screen';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { fontFamilies } from '@/theme/typography';
import type { ViewShotHandle } from '@/types/viewShot';
import { CLOUDINARY_ASSETS } from '@/constants/cloudinaryAssets';

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
    id: 'arise_1',
    name: 'Shadow Hunter I',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_1',
    source: CLOUDINARY_ASSETS.arise_avatar_1,
  },
  {
    id: 'arise_2',
    name: 'Shadow Hunter II',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_2',
    source: CLOUDINARY_ASSETS.arise_avatar_2,
  },
  {
    id: 'arise_3',
    name: 'Shadow Hunter III',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_3',
    source: CLOUDINARY_ASSETS.arise_avatar_3,
  },
  {
    id: 'arise_4',
    name: 'Shadow Hunter IV',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_4',
    source: CLOUDINARY_ASSETS.arise_avatar_4,
  },
  {
    id: 'arise_5',
    name: 'Shadow Hunter V',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_5',
    source: CLOUDINARY_ASSETS.arise_avatar_5,
  },
  {
    id: 'arise_6',
    name: 'Shadow Hunter VI',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_6',
    source: CLOUDINARY_ASSETS.arise_avatar_6,
  },
  {
    id: 'arise_7',
    name: 'Shadow Hunter VII',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_7',
    source: CLOUDINARY_ASSETS.arise_avatar_7,
  },
  {
    id: 'arise_8',
    name: 'Shadow Hunter VIII',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_8',
    source: CLOUDINARY_ASSETS.arise_avatar_8,
  },
  {
    id: 'arise_9',
    name: 'Shadow Hunter IX',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_9',
    source: CLOUDINARY_ASSETS.arise_avatar_9,
  },
  {
    id: 'arise_10',
    name: 'Shadow Hunter X',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_10',
    source: CLOUDINARY_ASSETS.arise_avatar_10,
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
    return CLOUDINARY_ASSETS.arise_avatar_2;
  }
  if (avatarUrl === 'char_luffy' || avatarUrl === 'luffy.jpg') {
    return CLOUDINARY_ASSETS.arise_avatar_2;
  }
  if (avatarUrl === 'char_gojo' || avatarUrl === 'gojo.jpg') {
    return CLOUDINARY_ASSETS.arise_avatar_3;
  }
  if (avatarUrl === 'char_itachi' || avatarUrl === 'itachi.jpg') {
    return CLOUDINARY_ASSETS.arise_avatar_4;
  }
  if (avatarUrl === 'char_goku' || avatarUrl === 'goku.jpg') {
    return CLOUDINARY_ASSETS.arise_avatar_5;
  }
  if (avatarUrl === 'char_jinwoo' || avatarUrl === 'jinwoo.jpg') {
    return CLOUDINARY_ASSETS.arise_avatar_6;
  }

  // Custom arise keys
  if (avatarUrl === 'arise_1') return CLOUDINARY_ASSETS.arise_avatar_1;
  if (avatarUrl === 'arise_2') return CLOUDINARY_ASSETS.arise_avatar_2;
  if (avatarUrl === 'arise_3') return CLOUDINARY_ASSETS.arise_avatar_3;
  if (avatarUrl === 'arise_4') return CLOUDINARY_ASSETS.arise_avatar_4;
  if (avatarUrl === 'arise_5') return CLOUDINARY_ASSETS.arise_avatar_5;
  if (avatarUrl === 'arise_6') return CLOUDINARY_ASSETS.arise_avatar_6;
  if (avatarUrl === 'arise_7') return CLOUDINARY_ASSETS.arise_avatar_7;
  if (avatarUrl === 'arise_8') return CLOUDINARY_ASSETS.arise_avatar_8;
  if (avatarUrl === 'arise_9') return CLOUDINARY_ASSETS.arise_avatar_9;
  if (avatarUrl === 'arise_10') return CLOUDINARY_ASSETS.arise_avatar_10;

  const found = GAMIFIED_ANIME_AVATARS.find(
    (a) => a.assetKey === avatarUrl || a.id === avatarUrl
  );
  if (found) return found.source;
  if (typeof avatarUrl === 'string' && avatarUrl.startsWith('http')) {
    return { uri: avatarUrl };
  }
  return CLOUDINARY_ASSETS.arise_avatar_2;
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const setUser = useAuthStore((state) => state.setUser);

  const userAny = user as any;

  // Modals State
  const [isEditNameModalVisible, setIsEditNameModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(userAny?.name ?? user?.displayName ?? 'Seymen');

  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: userAny?.name ?? user?.displayName ?? 'Seymen',
    gender: userAny?.gender ? (userAny.gender === 'MALE' ? 'Male' : userAny.gender === 'FEMALE' ? 'Female' : userAny.gender) : 'Male',
    birthday: userAny?.date_of_birth ? userAny.date_of_birth : '15/08/03',
    height: userAny?.height_cm ? String(userAny.height_cm) : '181',
    weight: userAny?.weight_kg ? String(userAny.weight_kg) : '75.0',
    heightUnit: userAny?.height_unit ?? 'cm',
    weightUnit: userAny?.weight_unit ?? 'kg',
    protein: user?.daily_protein_goal ? String(user.daily_protein_goal) : '140',
  });

  useEffect(() => {
    if (isEditProfileModalVisible && user) {
      const uAny = user as any;
      const hUnit = uAny?.height_unit ?? 'cm';
      const wUnit = uAny?.weight_unit ?? 'kg';

      const hVal = uAny?.height_cm
        ? (hUnit === 'ft' ? (uAny.height_cm * 0.0328084).toFixed(1) : String(uAny.height_cm))
        : '181';

      const wVal = uAny?.weight_kg
        ? (wUnit === 'lbs' ? (uAny.weight_kg * 2.20462).toFixed(1) : String(uAny.weight_kg))
        : '75';

      setProfileForm({
        name: uAny?.name ?? user?.displayName ?? 'Seymen',
        gender: uAny?.gender ? (uAny.gender === 'MALE' ? 'Male' : uAny.gender === 'FEMALE' ? 'Female' : uAny.gender) : 'Male',
        birthday: uAny?.date_of_birth ? uAny.date_of_birth : '15/08/03',
        height: hVal,
        weight: wVal,
        heightUnit: hUnit,
        weightUnit: wUnit,
        protein: user?.daily_protein_goal ? String(user.daily_protein_goal) : '140',
      });
      setIsGenderDropdownOpen(false);
    }
  }, [isEditProfileModalVisible, user]);

  // Invite Friends Modal State
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const referralCode = userAny?.referral_code ?? '45JLFI17';
  const referralLink = `https://join.hunterx.app/guestpass/${referralCode}`;
  const guestPassCardRef = useRef<ViewShotHandle>(null);

  // Scan Line Animation Value for guest pass card
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation: any = null;

    const startScanAnimation = () => {
      scanAnim.setValue(0);
      animation = Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 115, // middle of 230 height
          duration: 2200, // 2.2 seconds
          useNativeDriver: true,
        }),
        Animated.delay(600), // brief pause before reset
      ]);
      animation.start((result: any) => {
        if (result?.finished) {
          startScanAnimation();
        }
      });
    };

    if (isInviteModalVisible) {
      startScanAnimation();
    } else {
      scanAnim.setValue(0);
      if (animation) {
        animation.stop();
      }
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [isInviteModalVisible, scanAnim]);

  // Glow Pulse Animation Value
  const glowAnim = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    let animation: any = null;

    const startGlowAnimation = () => {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.55, // mild brighter state
            duration: 2200, // smooth breathing cycle
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.25, // mild dimmer state
            duration: 2200,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    };

    if (isInviteModalVisible) {
      startGlowAnimation();
    } else {
      glowAnim.setValue(0.25);
      if (animation) {
        animation.stop();
      }
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [isInviteModalVisible, glowAnim]);

  useEffect(() => {
    if (userAny?.delete_at) {
      const checkDeletion = () => {
        const remainingMs = userAny.delete_at - Date.now();
        if (remainingMs <= 0) {
          logout();
          router.replace('/(auth)/login');
        }
      };
      checkDeletion();
      const interval = setInterval(checkDeletion, 10000);
      return () => clearInterval(interval);
    }
  }, [userAny?.delete_at]);

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

  // Alert.alert is a no-op on web (react-native-web ships it as `static alert() {}`),
  // so logout/delete confirmations use ConfirmDialog (a real Modal) instead.
  const [isLogoutConfirmVisible, setIsLogoutConfirmVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

  const handleLogout = () => setIsLogoutConfirmVisible(true);

  const confirmLogout = async () => {
    setIsLogoutConfirmVisible(false);
    await logout();
    router.replace('/(auth)/login');
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
      let heightInCm = 181;
      const heightVal = parseFloat(profileForm.height);
      if (!isNaN(heightVal)) {
        if (profileForm.heightUnit === 'ft') {
          heightInCm = Math.round(heightVal / 0.0328084);
        } else {
          heightInCm = Math.round(heightVal);
        }
      }

      let weightInKg = 75;
      const weightVal = parseFloat(profileForm.weight);
      if (!isNaN(weightVal)) {
        if (profileForm.weightUnit === 'lbs') {
          weightInKg = parseFloat((weightVal / 2.20462).toFixed(1));
        } else {
          weightInKg = parseFloat(weightVal.toFixed(1));
        }
      }

      const updatedUser = {
        ...user,
        displayName: profileForm.name.trim(),
        gender: profileForm.gender.toUpperCase() === 'MALE' ? 'MALE' : profileForm.gender.toUpperCase() === 'FEMALE' ? 'FEMALE' : 'OTHER',
        date_of_birth: profileForm.birthday,
        height_cm: heightInCm,
        weight_kg: weightInKg,
        height_unit: profileForm.heightUnit,
        weight_unit: profileForm.weightUnit,
        daily_protein_goal: profileForm.protein ? parseInt(profileForm.protein, 10) : null,
      };

      setUser(updatedUser);
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
    Clipboard.setString(referralLink);
    Alert.alert('Link Copied!', 'Your unique referral link has been copied to clipboard.');
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleSendInvitation = async () => {
    const shareMessage = `Claim a free week of HunterX with my Guest Pass! Use code: ${referralCode}\n\nJoin here: ${referralLink}`;

    try {
      // Snapshot the Guest Pass card so it goes out as an image alongside the text + link.
      const cardImageUri = await guestPassCardRef.current?.capture?.();

      await RNShare.open({
        title: 'HunterX Guest Pass',
        message: shareMessage,
        url: cardImageUri,
        failOnCancel: false,
      });
    } catch (error: any) {
      // User dismissing the share sheet also lands here on some platforms - don't treat it as a failure.
      if (error?.message === 'User did not share') return;

      console.log('Error sharing invitation, falling back to text-only share:', error);
      try {
        await Share.share({
          message: shareMessage,
          title: 'HunterX Guest Pass',
        });
      } catch (fallbackError) {
        console.log('Fallback share also failed:', fallbackError);
      }
    }
  };

  const handleDeleteAccount = () => {
    setIsEditProfileModalVisible(false);
    setTimeout(() => {
      setIsDeleteConfirmVisible(true);
    }, 400);
  };

  const confirmDeleteAccount = async () => {
    setIsDeleteConfirmVisible(false);
    if (user) {
      const deleteTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
      setUser({ ...user, delete_at: deleteTime } as any);
      Alert.alert(
        'Account Scheduled for Deletion',
        'You have 7 days to retrieve your account. After 7 days, your account will be fully deleted.'
      );
    }
  };

  const handleCancelDeletion = () => {
    if (user) {
      const updatedUser = { ...user };
      delete (updatedUser as any).delete_at;
      setUser(updatedUser);
      Alert.alert('Account Restored', 'Your account deletion request has been cancelled.');
    }
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

        {userAny?.delete_at && (
          <View style={styles.deletionPendingBanner}>
            <View style={styles.deletionPendingLeft}>
              <Ionicons name="warning-outline" size={16} color="#EF4444" style={{ marginRight: 6 }} />
              <Text style={styles.deletionPendingText}>
                Account deletes in {Math.max(1, Math.ceil((userAny.delete_at - Date.now()) / (1000 * 60 * 60 * 24)))} days
              </Text>
            </View>
            <TouchableOpacity onPress={handleCancelDeletion} style={styles.undoDeletionBtn} activeOpacity={0.7}>
              <Text style={styles.undoDeletionText}>Undo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* TOP PROFILE SECTION (NO OUTER CARD BOX) */}
        <View style={styles.profileCard}>
          {/* Character Artwork Background on Right */}
          <Image
            source={currentAvatarSource}
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
          <Text style={styles.footerHeading}>Made with ❤️ in India</Text>
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
            <TouchableOpacity onPress={() => setActiveModal('Acknowledgements')}>
              <Text style={styles.footerLinkText}>Acknowledgements</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerVersionText}>
            Version: {Constants.expoConfig?.version ?? '1.0.0'} ({Platform.select({
              ios: Constants.expoConfig?.ios?.buildNumber,
              android: Constants.expoConfig?.android?.versionCode?.toString(),
            }) ?? '1'})
          </Text>
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

            {/* CARD GLOW CONTAINER */}
            <View style={styles.guestPassCardGlowContainer}>
              {/* Pulsing Glow Background Layer */}
              <Animated.View style={[styles.guestPassPulseGlowLayer, { opacity: glowAnim }]} />

              {/* REVAMPED ANIME HERO GUEST PASS CARD */}
              <ViewShot
                ref={guestPassCardRef}
                options={{ format: 'png', quality: 1 }}
                style={{ width: '100%', borderRadius: 20, overflow: 'hidden' }}
              >
                <View style={styles.guestPassCardWrapper}>
                  <Image
                    source={CLOUDINARY_ASSETS.refer_bg}
                    style={styles.guestPassAnimeArtBg}
                    resizeMode="cover"
                  />

                  {/* Scanning Line Animation Layer */}
                  <Animated.View
                    style={[
                      styles.scanLineContainer,
                      {
                        transform: [{ translateY: scanAnim }],
                        opacity: scanAnim.interpolate({
                          inputRange: [0, 15, 100, 115],
                          outputRange: [0, 0.25, 0.25, 0],
                        }),
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={['rgba(255, 210, 90, 0)', 'rgba(255, 210, 90, 0.2)', 'rgba(255, 210, 90, 0)']}
                      style={styles.scanLineGlow}
                    />
                    <View style={styles.scanLineCore} />
                  </Animated.View>

                  <LinearGradient
                    colors={['rgba(10, 15, 30, 0.45)', 'rgba(6, 10, 22, 0.65)', 'rgba(10, 18, 36, 0.85)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.guestPassGradientOverlay}
                  >
                    {/* Top Row: Legendary Badge and Sys Req */}
                    <View style={styles.guestPassTopRow}>
                      <View style={styles.guestPassRarityBadge}>
                        <View style={styles.starCircleIcon}>
                          <Ionicons name="star" size={7} color="#0E1116" />
                        </View>
                        <Text style={styles.guestPassRarityText}>LEGENDARY GUEST PASS</Text>
                      </View>
                      <View style={styles.guestPassSysReqGroup}>
                        <Text style={styles.guestPassAuthText}>Code : {referralCode}</Text>
                      </View>
                    </View>



                    {/* Main Titles Overlay */}
                    <View style={styles.guestPassCenterTextGroup}>
                      <Text style={styles.guestPassMainTitle}>Guest Pass</Text>
                      <Text style={styles.guestPassSubTitle}>ALL-ACCESS HUNTER PASS</Text>
                    </View>

                    {/* Bottom Row */}
                    <View style={styles.guestPassFooterRow}>
                      <View style={styles.guestPassBrandGroup}>
                        <View style={styles.guestPassIconBadge}>
                          <MaterialCommunityIcons name="sword-cross" size={13} color="#FFFFFF" />
                        </View>
                        <Text style={styles.guestPassBrandText}>HunterX.</Text>
                      </View>
                      <View style={styles.guestPassIssuerBadge}>
                        <Text style={styles.guestPassIssuerText}>
                          ISSUED BY {displayName ? displayName.toUpperCase() : 'SYSTEM'}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              </ViewShot>
            </View>

            {/* RECRUITMENT XP BADGE */}
            <LinearGradient
              colors={['rgba(234, 179, 8, 0.14)', 'rgba(234, 179, 8, 0.04)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.recruitmentXpBadge}
            >
              <View style={styles.recruitmentXpIconWrap}>
                <Ionicons name="medal-outline" size={16} color="#FBBF24" />
              </View>
              <Text style={styles.recruitmentXpText}>
                Awakening bonus: <Text style={styles.recruitmentXpTextGold}>+50 XP</Text>
              </Text>
            </LinearGradient>

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
                Only new hunters may pass through this gate
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
              <Text style={styles.sendInviteBtnText}>Awaken a Hunter</Text>
            </TouchableOpacity>
          </View>
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
                source={CLOUDINARY_ASSETS.rate_hunterx_bg}
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
                <LinearGradient
                  colors={['#FF9500', '#F97316', '#EA580C']}
                  style={styles.editAvatarGlowRing}
                >
                  <View style={styles.editAvatarCircleFrame}>
                    <Image
                      source={currentAvatarSource}
                      style={styles.editAvatarImage}
                      resizeMode="cover"
                    />
                  </View>
                </LinearGradient>
                <View style={styles.editPencilBadge}>
                  <Ionicons name="camera" size={14} color="#000000" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Form Fields Section */}
            <View style={styles.modernFormContainer}>
              {/* Name field */}
              <View style={styles.modernFormRow}>
                <View style={styles.modernRowLeft}>
                  <Ionicons name="person-outline" size={18} color="#F97316" style={styles.rowIcon} />
                  <Text style={styles.modernRowLabel}>Name</Text>
                </View>
                <TextInput
                  style={styles.modernRowInput}
                  value={profileForm.name}
                  onChangeText={(val) => setProfileForm({ ...profileForm, name: val })}
                  placeholderTextColor="#72727D"
                />
              </View>

              {/* Gender field */}
              <TouchableOpacity
                style={styles.modernFormRow}
                onPress={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                activeOpacity={0.8}
              >
                <View style={styles.modernRowLeft}>
                  <Ionicons name="male-female-outline" size={18} color="#F97316" style={styles.rowIcon} />
                  <Text style={styles.modernRowLabel}>Gender</Text>
                </View>
                <View style={styles.modernDateValueRow}>
                  <Text style={styles.modernDateValueText}>{profileForm.gender}</Text>
                  <Ionicons name={isGenderDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color="#71717A" />
                </View>
              </TouchableOpacity>

              {isGenderDropdownOpen && (
                <View style={styles.genderDropdownContainer}>
                  {['Male', 'Female', 'Other'].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.genderDropdownItem,
                        profileForm.gender === item && styles.genderDropdownItemSelected,
                      ]}
                      onPress={() => {
                        setProfileForm({ ...profileForm, gender: item });
                        setIsGenderDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.genderDropdownItemText,
                          profileForm.gender === item && styles.genderDropdownItemTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                      {profileForm.gender === item && (
                        <Ionicons name="checkmark" size={16} color="#F97316" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Birthday field */}
              <TouchableOpacity
                style={styles.modernFormRow}
                onPress={() => setIsDatePickerVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.modernRowLeft}>
                  <Ionicons name="calendar-outline" size={18} color="#F97316" style={styles.rowIcon} />
                  <Text style={styles.modernRowLabel}>Birthday</Text>
                </View>
                <View style={styles.modernDateValueRow}>
                  <Text style={styles.modernDateValueText}>{profileForm.birthday}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#71717A" />
                </View>
              </TouchableOpacity>

              {/* Height label & switcher header */}
              <View style={styles.fieldHeaderRow}>
                <View style={styles.fieldHeaderLeft}>
                  <Ionicons name="resize-outline" size={16} color="#F97316" style={{ marginRight: 6 }} />
                  <Text style={styles.fieldHeaderTitle}>Height</Text>
                </View>
                <View style={styles.unitSwitcherHeaderBtnRow}>
                  <TouchableOpacity
                    style={[
                      styles.unitSwitcherHeaderBtn,
                      profileForm.heightUnit === 'cm' && styles.unitSwitcherHeaderBtnActive,
                    ]}
                    onPress={() => {
                      if (profileForm.heightUnit === 'ft') {
                        const ftVal = parseFloat(profileForm.height);
                        const converted = isNaN(ftVal) ? '181' : Math.round(ftVal / 0.0328084).toString();
                        setProfileForm({ ...profileForm, heightUnit: 'cm', height: converted });
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.unitSwitcherHeaderBtnText, profileForm.heightUnit === 'cm' && styles.unitSwitcherHeaderBtnTextActive]}>cm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.unitSwitcherHeaderBtn,
                      profileForm.heightUnit === 'ft' && styles.unitSwitcherHeaderBtnActive,
                    ]}
                    onPress={() => {
                      if (profileForm.heightUnit === 'cm') {
                        const cmVal = parseFloat(profileForm.height);
                        const converted = isNaN(cmVal) ? '5.9' : (cmVal * 0.0328084).toFixed(1);
                        setProfileForm({ ...profileForm, heightUnit: 'ft', height: converted });
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.unitSwitcherHeaderBtnText, profileForm.heightUnit === 'ft' && styles.unitSwitcherHeaderBtnTextActive]}>ft</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Height field */}
              <View style={styles.modernFormRow}>
                <TextInput
                  style={styles.modernRowInputSingle}
                  value={profileForm.height}
                  onChangeText={(val) => setProfileForm({ ...profileForm, height: val })}
                  keyboardType="numeric"
                  placeholder="Enter height"
                  placeholderTextColor="#72727D"
                />
                <Text style={styles.modernInputSuffixText}>{profileForm.heightUnit}</Text>
              </View>

              {/* Weight label & switcher header */}
              <View style={styles.fieldHeaderRow}>
                <View style={styles.fieldHeaderLeft}>
                  <Ionicons name="fitness-outline" size={16} color="#F97316" style={{ marginRight: 6 }} />
                  <Text style={styles.fieldHeaderTitle}>Weight</Text>
                </View>
                <View style={styles.unitSwitcherHeaderBtnRow}>
                  <TouchableOpacity
                    style={[
                      styles.unitSwitcherHeaderBtn,
                      profileForm.weightUnit === 'kg' && styles.unitSwitcherHeaderBtnActive,
                    ]}
                    onPress={() => {
                      if (profileForm.weightUnit === 'lbs') {
                        const lbsVal = parseFloat(profileForm.weight);
                        const converted = isNaN(lbsVal) ? '75.0' : (lbsVal / 2.20462).toFixed(1);
                        setProfileForm({ ...profileForm, weightUnit: 'kg', weight: converted });
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.unitSwitcherHeaderBtnText, profileForm.weightUnit === 'kg' && styles.unitSwitcherHeaderBtnTextActive]}>kg</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.unitSwitcherHeaderBtn,
                      profileForm.weightUnit === 'lbs' && styles.unitSwitcherHeaderBtnActive,
                    ]}
                    onPress={() => {
                      if (profileForm.weightUnit === 'kg') {
                        const kgVal = parseFloat(profileForm.weight);
                        const converted = isNaN(kgVal) ? '165.3' : (kgVal * 2.20462).toFixed(1);
                        setProfileForm({ ...profileForm, weightUnit: 'lbs', weight: converted });
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.unitSwitcherHeaderBtnText, profileForm.weightUnit === 'lbs' && styles.unitSwitcherHeaderBtnTextActive]}>lbs</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Weight field */}
              <View style={styles.modernFormRow}>
                <TextInput
                  style={styles.modernRowInputSingle}
                  value={profileForm.weight}
                  onChangeText={(val) => setProfileForm({ ...profileForm, weight: val })}
                  keyboardType="numeric"
                  placeholder="Enter weight"
                  placeholderTextColor="#72727D"
                />
                <Text style={styles.modernInputSuffixText}>{profileForm.weightUnit}</Text>
              </View>

              {/* Protein Goal field */}
              <View style={styles.modernFormRow}>
                <View style={styles.modernRowLeft}>
                  <Ionicons name="nutrition-outline" size={18} color="#F97316" style={styles.rowIcon} />
                  <Text style={styles.modernRowLabel}>Protein Goal (g)</Text>
                </View>
                <TextInput
                  style={styles.modernRowInput}
                  value={profileForm.protein}
                  onChangeText={(val) => setProfileForm({ ...profileForm, protein: val })}
                  keyboardType="numeric"
                  placeholderTextColor="#72727D"
                />
              </View>
            </View>

            {/* Linked Account Card */}
            <View style={styles.modernAccountCard}>
              <View style={styles.modernAccountLeft}>
                <Ionicons name="logo-google" size={18} color="#EA4335" style={styles.accountIcon} />
                <View>
                  <Text style={styles.modernAccountLabel}>Google Account</Text>
                  <Text style={styles.modernAccountEmail}>{user?.email ?? 'shakthikumar.dev@gmail.com'}</Text>
                </View>
              </View>
            </View>

            {/* Delete Account */}
            <TouchableOpacity
              style={styles.deleteAccountContainer}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteAccountText}>Delete Account</Text>
            </TouchableOpacity>
          </ScrollView>

          {isDatePickerVisible && (
            <View style={styles.customModalOverlay}>
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
          )}
        </Screen>
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
                    : item.id === 'arise_2';

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

      <ConfirmDialog
        visible={isLogoutConfirmVisible}
        title="Log Out"
        message="Are you sure you want to log out?"
        confirmLabel="Log Out"
        destructive
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutConfirmVisible(false)}
      />

      <ConfirmDialog
        visible={isDeleteConfirmVisible}
        title="Delete Account"
        message="You have 7 days to retrieve your account. After 7 days, your account will be fully deleted."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDeleteAccount}
        onCancel={() => setIsDeleteConfirmVisible(false)}
      />
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
  genderDropdownContainer: {
    backgroundColor: '#1E1E24',
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2D2D39',
    overflow: 'hidden',
  },
  genderDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2D2D39',
  },
  genderDropdownItemText: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: '#A1A1AA',
  },
  genderDropdownItemTextSelected: {
    color: '#F97316',
    fontFamily: fontFamilies.semiBold,
  },
  genderDropdownItemSelected: {
    backgroundColor: '#272732',
  },
  customModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 9999,
  },
  fieldHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  fieldHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldHeaderTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 14,
    color: '#E4E4E7',
  },
  unitSwitcherHeaderBtnRow: {
    flexDirection: 'row',
    backgroundColor: '#18181B',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#27272A',
    padding: 1.5,
  },
  unitSwitcherHeaderBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitSwitcherHeaderBtnActive: {
    backgroundColor: '#F97316',
  },
  unitSwitcherHeaderBtnText: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    color: '#A1A1AA',
  },
  unitSwitcherHeaderBtnTextActive: {
    color: '#FFFFFF',
    fontFamily: fontFamilies.bold,
  },
  modernRowInputSingle: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
    paddingVertical: 8,
  },
  modernInputSuffixText: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: '#71717A',
  },
  deletionPendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 4,
  },
  deletionPendingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deletionPendingText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 13,
    color: '#EF4444',
    flex: 1,
  },
  undoDeletionBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  undoDeletionText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#FFFFFF',
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

  guestPassCardGlowContainer: {
    width: '100%',
    position: 'relative',
  },
  guestPassPulseGlowLayer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    backgroundColor: '#0A0E17',
    shadowColor: '#FFC83C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 14,
    elevation: 10,
  },
  guestPassCardWrapper: {
    width: '100%',
    height: 230,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0A0E17',
  },
  guestPassAnimeArtBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  guestPassGradientOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  scanLineContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 16,
    justifyContent: 'center',
    zIndex: 2,
  },
  scanLineGlow: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 16,
  },
  scanLineCore: {
    height: 1.5,
    backgroundColor: 'rgba(255, 210, 90, 0.45)',
    width: '100%',
  },
  guestPassTopRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  guestPassRarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderWidth: 1,
    borderColor: '#FBBF24',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  guestPassRarityText: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: 0.5,
  },
  starCircleIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FBBF24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestPassSysReqGroup: {
    alignItems: 'flex-end',
  },
  guestPassSysReqText: {
    fontFamily: fontFamilies.bold,
    fontSize: 8.5,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: 0.5,
  },
  guestPassAuthText: {
    fontFamily: fontFamilies.bold,
    fontSize: 8.5,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 0.5,
    marginTop: 1,
  },

  /* HUD Panels */
  hudPanelLeft: {
    position: 'absolute',
    top: 50,
    left: 12,
    width: 105,
    backgroundColor: 'rgba(6, 10, 20, 0.65)',
    borderWidth: 0.75,
    borderColor: 'rgba(34, 211, 238, 0.3)',
    borderRadius: 4,
    padding: 5,
    zIndex: 5,
  },
  hudPanelRight: {
    position: 'absolute',
    top: 50,
    right: 12,
    width: 110,
    backgroundColor: 'rgba(6, 10, 20, 0.65)',
    borderWidth: 0.75,
    borderColor: 'rgba(34, 211, 238, 0.3)',
    borderRadius: 4,
    padding: 5,
    zIndex: 5,
  },
  radarContainer: {
    height: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(34, 211, 238, 0.25)',
    borderRadius: 3,
    marginBottom: 4,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 10, 20, 0.4)',
    overflow: 'hidden',
  },
  radarCircle: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(34, 211, 238, 0.15)',
  },
  radarCircle2: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(34, 211, 238, 0.15)',
  },
  radarLineH: {
    position: 'absolute',
    width: '100%',
    height: 0.5,
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
  },
  radarLineV: {
    position: 'absolute',
    width: 0.5,
    height: '100%',
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
  },
  radarBlip: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#EF4444',
    top: 6,
    right: 32,
  },
  hudPanelTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 6.5,
    fontWeight: '900',
    color: '#22D3EE',
    letterSpacing: 0.3,
    marginBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(34, 211, 238, 0.2)',
    paddingBottom: 2,
  },
  hudStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  hudStatLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 6,
    color: '#E2E8F0',
  },
  hudStatBarContainer: {
    width: 48,
    height: 3,
    backgroundColor: '#374151',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  hudStatBarFilled: {
    height: '100%',
    borderRadius: 1.5,
  },
  hudPanelSubtext: {
    fontFamily: fontFamilies.regular,
    fontSize: 5.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  hudPanelValueText: {
    fontFamily: fontFamilies.bold,
    fontSize: 6,
    fontWeight: '800',
    color: '#38BDF8',
  },
  hudRightText: {
    fontFamily: fontFamilies.regular,
    fontSize: 5.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  hudRightVal: {
    fontFamily: fontFamilies.bold,
    fontSize: 6,
    fontWeight: '800',
  },

  /* Center Text & Titles */
  guestPassCenterTextGroup: {
    position: 'absolute',
    bottom: 45,
    left: 12,
    zIndex: 10,
  },
  guestPassMainTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.95)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  guestPassSubTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: 1.2,
    marginTop: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  /* Footer Row */
  guestPassFooterRow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  guestPassBrandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guestPassIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#22D3EE',
  },
  guestPassBrandText: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  guestPassIssuerBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 0.75,
    borderColor: 'rgba(34, 211, 238, 0.25)',
  },
  guestPassIssuerText: {
    fontFamily: fontFamilies.bold,
    fontSize: 7.5,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  recruitmentXpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 24,
    gap: 10,
    alignSelf: 'center',
    marginTop: 18,
    width: '100%',
    shadowColor: '#EAB308',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 3,
  },
  recruitmentXpIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(251, 191, 36, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recruitmentXpText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 0.3,
  },
  recruitmentXpTextGold: {
    fontFamily: fontFamilies.bold,
    fontWeight: '800',
    color: '#FBBF24',
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
    width: 106,
    height: 106,
    borderRadius: 53,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarGlowRing: {
    width: 106,
    height: 106,
    borderRadius: 53,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
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
  modernFormContainer: {
    gap: 12,
    marginVertical: 10,
  },
  modernFormRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#18181B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  modernRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowIcon: {
    width: 20,
    textAlign: 'center',
  },
  modernRowLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    fontWeight: '700',
    color: '#E4E4E7',
  },
  modernRowInput: {
    fontFamily: fontFamilies.medium,
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
    paddingVertical: 0,
  },
  modernDateValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modernDateValueText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 15,
    fontWeight: '600',
    color: '#F97316',
  },
  modernAccountCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modernAccountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  accountIcon: {
    width: 20,
    textAlign: 'center',
  },
  modernAccountLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  modernAccountEmail: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#A1A1AA',
  },
  modernAccountBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  modernAccountBadgeText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 11,
    color: '#22C55E',
    fontWeight: '600',
  },
  modernDeleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
  },
  modernDeleteButtonText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
    textDecorationLine: 'underline',
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

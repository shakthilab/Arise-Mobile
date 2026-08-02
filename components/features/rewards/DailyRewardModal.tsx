import React, { useRef, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useAuthStore } from '@/store/useAuthStore';
import { palette } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';
import { RewardsWalletModal } from './RewardsWalletModal';

interface DailyRewardModalProps {
  visible: boolean;
  onClose: () => void;
  streakDays?: number;
}

const ACCENT_GOLD = '#E5A93C';

const GRID_ROWS = 12;
const GRID_COLS = 20;
const TOTAL_CELLS = GRID_ROWS * GRID_COLS;
const CELL_W = 100 / GRID_COLS;
const CELL_H = 100 / GRID_ROWS;

type GiftStage = 'scratching' | 'unwrapped';

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  visible,
  onClose,
  streakDays = 12,
}) => {
  const user = useAuthStore((state) => state.user);
  const currentStreak = streakDays ?? user?.currentStreak ?? 12;
  const { height: windowHeight } = useWindowDimensions();
  const isCompact = windowHeight < 680;

  const [giftStage, setGiftStage] = useState<GiftStage>('scratching');
  const [isClaimed, setIsClaimed] = useState(false);
  const [expPopUpVisible, setExpPopUpVisible] = useState(false);
  const [walletVisible, setWalletVisible] = useState(false);
  const [shareSheetVisible, setShareSheetVisible] = useState(false);

  // Scratch card grid state
  const [clearedCells, setClearedCells] = useState<boolean[]>(
    () => new Array(TOTAL_CELLS).fill(false)
  );

  const cardLayout = useRef<{ width: number; height: number }>({ width: 320, height: 160 });

  // Pop-up scale & opacity animation
  const popUpScaleAnim = useRef(new Animated.Value(0.6)).current;
  const popUpFadeAnim = useRef(new Animated.Value(0)).current;
  const rewardScaleAnim = useRef(new Animated.Value(0.6)).current;
  const rewardOpacity = useRef(new Animated.Value(0)).current;

  // Trigger EXP Reward Celebration Pop-up
  const triggerScratchCompletion = () => {
    if (giftStage === 'unwrapped') return;

    setClearedCells(new Array(TOTAL_CELLS).fill(true));
    setGiftStage('unwrapped');
    setExpPopUpVisible(true);

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {}

    popUpScaleAnim.setValue(0.5);
    popUpFadeAnim.setValue(0);

    Animated.parallel([
      Animated.spring(popUpScaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 45,
        useNativeDriver: true,
      }),
      Animated.timing(popUpFadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(rewardScaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(rewardOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleTouchLocation = (locationX: number, locationY: number) => {
    if (giftStage !== 'scratching') return;

    const { width, height } = cardLayout.current;
    if (width <= 0 || height <= 0) return;

    const col = Math.floor((locationX / width) * GRID_COLS);
    const row = Math.floor((locationY / height) * GRID_ROWS);

    const radius = 2;
    let updated = false;

    setClearedCells((prev) => {
      const next = [...prev];
      for (let r = Math.max(0, row - radius); r <= Math.min(GRID_ROWS - 1, row + radius); r++) {
        for (let c = Math.max(0, col - radius); c <= Math.min(GRID_COLS - 1, col + radius); c++) {
          const idx = r * GRID_COLS + c;
          if (!next[idx]) {
            next[idx] = true;
            updated = true;
          }
        }
      }

      if (updated) {
        const clearedCount = next.filter(Boolean).length;
        if (clearedCount / TOTAL_CELLS >= 0.8) {
          triggerScratchCompletion();
        } else {
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } catch (e) {}
        }
      }

      return updated ? next : prev;
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        handleTouchLocation(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
      onPanResponderMove: (evt) => {
        handleTouchLocation(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
      onPanResponderRelease: (evt) => {
        handleTouchLocation(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
    })
  ).current;

  const handleClaim = () => {
    if (giftStage !== 'unwrapped') {
      triggerScratchCompletion();
    }
    setIsClaimed(true);
    setExpPopUpVisible(false);
    setWalletVisible(true);
  };

  const handleShare = () => {
    setShareSheetVisible(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}
  };

  const handleShareNative = async (platformName?: string) => {
    setShareSheetVisible(false);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share(
        {
          message: `🔥 Hunter Achievement Unlocked!\nClaimed HUNTER LOOT BOX with a ${currentStreak}-Day Streak on ARISE!\n\nJoin the squad: https://arise-app.com/share`,
          title: 'ARISE Hunter Achievement',
        },
        {
          dialogTitle: platformName ? `Share to ${platformName}` : 'Share Achievement',
        }
      );
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const scratchedCount = clearedCells.filter(Boolean).length;
  const isScratchingActive = scratchedCount > 0 && giftStage === 'scratching';

  // Proportioned sizing for Android/iOS
  const chestSize = isCompact ? { width: 160, height: 135 } : { width: 195, height: 160 };
  const scratchCardHeight = isCompact ? 115 : 130;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="#050505" />
      <SafeAreaView style={styles.container}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.headerBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topSection}>
            {/* Streak Pill Badge */}
            <View style={styles.streakPill}>
              <Text style={styles.fireEmoji}>🔥</Text>
              <Text style={styles.streakText}>{currentStreak}-DAY STREAK</Text>
            </View>

            {/* Glowing Loot Chest Image Container */}
            <View style={[styles.chestContainer, chestSize]}>
              <View style={styles.chestGlowHalo} />
              <Image
                source={require('@/assets/images/daily_loot_chest.png')}
                style={styles.chestImage}
                resizeMode="contain"
              />
            </View>

            {/* Title & Subtitle */}
            <Text style={styles.rewardTitle}>Your Reward is Ready!</Text>
            <Text style={styles.rewardSubtitle}>
              {giftStage === 'unwrapped'
                ? 'Congratulations! You unlocked your reward.'
                : 'Scratch the card below to reveal today\'s surprise.'}
            </Text>

            {/* Scratch Card Area */}
            <View
              style={[
                styles.scratchCard,
                { height: scratchCardHeight },
                giftStage === 'unwrapped' && styles.scratchCardRevealed,
              ]}
              onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                cardLayout.current = { width, height };
              }}
              {...(giftStage === 'scratching' ? panResponder.panHandlers : {})}
            >
              {/* Stage: Unwrapped Reward Revealed */}
              {giftStage === 'unwrapped' && (
                <Animated.View
                  style={[
                    styles.revealedContent,
                    {
                      opacity: rewardOpacity,
                      transform: [{ scale: rewardScaleAnim }],
                    },
                  ]}
                >
                  <Text style={styles.revealedBadge}>HUNTER LOOT BOX</Text>
                </Animated.View>
              )}

              {/* Stage: Scratching Foil Layer */}
              {giftStage !== 'unwrapped' && (
                <View style={styles.foilOverlay} pointerEvents="none">
                  {clearedCells.map((cleared, idx) => {
                    if (cleared) return null;
                    const r = Math.floor(idx / GRID_COLS);
                    const c = idx % GRID_COLS;
                    return (
                      <View
                        key={idx}
                        style={[
                          styles.foilCell,
                          {
                            left: `${c * CELL_W}%`,
                            top: `${r * CELL_H}%`,
                            width: `${CELL_W + 0.6}%`,
                            height: `${CELL_H + 0.6}%`,
                          },
                        ]}
                      />
                    );
                  })}

                  {/* Scratch Prompt Center Banner */}
                  {!isScratchingActive && (
                    <View style={styles.scratchPromptBanner} pointerEvents="none">
                      <MaterialCommunityIcons name="gesture-swipe" size={18} color={ACCENT_GOLD} />
                      <Text style={styles.scratchPromptText}>SCRATCH TO REVEAL</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionGroup}>
              {giftStage === 'unwrapped' && (
                <TouchableOpacity
                  style={styles.claimBtn}
                  activeOpacity={0.85}
                  onPress={handleClaim}
                >
                  <Text style={styles.claimBtnText}>
                    {isClaimed ? 'REWARD CLAIMED!' : 'CLAIM REWARD'}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.shareBtn}
                activeOpacity={0.8}
                onPress={handleShare}
              >
                <Text style={styles.shareBtnText}>SHARE ACHIEVEMENT</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Stats Row */}
          <View style={styles.footerSection}>
            <View style={styles.dividerLine} />

            <View style={styles.statsRow}>
              {/* Current Streak */}
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>CURRENT STREAK</Text>
                <Text style={styles.streakValue}>{currentStreak} DAYS</Text>
              </View>

              <View style={styles.verticalDivider} />

              {/* Next Drop Timer */}
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>NEXT DROP IN</Text>
                <Text style={styles.timerValue}>23:45:12</Text>
              </View>
            </View>

            {/* Accent Yellow Bar */}
            <View style={styles.accentBar} />

            {/* Quote */}
            <Text style={styles.quoteText}>
              "Peak performance is built on consistency. Return tomorrow to upgrade your streak rank."
            </Text>
          </View>
        </ScrollView>

        {/* EXP Reward Celebration Pop-up Overlay (In-Modal Overlay for Android/iOS Reliability) */}
        {expPopUpVisible && (
          <Animated.View
            style={[
              styles.popUpBackdrop,
              { opacity: popUpFadeAnim },
            ]}
          >
            <Pressable
              style={StyleSheet.absoluteFillObject}
              onPress={() => setExpPopUpVisible(false)}
            />
            <Animated.View
              style={[
                styles.popUpCard,
                {
                  transform: [{ scale: popUpScaleAnim }],
                },
              ]}
            >
              {/* Top Colorful Party Popper Icon */}
              <View style={styles.popperIconCircle}>
                <Text style={{ fontSize: 36, textAlign: 'center' }}>🎉</Text>
              </View>

              <Text style={styles.popUpTitle}>REWARD UNLOCKED!</Text>

              {/* EXP Amount Badge */}
              <View style={styles.expBadgeContainer}>
                <Text style={styles.expBadgeText}>+100 EXP</Text>
              </View>

              <Text style={styles.popUpSubtitle}>
                Experience points credited to your Hunter profile! Claim to level up your rank status.
              </Text>

              {/* Claim Reward Button */}
              <TouchableOpacity
                style={styles.popUpClaimBtn}
                activeOpacity={0.85}
                onPress={handleClaim}
              >
                <Text style={styles.popUpClaimBtnText}>
                  {isClaimed ? 'REWARD CLAIMED!' : 'CLAIM REWARD'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}

        {/* Social Media Share Sheet Overlay */}
        {shareSheetVisible && (
          <Pressable
            style={styles.shareSheetBackdrop}
            onPress={() => setShareSheetVisible(false)}
          >
            <Pressable style={styles.shareSheetCard} onPress={(e) => e.stopPropagation()}>
              <View style={styles.shareSheetHeader}>
                <Text style={styles.shareSheetTitle}>SHARE ACHIEVEMENT</Text>
                <Text style={styles.shareSheetSubtitle}>
                  Broadcast your {currentStreak}-Day streak victory to your squad!
                </Text>
              </View>

              {/* Social Channels Row */}
              <View style={styles.socialGrid}>
                {/* WhatsApp */}
                <TouchableOpacity
                  style={styles.socialItem}
                  onPress={() => handleShareNative('WhatsApp')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.socialIconCircle, { backgroundColor: '#122E1E', borderColor: '#25D366' }]}>
                    <Ionicons name="logo-whatsapp" size={26} color="#25D366" />
                  </View>
                  <Text style={styles.socialLabel}>WhatsApp</Text>
                </TouchableOpacity>

                {/* Snapchat */}
                <TouchableOpacity
                  style={styles.socialItem}
                  onPress={() => handleShareNative('Snapchat')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.socialIconCircle, { backgroundColor: '#2B2A10', borderColor: '#FFFC00' }]}>
                    <Ionicons name="logo-snapchat" size={26} color="#FFFC00" />
                  </View>
                  <Text style={styles.socialLabel}>Snapchat</Text>
                </TouchableOpacity>

                {/* Instagram */}
                <TouchableOpacity
                  style={styles.socialItem}
                  onPress={() => handleShareNative('Instagram')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.socialIconCircle, { backgroundColor: '#2E1222', borderColor: '#E1306C' }]}>
                    <Ionicons name="logo-instagram" size={26} color="#E1306C" />
                  </View>
                  <Text style={styles.socialLabel}>Instagram</Text>
                </TouchableOpacity>

                {/* Twitter / X */}
                <TouchableOpacity
                  style={styles.socialItem}
                  onPress={() => handleShareNative('X / Twitter')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.socialIconCircle, { backgroundColor: '#141E28', borderColor: '#1DA1F2' }]}>
                    <Ionicons name="logo-twitter" size={26} color="#1DA1F2" />
                  </View>
                  <Text style={styles.socialLabel}>X / Twitter</Text>
                </TouchableOpacity>
              </View>

              {/* Native Share Button */}
              <TouchableOpacity
                style={styles.nativeShareBtn}
                onPress={() => handleShareNative()}
                activeOpacity={0.85}
              >
                <Ionicons name="share-social-outline" size={18} color="#000000" />
                <Text style={styles.nativeShareBtnText}>MORE SHARING OPTIONS</Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelShareBtn}
                onPress={() => setShareSheetVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelShareBtnText}>CANCEL</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        )}

        {/* Rewards Wallet Modal */}
        <RewardsWalletModal
          visible={walletVisible}
          onClose={() => {
            setWalletVisible(false);
            onClose();
            router.replace('/(tabs)');
          }}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    position: 'relative',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
  },

  /* Header Bar */
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  topSection: {
    width: '100%',
    alignItems: 'center',
  },

  /* Streak Pill */
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161410',
    borderWidth: 1,
    borderColor: '#332917',
    borderRadius: 18,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginBottom: 12,
    gap: 6,
  },
  fireEmoji: {
    fontSize: 13,
  },
  streakText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: ACCENT_GOLD,
    letterSpacing: 1.2,
  },

  /* Loot Chest Image */
  chestContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  chestGlowHalo: {
    position: 'absolute',
    width: '85%',
    height: '85%',
    borderRadius: 75,
    backgroundColor: 'rgba(229, 169, 60, 0.18)',
    shadowColor: ACCENT_GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 45,
    shadowOpacity: 0.8,
  },
  chestImage: {
    width: '100%',
    height: '100%',
  },

  /* Text Section */
  rewardTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    color: palette.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  rewardSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 14,
  },

  /* Scratch Card Container */
  scratchCard: {
    width: '100%',
    backgroundColor: '#1C1912',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#332917',
    overflow: 'hidden',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scratchCardRevealed: {
    backgroundColor: '#1F1A0F',
    borderColor: ACCENT_GOLD,
  },

  /* Revealed Reward Content */
  revealedContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    zIndex: 1,
  },
  revealedBadge: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: ACCENT_GOLD,
    letterSpacing: 2,
    textAlign: 'center',
  },

  /* Scratch Foil Layer */
  foilOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 5,
  },
  foilCell: {
    position: 'absolute',
    backgroundColor: '#1E1E22',
    borderWidth: 0.5,
    borderColor: '#26262B',
  },
  scratchPromptBanner: {
    position: 'absolute',
    top: '32%',
    left: '10%',
    right: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: '#2C2516',
    borderRadius: 18,
    paddingVertical: 9,
    paddingHorizontal: 16,
    gap: 8,
    elevation: 4,
  },
  scratchPromptText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: '#D4D4D8',
    letterSpacing: 1.5,
  },

  /* Buttons */
  actionGroup: {
    width: '100%',
    gap: 10,
    marginBottom: 16,
  },
  claimBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: '#000000',
    letterSpacing: 1.5,
  },
  shareBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#0E0E10',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },

  /* Footer */
  footerSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  dividerLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#1A1A1E',
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 14,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  streakValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: ACCENT_GOLD,
  },
  timerValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: palette.white,
  },
  verticalDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#27272A',
  },
  accentBar: {
    width: 36,
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: ACCENT_GOLD,
    marginBottom: 10,
  },
  quoteText: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 16,
  },

  /* EXP Reward Celebration Pop-up Overlay */
  popUpBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 9999,
    elevation: 9999,
  },
  popUpCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#12110E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2314',
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 10,
    zIndex: 10000,
  },
  popperIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#19160E',
    borderWidth: 1.5,
    borderColor: ACCENT_GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  popUpTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: palette.white,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  expBadgeContainer: {
    width: '80%',
    maxWidth: 240,
    backgroundColor: '#1A160D',
    borderWidth: 1.5,
    borderColor: ACCENT_GOLD,
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  expBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    color: ACCENT_GOLD,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(229, 169, 60, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  popUpSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 22,
    paddingHorizontal: 8,
  },
  popUpClaimBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popUpClaimBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: '#000000',
    letterSpacing: 1.5,
  },

  /* Share Sheet Styles */
  shareSheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'flex-end',
    zIndex: 9999,
    elevation: 9999,
  },
  shareSheetCard: {
    width: '100%',
    backgroundColor: '#12110E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2314',
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  shareSheetHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  shareSheetTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  shareSheetSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  socialGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  socialItem: {
    alignItems: 'center',
    gap: 6,
  },
  socialIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: '#D4D4D8',
  },
  nativeShareBtn: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
    backgroundColor: ACCENT_GOLD,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  nativeShareBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: '#000000',
    letterSpacing: 1.5,
  },
  cancelShareBtn: {
    paddingVertical: 10,
  },
  cancelShareBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#71717A',
    letterSpacing: 1,
  },
});

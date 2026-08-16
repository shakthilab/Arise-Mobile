import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Share,
  Clipboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

import { HexagonBadge } from '../components/ui/HexagonBadge';
import { TreasureChestVisual } from '../components/ui/TreasureChestVisual';
import { ScratchCard } from '../components/features/ScratchCard';
import { FullScreenAmbientAnimation } from '../components/ui/FullScreenAmbientAnimation';
import { fontFamilies } from '../theme/typography';

type FlowStep = 'level' | 'treasure' | 'wallet';
type WalletTab = 'ACTIVE' | 'USED' | 'EXPIRED';

interface CouponReward {
  id: string;
  badge: string;
  badgeType: 'percent' | 'icon';
  iconName?: string;
  title: string;
  expiresIn: string;
  code: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
}

const INITIAL_COUPONS: CouponReward[] = [
  {
    id: '1',
    badge: '20%',
    badgeType: 'percent',
    title: 'ARISE PERFORMANCE SUPPLEMENTS',
    expiresIn: '47:59:12',
    code: 'ARISE20',
    status: 'ACTIVE',
  },
  {
    id: '2',
    badge: '',
    badgeType: 'icon',
    iconName: 'dumbbell',
    title: 'PREMIUM GYM ACCESS PASS',
    expiresIn: '12:15:44',
    code: 'PUMP72',
    status: 'ACTIVE',
  },
  {
    id: '3',
    badge: '',
    badgeType: 'icon',
    iconName: 'tshirt-crew',
    title: 'ARISE X GEAR COLLAB',
    expiresIn: '02:11:05',
    code: 'XGEAR15',
    status: 'ACTIVE',
  },
  {
    id: '4',
    badge: '15%',
    badgeType: 'percent',
    title: 'SOLO MONARCH ENERGY DRINK',
    expiresIn: 'EXPIRED',
    code: 'MONARCH15',
    status: 'EXPIRED',
  },
  {
    id: '5',
    badge: '500 XP',
    badgeType: 'percent',
    title: 'DAILY STREAK BONUS XP',
    expiresIn: 'CLAIMED',
    code: 'STREAK500',
    status: 'USED',
  },
];

export default function RewardsScreen() {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>('level');
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [activeTab, setActiveTab] = useState<WalletTab>('ACTIVE');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(85512); // 23:45:12

  const expandScale = useSharedValue(1);
  const textOpacity = useSharedValue(1);
  const colorFillScale = useSharedValue(0);
  const colorFillOpacity = useSharedValue(0);
  const [isExpanding, setIsExpanding] = useState(false);

  const handleBadgeTap = () => {
    if (isExpanding) return;
    setIsExpanding(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});

    textOpacity.value = withTiming(0, { duration: 250 });
    expandScale.value = withTiming(1.15, { duration: 250 });

    colorFillOpacity.value = withTiming(1, { duration: 150 });
    colorFillScale.value = withTiming(
      6.0,
      { duration: 550, easing: Easing.bezier(0.4, 0, 0.2, 1) },
      (finished) => {
        if (finished) {
          runOnJS(navigateToTreasure)();
        }
      }
    );
  };

  const navigateToTreasure = () => {
    setStep('treasure');
    setIsExpanding(false);
    expandScale.value = 1;
    textOpacity.value = 1;
    
    colorFillOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
      if (finished) {
        colorFillScale.value = 0;
      }
    });
  };

  const animatedBadgeScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: expandScale.value }],
  }));

  const animatedFadeTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const animatedColorFillStyle = useAnimatedStyle(() => ({
    opacity: colorFillOpacity.value,
    transform: [{ scale: colorFillScale.value }],
  }));

  const btnPulse = useSharedValue(1);

  useEffect(() => {
    btnPulse.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 900 }),
        withTiming(1, { duration: 900 })
      ),
      -1,
      true
    );
  }, []);

  const animatedBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnPulse.value }],
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 86400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    try {
      await Share.share({
        message: '🔥 Just claimed my daily Hunter loot box on Arise! Current streak: 12 Days! Level 12 Hunter Status unlocked.',
      });
    } catch (e) {
      console.log('Share error:', e);
    }
  };

  const handleCopyCode = (code: string) => {
    Clipboard.setString(code);
    setCopiedCode(code);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const handleClaimRewardModal = () => {
    setShowRewardModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setStep('wallet');
  };

  return (
    <View style={styles.rootView}>
      <LinearGradient colors={['#0D0D11', '#070709', '#030304']} style={StyleSheet.absoluteFillObject} />
      
      {/* Full-Screen Ambient Animations (Level Screen Only) */}
      {step === 'level' && <FullScreenAmbientAnimation />}

      {/* Vibrant Gold Color Fill Transition Burst */}
      <Animated.View style={[styles.colorFillOverlay, animatedColorFillStyle]} pointerEvents="none">
        <LinearGradient
          colors={['#FFE066', '#F59E0B', '#D97706', '#7C2D12']}
          style={styles.colorFillGradient}
        />
      </Animated.View>

      <SafeAreaView style={styles.safeArea}>
        {/* Toast Notification */}
        {copiedCode && (
          <View style={styles.toastContainer}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.toastText}>Code {copiedCode} copied to clipboard!</Text>
          </View>
        )}

        {/* STEP 1: REWARD LEVEL SCREEN */}
        {step === 'level' && (
          <View style={styles.fullScreenContainer}>
            <View style={styles.levelContentArea}>
              <Animated.View style={[styles.centeredCol, animatedFadeTextStyle]}>
                <Text style={styles.levelHeaderTitle}>LEVEL UP</Text>
                <Text style={styles.levelSubtitle}>
                  YOU'VE REACHED A NEW TIER IN THE ARISE ARENA.
                </Text>
              </Animated.View>

              {/* Hexagon Rank Frame with Screen-Fill Expansion */}
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={handleBadgeTap}
              >
                <Animated.View style={animatedBadgeScaleStyle}>
                  <HexagonBadge level={12} rankTitle="CURRENT RANK" size={270} />
                </Animated.View>
              </TouchableOpacity>

              <Animated.Text style={[styles.nextRewardText, animatedFadeTextStyle]}>
                Tap badge to unlock reward!
              </Animated.Text>
            </View>

            {/* Bottom Actions */}
            <Animated.View style={[styles.bottomButtonContainer, animatedFadeTextStyle]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.secondaryButton}
                onPress={() => router.back()}
              >
                <Text style={styles.secondaryButtonText}>SKIP TO DASHBOARD</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        {/* STEP 2: TREASURE BOX & SCRATCH CARD */}
        {step === 'treasure' && (
          <View style={styles.fullScreenContainer}>
            {/* Top Navigation Bar & Streak Badge */}
            <View style={styles.topNavBar}>
              <TouchableOpacity
                style={styles.navBackButton}
                onPress={() => setStep('level')}
              >
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.streakBadgePill}>
                <Text style={styles.streakBadgeText}>🔥 12-DAY STREAK</Text>
              </View>

              <View style={{ width: 40 }} />
            </View>

            <ScrollView
              contentContainerStyle={styles.treasureScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.treasureHeaderBox}>
                <View style={styles.todaysRewardHeaderRow}>
                  <View style={styles.headerOrnamentLine} />
                  <Text style={styles.todaysRewardTag}>TODAY'S REWARD</Text>
                  <View style={styles.headerOrnamentLine} />
                </View>

                <Text style={styles.treasureTitle}>A LOOT AWAITS YOU!</Text>
                <Text style={styles.treasureSubtitle}>
                  Open your chest and reveal today's surprise.
                </Text>
              </View>

              {/* Loot Chest Graphic */}
              <TreasureChestVisual size={260} />

              {/* Scratch Card */}
              <ScratchCard
                onComplete={() => setShowRewardModal(true)}
                rewardText="+100 EXP"
                rewardSubtitle="Hunter Rank XP Booster"
              />

              <View style={styles.dividerLine} />

              {/* Footer Streak & Drop Countdown */}
              <View style={styles.footerStatsRow}>
                <View style={styles.footerStatCol}>
                  <Text style={styles.footerStatLabel}>CURRENT STREAK</Text>
                  <Text style={styles.footerStatValue}>12 DAYS</Text>
                </View>
                <View style={styles.footerStatDivider} />
                <View style={styles.footerStatCol}>
                  <Text style={styles.footerStatLabel}>NEXT DROP IN</Text>
                  <Text style={styles.footerStatValue}>{formatTimer(secondsLeft)}</Text>
                </View>
              </View>

              <Text style={styles.footerQuote}>
                "Peak performance is built on consistency. Return tomorrow to upgrade your streak rank."
              </Text>
            </ScrollView>
          </View>
        )}

        {/* STEP 3: REWARD POPUP MODAL */}
        <Modal
          visible={showRewardModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowRewardModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.popupCardContainer}>
              <View style={styles.popupConfettiHeader}>
                <MaterialCommunityIcons name="party-popper" size={36} color="#F59E0B" />
              </View>

              <Text style={styles.popupTitle}>REWARD UNLOCKED!</Text>

              {/* Gold Pill Badge */}
              <View style={styles.expPillContainer}>
                <Text style={styles.expPillText}>+100 EXP</Text>
              </View>

              <Text style={styles.popupMessage}>
                Experience points credited to your Hunter profile! Claim to level up your rank status.
              </Text>

              {/* Primary Claim CTA */}
              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.popupClaimButton}
                onPress={handleClaimRewardModal}
              >
                <Text style={styles.popupClaimButtonText}>CLAIM REWARD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* STEP 4: REWARDS WALLET SCREEN */}
        {step === 'wallet' && (
          <View style={styles.fullScreenContainer}>
            {/* Wallet Header */}
            <View style={styles.walletHeaderContainer}>
              <TouchableOpacity
                style={styles.navBackButton}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.walletSubTag}>HUNTER</Text>
                <Text style={styles.walletHeaderTitle}>
                  REWARDS <Text style={styles.goldText}>WALLET</Text>
                </Text>
                <Text style={styles.walletHeaderDesc}>
                  OPTIMIZED BENEFITS FOR PEAK PERFORMANCE
                </Text>
              </View>
            </View>

            {/* Wallet Segmented Tabs */}
            <View style={styles.walletTabsContainer}>
              {(['ACTIVE', 'USED', 'EXPIRED'] as WalletTab[]).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    activeOpacity={0.7}
                    style={styles.walletTabItem}
                    onPress={() => {
                      Haptics.selectionAsync().catch(() => {});
                      setActiveTab(tab);
                    }}
                  >
                    <Text style={[styles.walletTabText, isActive && styles.walletTabTextActive]}>
                      {tab}
                    </Text>
                    {isActive && <View style={styles.walletTabActiveIndicator} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Wallet List */}
            <ScrollView
              contentContainerStyle={styles.walletScrollList}
              showsVerticalScrollIndicator={false}
            >
              {INITIAL_COUPONS.filter((item) => item.status === activeTab).map((coupon) => (
                <View key={coupon.id} style={styles.couponCard}>
                  <View style={styles.couponHeaderRow}>
                    {/* Left Icon / Badge Box */}
                    <View style={styles.couponBadgeBox}>
                      {coupon.badgeType === 'percent' ? (
                        <Text style={styles.couponBadgeText}>{coupon.badge}</Text>
                      ) : (
                        <FontAwesome5
                          name={coupon.iconName || 'gift'}
                          size={24}
                          color="#F59E0B"
                        />
                      )}
                    </View>

                    {/* Right Title & Expiry */}
                    <View style={styles.couponInfoCol}>
                      <Text style={styles.couponTitle}>{coupon.title}</Text>
                      <View style={styles.couponExpiryRow}>
                        <Ionicons name="time-outline" size={14} color="#F59E0B" />
                        <Text style={styles.couponExpiryText}>
                          {coupon.status === 'ACTIVE'
                            ? `EXPIRES IN: ${coupon.expiresIn}`
                            : coupon.expiresIn}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Promo Code Box */}
                  <View style={styles.promoCodeBox}>
                    <Text style={styles.promoCodeText}>{coupon.code}</Text>
                    <TouchableOpacity
                      onPress={() => handleCopyCode(coupon.code)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <MaterialCommunityIcons name="content-copy" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  {/* Copy Button */}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.couponActionButton,
                      coupon.status !== 'ACTIVE' && styles.couponActionButtonDisabled,
                    ]}
                    disabled={coupon.status !== 'ACTIVE'}
                    onPress={() => handleCopyCode(coupon.code)}
                  >
                    <Text
                      style={[
                        styles.couponActionText,
                        coupon.status !== 'ACTIVE' && styles.couponActionTextDisabled,
                      ]}
                    >
                      {coupon.status === 'ACTIVE' ? 'COPY CODE >' : coupon.status}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

              {INITIAL_COUPONS.filter((item) => item.status === activeTab).length === 0 && (
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons name="ticket-percent-outline" size={48} color="#3F3F46" />
                  <Text style={styles.emptyText}>No {activeTab.toLowerCase()} rewards found.</Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: '#070709',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  colorFillOverlay: {
    position: 'absolute',
    top: '45%',
    left: '50%',
    width: 200,
    height: 200,
    marginLeft: -100,
    marginTop: -100,
    borderRadius: 100,
    zIndex: 998,
    overflow: 'hidden',
  },
  colorFillGradient: {
    flex: 1,
    borderRadius: 100,
  },
  fullScreenContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  toastContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastText: {
    fontFamily: fontFamilies.medium,
    color: '#E4E4E7',
    fontSize: 13,
    fontWeight: '600',
  },

  /* STEP 1: LEVEL STYLES */
  centeredCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topSkipHeader: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  levelContentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelHeaderTitle: {
    fontFamily: fontFamilies.bold,
    color: '#F59E0B',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 3,
    textShadowColor: 'rgba(245, 158, 11, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  levelSubtitle: {
    fontFamily: fontFamilies.bold,
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 6,
    marginBottom: 8,
    textAlign: 'center',
  },
  nextRewardText: {
    fontFamily: fontFamilies.semiBold,
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  bottomButtonContainer: {
    paddingBottom: 28,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    fontFamily: fontFamilies.bold,
    color: '#09090B',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2,
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontFamily: fontFamilies.bold,
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  /* STEP 2: TREASURE STYLES */
  topNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 20,
  },
  navBackButton: {
    padding: 8,
    marginLeft: -8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakBadgePill: {
    backgroundColor: '#1F1B12',
    borderWidth: 1,
    borderColor: '#D97706',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  streakBadgeText: {
    fontFamily: fontFamilies.bold,
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  treasureScrollContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 32,
  },
  treasureHeaderBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  todaysRewardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 8,
    marginVertical: 4,
  },
  headerOrnamentLine: {
    width: 24,
    height: 1,
    backgroundColor: '#F97316',
    opacity: 0.8,
  },
  todaysRewardTag: {
    fontFamily: fontFamilies.bold,
    color: '#F97316',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
  },
  treasureTitle: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  treasureSubtitle: {
    fontFamily: fontFamilies.regular,
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  shareAchievementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
    width: 320,
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: 'center',
    marginTop: 8,
  },
  shareAchievementText: {
    fontFamily: fontFamilies.bold,
    color: '#E4E4E7',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  dividerLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#27272A',
    marginVertical: 20,
  },
  footerStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    marginVertical: 4,
  },
  footerStatCol: {
    alignItems: 'center',
  },
  footerStatLabel: {
    fontFamily: fontFamilies.bold,
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footerStatValue: {
    fontFamily: fontFamilies.bold,
    color: '#F59E0B',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
    letterSpacing: 1,
  },
  footerStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#27272A',
  },
  footerQuote: {
    fontFamily: fontFamilies.italic,
    color: '#71717A',
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 18,
    paddingHorizontal: 24,
    lineHeight: 16,
  },

  /* STEP 3: MODAL POPUP */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  popupCardContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#18181B',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#D97706',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  popupConfettiHeader: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  popupTitle: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  expPillContainer: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  expPillText: {
    fontFamily: fontFamilies.bold,
    color: '#F59E0B',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
  },
  popupMessage: {
    fontFamily: fontFamilies.regular,
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  popupClaimButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupClaimButtonText: {
    fontFamily: fontFamilies.bold,
    color: '#09090B',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  /* STEP 4: WALLET STYLES */
  walletHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletSubTag: {
    fontFamily: fontFamilies.bold,
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  walletHeaderTitle: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  goldText: {
    color: '#F59E0B',
  },
  walletHeaderDesc: {
    fontFamily: fontFamilies.bold,
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2,
  },
  walletTabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    marginBottom: 16,
  },
  walletTabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  walletTabText: {
    fontFamily: fontFamilies.bold,
    color: '#71717A',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  walletTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  walletTabActiveIndicator: {
    position: 'absolute',
    bottom: -1,
    height: 3,
    width: '60%',
    backgroundColor: '#F59E0B',
    borderRadius: 2,
  },
  walletScrollList: {
    paddingBottom: 32,
    gap: 14,
  },
  couponCard: {
    backgroundColor: '#18181B',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#27272A',
    padding: 16,
    gap: 12,
  },
  couponHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  couponBadgeBox: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponBadgeText: {
    fontFamily: fontFamilies.bold,
    color: '#09090B',
    fontSize: 18,
    fontWeight: '900',
  },
  couponInfoCol: {
    flex: 1,
  },
  couponTitle: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  couponExpiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  couponExpiryText: {
    fontFamily: fontFamilies.bold,
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
  },
  promoCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#09090B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  promoCodeText: {
    fontFamily: fontFamilies.bold,
    color: '#E4E4E7',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
  },
  couponActionButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponActionButtonDisabled: {
    backgroundColor: '#27272A',
  },
  couponActionText: {
    fontFamily: fontFamilies.bold,
    color: '#09090B',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  couponActionTextDisabled: {
    color: '#71717A',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontFamily: fontFamilies.regular,
    color: '#71717A',
    fontSize: 14,
  },
});

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Share,
  Clipboard,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { ScratchCard, ScratchRarity } from '../components/features/ScratchCard';
import { fontFamilies } from '../theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// 2 cards per row calculation: screen width - horizontal padding (20*2=40) - grid gap (12) divided by 2
const GRID_CARD_WIDTH = (SCREEN_WIDTH - 40 - 12) / 2;

export type WalletTab = 'ACTIVE' | 'USED' | 'EXPIRED';

export interface CouponReward {
  id: string;
  badge: string;
  badgeType: 'percent' | 'icon' | 'xp';
  iconName?: string;
  title: string;
  subtitle?: string;
  expiresIn: string;
  code: string;
  isScratched: boolean;
  isUsed: boolean;
  isExpired: boolean;
  rarity?: ScratchRarity;
}

const INITIAL_COUPONS: CouponReward[] = [
  {
    id: '1',
    badge: '20% OFF',
    badgeType: 'percent',
    title: 'ARISE PERFORMANCE',
    subtitle: 'Supplements & Protein',
    expiresIn: '47:59:12',
    code: 'ARISE20',
    isScratched: false,
    isUsed: false,
    isExpired: false,
    rarity: 'legendary',
  },
  {
    id: '2',
    badge: '+500 XP',
    badgeType: 'xp',
    iconName: 'trophy',
    title: 'DAILY STREAK LOOT',
    subtitle: 'Hunter Rank XP Booster',
    expiresIn: '23:14:00',
    code: 'STREAK500',
    isScratched: false,
    isUsed: false,
    isExpired: false,
    rarity: 'legendary',
  },
  {
    id: '3',
    badge: 'FREE PASS',
    badgeType: 'icon',
    iconName: 'dumbbell',
    title: 'PREMIUM GYM ACCESS',
    subtitle: '1-Day All Access Pass',
    expiresIn: '12:15:44',
    code: 'PUMP72',
    isScratched: true,
    isUsed: false,
    isExpired: false,
    rarity: 'epic',
  },
  {
    id: '4',
    badge: '15% OFF',
    badgeType: 'percent',
    title: 'SOLO MONARCH DRINK',
    subtitle: 'Energy & Electrolytes',
    expiresIn: '08:42:19',
    code: 'MONARCH15',
    isScratched: true,
    isUsed: false,
    isExpired: false,
    rarity: 'rare',
  },
  {
    id: '5',
    badge: '30% OFF',
    badgeType: 'percent',
    title: 'ARISE GEAR COLLAB',
    subtitle: 'Apparel & Training Wear',
    expiresIn: 'REDEEMED',
    code: 'XGEAR30',
    isScratched: true,
    isUsed: true,
    isExpired: false,
    rarity: 'epic',
  },
  {
    id: '6',
    badge: '+250 XP',
    badgeType: 'xp',
    iconName: 'lightning-bolt',
    title: 'QUEST VICTORY REWARD',
    subtitle: 'Weekly Quest Completion',
    expiresIn: 'CLAIMED',
    code: 'QUEST250',
    isScratched: true,
    isUsed: true,
    isExpired: false,
    rarity: 'common',
  },
  {
    id: '7',
    badge: 'MYSTERY CHEST',
    badgeType: 'icon',
    iconName: 'treasure-chest',
    title: 'WARRIOR CHEST',
    subtitle: 'Unopened Missed Drop',
    expiresIn: 'EXPIRED',
    code: 'SEASON1',
    isScratched: false,
    isUsed: false,
    isExpired: true,
    rarity: 'rare',
  },
  {
    id: '8',
    badge: '50% OFF',
    badgeType: 'percent',
    title: 'EARLY BIRD PROMO',
    subtitle: 'Hunter Launch Special',
    expiresIn: 'EXPIRED',
    code: 'LAUNCH50',
    isScratched: true,
    isUsed: false,
    isExpired: true,
    rarity: 'common',
  },
];

export default function RewardsScreen() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<CouponReward[]>(INITIAL_COUPONS);
  const [activeTab, setActiveTab] = useState<WalletTab>('ACTIVE');
  
  // Scratch modal state
  const [scratchingCard, setScratchingCard] = useState<CouponReward | null>(null);
  const [showRewardSuccessModal, setShowRewardSuccessModal] = useState(false);
  const [justRevealedReward, setJustRevealedReward] = useState<CouponReward | null>(null);

  // Coupon detail modal state
  const [selectedDetailsCard, setSelectedDetailsCard] = useState<CouponReward | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView>(null);

  // Filter cards based on user requirement:
  // - ACTIVE tab: contains non-scratched cards AND non-expired cards
  // - USED tab: contains only used cards that are already scratched
  // - EXPIRED tab: contains non-scratched AND scratched expired cards
  const activeCards = coupons.filter((c) => !c.isUsed && !c.isExpired);
  const usedCards = coupons.filter((c) => c.isUsed);
  const expiredCards = coupons.filter((c) => c.isExpired);

  const getCurrentTabCards = () => {
    switch (activeTab) {
      case 'ACTIVE':
        return activeCards;
      case 'USED':
        return usedCards;
      case 'EXPIRED':
        return expiredCards;
      default:
        return activeCards;
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

  const handleCardPress = (card: CouponReward) => {
    Haptics.selectionAsync().catch(() => {});

    if (!card.isScratched) {
      // Open interactive scratch card modal
      setScratchingCard(card);
    } else {
      // Open coupon details modal
      setSelectedDetailsCard(card);
    }
  };

  const handleScratchComplete = () => {
    if (!scratchingCard) return;

    const updatedCard = { ...scratchingCard, isScratched: true };
    setCoupons((prev) => prev.map((c) => (c.id === scratchingCard.id ? updatedCard : c)));
    setJustRevealedReward(updatedCard);
    setScratchingCard(null);
    
    setTimeout(() => {
      setShowRewardSuccessModal(true);
    }, 300);
  };

  const handleMarkAsUsed = (cardId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setCoupons((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isUsed: true, expiresIn: 'REDEEMED' } : c))
    );
    setSelectedDetailsCard(null);
  };

  const getRarityColor = (rarity: ScratchRarity = 'legendary') => {
    switch (rarity) {
      case 'legendary':
        return '#F59E0B';
      case 'epic':
        return '#C084FC';
      case 'rare':
        return '#38BDF8';
      case 'common':
        return '#34D399';
    }
  };

  return (
    <View style={styles.rootView}>
      <LinearGradient colors={['#0D0D11', '#070709', '#030304']} style={StyleSheet.absoluteFillObject} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Toast Notification */}
        {copiedCode && (
          <View style={styles.toastContainer}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.toastText}>Code {copiedCode} copied to clipboard!</Text>
          </View>
        )}

        {/* HEADER BAR */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.navBackButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTag}>HUNTER ARENA</Text>
            <Text style={styles.headerTitle}>
              REWARDS <Text style={styles.goldText}>CENTER</Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.headerShareBtn} onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
            Share.share({ message: '🔥 Check out my Hunter rewards and loot streak on Arise!' }).catch(() => {});
          }}>
            <Ionicons name="share-social-outline" size={20} color="#F59E0B" />
          </TouchableOpacity>
        </View>

        {/* SUMMARY STATS BANNER */}
        <View style={styles.statsBanner}>
          <LinearGradient
            colors={['rgba(245, 158, 11, 0.12)', 'rgba(217, 119, 6, 0.04)']}
            style={styles.statsBannerGradient}
          >
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>TOTAL CARDS</Text>
              <Text style={styles.statValue}>{coupons.length}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>ACTIVE LOOT</Text>
              <Text style={[styles.statValue, { color: '#F59E0B' }]}>{activeCards.length}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>REDEEMED</Text>
              <Text style={[styles.statValue, { color: '#10B981' }]}>{usedCards.length}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* SEGMENTED 3 TABS (ACTIVE, USED, EXPIRED) */}
        <View style={styles.tabBarContainer}>
          {(['ACTIVE', 'USED', 'EXPIRED'] as WalletTab[]).map((tab) => {
            const isActive = activeTab === tab;
            let count = 0;
            if (tab === 'ACTIVE') count = activeCards.length;
            if (tab === 'USED') count = usedCards.length;
            if (tab === 'EXPIRED') count = expiredCards.length;

            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.75}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setActiveTab(tab);
                  scrollRef.current?.scrollTo({ y: 0, animated: false });
                }}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
                <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                  <Text style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 2-COLUMN GPAY CARD GRID */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollGridContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gridContainer}>
            {getCurrentTabCards().map((item) => {
              const rarityColor = getRarityColor(item.rarity);

              // UNSCRATCHED CARD (GPay Foil Style)
              if (!item.isScratched) {
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.88}
                    style={[
                      styles.gpayCardOuter,
                      { borderColor: item.isExpired ? '#3F3F46' : rarityColor },
                    ]}
                    onPress={() => handleCardPress(item)}
                  >
                    <LinearGradient
                      colors={
                        item.isExpired
                          ? ['#1F1F24', '#121215']
                          : ['#2A1D08', '#160E03', '#090501']
                      }
                      style={styles.gpayFoilCard}
                    >
                      {/* Metallic Shimmer Accents */}
                      <View style={styles.foilPatternOverlay} />

                      {/* Top Rarity Badge */}
                      <View
                        style={[
                          styles.cardBadgePill,
                          {
                            backgroundColor: item.isExpired
                              ? 'rgba(113, 113, 122, 0.2)'
                              : 'rgba(245, 158, 11, 0.2)',
                            borderColor: item.isExpired ? '#52525B' : rarityColor,
                          },
                        ]}
                      >
                        <Ionicons
                          name="sparkles"
                          size={10}
                          color={item.isExpired ? '#A1A1AA' : rarityColor}
                        />
                        <Text
                          style={[
                            styles.cardBadgeText,
                            { color: item.isExpired ? '#A1A1AA' : rarityColor },
                          ]}
                        >
                          {item.isExpired ? 'EXPIRED' : item.rarity?.toUpperCase() || 'MYSTERY'}
                        </Text>
                      </View>

                      {/* Mystery Icon */}
                      <View
                        style={[
                          styles.mysteryIconCircle,
                          { borderColor: item.isExpired ? '#3F3F46' : rarityColor },
                        ]}
                      >
                        <FontAwesome5
                          name={item.iconName || 'gift'}
                          size={26}
                          color={item.isExpired ? '#71717A' : rarityColor}
                        />
                      </View>

                      <Text style={styles.gpayCardTitle} numberOfLines={1}>
                        {item.title}
                      </Text>

                      {/* Touch / Scratch CTA Pill */}
                      <View
                        style={[
                          styles.scratchPill,
                          { borderColor: item.isExpired ? '#3F3F46' : rarityColor },
                        ]}
                      >
                        <FontAwesome5
                          name="hand-pointer"
                          size={10}
                          color={item.isExpired ? '#71717A' : '#FFFFFF'}
                        />
                        <Text
                          style={[
                            styles.scratchPillText,
                            { color: item.isExpired ? '#71717A' : '#FFFFFF' },
                          ]}
                        >
                          {item.isExpired ? 'VIEW DROP' : 'SCRATCH'}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              }

              // SCRATCHED CARD (Active, Used, or Expired)
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.88}
                  style={[
                    styles.gpayCardOuter,
                    styles.scratchedCardOuter,
                    item.isUsed && styles.dimmedCardOuter,
                    item.isExpired && styles.dimmedCardOuter,
                  ]}
                  onPress={() => handleCardPress(item)}
                >
                  <LinearGradient
                    colors={
                      item.isUsed || item.isExpired
                        ? ['#161619', '#0D0D10']
                        : ['#1F1A10', '#14120C', '#0C0A06']
                    }
                    style={styles.scratchedCardInner}
                  >
                    {/* Status Stamps */}
                    {item.isUsed && (
                      <View style={styles.stampBadgeUsed}>
                        <Text style={styles.stampTextUsed}>USED</Text>
                      </View>
                    )}
                    {item.isExpired && (
                      <View style={styles.stampBadgeExpired}>
                        <Text style={styles.stampTextExpired}>EXPIRED</Text>
                      </View>
                    )}

                    {/* Reward Value Badge */}
                    <Text
                      style={[
                        styles.scratchedBadgeValue,
                        (item.isUsed || item.isExpired) && styles.dimmedText,
                      ]}
                      numberOfLines={1}
                    >
                      {item.badge}
                    </Text>

                    {/* Brand / Title */}
                    <Text
                      style={[
                        styles.scratchedTitle,
                        (item.isUsed || item.isExpired) && styles.dimmedText,
                      ]}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>

                    {/* Promo Code Box */}
                    <View style={styles.codeSnippetBox}>
                      <Text style={styles.codeSnippetText} numberOfLines={1}>
                        {item.code}
                      </Text>
                      {!item.isUsed && !item.isExpired && (
                        <MaterialCommunityIcons name="content-copy" size={12} color="#F59E0B" />
                      )}
                    </View>

                    {/* Bottom Status / Action */}
                    <View style={styles.scratchedFooterRow}>
                      <Ionicons
                        name={
                          item.isUsed
                            ? 'checkmark-done'
                            : item.isExpired
                            ? 'time-outline'
                            : 'ticket-outline'
                        }
                        size={12}
                        color={
                          item.isUsed
                            ? '#10B981'
                            : item.isExpired
                            ? '#EF4444'
                            : '#F59E0B'
                        }
                      />
                      <Text
                        style={[
                          styles.scratchedFooterText,
                          {
                            color: item.isUsed
                              ? '#10B981'
                              : item.isExpired
                              ? '#EF4444'
                              : '#F59E0B',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {item.isUsed
                          ? 'REDEEMED'
                          : item.isExpired
                          ? 'EXPIRED'
                          : item.expiresIn}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* EMPTY STATE */}
          {getCurrentTabCards().length === 0 && (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="ticket-percent-outline" size={56} color="#3F3F46" />
              <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} cards</Text>
              <Text style={styles.emptySub}>
                {activeTab === 'ACTIVE'
                  ? 'Complete daily hunter quests to earn mystery scratch cards!'
                  : activeTab === 'USED'
                  ? 'Redeemed coupons and claimed rewards will appear here.'
                  : 'Expired scratch cards and rewards will be archived here.'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* MODAL 1: INTERACTIVE SCRATCH MODAL */}
        <Modal
          visible={!!scratchingCard}
          transparent
          animationType="fade"
          onRequestClose={() => setScratchingCard(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.scratchModalBox}>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setScratchingCard(null)}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <Text style={styles.scratchModalTitle}>SCRATCH YOUR CARD</Text>
              <Text style={styles.scratchModalSubtitle}>
                Swipe your finger over the foil layer to reveal your reward!
              </Text>

              {scratchingCard && (
                <ScratchCard
                  onComplete={handleScratchComplete}
                  rewardText={scratchingCard.badge}
                  rewardSubtitle={scratchingCard.title}
                  rarity={scratchingCard.rarity || 'legendary'}
                  iconName={(scratchingCard.iconName as any) || 'trophy-award'}
                  width={310}
                  height={180}
                />
              )}
            </View>
          </View>
        </Modal>

        {/* MODAL 2: REWARD REVEAL CELEBRATION */}
        <Modal
          visible={showRewardSuccessModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowRewardSuccessModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.successPopupBox}>
              <View style={styles.successIconCircle}>
                <MaterialCommunityIcons name="party-popper" size={38} color="#F59E0B" />
              </View>

              <Text style={styles.successTitle}>REWARD UNLOCKED!</Text>
              <Text style={styles.successRewardText}>
                {justRevealedReward?.badge}
              </Text>
              <Text style={styles.successSubtext}>
                {justRevealedReward?.title} - {justRevealedReward?.subtitle}
              </Text>

              {justRevealedReward?.code && (
                <TouchableOpacity
                  style={styles.copyCodeBanner}
                  onPress={() => handleCopyCode(justRevealedReward.code)}
                >
                  <Text style={styles.copyCodeBannerLabel}>PROMO CODE:</Text>
                  <Text style={styles.copyCodeBannerValue}>{justRevealedReward.code}</Text>
                  <MaterialCommunityIcons name="content-copy" size={16} color="#09090B" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.primaryModalBtn}
                onPress={() => {
                  setShowRewardSuccessModal(false);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                }}
              >
                <Text style={styles.primaryModalBtnText}>COLLECT TO WALLET</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* MODAL 3: COUPON DETAILS MODAL */}
        <Modal
          visible={!!selectedDetailsCard}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedDetailsCard(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.detailsModalBox}>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setSelectedDetailsCard(null)}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.detailsHeaderRow}>
                <View style={styles.detailsBadgeBox}>
                  <Text style={styles.detailsBadgeText}>{selectedDetailsCard?.badge}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailsTitle}>{selectedDetailsCard?.title}</Text>
                  <Text style={styles.detailsSubtitle}>{selectedDetailsCard?.subtitle}</Text>
                </View>
              </View>

              <View style={styles.modalDivider} />

              {/* Promo Code Copy Bar */}
              <View style={styles.detailCodeBox}>
                <View>
                  <Text style={styles.detailCodeLabel}>COUPON / VOUCHER CODE</Text>
                  <Text style={styles.detailCodeVal}>{selectedDetailsCard?.code}</Text>
                </View>
                <TouchableOpacity
                  style={styles.detailCopyBtn}
                  onPress={() => selectedDetailsCard && handleCopyCode(selectedDetailsCard.code)}
                >
                  <MaterialCommunityIcons name="content-copy" size={18} color="#09090B" />
                  <Text style={styles.detailCopyBtnText}>COPY</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.termsText}>
                • Valid on official partner apps and Arise store purchases.{'\n'}
                • Show or apply this code at checkout to claim discount/points.
              </Text>

              {/* Action CTAs */}
              {!selectedDetailsCard?.isUsed && !selectedDetailsCard?.isExpired ? (
                <TouchableOpacity
                  style={styles.useNowBtn}
                  onPress={() => selectedDetailsCard && handleMarkAsUsed(selectedDetailsCard.id)}
                >
                  <Text style={styles.useNowBtnText}>MARK AS REDEEMED</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.disabledStatusBanner}>
                  <Text style={styles.disabledStatusText}>
                    {selectedDetailsCard?.isUsed ? 'REWARD ALREADY CLAIMED' : 'REWARD HAS EXPIRED'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Modal>
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

  /* HEADER */
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  navBackButton: {
    padding: 6,
    marginLeft: -6,
  },
  headerTitleCol: {
    flex: 1,
    marginLeft: 8,
  },
  headerTag: {
    fontFamily: fontFamilies.bold,
    color: '#71717A',
    fontSize: 10,
    letterSpacing: 2,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontSize: 20,
    letterSpacing: 1,
  },
  goldText: {
    color: '#F59E0B',
  },
  headerShareBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* STATS BANNER */
  statsBanner: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  statsBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: fontFamilies.bold,
    color: '#71717A',
    fontSize: 9,
    letterSpacing: 1,
  },
  statValue: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  /* 3 SEGMENTED TABS */
  tabBarContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#121215',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  tabItemActive: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  tabText: {
    fontFamily: fontFamilies.bold,
    color: '#71717A',
    fontSize: 12,
    letterSpacing: 0.8,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabBadge: {
    backgroundColor: '#27272A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tabBadgeActive: {
    backgroundColor: '#F59E0B',
  },
  tabBadgeText: {
    fontFamily: fontFamilies.bold,
    color: '#A1A1AA',
    fontSize: 10,
  },
  tabBadgeTextActive: {
    color: '#09090B',
  },

  /* 2-COLUMN GRID */
  scrollGridContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  /* GPAY FOIL UNSCRATCHED CARD */
  gpayCardOuter: {
    width: GRID_CARD_WIDTH,
    height: 195,
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gpayFoilCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    position: 'relative',
  },
  foilPatternOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  cardBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  cardBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    letterSpacing: 0.8,
  },
  mysteryIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  gpayCardTitle: {
    fontFamily: fontFamilies.bold,
    color: '#E4E4E7',
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  scratchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  scratchPillText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    letterSpacing: 1,
  },

  /* SCRATCHED CARD */
  scratchedCardOuter: {
    borderColor: '#27272A',
  },
  dimmedCardOuter: {
    opacity: 0.6,
  },
  scratchedCardInner: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    position: 'relative',
  },
  stampBadgeUsed: {
    position: 'absolute',
    top: 10,
    right: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    transform: [{ rotate: '12deg' }],
    zIndex: 10,
  },
  stampTextUsed: {
    fontFamily: fontFamilies.bold,
    color: '#10B981',
    fontSize: 9,
    letterSpacing: 1,
  },
  stampBadgeExpired: {
    position: 'absolute',
    top: 10,
    right: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    transform: [{ rotate: '12deg' }],
    zIndex: 10,
  },
  stampTextExpired: {
    fontFamily: fontFamilies.bold,
    color: '#EF4444',
    fontSize: 9,
    letterSpacing: 1,
  },
  scratchedBadgeValue: {
    fontFamily: fontFamilies.bold,
    color: '#F59E0B',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  scratchedTitle: {
    fontFamily: fontFamilies.semiBold,
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 15,
    marginVertical: 4,
  },
  dimmedText: {
    color: '#71717A',
  },
  codeSnippetBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#09090B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginVertical: 4,
  },
  codeSnippetText: {
    fontFamily: fontFamilies.bold,
    color: '#E4E4E7',
    fontSize: 10,
    letterSpacing: 1,
  },
  scratchedFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scratchedFooterText: {
    fontFamily: fontFamilies.medium,
    fontSize: 9,
  },

  /* EMPTY STATE */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: fontFamilies.bold,
    color: '#E4E4E7',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  emptySub: {
    fontFamily: fontFamilies.regular,
    color: '#71717A',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },

  /* MODALS */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  /* SCRATCH MODAL */
  scratchModalBox: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#121215',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    padding: 20,
    alignItems: 'center',
  },
  scratchModalTitle: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontSize: 18,
    letterSpacing: 1,
    marginTop: 6,
  },
  scratchModalSubtitle: {
    fontFamily: fontFamilies.regular,
    color: '#9CA3AF',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },

  /* REWARD SUCCESS POPUP */
  successPopupBox: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#18181B',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    padding: 24,
    alignItems: 'center',
  },
  successIconCircle: {
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
  successTitle: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontSize: 18,
    letterSpacing: 1.5,
  },
  successRewardText: {
    fontFamily: fontFamilies.bold,
    color: '#F59E0B',
    fontSize: 28,
    marginVertical: 8,
  },
  successSubtext: {
    fontFamily: fontFamilies.regular,
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  copyCodeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  copyCodeBannerLabel: {
    fontFamily: fontFamilies.bold,
    color: '#09090B',
    fontSize: 10,
  },
  copyCodeBannerValue: {
    fontFamily: fontFamilies.bold,
    color: '#09090B',
    fontSize: 14,
    letterSpacing: 1.5,
  },
  primaryModalBtn: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryModalBtnText: {
    fontFamily: fontFamilies.bold,
    color: '#09090B',
    fontSize: 13,
    letterSpacing: 1,
  },

  /* DETAILS MODAL */
  detailsModalBox: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#18181B',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#27272A',
    padding: 20,
  },
  detailsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  detailsBadgeBox: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  detailsBadgeText: {
    fontFamily: fontFamilies.bold,
    color: '#09090B',
    fontSize: 16,
  },
  detailsTitle: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontSize: 14,
  },
  detailsSubtitle: {
    fontFamily: fontFamilies.regular,
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 2,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#27272A',
    marginVertical: 16,
  },
  detailCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#09090B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  detailCodeLabel: {
    fontFamily: fontFamilies.bold,
    color: '#71717A',
    fontSize: 9,
    letterSpacing: 0.8,
  },
  detailCodeVal: {
    fontFamily: fontFamilies.bold,
    color: '#E4E4E7',
    fontSize: 15,
    letterSpacing: 2,
    marginTop: 2,
  },
  detailCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailCopyBtnText: {
    fontFamily: fontFamilies.bold,
    color: '#09090B',
    fontSize: 11,
  },
  termsText: {
    fontFamily: fontFamilies.regular,
    color: '#71717A',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 18,
  },
  useNowBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  useNowBtnText: {
    fontFamily: fontFamilies.bold,
    color: '#09090B',
    fontSize: 13,
    letterSpacing: 1,
  },
  disabledStatusBanner: {
    backgroundColor: '#27272A',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledStatusText: {
    fontFamily: fontFamilies.bold,
    color: '#71717A',
    fontSize: 12,
    letterSpacing: 1,
  },
});

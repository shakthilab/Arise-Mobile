import React, { useState } from 'react';
import {
  Clipboard,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { fontFamilies } from '@/theme/typography';

interface RewardsWalletModalProps {
  visible: boolean;
  onClose: () => void;
}

const ACCENT_YELLOW = '#FFD700';

interface RewardItem {
  id: string;
  badgeType: 'percent' | 'icon';
  badgeValue?: string;
  badgeIcon?: string;
  badgeBg?: string;
  title: string;
  expiresIn: string;
  code: string;
}

const ACTIVE_REWARDS: RewardItem[] = [
  {
    id: '1',
    badgeType: 'percent',
    badgeValue: '20%',
    badgeBg: ACCENT_YELLOW,
    title: 'ARISE PERFORMANCE SUPPLEMENTS',
    expiresIn: '47:59:12',
    code: 'ARISE20',
  },
  {
    id: '2',
    badgeType: 'icon',
    badgeIcon: 'barbell-outline',
    badgeBg: '#2C2C2E',
    title: 'PREMIUM GYM ACCESS PASS',
    expiresIn: '12:15:44',
    code: 'PUMP72',
  },
  {
    id: '3',
    badgeType: 'icon',
    badgeIcon: 'shirt-outline',
    badgeBg: ACCENT_YELLOW,
    title: 'ARISE X GEAR COLLAB',
    expiresIn: '02:11:05',
    code: 'XGEAR15',
  },
];

export const RewardsWalletModal: React.FC<RewardsWalletModalProps> = ({
  visible,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'USED' | 'EXPIRED'>('ACTIVE');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (id: string, code: string) => {
    try {
      Clipboard.setString(code);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {}

    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0C" />
      <SafeAreaView style={styles.container}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>HUNTER</Text>
          <View style={styles.headerRightSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Subtitle Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitleMain}>
              REWARDS <Text style={styles.heroTitleGold}>WALLET</Text>
            </Text>
            <Text style={styles.heroSubText}>
              OPTIMIZED BENEFITS FOR PEAK PERFORMANCE
            </Text>
          </View>

          {/* Tabs Bar */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'ACTIVE' && styles.tabItemActive]}
              onPress={() => setActiveTab('ACTIVE')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'ACTIVE' && styles.tabTextActive,
                ]}
              >
                ACTIVE
              </Text>
              {activeTab === 'ACTIVE' && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveTab('USED')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'USED' && styles.tabTextActive,
                ]}
              >
                USED
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveTab('EXPIRED')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'EXPIRED' && styles.tabTextActive,
                ]}
              >
                EXPIRED
              </Text>
            </TouchableOpacity>
          </View>

          {/* Active Rewards List */}
          {activeTab === 'ACTIVE' ? (
            <View style={styles.cardsList}>
              {ACTIVE_REWARDS.map((item) => {
                const isCopied = copiedId === item.id;
                return (
                  <View key={item.id} style={styles.rewardCard}>
                    {/* Top Row: Badge & Details */}
                    <View style={styles.cardHeaderRow}>
                      {/* Badge Box */}
                      <View
                        style={[
                          styles.badgeBox,
                          { backgroundColor: item.badgeBg || ACCENT_YELLOW },
                        ]}
                      >
                        {item.badgeType === 'percent' ? (
                          <Text style={styles.badgePercentText}>{item.badgeValue}</Text>
                        ) : (
                          <Ionicons
                            name={item.badgeIcon as any}
                            size={28}
                            color={item.badgeBg === ACCENT_YELLOW ? '#000000' : ACCENT_YELLOW}
                          />
                        )}
                      </View>

                      {/* Info Column */}
                      <View style={styles.cardInfoCol}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <View style={styles.expiryRow}>
                          <Ionicons name="time-outline" size={13} color={ACCENT_YELLOW} />
                          <Text style={styles.expiryText}>
                            EXPIRES IN: {item.expiresIn}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Promo Code Copy Box */}
                    <View style={styles.codeBox}>
                      <Text style={styles.codeText}>{item.code}</Text>
                      <TouchableOpacity
                        style={styles.copyIconBtn}
                        onPress={() => handleCopyCode(item.id, item.code)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={isCopied ? 'checkmark-circle' : 'copy-outline'}
                          size={18}
                          color={isCopied ? '#4ADE80' : ACCENT_YELLOW}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Copy Code Primary Action Button */}
                    <TouchableOpacity
                      style={styles.copyActionBtn}
                      activeOpacity={0.85}
                      onPress={() => handleCopyCode(item.id, item.code)}
                    >
                      <Text style={styles.copyActionBtnText}>
                        {isCopied ? 'COPIED TO CLIPBOARD ✓' : 'COPY CODE >'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="ticket-outline" size={48} color="#3A3A3C" />
              <Text style={styles.emptyText}>No {activeTab.toLowerCase()} rewards found.</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1E',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: ACCENT_YELLOW,
    letterSpacing: 2,
  },
  headerRightSpacer: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },

  /* Hero Section */
  heroSection: {
    marginBottom: 24,
  },
  heroTitleMain: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroTitleGold: {
    color: ACCENT_YELLOW,
  },
  heroSubText: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    color: '#A1A1AA',
    letterSpacing: 1.5,
  },

  /* Tabs Row */
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    marginBottom: 20,
  },
  tabItem: {
    paddingVertical: 10,
    marginRight: 28,
    position: 'relative',
  },
  tabItemActive: {},
  tabText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: '#71717A',
    letterSpacing: 1.5,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: ACCENT_YELLOW,
  },

  /* Cards List */
  cardsList: {
    gap: 16,
  },
  rewardCard: {
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: '#242428',
    borderRadius: 8,
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  badgeBox: {
    width: 64,
    height: 64,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePercentText: {
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    color: '#000000',
  },
  cardInfoCol: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.8,
    marginBottom: 6,
    lineHeight: 18,
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expiryText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: ACCENT_YELLOW,
    letterSpacing: 1,
  },

  /* Promo Code Box */
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1E',
    borderWidth: 1,
    borderColor: '#2C2C30',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  codeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#E4E4E7',
    letterSpacing: 1.5,
  },
  copyIconBtn: {
    padding: 4,
  },

  /* Copy Action Button */
  copyActionBtn: {
    width: '100%',
    height: 44,
    backgroundColor: ACCENT_YELLOW,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyActionBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#000000',
    letterSpacing: 1.5,
  },

  /* Empty State */
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: '#71717A',
  },
});

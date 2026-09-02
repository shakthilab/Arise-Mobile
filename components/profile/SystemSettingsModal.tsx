import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GoogleIcon } from '@/components/common/GoogleIcon';
import { Screen } from '@/components/common/Screen';
import { fontFamilies } from '@/theme/typography';
import { HunterSwitch } from './HunterSwitch';

export interface SystemSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  user: any;
  onUpdateUser: (updatedUser: any) => void;
  unitSystem: 'metric' | 'imperial';
  onUnitSystemChange: (system: 'metric' | 'imperial') => void;
  soundEffectsEnabled: boolean;
  setSoundEffectsEnabled: (val: boolean) => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (val: boolean) => void;
  allNotificationsEnabled: boolean;
  setAllNotificationsEnabled: (val: boolean) => void;
  dailyMotivationEnabled: boolean;
  setDailyMotivationEnabled: (val: boolean) => void;
  taskRemindersEnabled: boolean;
  setTaskRemindersEnabled: (val: boolean) => void;
  streakAtRiskEnabled: boolean;
  setStreakAtRiskEnabled: (val: boolean) => void;
  streakMilestonesEnabled: boolean;
  setStreakMilestonesEnabled: (val: boolean) => void;
  streakStatusAlertsEnabled: boolean;
  setStreakStatusAlertsEnabled: (val: boolean) => void;
  levelUpAlertsEnabled: boolean;
  setLevelUpAlertsEnabled: (val: boolean) => void;
  rewardReadyAlertsEnabled: boolean;
  setRewardReadyAlertsEnabled: (val: boolean) => void;
  announcementsEnabled: boolean;
  setAnnouncementsEnabled: (val: boolean) => void;
}

export function SystemSettingsModal({
  visible,
  onClose,
  user,
  onUpdateUser,
  unitSystem,
  onUnitSystemChange,
  soundEffectsEnabled,
  setSoundEffectsEnabled,
  hapticsEnabled,
  setHapticsEnabled,
  allNotificationsEnabled,
  setAllNotificationsEnabled,
  dailyMotivationEnabled,
  setDailyMotivationEnabled,
  taskRemindersEnabled,
  setTaskRemindersEnabled,
  streakAtRiskEnabled,
  setStreakAtRiskEnabled,
  streakMilestonesEnabled,
  setStreakMilestonesEnabled,
  streakStatusAlertsEnabled,
  setStreakStatusAlertsEnabled,
  levelUpAlertsEnabled,
  setLevelUpAlertsEnabled,
  rewardReadyAlertsEnabled,
  setRewardReadyAlertsEnabled,
  announcementsEnabled,
  setAnnouncementsEnabled,
}: SystemSettingsModalProps) {
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('dark');

  // Submodals
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [isChangeEmailModalVisible, setIsChangeEmailModalVisible] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [newEmailInput, setNewEmailInput] = useState('');

  const handleChangePassword = () => {
    if (!currentPasswordInput || !newPasswordInput || !confirmPasswordInput) {
      Alert.alert('Error', 'Please fill in all password fields.');
      return;
    }
    if (newPasswordInput.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Alert.alert('Success', 'Your password has been updated.');
    setIsChangePasswordModalVisible(false);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
  };

  const handleChangeEmail = () => {
    const trimmed = newEmailInput.trim();
    if (!trimmed || !trimmed.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    if (user) {
      onUpdateUser({ ...user, email: trimmed });
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Alert.alert('Success', `Your email address has been updated to ${trimmed}.`);
    setIsChangeEmailModalVisible(false);
    setNewEmailInput('');
  };

  const handleDownloadData = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Alert.alert(
      'Data Export Requested',
      `We are preparing an archive of your HunterX workouts, quests, and account history. A download link will be emailed to ${
        user?.email || 'your registered email'
      } within 24 hours.`
    );
  };

  const providerStr =
    user?.provider ?? user?.authProvider ?? user?.auth_provider ?? 'EMAIL';
  const p = String(providerStr).toUpperCase();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Screen style={styles.screen}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onClose}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>System Settings</Text>
          <View style={{ width: 48 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* SECTION 1: APPEARANCE & THEME MODE */}
          <Text style={styles.sectionHeader}>APPEARANCE & THEME</Text>
          <View style={styles.settingsGroupCard}>
            <View style={styles.themeSelectorRow}>
              {/* Dark Mode - Active & Selected */}
              <TouchableOpacity
                style={[styles.themeModeCard, styles.themeModeCardSelected]}
                onPress={() => setThemeMode('dark')}
                activeOpacity={0.8}
              >
                <Ionicons name="moon" size={20} color="#FE5B01" />
                <Text style={[styles.themeModeText, styles.themeModeTextSelected]}>
                  Dark Mode
                </Text>
              </TouchableOpacity>

              {/* Light Mode - Disabled / Coming Soon */}
              <View style={[styles.themeModeCard, styles.themeModeCardDisabled]}>
                <View style={styles.comingSoonPill}>
                  <Text style={styles.comingSoonPillText}>SOON</Text>
                </View>
                <Ionicons name="sunny" size={20} color="#52525B" />
                <Text style={[styles.themeModeText, styles.themeModeTextDisabled]}>
                  Light Mode
                </Text>
              </View>

              {/* System - Disabled / Coming Soon */}
              <View style={[styles.themeModeCard, styles.themeModeCardDisabled]}>
                <View style={styles.comingSoonPill}>
                  <Text style={styles.comingSoonPillText}>SOON</Text>
                </View>
                <Ionicons name="hardware-chip" size={20} color="#52525B" />
                <Text style={[styles.themeModeText, styles.themeModeTextDisabled]}>
                  System
                </Text>
              </View>
            </View>
          </View>

          {/* SECTION 2: ACCOUNT & SECURITY */}
          <Text style={styles.sectionHeader}>ACCOUNT & SECURITY</Text>
          <View style={styles.settingsGroupCard}>
            {/* Linked Sign-in Method */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeftGroup}>
                <View style={styles.settingIconBox}>
                  <Ionicons name="shield-checkmark-outline" size={18} color="#FE5B01" />
                </View>
                <View style={styles.settingTextGroup}>
                  <Text style={styles.settingTitle}>Linked Sign-In Method</Text>
                  <Text style={styles.settingSubtitle}>
                    {user?.email || 'hunter@hunterx.app'}
                  </Text>
                </View>
              </View>
              {p === 'GOOGLE' ? (
                <View style={styles.googleProviderPill}>
                  <GoogleIcon size={16} />
                  <Text style={styles.googleProviderPillText}>Google</Text>
                </View>
              ) : p === 'APPLE' ? (
                <View style={styles.appleProviderPill}>
                  <Ionicons name="logo-apple" size={16} color="#FFFFFF" />
                  <Text style={styles.appleProviderPillText}>Apple</Text>
                </View>
              ) : (
                <View style={styles.emailProviderPill}>
                  <Ionicons name="mail-outline" size={16} color="#FE5B01" />
                  <Text style={styles.emailProviderPillText}>Email</Text>
                </View>
              )}
            </View>

            {/* Change Password (Only for Email accounts) */}
            {p !== 'GOOGLE' && p !== 'APPLE' && (
              <>
                <View style={styles.settingItemDivider} />
                <TouchableOpacity
                  style={styles.settingRow}
                  onPress={() => setIsChangePasswordModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingLeftGroup}>
                    <View style={styles.settingIconBox}>
                      <Ionicons name="key-outline" size={18} color="#FE5B01" />
                    </View>
                    <View style={styles.settingTextGroup}>
                      <Text style={styles.settingTitle}>Change Password</Text>
                      <Text style={styles.settingSubtitle}>
                        Update your account security credentials
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#71717A" />
                </TouchableOpacity>
              </>
            )}

            <View style={styles.settingItemDivider} />

            {/* Change Email */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => {
                setNewEmailInput(user?.email || '');
                setIsChangeEmailModalVisible(true);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeftGroup}>
                <View style={styles.settingIconBox}>
                  <Ionicons name="mail-outline" size={18} color="#FE5B01" />
                </View>
                <View style={styles.settingTextGroup}>
                  <Text style={styles.settingTitle}>Change Email</Text>
                  <Text style={styles.settingSubtitle}>Update primary email address</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#71717A" />
            </TouchableOpacity>
          </View>

          {/* SECTION 3: PREFERENCES */}
          <Text style={styles.sectionHeader}>PREFERENCES</Text>
          <View style={styles.settingsGroupCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeftGroup}>
                <View style={styles.settingIconBox}>
                  <Ionicons name="options-outline" size={18} color="#FE5B01" />
                </View>
                <View style={styles.settingTextGroup}>
                  <Text style={styles.settingTitle}>Measurement Units</Text>
                  <Text style={styles.settingSubtitle}>Used for height, weight & goals</Text>
                </View>
              </View>
              <View style={styles.unitsSegmentedContainer}>
                <TouchableOpacity
                  style={[
                    styles.unitSegmentBtn,
                    unitSystem === 'metric' && styles.unitSegmentBtnActive,
                  ]}
                  onPress={() => onUnitSystemChange('metric')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.unitSegmentText,
                      unitSystem === 'metric' && styles.unitSegmentTextActive,
                    ]}
                  >
                    Metric (cm, kg)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.unitSegmentBtn,
                    unitSystem === 'imperial' && styles.unitSegmentBtnActive,
                  ]}
                  onPress={() => onUnitSystemChange('imperial')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.unitSegmentText,
                      unitSystem === 'imperial' && styles.unitSegmentTextActive,
                    ]}
                  >
                    Imperial (ft, lbs)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* SECTION 4: AUDIO & HAPTICS */}
          <Text style={styles.sectionHeader}>AUDIO & HAPTICS</Text>
          <View style={styles.settingsGroupCard}>
            {/* Sound Effects */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeftGroup}>
                <View style={styles.settingIconBox}>
                  <Ionicons name="volume-high-outline" size={18} color="#FE5B01" />
                </View>
                <View style={styles.settingTextGroup}>
                  <Text style={styles.settingTitle}>Sound Effects</Text>
                  <Text style={styles.settingSubtitle}>Quest completion chimes & audio cues</Text>
                </View>
              </View>
              <HunterSwitch
                value={soundEffectsEnabled}
                onValueChange={setSoundEffectsEnabled}
              />
            </View>

            <View style={styles.settingItemDivider} />

            {/* Haptic Feedback */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeftGroup}>
                <View style={styles.settingIconBox}>
                  <Ionicons name="phone-portrait-outline" size={18} color="#FE5B01" />
                </View>
                <View style={styles.settingTextGroup}>
                  <Text style={styles.settingTitle}>Haptic Feedback</Text>
                  <Text style={styles.settingSubtitle}>
                    Tactile vibration on quest & action triggers
                  </Text>
                </View>
              </View>
              <HunterSwitch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
              />
            </View>
          </View>

          {/* SECTION 5: HUNTER NOTIFICATIONS */}
          <Text style={styles.sectionHeader}>HUNTER NOTIFICATIONS</Text>
          <View style={styles.settingsGroupCard}>
            {/* Master All Notifications Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeftGroup}>
                <View style={styles.settingIconBox}>
                  <Ionicons
                    name={allNotificationsEnabled ? 'notifications' : 'notifications-off-outline'}
                    size={18}
                    color={allNotificationsEnabled ? '#FE5B01' : '#71717A'}
                  />
                </View>
                <View style={styles.settingTextGroup}>
                  <Text style={styles.settingTitle}>All Notifications</Text>
                  <Text style={styles.settingSubtitle}>
                    Master switch to enable or mute all alerts
                  </Text>
                </View>
              </View>
              <HunterSwitch
                value={allNotificationsEnabled}
                onValueChange={setAllNotificationsEnabled}
              />
            </View>

            {/* Sub-Notification Toggles */}
            <View style={{ opacity: allNotificationsEnabled ? 1 : 0.4 }}>
              <View style={styles.settingItemDivider} />

              {/* 1. Daily Motivation */}
              <View style={styles.settingRow}>
                <View style={styles.settingLeftGroup}>
                  <View style={styles.settingSubIconBox}>
                    <Ionicons name="sunny-outline" size={16} color="#FE5B01" />
                  </View>
                  <View style={styles.settingTextGroup}>
                    <Text style={styles.settingTitle}>Daily Motivation</Text>
                    <Text style={styles.settingSubtitle}>
                      Morning awakening & motivational sparks
                    </Text>
                  </View>
                </View>
                <HunterSwitch
                  disabled={!allNotificationsEnabled}
                  value={allNotificationsEnabled && dailyMotivationEnabled}
                  onValueChange={setDailyMotivationEnabled}
                />
              </View>

              <View style={styles.settingItemDivider} />

              {/* 2. Task Reminders */}
              <View style={styles.settingRow}>
                <View style={styles.settingLeftGroup}>
                  <View style={styles.settingSubIconBox}>
                    <Ionicons name="checkmark-circle-outline" size={16} color="#FE5B01" />
                  </View>
                  <View style={styles.settingTextGroup}>
                    <Text style={styles.settingTitle}>Task Reminders</Text>
                    <Text style={styles.settingSubtitle}>
                      Routine quests & daily task due prompts
                    </Text>
                  </View>
                </View>
                <HunterSwitch
                  disabled={!allNotificationsEnabled}
                  value={allNotificationsEnabled && taskRemindersEnabled}
                  onValueChange={setTaskRemindersEnabled}
                />
              </View>

              <View style={styles.settingItemDivider} />

              {/* 3. Streak Preservation Alert */}
              <View style={styles.settingRow}>
                <View style={styles.settingLeftGroup}>
                  <View style={styles.settingSubIconBox}>
                    <Ionicons name="flame-outline" size={16} color="#FE5B01" />
                  </View>
                  <View style={styles.settingTextGroup}>
                    <Text style={styles.settingTitle}>Streak Preservation Alert</Text>
                    <Text style={styles.settingSubtitle}>
                      Urgent warning before daily streak expires
                    </Text>
                  </View>
                </View>
                <HunterSwitch
                  disabled={!allNotificationsEnabled}
                  value={allNotificationsEnabled && streakAtRiskEnabled}
                  onValueChange={setStreakAtRiskEnabled}
                />
              </View>

              <View style={styles.settingItemDivider} />

              {/* 4. Streak Milestone Alerts */}
              <View style={styles.settingRow}>
                <View style={styles.settingLeftGroup}>
                  <View style={styles.settingSubIconBox}>
                    <Ionicons name="trophy-outline" size={16} color="#FE5B01" />
                  </View>
                  <View style={styles.settingTextGroup}>
                    <Text style={styles.settingTitle}>Streak Milestone Alerts</Text>
                    <Text style={styles.settingSubtitle}>
                      Celebration alerts for 7, 14, 30+ day records
                    </Text>
                  </View>
                </View>
                <HunterSwitch
                  disabled={!allNotificationsEnabled}
                  value={allNotificationsEnabled && streakMilestonesEnabled}
                  onValueChange={setStreakMilestonesEnabled}
                />
              </View>

              <View style={styles.settingItemDivider} />

              {/* 5. Streak Status & Recovery */}
              <View style={styles.settingRow}>
                <View style={styles.settingLeftGroup}>
                  <View style={styles.settingSubIconBox}>
                    <Ionicons name="snow-outline" size={16} color="#38BDF8" />
                  </View>
                  <View style={styles.settingTextGroup}>
                    <Text style={styles.settingTitle}>Streak Freeze & Recovery</Text>
                    <Text style={styles.settingSubtitle}>
                      Alerts when streak freezes are used or restored
                    </Text>
                  </View>
                </View>
                <HunterSwitch
                  disabled={!allNotificationsEnabled}
                  value={allNotificationsEnabled && streakStatusAlertsEnabled}
                  onValueChange={setStreakStatusAlertsEnabled}
                />
              </View>

              <View style={styles.settingItemDivider} />

              {/* 6. Level Up Alerts */}
              <View style={styles.settingRow}>
                <View style={styles.settingLeftGroup}>
                  <View style={styles.settingSubIconBox}>
                    <Ionicons name="sparkles-outline" size={16} color="#FE5B01" />
                  </View>
                  <View style={styles.settingTextGroup}>
                    <Text style={styles.settingTitle}>Level Up Alerts</Text>
                    <Text style={styles.settingSubtitle}>
                      Hunter rank promotions & XP milestone alerts
                    </Text>
                  </View>
                </View>
                <HunterSwitch
                  disabled={!allNotificationsEnabled}
                  value={allNotificationsEnabled && levelUpAlertsEnabled}
                  onValueChange={setLevelUpAlertsEnabled}
                />
              </View>

              <View style={styles.settingItemDivider} />

              {/* 7. Reward Ready Alerts */}
              <View style={styles.settingRow}>
                <View style={styles.settingLeftGroup}>
                  <View style={styles.settingSubIconBox}>
                    <Ionicons name="gift-outline" size={16} color="#FE5B01" />
                  </View>
                  <View style={styles.settingTextGroup}>
                    <Text style={styles.settingTitle}>Reward Ready Alerts</Text>
                    <Text style={styles.settingSubtitle}>
                      Reminders when loot drops or rewards are available
                    </Text>
                  </View>
                </View>
                <HunterSwitch
                  disabled={!allNotificationsEnabled}
                  value={allNotificationsEnabled && rewardReadyAlertsEnabled}
                  onValueChange={setRewardReadyAlertsEnabled}
                />
              </View>

              <View style={styles.settingItemDivider} />

              {/* 8. Announcements & Broadcast */}
              <View style={styles.settingRow}>
                <View style={styles.settingLeftGroup}>
                  <View style={styles.settingSubIconBox}>
                    <Ionicons name="megaphone-outline" size={16} color="#FE5B01" />
                  </View>
                  <View style={styles.settingTextGroup}>
                    <Text style={styles.settingTitle}>Announcements & Broadcasts</Text>
                    <Text style={styles.settingSubtitle}>
                      Important messages & system updates from admin
                    </Text>
                  </View>
                </View>
                <HunterSwitch
                  disabled={!allNotificationsEnabled}
                  value={allNotificationsEnabled && announcementsEnabled}
                  onValueChange={setAnnouncementsEnabled}
                />
              </View>
            </View>
          </View>

          {/* SECTION 6: DATA & PRIVACY */}
          <Text style={styles.sectionHeader}>DATA & PRIVACY</Text>
          <View style={styles.settingsGroupCard}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleDownloadData}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeftGroup}>
                <View style={styles.settingIconBox}>
                  <Ionicons name="cloud-download-outline" size={18} color="#FE5B01" />
                </View>
                <View style={styles.settingTextGroup}>
                  <Text style={styles.settingTitle}>Download My Data</Text>
                  <Text style={styles.settingSubtitle}>
                    Request an archive of your workouts, quests & stats
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#71717A" />
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Change Password Modal */}
        <Modal
          visible={isChangePasswordModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsChangePasswordModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <Text style={styles.modalSubtitleText}>Enter your new password below.</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Current Password"
                placeholderTextColor="#71717A"
                secureTextEntry
                value={currentPasswordInput}
                onChangeText={setCurrentPasswordInput}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="New Password (min. 6 chars)"
                placeholderTextColor="#71717A"
                secureTextEntry
                value={newPasswordInput}
                onChangeText={setNewPasswordInput}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Confirm New Password"
                placeholderTextColor="#71717A"
                secureTextEntry
                value={confirmPasswordInput}
                onChangeText={setConfirmPasswordInput}
              />
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={() => setIsChangePasswordModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.saveBtn]}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.saveBtnText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Change Email Modal */}
        <Modal
          visible={isChangeEmailModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsChangeEmailModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Change Email</Text>
              <Text style={styles.modalSubtitleText}>Enter your new email address.</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="New Email Address"
                placeholderTextColor="#71717A"
                keyboardType="email-address"
                autoCapitalize="none"
                value={newEmailInput}
                onChangeText={setNewEmailInput}
              />
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={() => setIsChangeEmailModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.saveBtn]}
                  onPress={handleChangeEmail}
                >
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Screen>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#242428',
  },
  backBtn: {
    width: 48,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 60,
  },
  sectionHeader: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    fontWeight: '800',
    color: '#71717A',
    letterSpacing: 1.5,
    marginTop: 8,
    marginLeft: 4,
  },
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
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingSubIconBox: {
    width: 24,
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
    backgroundColor: 'rgba(254, 91, 1, 0.12)',
    borderColor: '#FE5B01',
  },
  themeModeCardDisabled: {
    backgroundColor: '#141417',
    borderColor: '#202026',
    opacity: 0.55,
    position: 'relative',
  },
  themeModeText: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: '#A1A1AA',
  },
  themeModeTextSelected: {
    fontFamily: fontFamilies.bold,
    color: '#FE5B01',
    fontWeight: '800',
  },
  themeModeTextDisabled: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: '#52525B',
  },
  comingSoonPill: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#27272A',
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#3F3F46',
  },
  comingSoonPillText: {
    fontFamily: fontFamilies.bold,
    fontSize: 7.5,
    color: '#A1A1AA',
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  googleProviderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 5.5,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#FE5B01',
    backgroundColor: '#141416',
  },
  googleProviderPillText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    fontWeight: '800',
    color: '#FE5B01',
  },
  appleProviderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 5.5,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    backgroundColor: '#18181B',
  },
  appleProviderPillText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emailProviderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 5.5,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#FE5B01',
    backgroundColor: '#141416',
  },
  emailProviderPillText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    fontWeight: '800',
    color: '#FE5B01',
  },
  unitsSegmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#18181C',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#27272A',
    padding: 3,
    gap: 3,
  },
  unitSegmentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
  },
  unitSegmentBtnActive: {
    backgroundColor: '#FE5B01',
  },
  unitSegmentText: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    color: '#A1A1AA',
  },
  unitSegmentTextActive: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#18181C',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2E2E36',
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalSubtitleText: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    color: '#71717A',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  modalActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  modalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  cancelBtn: {
    backgroundColor: '#27272A',
  },
  cancelBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '700',
    color: '#A1A1AA',
  },
  saveBtn: {
    backgroundColor: '#FE5B01',
  },
  saveBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

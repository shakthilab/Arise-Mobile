import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { QuestItem } from '@/app/(tabs)/index';
import { fontFamilies } from '@/theme/typography';

export interface TaskCompletionScreenProps {
  visible: boolean;
  quest: QuestItem | null;
  onClose: () => void;
  onFullComplete: () => void;
  onPartialComplete: () => void;
}

export function TaskCompletionScreen({
  visible,
  quest,
  onClose,
  onFullComplete,
  onPartialComplete,
}: TaskCompletionScreenProps) {
  if (!visible || !quest) return null;

  const handleDonePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onFullComplete();
  };

  const handlePartialPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPartialComplete();
  };

  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.screenContainer}>
        {/* Top Close Icon */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#71717A" />
        </TouchableOpacity>

        {/* Centered Standalone Popup Card */}
        <View style={styles.popupCard}>
          {/* Top Handle Indicator */}
          <View style={styles.handleBar} />

          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Text style={styles.questTitle}>{quest.title}</Text>
            <Text style={styles.subtitleText}>How much did you complete?</Text>
          </View>

          {/* Option Cards */}
          <View style={styles.optionsContainer}>
            {/* DONE OPTION */}
            <TouchableOpacity
              style={styles.doneOptionCard}
              activeOpacity={0.82}
              onPress={handleDonePress}
            >
              <View style={styles.doneIconCircle}>
                <Ionicons name="checkmark" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.optionTextColumn}>
                <Text style={styles.doneTitleText}>DONE</Text>
                <Text style={styles.optionDescText}>
                  Great job! You completed your goal.
                </Text>
              </View>
            </TouchableOpacity>

            {/* PARTIAL OPTION */}
            <TouchableOpacity
              style={styles.partialOptionCard}
              activeOpacity={0.82}
              onPress={handlePartialPress}
            >
              <View style={styles.partialIconCircle}>
                <Ionicons name="pie-chart" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.optionTextColumn}>
                <Text style={styles.partialTitleText}>PARTIAL</Text>
                <Text style={styles.optionDescText}>
                  Some progress is better than none.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#09090B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#18181C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
    zIndex: 10,
  },

  /* Centered Popup Card */
  popupCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#131316',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#26262B',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.7,
    shadowRadius: 18,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3F3F46',
    marginBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  questTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitleText: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: '#A1A1AA',
    textAlign: 'center',
  },

  /* Options Container */
  optionsContainer: {
    width: '100%',
    gap: 12,
  },

  /* DONE CARD */
  doneOptionCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 106, 0, 0.06)',
    borderWidth: 1.5,
    borderColor: '#FF6A00',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  doneIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6A00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },

  /* PARTIAL CARD */
  partialOptionCard: {
    width: '100%',
    backgroundColor: 'rgba(245, 158, 11, 0.06)',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  partialIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },

  /* Text Columns */
  optionTextColumn: {
    flex: 1,
  },
  doneTitleText: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: '#FF6A00',
    letterSpacing: 0.8,
  },
  partialTitleText: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: '#F59E0B',
    letterSpacing: 0.8,
  },
  optionDescText: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: '#A1A1AA',
    marginTop: 2,
    lineHeight: 16,
  },
});

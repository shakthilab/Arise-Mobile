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

import { fontFamilies } from '@/theme/typography';

export interface QuestActionModalProps {
  visible: boolean;
  questTitle: string;
  questCategory: string;
  xpReward: number;
  onClose: () => void;
  onFullComplete: () => void;
  onPartialComplete: () => void;
  onSkip?: () => void;
}

export function QuestActionModal({
  visible,
  questTitle,
  onClose,
  onFullComplete,
  onPartialComplete,
}: QuestActionModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          {/* Top Handle Indicator */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.questTitleHeader}>{questTitle}</Text>
            <Text style={styles.subtitleText}>SELECT COMPLETION STATUS</Text>
          </View>

          {/* Action Option Cards Row */}
          <View style={styles.optionsRow}>
            {/* DONE BUTTON */}
            <TouchableOpacity
              style={[styles.optionCard, styles.doneCard]}
              activeOpacity={0.8}
              onPress={onFullComplete}
            >
              <View style={styles.iconCircleDone}>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.doneBtnText}>DONE</Text>
            </TouchableOpacity>

            {/* PARTIAL BUTTON */}
            <TouchableOpacity
              style={[styles.optionCard, styles.partialCard]}
              activeOpacity={0.8}
              onPress={onPartialComplete}
            >
              <View style={styles.iconCirclePartial}>
                <Ionicons name="pie-chart" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.partialBtnText}>PARTIAL</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '92%',
    maxWidth: 340,
    backgroundColor: '#121215',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 22,
    alignItems: 'center',
    gap: 16,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3F3F46',
  },
  headerContainer: {
    alignItems: 'center',
    gap: 4,
  },
  questTitleHeader: {
    fontFamily: fontFamilies.bold,
    fontSize: 19,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitleText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: '#71717A',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  optionCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 18,
    gap: 10,
    borderWidth: 1.5,
  },
  doneCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    borderColor: '#22C55E',
  },
  partialCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: '#F59E0B',
  },
  iconCircleDone: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  iconCirclePartial: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  doneBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: '#22C55E',
    letterSpacing: 0.8,
  },
  partialBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: '#F59E0B',
    letterSpacing: 0.8,
  },
});

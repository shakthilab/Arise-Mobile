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
  questTargetValue?: string;
  onClose: () => void;
  onFullComplete: () => void;
  onPartialComplete: () => void;
  onSkip?: () => void;
}

export function QuestActionModal({
  visible,
  questTitle,
  questTargetValue,
  xpReward,
  onClose,
  onFullComplete,
  onPartialComplete,
}: QuestActionModalProps) {
  const targetLabel = questTargetValue ? `Target · ${questTargetValue}` : `XP Reward · ${xpReward} XP`;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>

          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text style={styles.logProgressLabel}>LOG PROGRESS</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="close" size={20} color="#71717A" />
            </TouchableOpacity>
          </View>

          {/* Title & Target Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.questTitle}>{questTitle}</Text>
            <Text style={styles.targetDetail}>{targetLabel}</Text>
          </View>

          {/* Option Stack (Vertical Stack) */}
          <View style={styles.optionStack}>
            {/* COMPLETED CARD */}
            <TouchableOpacity
              style={styles.completedOptionCard}
              activeOpacity={0.85}
              onPress={onFullComplete}
            >
              <View style={styles.iconCircleCompleted}>
                <Ionicons name="checkmark" size={18} color="#22C55E" />
              </View>
              <View style={styles.optionTextColumn}>
                <Text style={styles.optionTitleText}>COMPLETED</Text>
                <Text style={styles.optionSubtitleText}>Full XP · quest cleared</Text>
              </View>
            </TouchableOpacity>

            {/* PARTIALLY COMPLETED CARD */}
            <TouchableOpacity
              style={styles.partialOptionCard}
              activeOpacity={0.85}
              onPress={onPartialComplete}
            >
              <View style={styles.iconCirclePartial}>
                <Ionicons name="flash" size={18} color="#F59E0B" />
              </View>
              <View style={styles.optionTextColumn}>
                <Text style={styles.optionTitleText}>PARTIALLY COMPLETED</Text>
                <Text style={styles.optionSubtitleText}>Half XP · progress still counts</Text>
              </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '94%',
    maxWidth: 360,
    backgroundColor: '#0F1012',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#222227',
    padding: 24,
    gap: 16,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logProgressLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: '#FF6A00',
    letterSpacing: 1.5,
  },
  detailsContainer: {
    gap: 4,
    marginTop: 4,
  },
  questTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    color: '#FFFFFF',
  },
  targetDetail: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: '#71717A',
  },
  optionStack: {
    gap: 12,
    marginTop: 8,
  },
  completedOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16171B',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(34, 197, 94, 0.45)',
    padding: 16,
    gap: 14,
  },
  partialOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16171B',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#27272A',
    padding: 16,
    gap: 14,
  },
  iconCircleCompleted: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCirclePartial: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextColumn: {
    flex: 1,
    gap: 2,
  },
  optionTitleText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  optionSubtitleText: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: '#71717A',
  },
});

import React, { useRef } from 'react';
import {
  Animated,
  ImageBackground,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fontFamilies } from '@/theme/typography';

export interface QuestItem {
  id: string;
  title: string;
  category: string;
  xpReward: number;
  type: 'daily' | 'weekly';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: string;
  quickAddLabel: string;
  image: any;
  status: 'todo' | 'done' | 'partial' | 'skipped';
  earnedXp?: number;
}

export interface SwipeableQuestCardProps {
  quest: QuestItem;
  onFullComplete: (quest: QuestItem) => void;
  onPartial: (quest: QuestItem) => void;
  onSkip: (quest: QuestItem) => void;
  onQuickAdd?: (quest: QuestItem) => void;
  onLogMore?: (quest: QuestItem) => void;
}

const ACTION_WIDTH = 110;

export function SwipeableQuestCard({
  quest,
  onFullComplete,
  onPartial,
  onSkip,
  onQuickAdd,
  onLogMore,
}: SwipeableQuestCardProps) {
  const panX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 15;
      },
      onPanResponderMove: (_, gestureState) => {
        let newX = gestureState.dx;
        if (newX > ACTION_WIDTH + 15) newX = ACTION_WIDTH + 15;
        if (newX < -ACTION_WIDTH - 15) newX = -ACTION_WIDTH - 15;
        panX.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 45) {
          // Snap open right to reveal PARTIAL & SKIP buttons on the left
          Animated.spring(panX, {
            toValue: ACTION_WIDTH,
            useNativeDriver: true,
            bounciness: 6,
          }).start();
        } else if (gestureState.dx < -45) {
          // Snap open left to reveal QUICK ADD & LOG MORE buttons on the right
          Animated.spring(panX, {
            toValue: -ACTION_WIDTH,
            useNativeDriver: true,
            bounciness: 6,
          }).start();
        } else {
          // Snap back to closed position
          Animated.spring(panX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 6,
          }).start();
        }
      },
    })
  ).current;

  const closeSwipe = () => {
    Animated.spring(panX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const handlePartialPress = () => {
    closeSwipe();
    onPartial(quest);
  };

  const handleSkipPress = () => {
    closeSwipe();
    onSkip(quest);
  };

  const handleQuickAddPress = () => {
    closeSwipe();
    if (onQuickAdd) onQuickAdd(quest);
  };

  const handleLogMorePress = () => {
    closeSwipe();
    if (onLogMore) onLogMore(quest);
  };

  const handleTickPress = () => {
    closeSwipe();
    onFullComplete(quest);
  };

  return (
    <View style={styles.cardWrapper}>
      {/* LEFT ACTION REVEAL (SWIPE RIGHT TO SEE PARTIAL & SKIP) */}
      <View style={styles.leftActionsContainer}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.partialBtn]}
          activeOpacity={0.85}
          onPress={handlePartialPress}
        >
          <Text style={styles.actionBtnText}>PARTIAL</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.skipBtn]}
          activeOpacity={0.85}
          onPress={handleSkipPress}
        >
          <Text style={styles.actionBtnText}>SKIP</Text>
        </TouchableOpacity>
      </View>

      {/* RIGHT ACTION REVEAL (SWIPE LEFT TO SEE QUICK ADD & LOG MORE) */}
      <View style={styles.rightActionsContainer}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.quickAddBtn]}
          activeOpacity={0.85}
          onPress={handleQuickAddPress}
        >
          <Ionicons name="water-outline" size={18} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>{quest.quickAddLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.logMoreBtn]}
          activeOpacity={0.85}
          onPress={handleLogMorePress}
        >
          <Text style={styles.logMoreBtnText}>LOG MORE</Text>
        </TouchableOpacity>
      </View>

      {/* MAIN SWIPEABLE QUEST CARD */}
      <Animated.View
        style={[
          styles.mainCard,
          {
            transform: [{ translateX: panX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <ImageBackground
          source={quest.image}
          style={styles.cardImageBg}
          imageStyle={styles.cardImageStyle}
        >
          <View style={styles.cardOverlay}>
            <View style={styles.cardContentRow}>
              {/* Quest Title & Meta line */}
              <View style={styles.questDetailsCol}>
                <Text style={styles.questTitleText}>{quest.title}</Text>

                <View style={styles.questMetaRow}>
                  <Ionicons name="repeat-outline" size={14} color="#E4E4E7" />
                  <Text style={styles.metaText}>{quest.type === 'daily' ? 'Daily' : 'Weekly'}</Text>

                  <Text style={styles.metaDivider}>|</Text>

                  <Ionicons name="bar-chart-outline" size={14} color="#E4E4E7" />
                  <Text style={styles.metaText}>{quest.difficulty}</Text>

                  <Text style={styles.metaDivider}>|</Text>

                  <Text style={styles.metaText}>{quest.progress}</Text>
                </View>
              </View>

              {/* Square Cream Tick Button */}
              <TouchableOpacity
                style={styles.creamTickButton}
                activeOpacity={0.8}
                onPress={handleTickPress}
              >
                <Ionicons name="checkmark" size={20} color="#262626" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: '#09090B',
  },
  leftActionsContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: ACTION_WIDTH - 10,
    justifyContent: 'space-between',
    gap: 8,
  },
  rightActionsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: ACTION_WIDTH - 10,
    justifyContent: 'space-between',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    gap: 2,
  },
  partialBtn: {
    backgroundColor: '#2563EB',
  },
  skipBtn: {
    backgroundColor: '#DC2626',
  },
  quickAddBtn: {
    backgroundColor: '#2563EB',
  },
  logMoreBtn: {
    backgroundColor: '#FFFFFF',
  },
  actionBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  logMoreBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#000000',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  mainCard: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#27272A',
    backgroundColor: '#121215',
  },
  cardImageBg: {
    width: '100%',
    height: 145,
  },
  cardImageStyle: {
    resizeMode: 'cover',
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  questDetailsCol: {
    flex: 1,
    paddingRight: 12,
    gap: 6,
  },
  questTitleText: {
    fontFamily: fontFamilies.bold,
    fontSize: 26,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  questMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#E4E4E7',
  },
  metaDivider: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#71717A',
  },
  creamTickButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#E5D7C5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

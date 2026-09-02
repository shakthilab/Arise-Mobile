import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DragonRewardReveal } from '../components/features/DragonRewardReveal';
import { fontFamilies } from '../theme/typography';
import { colors } from '../theme/colors';

export default function DragonTestScreen() {
  const router = useRouter();
  
  // Test parameters state
  const [showAnimation, setShowAnimation] = useState(false);
  const [xpGained, setXpGained] = useState(1250);
  const [dragonPowerGained, setDragonPowerGained] = useState(350);
  const [newLevel, setNewLevel] = useState(15);
  const [evolutionProgress, setEvolutionProgress] = useState(78);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Animation Sandbox</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Dragon Egg Reveal Sandbox</Text>
        <Text style={styles.subtitle}>
          Configure parameters and trigger the AAA reward animation sequence.
        </Text>

        {/* Configuration Panel */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Configuration</Text>

          {/* Level input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>New Level Reached</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => setNewLevel(Math.max(1, newLevel - 1))}
              >
                <Text style={styles.adjustBtnText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                value={String(newLevel)}
                onChangeText={(val) => setNewLevel(Number(val) || 0)}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => setNewLevel(newLevel + 1)}
              >
                <Text style={styles.adjustBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* XP input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Dragon XP Gained</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => setXpGained(Math.max(0, xpGained - 250))}
              >
                <Text style={styles.adjustBtnText}>-250</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                value={String(xpGained)}
                onChangeText={(val) => setXpGained(Number(val) || 0)}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => setXpGained(xpGained + 250)}
              >
                <Text style={styles.adjustBtnText}>+250</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dragon Power input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Dragon Power Gained</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => setDragonPowerGained(Math.max(0, dragonPowerGained - 50))}
              >
                <Text style={styles.adjustBtnText}>-50</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                value={String(dragonPowerGained)}
                onChangeText={(val) => setDragonPowerGained(Number(val) || 0)}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => setDragonPowerGained(dragonPowerGained + 50)}
              >
                <Text style={styles.adjustBtnText}>+50</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Evolution percentage input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Evolution Progress %</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => setEvolutionProgress(Math.max(0, evolutionProgress - 10))}
              >
                <Text style={styles.adjustBtnText}>-10%</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                value={String(evolutionProgress)}
                onChangeText={(val) => setEvolutionProgress(Math.min(100, Math.max(0, Number(val) || 0)))}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => setEvolutionProgress(Math.min(100, evolutionProgress + 10))}
              >
                <Text style={styles.adjustBtnText}>+10%</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mute switcher */}
          <View style={[styles.inputGroup, styles.switchRow]}>
            <Text style={styles.inputLabel}>Mute Audio Effects</Text>
            <Switch
              value={isMuted}
              onValueChange={setIsMuted}
              trackColor={{ false: '#27272A', true: '#F59E0B' }}
              thumbColor={isMuted ? '#FFFFFF' : '#71717A'}
            />
          </View>
        </View>

        {/* Trigger Button */}
        <TouchableOpacity
          style={styles.triggerButton}
          activeOpacity={0.88}
          onPress={() => setShowAnimation(true)}
        >
          <Text style={styles.triggerButtonText}>LAUNCH REVEAL SEQUENCE</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Animation Overlay component */}
      {showAnimation && (
        <DragonRewardReveal
          xpGained={xpGained}
          dragonPowerGained={dragonPowerGained}
          newLevel={newLevel}
          evolutionProgress={evolutionProgress}
          isMuted={isMuted}
          onComplete={() => setShowAnimation(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#161618',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: fontFamilies.bold,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#A1A1AA',
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#0E0E10',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    color: '#F59E0B',
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 0,
  },
  inputLabel: {
    color: '#71717A',
    fontSize: 13,
    fontFamily: fontFamilies.medium,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#161618',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272A',
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    marginHorizontal: 12,
  },
  adjustBtn: {
    width: 64,
    height: 44,
    backgroundColor: '#27272A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fontFamilies.bold,
  },
  triggerButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#F59E0B',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  triggerButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    letterSpacing: 1.0,
  },
});

import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';

import { HunterToast, type HunterToastType } from '@/components/common/HunterToast';
import { Screen } from '@/components/common/Screen';
import { useAuth } from '@/hooks/useAuth';
import {
  sendFeedback,
  type FeedbackCategory,
  type FeedbackPayload,
} from '@/services/api/feedback.service';
import { uploadImageToCloudinary } from '@/services/media/cloudinary';
import { fontFamilies } from '@/theme/typography';

const CATEGORIES: { id: FeedbackCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'Bug Report', label: 'Bug Report', icon: 'bug-outline' },
  { id: 'Suggestion', label: 'Suggestion', icon: 'bulb-outline' },
  { id: 'Something Else', label: 'Other', icon: 'chatbox-ellipses-outline' },
];

const PLACEHOLDERS: Record<FeedbackCategory, string> = {
  'Bug Report': 'What went wrong? Steps to reproduce if possible...',
  Suggestion: 'What new feature or improvement would you love to see?',
  'Something Else': "Share whatever is on your mind...",
};

const MIN_LENGTH = 10;
const MAX_LENGTH = 1000;

export default function FeedbackScreen() {
  const { user } = useAuth();
  const userAny = user as any;

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  // Form States
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [screenshotUri, setScreenshotUri] = useState<string | null>(null);
  const [allowContact, setAllowContact] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // UI Flow States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Bottom Center Alert Toast State
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: HunterToastType;
  }>({
    visible: false,
    message: '',
    type: 'error',
  });

  // Animations
  const successScaleAnim = useRef(new Animated.Value(0.85)).current;
  const successOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSuccess) {
      Animated.parallel([
        Animated.spring(successScaleAnim, {
          toValue: 1,
          friction: 6.5,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(successOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        router.back();
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, successScaleAnim, successOpacityAnim]);

  const showToast = (message: string, type: HunterToastType = 'error') => {
    setToast({ visible: true, message, type });
  };

  const handleCategorySelect = (category: FeedbackCategory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
    setSelectedCategory(category);
    if (toast.visible) setToast((prev) => ({ ...prev, visible: false }));
  };

  const handlePickScreenshot = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        showToast('Gallery access is needed to attach a screenshot.', 'warning');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions?.Images ?? ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setScreenshotUri(result.assets[0].uri);
      }
    } catch (err) {
      console.log('Error picking screenshot:', err);
    }
  };

  const handleRemoveScreenshot = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
    setScreenshotUri(null);
  };

  const isFormValid =
    !!selectedCategory && feedbackText.trim().length >= MIN_LENGTH;

  const handleSubmit = async () => {
    if (!selectedCategory) {
      showToast('Please select a feedback category.', 'warning');
      return;
    }

    if (feedbackText.trim().length < MIN_LENGTH) {
      showToast(`Please enter at least ${MIN_LENGTH} characters.`, 'warning');
      return;
    }

    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => { });

    try {
      let uploadedScreenshotUrl: string | null = null;
      if (screenshotUri) {
        try {
          const uploadRes = await uploadImageToCloudinary(screenshotUri, 'misc');
          uploadedScreenshotUrl = uploadRes.url;
        } catch (uploadErr) {
          console.log('Cloudinary upload error, continuing with submission:', uploadErr);
        }
      }

      const payload: FeedbackPayload = {
        category: selectedCategory,
        feedback_text: feedbackText.trim(),
        screenshot_url: uploadedScreenshotUrl,
        allow_contact: allowContact,
        hunter_id: user?.id ?? userAny?.hunter_id ?? userAny?._id ?? undefined,
        email: user?.email ?? undefined,
        app_version: Constants.expoConfig?.version ?? '1.0.0',
        device_os: Device.osName ?? Platform.OS,
        device_os_version: Device.osVersion ?? String(Platform.Version),
        device_model: Device.modelName ?? 'Unknown Device',
        level: user?.level ?? 12,
        rank: userAny?.rank ?? 'VANGUARD',
        timestamp: new Date().toISOString(),
      };

      await sendFeedback(payload);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => { });
      setIsSuccess(true);
    } catch (err: any) {
      console.log('Feedback submission failed:', err);
      const serverMsg =
        err?.message ||
        'Unable to submit feedback. Please check your connection and try again.';
      showToast(serverMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPlaceholder = selectedCategory
    ? PLACEHOLDERS[selectedCategory]
    : 'Select a category above to start writing your feedback...';

  return (
    <Screen style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* CLEAN PROFESSIONAL HEADER */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send Feedback</Text>
          <View style={styles.headerRightSpacer} />
        </View>

        {isSuccess ? (
          /* SUCCESS CONFIRMATION STATE */
          <View style={styles.successContainer}>
            <Animated.View
              style={[
                styles.successCard,
                {
                  opacity: successOpacityAnim,
                  transform: [{ scale: successScaleAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(254, 91, 1, 0.14)', 'rgba(254, 91, 1, 0.02)']}
                style={styles.successCardGradient}
              >
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark" size={38} color="#FE5B01" />
                </View>

                <Text style={styles.successHeadline}>Feedback Received</Text>
                <Text style={styles.successSubtext}>
                  Thank you for helping us make HunterX better. Our development team reviews all
                  feedback carefully.
                </Text>

                <View style={styles.successMetaBox}>
                  <Text style={styles.successMetaLabel}>CATEGORY</Text>
                  <Text style={styles.successMetaValue}>{selectedCategory?.toUpperCase()}</Text>
                </View>
              </LinearGradient>
            </Animated.View>
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* TOP FORM CONTENT GROUP */}
            <View style={styles.topFormGroup}>
              {/* HERO HEADER */}
              <View style={styles.heroSection}>
                <Text style={styles.heroTitle}>How can we calibrate?</Text>
                <Text style={styles.heroSubtitle}>
                  Report system anomalies or suggest enhancements to the Tactical OS. Your telemetry is critical.
                </Text>
              </View>

              {/* FIELD 1: CATEGORY SELECTOR */}
              <View style={styles.sectionContainer}>
                <Text style={styles.fieldLabel}>Category</Text>
                <View style={styles.categoryGrid}>
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.categoryCard,
                          isSelected && styles.categoryCardSelected,
                        ]}
                        onPress={() => handleCategorySelect(cat.id)}
                        activeOpacity={0.75}
                      >
                        <View
                          style={[
                            styles.categoryIconWrap,
                            isSelected && styles.categoryIconWrapSelected,
                          ]}
                        >
                          <Ionicons
                            name={cat.icon}
                            size={18}
                            color={isSelected ? '#FE5B01' : '#A1A1AA'}
                          />
                        </View>
                        <Text
                          style={[
                            styles.categoryCardText,
                            isSelected && styles.categoryCardTextSelected,
                          ]}
                          numberOfLines={1}
                        >
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* FIELD 2: FEEDBACK TEXTAREA */}
              <View style={styles.sectionContainer}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>Feedback Details</Text>
                  <Text
                    style={[
                      styles.charCounter,
                      feedbackText.length > 0 &&
                      feedbackText.length < MIN_LENGTH &&
                      styles.charCounterWarning,
                    ]}
                  >
                    {feedbackText.length}/{MAX_LENGTH}
                  </Text>
                </View>

                <View
                  style={[
                    styles.inputCard,
                    isInputFocused && styles.inputCardFocused,
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder={currentPlaceholder}
                    placeholderTextColor="#71717A"
                    value={feedbackText}
                    onChangeText={setFeedbackText}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    multiline
                    maxLength={MAX_LENGTH}
                    textAlignVertical="top"
                  />
                </View>

                {feedbackText.length > 0 && feedbackText.length < MIN_LENGTH && (
                  <Text style={styles.helperText}>
                    Please enter at least {MIN_LENGTH - feedbackText.length} more characters.
                  </Text>
                )}
              </View>

              {/* FIELD 3: SCREENSHOT ATTACHMENT */}
              <View style={styles.sectionContainer}>
                <Text style={styles.fieldLabel}>Attachment (Optional)</Text>

                {screenshotUri ? (
                  /* Attached Preview Card */
                  <View style={styles.attachedFileCard}>
                    <Image source={{ uri: screenshotUri }} style={styles.thumbnail} />
                    <View style={styles.attachedInfo}>
                      <Text style={styles.attachedTitle} numberOfLines={1}>
                        Screenshot Attached
                      </Text>
                      <Text style={styles.attachedSubtitle}>Ready to upload with submission</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={handleRemoveScreenshot}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close" size={18} color="#A1A1AA" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* Modern Upload Button */
                  <TouchableOpacity
                    style={styles.uploadCard}
                    onPress={handlePickScreenshot}
                    activeOpacity={0.75}
                  >
                    <View style={styles.uploadIconCircle}>
                      <Feather name="image" size={18} color="#FE5B01" />
                    </View>
                    <View style={styles.uploadTextWrap}>
                      <Text style={styles.uploadPrimaryText}>Attach a screenshot or photo</Text>
                      <Text style={styles.uploadSecondaryText}>PNG, JPG up to 10MB</Text>
                    </View>
                    <Ionicons name="add" size={20} color="#71717A" />
                  </TouchableOpacity>
                )}
              </View>

              {/* FIELD 4: CONTACT PERMISSION */}
              <TouchableOpacity
                style={styles.contactCard}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
                  setAllowContact(!allowContact);
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.checkboxSquare, allowContact && styles.checkboxSquareActive]}>
                  {allowContact && <Ionicons name="checkmark" size={14} color="#000000" />}
                </View>
                <View style={styles.contactTextGroup}>
                  <Text style={styles.contactTitle}>Allow follow-up via email</Text>
                  <Text style={styles.contactSubtitle}>
                    We may reach out to your registered email if we need more details.
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* BOTTOM ACTIONS */}
            <View style={styles.bottomActionGroup}>
              {/* PURE WHITE SUBMIT BUTTON */}
              <TouchableOpacity
                style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={
                    isFormValid
                      ? ['#FFFFFF', '#F4F4F5']
                      : ['#1E1E24', '#1E1E24']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#09090B" size="small" />
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        name="send-outline"
                        size={17}
                        color={isFormValid ? '#09090B' : '#71717A'}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={[
                          styles.submitText,
                          !isFormValid && styles.submitTextDisabled,
                        ]}
                      >
                        Submit Feedback
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* BOTTOM CENTER FLOATING ALERT POPUP (UNIFIED APP TOAST) */}
        <HunterToast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1E',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: '#24242A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 16.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerRightSpacer: {
    width: 38,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  topFormGroup: {
    gap: 26,
  },
  heroSection: {
    gap: 6,
    paddingVertical: 4,
    marginBottom: 2,
  },
  heroTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 23,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 13.5,
    color: '#9E9EA8',
    lineHeight: 19,
  },
  sectionContainer: {
    gap: 10,
  },
  fieldLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#A1A1AA',
    letterSpacing: 0.6,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  charCounter: {
    fontFamily: fontFamilies.medium,
    fontSize: 11.5,
    color: '#71717A',
  },
  charCounterWarning: {
    color: '#F59E0B',
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131317',
    borderWidth: 1,
    borderColor: '#24242C',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 6,
    gap: 8,
  },
  categoryCardSelected: {
    backgroundColor: 'rgba(254, 91, 1, 0.12)',
    borderColor: '#FE5B01',
  },
  categoryIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1C1C22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconWrapSelected: {
    backgroundColor: 'rgba(254, 91, 1, 0.2)',
  },
  categoryCardText: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: '#A1A1AA',
    textAlign: 'center',
  },
  categoryCardTextSelected: {
    color: '#FE5B01',
    fontWeight: '700',
  },
  inputCard: {
    backgroundColor: '#131317',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#24242C',
    padding: 14,
    minHeight: 145,
  },
  inputCardFocused: {
    borderColor: '#FE5B01',
  },
  textInput: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    minHeight: 115,
  },
  helperText: {
    fontFamily: fontFamilies.regular,
    fontSize: 11.5,
    color: '#F59E0B',
    marginLeft: 2,
  },
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131317',
    borderWidth: 1,
    borderColor: '#24242C',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  uploadIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(254, 91, 1, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTextWrap: {
    flex: 1,
    gap: 2,
  },
  uploadPrimaryText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#E4E4E7',
  },
  uploadSecondaryText: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#71717A',
  },
  attachedFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131317',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2E2E38',
    padding: 10,
    gap: 12,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#202026',
  },
  attachedInfo: {
    flex: 1,
    gap: 2,
  },
  attachedTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 12.5,
    color: '#FFFFFF',
  },
  attachedSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#71717A',
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#202028',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#111115',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#202026',
    padding: 14,
  },
  checkboxSquare: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#3F3F46',
    backgroundColor: '#18181D',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxSquareActive: {
    backgroundColor: '#FE5B01',
    borderColor: '#FE5B01',
  },
  contactTextGroup: {
    flex: 1,
    gap: 2,
  },
  contactTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  contactSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 11.5,
    color: '#71717A',
    lineHeight: 16,
  },
  bottomActionGroup: {
    paddingTop: 20,
    gap: 10,
  },
  submitButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  submitButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  submitText: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    fontWeight: '800',
    color: '#09090B',
    letterSpacing: 0.3,
  },
  submitTextDisabled: {
    color: '#71717A',
  },

  /* SUCCESS CONFIRMATION */
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FE5B01',
    backgroundColor: '#131317',
    overflow: 'hidden',
    shadowColor: '#FE5B01',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  successCardGradient: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 22,
    gap: 14,
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(254, 91, 1, 0.12)',
    borderWidth: 1.5,
    borderColor: '#FE5B01',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  successHeadline: {
    fontFamily: fontFamilies.bold,
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  successSubtext: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    color: '#A1A1AA',
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  successMetaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1C1C22',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 6,
  },
  successMetaLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 9.5,
    color: '#71717A',
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  successMetaValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 10.5,
    color: '#FE5B01',
    fontWeight: '700',
  },
});

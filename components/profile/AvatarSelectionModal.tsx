import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { fontFamilies } from '@/theme/typography';
import { getAvatars, getCachedAvatars, type AvatarItem } from '@/services/api/avatar.service';
import { AVATAR_THUMB_WIDTH, DEFAULT_BLURHASH, optimizeCloudinaryUrl } from '@/services/media/cloudinary';

export const DEFAULT_FALLBACK_AVATAR = 'https://res.cloudinary.com/sc8zzixt/image/upload/f_auto,q_auto/v1788468328/hunterx/app-assets/arise_avatar_11.jpg';

// Avatars render small almost everywhere (a 40-90px circle), so the default
// requests a width-capped, auto-format/quality derivative instead of the
// full-resolution original. A caller rendering the same source large (e.g.
// profile.tsx's full-height background portrait) should pass an explicit
// wider `width` — otherwise that 160px derivative gets stretched across a
// much bigger area and comes out blurry.
const toAvatarSource = (uri: string, width: number) => ({ uri: optimizeCloudinaryUrl(uri, width) });

export const getAvatarSource = (
  avatarUrl: string | null | undefined,
  avatarId?: string | number | null,
  width: number = AVATAR_THUMB_WIDTH
) => {
  const list = getCachedAvatars();
  const firstAvatarUrl = list && list.length > 0 ? list[0].image_url : DEFAULT_FALLBACK_AVATAR;

  if (!avatarUrl && !avatarId) {
    return toAvatarSource(firstAvatarUrl, width);
  }

  if (avatarUrl && typeof avatarUrl === 'string' && (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://'))) {
    return toAvatarSource(avatarUrl, width);
  }

  const searchKey = String(avatarId || avatarUrl);
  if (list && list.length > 0) {
    const matched = list.find((a) => String(a.id) === searchKey || a.image_url === searchKey);
    if (matched && matched.image_url) {
      return toAvatarSource(matched.image_url, width);
    }
  }

  return toAvatarSource(firstAvatarUrl, width);
};

export interface AvatarSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  currentAvatar?: string | null;
  currentAvatarId?: string | number | null;
  onSelectAvatar: (avatarId: string, avatarUrl: string, isChanged?: boolean) => void;
}

export function AvatarSelectionModal({
  visible,
  onClose,
  currentAvatar,
  currentAvatarId,
  onSelectAvatar,
}: AvatarSelectionModalProps) {
  const [avatars, setAvatars] = useState<AvatarItem[]>(getCachedAvatars() || []);
  const [isLoading, setIsLoading] = useState(!getCachedAvatars());
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (visible) {
      getAvatars()
        .then((items) => {
          if (isMounted) {
            setAvatars(items);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [visible]);

  useEffect(() => {
    if (visible && avatars.length > 0) {
      // Find matching avatar by ID or URL, else default to 1st avatar (avatars[0])
      const searchKey = String(currentAvatarId || currentAvatar || '');
      const matched = avatars.find(
        (a) => String(a.id) === searchKey || a.image_url === searchKey
      );
      if (matched) {
        setSelectedAvatarId(matched.id);
      } else {
        setSelectedAvatarId(avatars[0].id);
      }
    }
  }, [visible, avatars, currentAvatar, currentAvatarId]);

  const handleSave = () => {
    const activeItem = avatars.find((a) => a.id === selectedAvatarId) || avatars[0];
    if (activeItem) {
      const currentIdStr = String(currentAvatarId ?? '');
      const selectedIdStr = String(activeItem.id);
      const isChanged =
        currentIdStr !== ''
          ? currentIdStr !== selectedIdStr
          : !!currentAvatar && currentAvatar !== activeItem.image_url;

      onSelectAvatar(activeItem.id, activeItem.image_url, isChanged);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.avatarModalOverlay}>
        <View style={styles.avatarModalCard}>
          {/* Modal Title */}
          <Text style={styles.avatarModalTitle}>SELECT ANIME HUNTER AVATAR</Text>

          {/* Horizontal Circular Avatar List */}
          <View style={styles.avatarCarouselWrapper}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FE5B01" />
              </View>
            ) : avatars.length === 0 ? (
              <Text style={styles.noAvatarsText}>No avatars available</Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.avatarCarouselContent}
              >
                {avatars.map((item) => {
                  const isSelected = item.id === selectedAvatarId;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.circularAvatarWrapper,
                        isSelected
                          ? styles.circularAvatarSelected
                          : styles.circularAvatarUnselected,
                      ]}
                      onPress={() => setSelectedAvatarId(item.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.circularAvatarFrame}>
                        <Image
                          source={toAvatarSource(item.image_url, AVATAR_THUMB_WIDTH)}
                          style={styles.circularAvatarImage}
                          contentFit="cover"
                          cachePolicy="memory-disk"
                          placeholder={{ blurhash: DEFAULT_BLURHASH }}
                          transition={150}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.cancelActionBtn}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelActionText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  avatarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  avatarModalCard: {
    width: '100%',
    backgroundColor: '#16161B',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FE5B01',
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#FE5B01',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarModalTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    fontWeight: '800',
    color: '#FE5B01',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 24,
  },
  avatarCarouselWrapper: {
    width: '100%',
    marginVertical: 4,
    minHeight: 84,
    justifyContent: 'center',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAvatarsText: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: '#71717A',
    textAlign: 'center',
  },
  avatarCarouselContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 14,
  },
  circularAvatarWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularAvatarSelected: {
    borderWidth: 2.5,
    borderColor: '#FE5B01',
    backgroundColor: '#FE5B01',
    shadowColor: '#FE5B01',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  circularAvatarUnselected: {
    borderWidth: 1.5,
    borderColor: '#2B3856',
    backgroundColor: '#1F2432',
  },
  circularAvatarFrame: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: '#16161A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
  },
  cancelActionBtn: {
    backgroundColor: '#FE5B01',
    borderRadius: 10,
    paddingHorizontal: 36,
    paddingVertical: 12,
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FE5B01',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  cancelActionText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});

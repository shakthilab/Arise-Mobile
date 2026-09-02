import React from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CLOUDINARY_ASSETS } from '@/constants/cloudinaryAssets';
import { fontFamilies } from '@/theme/typography';

export interface AnimeAvatarItem {
  id: string;
  name: string;
  tag: string;
  rarity: 'LEGENDARY' | 'EPIC' | 'RARE';
  assetKey: string;
  source: any;
}

export const GAMIFIED_ANIME_AVATARS: AnimeAvatarItem[] = [
  {
    id: 'arise_1',
    name: 'Shadow Hunter I',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_1',
    source: CLOUDINARY_ASSETS.arise_avatar_1,
  },
  {
    id: 'arise_2',
    name: 'Shadow Hunter II',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_2',
    source: CLOUDINARY_ASSETS.arise_avatar_2,
  },
  {
    id: 'arise_3',
    name: 'Shadow Hunter III',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_3',
    source: CLOUDINARY_ASSETS.arise_avatar_3,
  },
  {
    id: 'arise_4',
    name: 'Shadow Hunter IV',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_4',
    source: CLOUDINARY_ASSETS.arise_avatar_4,
  },
  {
    id: 'arise_5',
    name: 'Shadow Hunter V',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_5',
    source: CLOUDINARY_ASSETS.arise_avatar_5,
  },
  {
    id: 'arise_6',
    name: 'Shadow Hunter VI',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_6',
    source: CLOUDINARY_ASSETS.arise_avatar_6,
  },
  {
    id: 'arise_7',
    name: 'Shadow Hunter VII',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_7',
    source: CLOUDINARY_ASSETS.arise_avatar_7,
  },
  {
    id: 'arise_8',
    name: 'Shadow Hunter VIII',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_8',
    source: CLOUDINARY_ASSETS.arise_avatar_8,
  },
  {
    id: 'arise_9',
    name: 'Shadow Hunter IX',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_9',
    source: CLOUDINARY_ASSETS.arise_avatar_9,
  },
  {
    id: 'arise_10',
    name: 'Shadow Hunter X',
    tag: 'S-RANK HUNTER',
    rarity: 'LEGENDARY',
    assetKey: 'arise_10',
    source: CLOUDINARY_ASSETS.arise_avatar_10,
  },
];

export const getAvatarSource = (avatarUrl: string | null | undefined) => {
  if (!avatarUrl || avatarUrl === 'char_naruto' || avatarUrl === 'naruto.jpg') {
    return CLOUDINARY_ASSETS.arise_avatar_2;
  }
  if (avatarUrl === 'char_luffy' || avatarUrl === 'luffy.jpg') {
    return CLOUDINARY_ASSETS.arise_avatar_2;
  }
  if (avatarUrl === 'char_gojo' || avatarUrl === 'gojo.jpg') {
    return CLOUDINARY_ASSETS.arise_avatar_3;
  }
  if (avatarUrl === 'char_itachi' || avatarUrl === 'itachi.jpg') {
    return CLOUDINARY_ASSETS.arise_avatar_4;
  }
  if (avatarUrl === 'char_goku' || avatarUrl === 'goku.jpg') {
    return CLOUDINARY_ASSETS.arise_avatar_5;
  }
  if (avatarUrl === 'char_jinwoo' || avatarUrl === 'jinwoo.jpg') {
    return CLOUDINARY_ASSETS.arise_avatar_6;
  }

  // Custom arise keys
  if (avatarUrl === 'arise_1') return CLOUDINARY_ASSETS.arise_avatar_1;
  if (avatarUrl === 'arise_2') return CLOUDINARY_ASSETS.arise_avatar_2;
  if (avatarUrl === 'arise_3') return CLOUDINARY_ASSETS.arise_avatar_3;
  if (avatarUrl === 'arise_4') return CLOUDINARY_ASSETS.arise_avatar_4;
  if (avatarUrl === 'arise_5') return CLOUDINARY_ASSETS.arise_avatar_5;
  if (avatarUrl === 'arise_6') return CLOUDINARY_ASSETS.arise_avatar_6;
  if (avatarUrl === 'arise_7') return CLOUDINARY_ASSETS.arise_avatar_7;
  if (avatarUrl === 'arise_8') return CLOUDINARY_ASSETS.arise_avatar_8;
  if (avatarUrl === 'arise_9') return CLOUDINARY_ASSETS.arise_avatar_9;
  if (avatarUrl === 'arise_10') return CLOUDINARY_ASSETS.arise_avatar_10;

  const found = GAMIFIED_ANIME_AVATARS.find(
    (a) => a.assetKey === avatarUrl || a.id === avatarUrl
  );
  if (found) return found.source;
  if (typeof avatarUrl === 'string' && avatarUrl.startsWith('http')) {
    return { uri: avatarUrl };
  }
  return CLOUDINARY_ASSETS.arise_avatar_2;
};

export interface AvatarSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  currentAvatar?: string | null;
  onSelectAvatar: (assetKey: string) => void;
}

export function AvatarSelectionModal({
  visible,
  onClose,
  currentAvatar,
  onSelectAvatar,
}: AvatarSelectionModalProps) {
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
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.avatarCarouselContent}
            >
              {GAMIFIED_ANIME_AVATARS.map((item) => {
                const isSelected = currentAvatar
                  ? currentAvatar === item.assetKey || currentAvatar === item.id
                  : item.id === 'arise_2';

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.circularAvatarWrapper,
                      isSelected
                        ? styles.circularAvatarSelected
                        : styles.circularAvatarUnselected,
                    ]}
                    onPress={() => onSelectAvatar(item.assetKey)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.circularAvatarFrame}>
                      <Image
                        source={item.source}
                        style={styles.circularAvatarImage}
                        resizeMode="cover"
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.cancelActionBtn}
            onPress={onClose}
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
    resizeMode: 'cover',
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

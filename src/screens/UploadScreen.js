import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function UploadScreen() {
  const [hasResult, setHasResult] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImageFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera permission is needed to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setHasResult(true);
    }
  };

  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Gallery access permission is needed');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setHasResult(true);
    }
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Crop Scanner</Text>
        <Text style={styles.subtitle}>AI-powered plant disease detection</Text>
      </View>

      {/* Upload Area */}
      <View style={styles.uploadSection}>
        <Pressable 
          style={styles.uploadBox}
          onPress={pickImageFromCamera}
        >
          <View style={styles.uploadIconCircle}>
            <Text style={styles.uploadIcon}>📸</Text>
          </View>
          <Text style={styles.uploadTitle}>Take a Photo</Text>
          <Text style={styles.uploadDesc}>Point camera at affected leaves</Text>
        </Pressable>

        <Pressable 
          style={styles.uploadBox}
          onPress={pickImageFromGallery}
        >
          <View style={styles.uploadIconCircle}>
            <Text style={styles.uploadIcon}>🖼️</Text>
          </View>
          <Text style={styles.uploadTitle}>Choose from Gallery</Text>
          <Text style={styles.uploadDesc}>Select existing crop photos</Text>
        </Pressable>
      </View>

      {/* Quick Scan Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>📋 Best Results Tips</Text>
        <View style={styles.tipsList}>
          <View style={styles.tipItem}>
            <Text style={styles.tipDot}>•</Text>
            <Text style={styles.tipText}>Good lighting, avoid shadows</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipDot}>•</Text>
            <Text style={styles.tipText}>Clear focus on leaves/stems</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipDot}>•</Text>
            <Text style={styles.tipText}>Include affected areas</Text>
          </View>
        </View>
      </View>

      {/* Results Section - Shows after scan */}
      {hasResult && (
        <>
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Analysis Complete ✓</Text>
              <Pressable onPress={() => {
                setHasResult(false);
                setSelectedImage(null);
              }}>
                <Text style={styles.clearBtn}>Clear</Text>
              </Pressable>
            </View>

            {/* Selected Image Preview */}
            {selectedImage && (
              <View style={styles.imagePreview}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              </View>
            )}

            {/* Issue Card */}
            <View style={styles.issueCard}>
              <View style={styles.issueHeader}>
                <View style={styles.issueIconBox}>
                  <Text style={styles.issueIcon}>⚠️</Text>
                </View>
                <View style={styles.issueInfo}>
                  <Text style={styles.issueName}>Early Blight</Text>
                  <Text style={styles.issueConfidence}>89% confidence</Text>
                </View>
              </View>

              <View style={styles.severityBar}>
                <View style={styles.severityFill} />
              </View>
              <Text style={styles.severityLabel}>Moderate Severity</Text>
            </View>

            {/* Treatment Card */}
            <View style={styles.treatmentCard}>
              <Text style={styles.treatmentTitle}>💊 Recommended Treatment</Text>
              <View style={styles.treatmentSteps}>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <Text style={styles.stepText}>Remove infected leaves immediately</Text>
                </View>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <Text style={styles.stepText}>Apply neem-based organic spray</Text>
                </View>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <Text style={styles.stepText}>Best time: Evening 5-7 PM</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionBtns}>
              <Pressable style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>💬 Ask AI About This</Text>
              </Pressable>
              <Pressable style={[styles.actionBtn, styles.actionBtnSecondary]}>
                <Text style={styles.actionBtnTextSecondary}>📥 Save Report</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}

      {/* Recent Scans */}
      {!hasResult && (
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recent Scans</Text>
          
          <Pressable style={styles.recentItem} onPress={() => setHasResult(true)}>
            <View style={styles.recentThumb}>
              <Text style={styles.recentThumbIcon}>🌿</Text>
            </View>
            <View style={styles.recentInfo}>
              <Text style={styles.recentName}>Tomato Leaf</Text>
              <Text style={styles.recentDate}>2 days ago • Early Blight</Text>
            </View>
            <Text style={styles.recentArrow}>›</Text>
          </Pressable>

          <Pressable style={styles.recentItem}>
            <View style={styles.recentThumb}>
              <Text style={styles.recentThumbIcon}>🌾</Text>
            </View>
            <View style={styles.recentInfo}>
              <Text style={styles.recentName}>Wheat Stem</Text>
              <Text style={styles.recentDate}>5 days ago • Healthy</Text>
            </View>
            <Text style={styles.recentArrow}>›</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },

  // Header
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Upload Section
  uploadSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
  },
  uploadBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  uploadIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadIcon: {
    fontSize: 34,
  },
  uploadTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  uploadDesc: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  // Tips Section
  tipsSection: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 10,
  },
  tipsList: {
    gap: 6,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipDot: {
    fontSize: 16,
    color: '#D97706',
    marginRight: 8,
    marginTop: -2,
  },
  tipText: {
    fontSize: 14,
    color: '#78350F',
    flex: 1,
    lineHeight: 20,
  },

  // Result Section
  resultSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  clearBtn: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '600',
  },

  // Image Preview
  imagePreview: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  previewImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },

  // Issue Card
  issueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  issueIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  issueIcon: {
    fontSize: 28,
  },
  issueInfo: {
    flex: 1,
  },
  issueName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  issueConfidence: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  severityBar: {
    height: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  severityFill: {
    height: '100%',
    width: '65%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  severityLabel: {
    fontSize: 13,
    color: '#D97706',
    fontWeight: '600',
  },

  // Treatment Card
  treatmentCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  treatmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#14532D',
    marginBottom: 14,
  },
  treatmentSteps: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: -2,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepText: {
    fontSize: 15,
    color: '#166534',
    flex: 1,
    lineHeight: 22,
  },

  // Action Buttons
  actionBtns: {
    gap: 10,
  },
  actionBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionBtnSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionBtnTextSecondary: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },

  // Recent Scans
  recentSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  recentItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  recentThumb: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentThumbIcon: {
    fontSize: 24,
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 3,
  },
  recentDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  recentArrow: {
    fontSize: 24,
    color: '#D1D5DB',
    fontWeight: '300',
  },

  bottomPadding: {
    height: 30,
  },
});

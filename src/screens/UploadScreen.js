import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { analyzePlantImageWithAI } from '../services/aiService';

export default function UploadScreen() {
  const [selectedImage, setSelectedImage] = useState(/** @type {string | null} */ (null));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(
    /** @type {{ diseaseName: string; severity: string; confidence: string; treatmentPlan: string } | null} */ (null)
  );

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Gallery permission is needed to select an image.');
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
      setAnalysisResult(null);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Camera permission is needed to take a photo.');
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
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || isAnalyzing) {
      return;
    }

    try {
      setIsAnalyzing(true);
      const result = await analyzePlantImageWithAI(selectedImage);
      setAnalysisResult(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to analyze image right now.';
      Alert.alert('AI Analysis Failed', message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Upload Crop Image</Text>
      <Text style={styles.subheading}>Capture or select a crop image for AI analysis.</Text>

      <View style={styles.card}>
        <View style={styles.actionRow}>
          <Pressable style={styles.actionButton} onPress={pickFromGallery}>
            <Text style={styles.actionIcon}>🖼️</Text>
            <Text style={styles.actionText}>Select from Gallery</Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={takePhoto}>
            <Text style={styles.actionIcon}>📸</Text>
            <Text style={styles.actionText}>Take Photo</Text>
          </Pressable>
        </View>
      </View>

      {selectedImage ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Image Preview</Text>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />

          <Pressable style={[styles.analyzeButton, isAnalyzing ? styles.analyzeButtonDisabled : null]} onPress={handleAnalyze}>
            {isAnalyzing ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.analyzeButtonText}>Analyze</Text>}
          </Pressable>
        </View>
      ) : null}

      {analysisResult ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Analysis Result</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Disease name</Text>
            <Text style={styles.resultValue}>{analysisResult.diseaseName}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Severity</Text>
            <Text style={styles.resultValue}>{analysisResult.severity}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Confidence</Text>
            <Text style={styles.resultValue}>{analysisResult.confidence}</Text>
          </View>
          <View style={styles.treatmentWrap}>
            <Text style={styles.resultLabel}>Treatment plan</Text>
            <Text style={styles.treatmentText}>{analysisResult.treatmentPlan}</Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 12,
  },
  analyzeButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzeButtonDisabled: {
    opacity: 0.7,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  resultLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  treatmentWrap: {
    marginTop: 4,
  },
  treatmentText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
});

import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const GEMINI_API_KEY =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
  Constants?.expoConfig?.extra?.geminiApiKey ||
  '';

const GEMINI_MODELS = ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-2.0-flash'];

/** @param {string} modelName */
const getGeminiUrl = (modelName) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is missing. Set EXPO_PUBLIC_GEMINI_API_KEY in .env and restart Expo.');
  }

  return `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
};

/** @param {string} errorMessage */
const isModelNotFoundError = (errorMessage) => {
  return /not found|not supported|unsupported|404/i.test(errorMessage || '');
};

/** @param {string} errorMessage */
const isQuotaOrRateLimitError = (errorMessage) => {
  return /quota exceeded|rate limit|too many requests|retry in|429/i.test(errorMessage || '');
};

/** @param {any} requestBody */
const callGeminiWithFallback = async (requestBody) => {
  let lastErrorMessage = '';
  let hadQuotaIssue = false;

  for (const modelName of GEMINI_MODELS) {
    const response = await fetch(getGeminiUrl(modelName), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const json = await response.json();
    if (response.ok) {
      return json;
    }

    const message = json?.error?.message || 'Gemini request failed.';
    lastErrorMessage = message;

    if (isQuotaOrRateLimitError(message)) {
      hadQuotaIssue = true;
      continue;
    }

    if (!isModelNotFoundError(message)) {
      throw new Error(message);
    }
  }

  if (hadQuotaIssue) {
    throw new Error('Gemini quota exceeded for all configured models. Please enable billing or increase quota in Google AI Studio, then retry.');
  }

  throw new Error(lastErrorMessage || 'No supported Gemini model found for generateContent.');
};

/** @param {any} json */
const getGeminiOutputText = (json) => {
  const parts = json?.candidates?.[0]?.content?.parts || [];
  const merged = parts
    .map((/** @type {any} */ part) => part?.text)
    .filter(Boolean)
    .join('\n')
    .trim();

  return merged || 'No response from AI.';
};

/** @param {string} userPrompt */
export const getAiChatReply = async (userPrompt) => {
  const json = await callGeminiWithFallback({
      systemInstruction: {
        parts: [{ text: 'You are KrishiNova AI. Give short, practical farming advice in simple language.' }],
      },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
  });

  return getGeminiOutputText(json).trim();
};

/** @param {string} text */
const parseAnalysisJson = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
};

/** @param {string} imageUri */
const parseDataUrl = (imageUri) => {
  const match = imageUri.match(/^data:(.*?);base64,(.*)$/);
  if (!match) {
    return null;
  }

  return {
    mimeType: match[1] || 'image/jpeg',
    base64: match[2],
  };
};

/** @param {string} imageUri */
const getImagePayload = async (imageUri) => {
  const directDataUrl = parseDataUrl(imageUri);
  if (directDataUrl) {
    return directDataUrl;
  }

  if (Platform.OS === 'web') {
    const response = await fetch(imageUri);
    if (!response.ok) {
      throw new Error('Unable to read selected image on web.');
    }

    const blob = await response.blob();
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Unable to convert web image to base64.'));
      reader.readAsDataURL(blob);
    });

    const parsedDataUrl = parseDataUrl(dataUrl);
    if (!parsedDataUrl) {
      throw new Error('Selected image format is not supported.');
    }

    return parsedDataUrl;
  }

  const base64Image = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return {
    mimeType: 'image/jpeg',
    base64: base64Image,
  };
};

/** @param {string} imageUri */
export const analyzePlantImageWithAI = async (imageUri) => {
  const { base64, mimeType } = await getImagePayload(imageUri);

  const json = await callGeminiWithFallback({
      systemInstruction: {
        parts: [
          {
            text: 'You are a plant disease assistant. Respond ONLY as JSON with keys: diseaseName, severity, confidence, treatmentPlan. confidence should be like "85%".',
          },
        ],
      },
      contents: [
        {
          role: 'user',
          parts: [
            { text: 'Analyze this crop/plant image and provide disease diagnosis summary.' },
            { inlineData: { mimeType, data: base64 } },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      },
  });

  const outputText = getGeminiOutputText(json);
  const parsed = parseAnalysisJson(outputText);

  if (!parsed) {
    return {
      diseaseName: 'Unable to detect exactly',
      severity: 'Moderate',
      confidence: '70%',
      treatmentPlan: outputText,
    };
  }

  return {
    diseaseName: parsed.diseaseName || 'Unknown',
    severity: parsed.severity || 'Moderate',
    confidence: parsed.confidence || '70%',
    treatmentPlan: parsed.treatmentPlan || 'Monitor plant and consult local agronomist.',
  };
};

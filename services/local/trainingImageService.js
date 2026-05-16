import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

const IMAGES_DIRECTORY = 'images';
const IMAGE_QUALITY = 0.8;

const getImagesDirectoryUri = () => `${FileSystem.documentDirectory}${IMAGES_DIRECTORY}/`;

const ensureImagesDirectory = async () => {
  const directoryUri = getImagesDirectoryUri();
  const directoryInfo = await FileSystem.getInfoAsync(directoryUri);

  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
  }
};

const getImageExtension = (asset) => {
  const fileName = asset.fileName || asset.uri.split('/').pop() || '';
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (extension && extension !== fileName) {
    return extension;
  }

  if (asset.mimeType?.includes('png')) {
    return 'png';
  }

  return 'jpg';
};

const copyImageToTrainingFolder = async (asset) => {
  await ensureImagesDirectory();

  const extension = getImageExtension(asset);
  const fileName = `entrenamiento_${Date.now()}.${extension}`;
  const relativePath = `${IMAGES_DIRECTORY}/${fileName}`;
  const destinationUri = `${FileSystem.documentDirectory}${relativePath}`;

  await FileSystem.copyAsync({
    from: asset.uri,
    to: destinationUri
  });

  return relativePath;
};

const buildPickerOptions = () => ({
  mediaTypes: ['images'],
  allowsEditing: true,
  quality: IMAGE_QUALITY
});

export const pickTrainingImageFromLibrary = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error('Permiso de galeria denegado');
  }

  const result = await ImagePicker.launchImageLibraryAsync(buildPickerOptions());

  if (result.canceled || !result.assets?.length) {
    return null;
  }

  return copyImageToTrainingFolder(result.assets[0]);
};

export const pickTrainingImageFromCamera = async () => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    throw new Error('Permiso de camara denegado');
  }

  const result = await ImagePicker.launchCameraAsync(buildPickerOptions());

  if (result.canceled || !result.assets?.length) {
    return null;
  }

  return copyImageToTrainingFolder(result.assets[0]);
};

export const getTrainingImageUri = (relativePath) => {
  if (!relativePath) return null;

  return `${FileSystem.documentDirectory}${relativePath}`;
};

export const deleteTrainingImage = async (relativePath) => {
  const imageUri = getTrainingImageUri(relativePath);

  if (!imageUri) return;

  const imageInfo = await FileSystem.getInfoAsync(imageUri);

  if (imageInfo.exists) {
    await FileSystem.deleteAsync(imageUri, { idempotent: true });
  }
};

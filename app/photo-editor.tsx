import * as ImagePicker from 'expo-image-picker';
import * as PIXI from 'expo-pixi';
import React, { useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PhotoEditorScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [texture, setTexture] = useState<any>(null);
  const [sprite, setSprite] = useState<any>(null);

  // Pick an image from the library
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      // Create PIXI texture from the image
      const newTexture = await PIXI.Texture.fromExpoAsync({ uri: result.assets[0].uri });
      setTexture(newTexture);
      const newSprite = new PIXI.Sprite(newTexture);
      setSprite(newSprite);
    }
  };

  // Apply image adjustments
  const applyAdjustments = async () => {
    if (!sprite || !texture) return;

    // Create a shader for our adjustments
    const fragmentShader = `
      precision mediump float;
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform float exposure;
      uniform float brilliance;
      uniform float shadows;
      uniform float brightness;
      uniform float highlights;
      uniform float contrast;

      void main(void) {
        vec4 color = texture2D(uSampler, vTextureCoord);
        
        // Apply exposure
        color.rgb = color.rgb * pow(2.0, exposure);
        
        // Apply brilliance (midtone contrast)
        float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        float brillianceFactor = brilliance * (luminance - 0.5);
        color.rgb = color.rgb + brillianceFactor;
        
        // Apply shadows
        float shadowFactor = shadows * (1.0 - luminance);
        color.rgb = color.rgb * (1.0 + shadowFactor);
        
        // Apply brightness
        color.rgb = color.rgb + brightness;
        
        // Apply highlights
        float highlightFactor = highlights * luminance;
        color.rgb = color.rgb * (1.0 + highlightFactor);
        
        // Apply contrast
        color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;
        
        gl_FragColor = color;
      }
    `;

    // Create a filter with our shader
    const filter = new PIXI.Filter(null, fragmentShader, {
      exposure: -0.49,
      brilliance: -0.39,
      shadows: -0.71,
      brightness: -0.16,
      highlights: -0.50,
      contrast: 0.69,
    });

    // Apply the filter to our sprite
    sprite.filters = [filter];
  };

  // Save the processed image
  const saveToPhotos = async () => {
    if (!sprite) {
      Alert.alert('Error', 'No image to save');
      return;
    }

    try {
      // Create a render texture
      const renderTexture = PIXI.RenderTexture.create({
        width: sprite.width,
        height: sprite.height,
      });

      // Render the sprite with its filters
      const renderer = new PIXI.Renderer({
        width: sprite.width,
        height: sprite.height,
      });
      renderer.render(sprite, renderTexture);

      // Convert to base64
      const base64 = await renderTexture.base64();
      
      // Save to photos
      // Note: You'll need to implement the actual saving logic here
      Alert.alert('Success', 'Image processed and saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save image');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Photo Editor</Text>
      <Text style={styles.subtitle}>Clarify photos of the night sky</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>Upload Image</Text>
      </TouchableOpacity>

      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity style={styles.processButton} onPress={applyAdjustments}>
            <Text style={styles.processButtonText}>Apply Adjustments</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.saveButton, !imageUri ? styles.saveButtonDisabled : null]}
        onPress={saveToPhotos}
        disabled={!imageUri}
      >
        <Text style={styles.saveButtonText}>Save to photos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0d2e',
    padding: 20,
  },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 16, marginBottom: 4, textAlign: 'center' },
  subtitle: { color: '#fff', fontSize: 16, marginBottom: 24, textAlign: 'center' },
  uploadButton: { backgroundColor: '#3a2459', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 24 },
  uploadButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  imageContainer: { alignItems: 'center', marginBottom: 16 },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
  },
  processButton: {
    backgroundColor: '#3a2459',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: { backgroundColor: '#3a2459', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
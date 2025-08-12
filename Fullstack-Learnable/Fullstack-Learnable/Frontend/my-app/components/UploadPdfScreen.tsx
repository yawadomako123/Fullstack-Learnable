import * as DocumentPicker from 'expo-document-picker';
import React from 'react';
import { Button, View, Alert } from 'react-native';

export default function UploadPdfScreen() {
  const pickAndUploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      // Narrow the type safely
      if ('type' in result && result.type === 'success') {
        // Cast via unknown to avoid TS errors
        const successResult = result as unknown as {
          type: 'success';
          uri: string;
          name: string;
        };

        const localUri = successResult.uri;
        const filename = successResult.name;
        const fileType = 'application/pdf';

        // Fetch file blob from local URI
        const response = await fetch(localUri);
        const fileBlob = await response.blob();

        // Prepare FormData for upload
        const formData = new FormData();
        formData.append('file', {
          uri: localUri,
          name: filename,
          type: fileType,
        } as any); // cast as any to avoid fetch/FormData typing issues

        // Upload to backend
        const uploadResponse = await fetch('http://localhost:8080/api/files/upload', {
          method: 'POST',
          body: formData,
          // Do NOT manually set Content-Type; let fetch handle it
        });

        if (uploadResponse.ok) {
          const fileUrl = await uploadResponse.text();
          Alert.alert('Upload Successful!', `File accessible at: ${fileUrl}`);
        } else {
          Alert.alert('Upload failed', 'Server returned an error.');
        }
      } else {
        Alert.alert('No file selected or upload cancelled');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ marginTop: 50, padding: 20 }}>
      <Button title="Pick and Upload PDF" onPress={pickAndUploadFile} />
    </View>
  );
}

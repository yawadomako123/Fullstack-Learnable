// utils/moduleProgress.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export const markModuleComplete = async (courseId: string, moduleId: number) => {
  const key = `progress_course_${courseId}`;
  const stored = await AsyncStorage.getItem(key);
  const current = stored ? JSON.parse(stored) : [];

  if (!current.includes(moduleId)) {
    current.push(moduleId);
    await AsyncStorage.setItem(key, JSON.stringify(current));
  }
};

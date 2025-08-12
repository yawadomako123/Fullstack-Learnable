import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useColorScheme,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GAP = 16;
const SAFE_MARGIN = 24;
const ITEM_WIDTH = width - GAP * 2 - SAFE_MARGIN;
const AUTO_SCROLL_INTERVAL = 4000;

// ✅ Loosen the route type to string (to allow custom routes)
type Slide = {
  id: string;
  image: any;
  message: string;
  route: string;
};

const slides: Slide[] = [
  {
    id: '1',
    image: require('../assets/images/free to learn.jpg'),
    message: 'Get all courses for free',
    route: '/(tabs)/explore',
  },
  {
    id: '2',
    image: require('../assets/images/Ai.jpeg'),
    message: 'Try our new AI feature',
    route: '/Ai',
  },
  {
    id: '3',
    image: require('../assets/images/something-new.jpg'),
    message: 'Explore our latest course',
    route: '/(tabs)/explore',
  },
];

const Carousel = () => {
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isDarkMode = useColorScheme() === 'dark';
  const router = useRouter();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      scrollToIndex(nextIndex);
    }, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderItem = ({ item }: { item: Slide }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.slide}
      onPress={() => router.push({ pathname: item.route } as any)} // ✅ Direct string works now
    >
      <Image source={item.image} style={styles.image} />
      <View style={styles.textOverlay}>
        <View style={styles.textWrapper}>
          <Text style={styles.titleText}>{item.message}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={width}
        decelerationRate="fast"
        bounces={false}
      />
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
              isDarkMode && styles.dotDark,
              currentIndex === index && isDarkMode && styles.activeDotDark,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    width: width,
    height: width * 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
  },
  image: {
    width: ITEM_WIDTH,
    height: '100%',
    borderRadius: 14,
    resizeMode: 'cover',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  textWrapper: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    marginLeft: 9,
  },
  titleText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#bbb',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007AFF',
    width: 10,
    height: 10,
  },
  dotDark: {
    backgroundColor: '#666',
  },
  activeDotDark: {
    backgroundColor: '#4DA3FF',
  },
});

export default Carousel;

// Image & media files
declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.avif' {
  const value: string;
  export default value;
}

declare module '*.mp4' {
  const value: string;
  export default value;
}

// React Native Vector Icons (FontAwesome)
declare module 'react-native-vector-icons/FontAwesome' {
  // import { Icon } from 'react-native-vector-icons/Icon';
  export default Icon;
}

// React Native Onboarding Swiper
declare module 'react-native-onboarding-swiper' {
  import { ComponentType, ReactNode } from 'react';
  import {
    ViewStyle,
    ImageSourcePropType,
    TextStyle,
    StyleProp,
  } from 'react-native';

  export interface OnboardingPage {
    backgroundColor?: string;
    image?: ReactNode;
    title?: string;
    subtitle?: string;
    titleStyles?: StyleProp<TextStyle>;
    subTitleStyles?: StyleProp<TextStyle>;
  }

  export interface OnboardingProps {
    pages: OnboardingPage[];
    onDone?: () => void;
    onSkip?: () => void;
    showSkip?: boolean;
    showNext?: boolean;
    showDone?: boolean;
    nextLabel?: string;
    skipLabel?: string;
    doneLabel?: string;
    bottomBarHighlight?: boolean;
    bottomBarColor?: string;
    imageContainerStyles?: StyleProp<ViewStyle>;
    titleStyles?: StyleProp<TextStyle>;
    subTitleStyles?: StyleProp<TextStyle>;
    containerStyles?: StyleProp<ViewStyle>;
  }

  const Onboarding: ComponentType<OnboardingProps>;
  export default Onboarding;
}

// React Native EventSource (for Server-Sent Events)
declare module 'react-native-event-source' {
  export default class EventSource {
    constructor(
      url: string,
      options?: {
        method?: string;
        headers?: Record<string, string>;
        body?: string;
      }
    );

    onopen: () => void;
    onmessage: (event: { data: string }) => void;
    onerror: (error: any) => void;
    onclose?: () => void;
    close: () => void;
  }
}

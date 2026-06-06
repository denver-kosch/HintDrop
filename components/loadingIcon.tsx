import { useEffect, useRef, FC} from 'react';
import { Animated, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const LoadingIcon: FC = () => {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [rotate]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <AnimatedSvg width={100} height={100} viewBox="0 0 100 100" style={{ transform: [{ rotate: spin }] }}>
        <Circle cx="50" cy="50" r="40" stroke="#0075f2" strokeWidth="10" fill="none" />
        <Circle cx="50" cy="50" r="40" stroke="#fff9e2" strokeWidth="10" strokeLinecap="round" fill="none" strokeDasharray="62.83185307179586 62.83185307179586" strokeDashoffset="62.83185307179586" />
      </AnimatedSvg>
    </View>
)};

export default LoadingIcon;
import { Alert, Image, View } from 'react-native';

import { styles } from './styles';
import { Button, Input } from '@/components';

export function Home() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/logo.png')}
        style={styles.logo}
      />

      <Input
        placeholder="O que você deseja comprar?"
      />
      <Button
        title="Adicionar"
        onPress={() => Alert.alert('Pituquinha Apertou')}
      />
    </View>
  );
}



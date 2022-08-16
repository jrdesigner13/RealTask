import { useState, useRef } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { VStack, Heading, Icon, useTheme, Image } from 'native-base';
import { Envelope, Key } from 'phosphor-react-native';

import  Logo  from '../assets/logo.png';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function SignIn() {
  const passwordRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { colors } = useTheme();

  function handleSignIn() {
    if(!email || !password) {
      return Alert.alert('Sign In', 'Enter email and password');
    }
    setIsLoading(true);

    auth()
    .signInWithEmailAndPassword(email, password)
    .catch((error) =>{
      console.log(error);
      setIsLoading(false);

      if(error.code === 'auth/invalid-email') {
        return Alert.alert('Sign In', 'Invalid email.');
      }

      if(error.code === 'auth/wrong-password') {
        return Alert.alert('Sign In', 'Invalid email or password.');
      }

      if(error.code === 'auth/user-not-found') {
        return Alert.alert('Sign In', 'Invalid email or password.');
      }

      return Alert.alert('Sign In', 'Could not login, please try again later!');
    });


  };
  
  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Image source={Logo} size="lg" resizeMode="contain"/>
      <Heading color="gray.100" fontSize="xl" mt={10} mb={6}>
        Access your account
      </Heading>
      <Input 
        keyboardType="email-address"
        autoCorrect={false}
        autoCapitalize="none"
        autoFocus={true}
        placeholder="Your email"
        returnKeyType="next"
        mb={4} 
        InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
        onChangeText={setEmail}
        />
      <Input 
        placeholder="Password" 
        secureTextEntry
        returnKeyType="send"
        ref={passwordRef}
        mb={8}
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        onChangeText={setPassword}
        onSubmitEditing={handleSignIn}
      />
      <Button 
        title="Sign In" 
        w="full" 
        isLoading={isLoading}
        onPress={handleSignIn} 
      />
    </VStack>
  )
  
}
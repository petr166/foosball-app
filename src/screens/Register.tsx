import React, { FunctionComponent, useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo-hooks';
import { useGlobal } from 'reactn';

import { ScreenContainer, TextX, InputX, ButtonX } from '../components';
import { useLoading } from '../hooks';
import { login } from '../login';
import { UserFragment } from '../fragments';
import { IGlobalState, ROOT } from '../global';
import { colors } from '../config/styles';

const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        ...UserFragment
      }
      token
    }
  }

  ${UserFragment}
`;

export const Register: FunctionComponent = () => {
  const [, setRoot] = useGlobal<IGlobalState>('root');
  const [isLoading, setLoading, errorText, , btnDisabled] = useLoading(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPass] = useState('');
  const register = useMutation(REGISTER);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flex: 1,
      }}
      keyboardDismissMode="on-drag"
    >
      <ScreenContainer contentContainerStyle={styles.container}>
        <SafeAreaView />
        <TextX style={{ marginBottom: 42, fontSize: 30 }}>Register</TextX>

        <InputX
          placeholder="your@mail.com"
          value={email}
          onChangeText={val => setEmail(val)}
        />
        <InputX
          placeholder="Your Name"
          value={name}
          onChangeText={val => setName(val)}
        />
        <InputX
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={val => setPassword(val)}
        />
        <InputX
          placeholder="Confirm password"
          secureTextEntry
          value={repeatPassword}
          onChangeText={val => setRepeatPass(val)}
        />

        <ButtonX
          title="Register"
          isLoading={isLoading}
          disabled={btnDisabled}
          onPress={() => {
            setLoading(true);
            register({
              variables: {
                input: {
                  email,
                  name,
                  password,
                  repeatPassword,
                },
              },
            })
              .then(({ data: { register: { token, user } } }) => {
                return login({ token, user });
              })
              .catch(err => {
                setLoading(false, err);
              });
          }}
        />

        <TextX style={{ marginVertical: 12 }}>or</TextX>

        <ButtonX
          style={{ backgroundColor: colors.secondary }}
          title="Go to login"
          onPress={() => {
            setRoot(ROOT.LOGIN);
          }}
        />

        {!!errorText && <TextX>{errorText}</TextX>}
      </ScreenContainer>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

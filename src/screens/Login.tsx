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

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        ...UserFragment
      }
      token
    }
  }

  ${UserFragment}
`;

export const Login: FunctionComponent = () => {
  const [, setRoot] = useGlobal<IGlobalState>('root');
  const [isLoading, setLoading, errorText, , btnDisabled] = useLoading(false);
  const [email, setEmail] = useState('my@mail.com');
  const [password, setPassword] = useState('12345678');
  const loginReq = useMutation(LOGIN);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flex: 1,
      }}
      keyboardDismissMode="on-drag"
    >
      <ScreenContainer contentContainerStyle={styles.container}>
        <SafeAreaView />
        <TextX style={{ marginBottom: 42, fontSize: 30 }}>Login</TextX>

        <InputX
          placeholder="your@mail.com"
          value={email}
          onChangeText={val => setEmail(val)}
        />
        <InputX
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={val => setPassword(val)}
        />

        <ButtonX
          title="Login"
          isLoading={isLoading}
          disabled={btnDisabled}
          onPress={() => {
            setLoading(true);
            loginReq({
              variables: {
                input: {
                  email,
                  password,
                },
              },
            })
              .then(({ data: { login: { token, user } } }) => {
                login({ token, user });
              })
              .catch(err => {
                setLoading(false, err);
              });
          }}
        />

        <TextX style={{ marginVertical: 12 }}>or</TextX>

        <ButtonX
          style={{ backgroundColor: colors.secondary }}
          title="Go to register"
          onPress={() => {
            setRoot(ROOT.REGISTER);
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

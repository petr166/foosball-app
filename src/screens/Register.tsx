import React, { FunctionComponent, useState } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo-hooks';
import { useGlobal } from 'reactn';

import { ScreenContainer, TextX, InputX, ButtonX } from '../components';
import { useLoading } from '../hooks';
import { login } from '../login';
import { UserFragment } from '../fragments';
import { IGlobalState, ROOT } from '../global';

const REGISTER = gql`
  ${UserFragment}

  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        ...UserFragment
      }
      token
    }
  }
`;

export const Register: FunctionComponent = () => {
  const [, setRoot] = useGlobal<IGlobalState>('root');
  const [isLoading, setLoading, errorText, , btnDisabled] = useLoading(false);
  const [email, setEmail] = useState('my@mail.com');
  const [name, setName] = useState('mirel');
  const [password, setPassword] = useState('12345678');
  const [repeatPassword, setRepeatPass] = useState('12345678');
  const register = useMutation(REGISTER);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <ScreenContainer style={styles.container}>
        <TextX>foosball</TextX>
        <TextX>register</TextX>

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
          title="Sign Up"
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
                login({ token, user });
              })
              .catch(err => {
                setLoading(false, err);
              });
          }}
        />

        <TextX>or</TextX>

        <ButtonX
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
  },
});

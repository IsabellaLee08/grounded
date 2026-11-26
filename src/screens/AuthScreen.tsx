import React, { useState } from 'react';
import { Alert, Text } from 'react-native';
import { colors, type } from '../theme';
import { Button, Field, Screen, Segmented } from '../components/ui';
import { useStore } from '../store';

export default function AuthScreen() {
  const { signIn, signUp } = useStore();
  const [mode, setMode] = useState('Sign in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const go = async () => {
    if (!email.trim() || password.length < 6) {
      return Alert.alert('Check your info', 'Enter an email and a password of at least 6 characters.');
    }
    setBusy(true);
    const msg = mode === 'Sign in' ? await signIn(email.trim(), password) : await signUp(email.trim(), password);
    setBusy(false);
    if (msg) Alert.alert(mode === 'Sign in' ? 'Could not sign in' : 'Almost there', msg);
  };

  return (
    <Screen>
      <Text style={[type.display, { marginTop: 40 }]}>Grounded<Text style={{ color: colors.blue }}>.</Text></Text>
      <Text style={[type.body, { color: colors.charcoal, marginTop: 6, marginBottom: 24 }]}>
        Everything happening around UVA and Charlottesville, in one place.
      </Text>
      <Segmented options={['Sign in', 'Create account']} value={mode} onChange={setMode} />
      <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@virginia.edu" />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 6 characters" />
      <Button label={busy ? 'Please wait…' : mode === 'Sign in' ? 'Sign in' : 'Create account'} onPress={go} />
    </Screen>
  );
}

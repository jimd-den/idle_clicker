import React from 'react';
import { View } from 'react-native';
import { ThemedText } from './ThemedText';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('CallStack Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText>Something went wrong. Please try again.</ThemedText>
        </View>
      );
    }

    return this.props.children;
  }
}
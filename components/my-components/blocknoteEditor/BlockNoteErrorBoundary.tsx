'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class BlockNoteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error in BlockNote editor:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>{this.props.fallbackMessage || "Something went wrong with the editor."}</h2>
          {this.state.error && <p>Details: {this.state.error.message}</p>}
          <p>Please try refreshing the page or contacting support if the issue persists.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default BlockNoteErrorBoundary; 
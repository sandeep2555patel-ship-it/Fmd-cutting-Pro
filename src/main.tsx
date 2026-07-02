import React, {StrictMode, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ProjectProvider } from './context.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    const self = this as any;
    if (self.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'white', backgroundColor: '#181818', height: '100vh' }}>
          <h1 style={{ color: '#ff4444' }}>Something went wrong.</h1>
          <pre style={{ color: '#ff8888', whiteSpace: 'pre-wrap' }}>
            {self.state.error?.toString()}
          </pre>
        </div>
      );
    }
    return self.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </ErrorBoundary>
  </StrictMode>,
);

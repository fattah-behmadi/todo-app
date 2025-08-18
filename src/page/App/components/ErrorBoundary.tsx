import { Component, ErrorInfo, ReactNode } from "react";
import { WarningIcon } from "../../../components/icons";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Component error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-danger-500 mb-4">
              <WarningIcon className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              An error has occurred
            </h1>
            <p className="text-gray-600 mb-4">
              Unfortunately, there was a problem with the application. Please
              reload the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

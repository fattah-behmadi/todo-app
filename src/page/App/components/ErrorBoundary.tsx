import { Component, ErrorInfo, ReactNode } from "react";
import { WarningIcon } from "../../../components/icons";
import { Button, Card } from "../../../components/base";

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
          <Card className="max-w-md w-full text-center" variant="elevated">
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
            <Button onClick={() => window.location.reload()} variant="primary">
              Reload
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

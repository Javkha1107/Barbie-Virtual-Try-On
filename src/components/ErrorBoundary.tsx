import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-linear-to-br from-pink-50 to-purple-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
            <h1 className="text-2xl font-bold text-pink-600">
              エラーが発生しました
            </h1>
            <p className="text-gray-600">
              申し訳ございません。予期しないエラーが発生しました。
            </p>
            {this.state.error && (
              <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleReset}
              className="bg-linear-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

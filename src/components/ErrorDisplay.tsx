import { useNavigate } from "react-router-dom";
import { useAppContext, ErrorType } from "../context/AppContext";
import { Button } from "./ui/button";

export function ErrorDisplay() {
  const { error, setError } = useAppContext();
  const navigate = useNavigate();

  if (!error) return null;

  const handleRetry = () => {
    setError(null);
    // Retry logic depends on error type
    if (
      error.type === ErrorType.CAMERA_ACCESS_DENIED ||
      error.type === ErrorType.CAMERA_NOT_AVAILABLE
    ) {
      window.location.reload();
    } else if (error.type === ErrorType.UPLOAD_FAILED) {
      // Stay on current page for retry
    } else {
      navigate("/");
    }
  };

  const handleDismiss = () => {
    setError(null);
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-pink-primary font-heading">
            エラーが発生しました
          </h2>
        </div>

        <p className="text-gray-700 text-center">{error.userMessage}</p>

        <div className="flex gap-4 justify-center">
          {error.retryable && (
            <Button onClick={handleRetry}>もう一度試す</Button>
          )}
          <Button variant="custom" onClick={handleDismiss}>
            ホームに戻る
          </Button>
        </div>
      </div>
    </div>
  );
}

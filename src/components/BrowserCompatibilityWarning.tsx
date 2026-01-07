import {
  checkBrowserCompatibility,
  getBrowserName,
} from "../utils/browserCheck";
import { Button } from "./ui/button";

export function BrowserCompatibilityWarning() {
  const compatibility = checkBrowserCompatibility();

  if (compatibility.isCompatible) {
    return null;
  }

  const browserName = getBrowserName();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🌐</div>
          <h2 className="text-2xl font-bold text-pink-primary font-heading">
            ブラウザが対応していません
          </h2>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">
            お使いのブラウザ ({browserName}) は以下の機能に対応していません：
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {compatibility.missingFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>

          <p className="text-gray-700">以下のブラウザをご利用ください：</p>

          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Google Chrome (推奨)</li>
            <li>Microsoft Edge</li>
            <li>Mozilla Firefox</li>
            <li>Safari (macOS/iOS)</li>
          </ul>
        </div>

        <div className="flex justify-center">
          <Button onClick={() => window.location.reload()}>再読み込み</Button>
        </div>
      </div>
    </div>
  );
}

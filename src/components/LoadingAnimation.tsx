import { Sparkles, Star, Heart } from "lucide-react";

export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center space-y-8 md:space-y-12 px-4">
      {/* Magic wand animation - scaled for portrait */}
      <div className="relative w-32 h-32 md:w-48 md:h-48">
        {/* Sparkle stars */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-bounce">
          <Sparkles className="w-10 h-10 md:w-16 md:h-16 text-yellow-300" />
        </div>
        <div
          className="absolute top-4 left-4 md:top-8 md:left-8 animate-pulse"
          style={{ animationDelay: "200ms" }}
        >
          <Star className="w-8 h-8 md:w-12 md:h-12 text-pink-300 fill-pink-300" />
        </div>
        <div
          className="absolute top-4 right-4 md:top-8 md:right-8 animate-pulse"
          style={{ animationDelay: "400ms" }}
        >
          <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-purple-300" />
        </div>
        <div
          className="absolute bottom-4 left-6 md:bottom-8 md:left-12 animate-pulse"
          style={{ animationDelay: "600ms" }}
        >
          <Star className="w-6 h-6 md:w-10 md:h-10 text-yellow-300 fill-yellow-300" />
        </div>
        <div
          className="absolute bottom-4 right-6 md:bottom-8 md:right-12 animate-pulse"
          style={{ animationDelay: "800ms" }}
        >
          <Sparkles className="w-6 h-6 md:w-10 md:h-10 text-pink-300" />
        </div>

        {/* Central magic circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-20 h-20 md:w-32 md:h-32">
            <div className="absolute inset-0 bg-linear-to-r from-pink-400 via-purple-400 to-pink-400 rounded-full animate-spin opacity-50 blur-md"></div>
            <div
              className="absolute inset-1 md:inset-2 bg-linear-to-r from-purple-300 via-pink-300 to-purple-300 rounded-full animate-spin opacity-70 blur-sm"
              style={{ animationDirection: "reverse", animationDuration: "2s" }}
            ></div>
            <div className="absolute inset-2 md:inset-4 bg-white rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-10 h-10 md:w-16 md:h-16 text-pink-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Text and hearts */}
      <div className="text-center space-y-4 md:space-y-6">
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <Heart className="w-6 h-6 md:w-8 md:h-8 text-pink-500 fill-pink-500 animate-pulse flex-shrink-0" />
          <h2 className="text-2xl md:text-4xl font-bold bg-linear-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-heading animate-pulse">
            Creating Magic
          </h2>
          <Heart
            className="w-6 h-6 md:w-8 md:h-8 text-pink-500 fill-pink-500 animate-pulse flex-shrink-0"
            style={{ animationDelay: "500ms" }}
          />
        </div>

        <p className="text-lg md:text-2xl font-medium bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent px-4">
          Generating your amazing video
        </p>

        {/* Heart wave */}
        <div className="flex justify-center gap-2 md:gap-3 mt-4 md:mt-6">
          <Heart
            className="w-6 h-6 md:w-8 md:h-8 text-pink-400 fill-pink-400 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <Heart
            className="w-6 h-6 md:w-8 md:h-8 text-pink-500 fill-pink-500 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <Heart
            className="w-6 h-6 md:w-8 md:h-8 text-pink-600 fill-pink-600 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
          <Heart
            className="w-6 h-6 md:w-8 md:h-8 text-pink-500 fill-pink-500 animate-bounce"
            style={{ animationDelay: "450ms" }}
          />
          <Heart
            className="w-6 h-6 md:w-8 md:h-8 text-pink-400 fill-pink-400 animate-bounce"
            style={{ animationDelay: "600ms" }}
          />
        </div>
      </div>
    </div>
  );
}

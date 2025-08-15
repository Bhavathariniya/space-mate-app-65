import * as React from "react"
import { cn } from "@/lib/utils"

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | "auto"
  loading?: "lazy" | "eager"
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  auto: "aspect-auto"
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ 
    className,
    src,
    alt,
    fallback = "/placeholder.png",
    aspectRatio = "auto",
    loading = "lazy",
    ...props 
  }, ref) => {
    const [error, setError] = React.useState(false)
    const [loaded, setLoaded] = React.useState(false)

    const handleError = () => {
      setError(true)
      setLoaded(true)
    }

    const handleLoad = () => {
      setLoaded(true)
    }

    return (
      <div className={cn(
        "relative overflow-hidden bg-muted",
        aspectRatioClasses[aspectRatio],
        className
      )}>
        <img
          ref={ref}
          src={error ? fallback : src}
          alt={alt}
          loading={loading}
          onError={handleError}
          onLoad={handleLoad}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            !loaded && "opacity-0",
            loaded && "opacity-100"
          )}
          {...props}
        />
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <svg
              className="h-8 w-8 animate-spin text-muted-foreground/30"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>
    )
  }
)
Image.displayName = "Image"

export { Image } 
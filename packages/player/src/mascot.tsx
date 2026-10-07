import { cn } from "@workspace/ui/lib/utils"

// Placeholder mascot until the real one is designed. Reactions come from the player, never the lesson.

export type MascotMood = "idle" | "happy" | "cheer" | "oops" | "think"

const ink = "#2b2d3a"
const body = "#f2b632"

export function Mascot({
  mood = "idle",
  size = "md",
}: {
  mood?: MascotMood
  size?: "md" | "lg"
}) {
  const happy = mood === "happy" || mood === "cheer"
  return (
    <div
      aria-hidden="true"
      className={cn(
        "shrink-0",
        size === "lg" ? "size-24" : "size-12",
        happy &&
          "motion-safe:animate-[mascot-bounce_.6s_cubic-bezier(.3,1.6,.5,1)]",
        mood === "oops" && "motion-safe:animate-[mascot-shake_.45s_ease]"
      )}
    >
      <svg viewBox="0 0 64 64" className="size-full overflow-visible">
        <path
          d="M32 11 C 33 6 37 4.5 40 5.5 C 38.5 8.5 36 10.5 32.5 11.5"
          fill="#2f9e5b"
        />
        <path
          d="M32 12 V 9"
          stroke={ink}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M32 12 C 47 12 55 21 55 35 C 55 49 45 57 32 57 C 19 57 9 49 9 35 C 9 21 17 12 32 12 Z"
          fill={body}
        />
        {mood === "think" ? (
          <>
            <circle cx="25" cy="29" r="3.4" fill={ink} />
            <circle cx="39" cy="29" r="3.4" fill={ink} />
          </>
        ) : mood === "oops" ? (
          <>
            <path
              d="M21.5 30.5 L28 28.5"
              stroke={ink}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M42.5 30.5 L36 28.5"
              stroke={ink}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </>
        ) : happy ? (
          <>
            <path
              d="M21.5 31 Q25 26.5 28.5 31"
              fill="none"
              stroke={ink}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M35.5 31 Q39 26.5 42.5 31"
              fill="none"
              stroke={ink}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <circle cx="19.5" cy="38" r="3" fill="#e8848f" opacity=".7" />
            <circle cx="44.5" cy="38" r="3" fill="#e8848f" opacity=".7" />
          </>
        ) : (
          <>
            <circle cx="25" cy="30" r="3.4" fill={ink} />
            <circle cx="39" cy="30" r="3.4" fill={ink} />
          </>
        )}
        {mood === "cheer" ? (
          <path d="M24.5 39.5 Q32 52 39.5 39.5 Z" fill={ink} />
        ) : mood === "happy" ? (
          <path
            d="M25 40 Q32 48 39 40"
            fill="none"
            stroke={ink}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        ) : mood === "oops" ? (
          <path
            d="M26 44 Q32 39.5 38 44"
            fill="none"
            stroke={ink}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        ) : mood === "think" ? (
          <circle
            cx="33"
            cy="42.5"
            r="2.6"
            fill="none"
            stroke={ink}
            strokeWidth="2.2"
          />
        ) : (
          <path
            d="M27 41.5 Q32 44.5 37 41.5"
            fill="none"
            stroke={ink}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  )
}

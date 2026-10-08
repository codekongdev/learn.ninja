"use client"

import * as React from "react"

import { usePlayer } from "./context"
import { mathKey } from "./prepared"

// Renders the spec's rich-text subset: **bold**, *italic*, `code`, and \( formulas \).
// A $ is always a plain dollar sign.

const TOKEN = /\\\(([\s\S]+?)\\\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g

/** The same text without its markers, for places that need a plain string (like a live region). */
export function plainText(text: string): string {
  return text.replace(
    TOKEN,
    (_, math?: string, code?: string, bold?: string, italic?: string) =>
      math?.trim() ?? code ?? bold ?? italic ?? ""
  )
}

export function RichText({
  text,
  lang,
  className,
}: {
  text: string
  lang?: string
  className?: string
}) {
  const { prepared } = usePlayer()
  const nodes: React.ReactNode[] = []
  let last = 0
  let key = 0
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const [, math, code, bold, italic] = m
    if (math !== undefined) {
      const html = prepared.math[mathKey(math.trim(), false)]
      nodes.push(
        html ? (
          <span
            key={key++}
            dir="ltr"
            className="inline-block"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <code key={key++}>{math}</code>
        )
      )
    } else if (code !== undefined) {
      nodes.push(
        <code
          key={key++}
          dir="ltr"
          className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em]"
        >
          {code}
        </code>
      )
    } else if (bold !== undefined) {
      nodes.push(
        <strong key={key++} className="font-semibold">
          {bold}
        </strong>
      )
    } else if (italic !== undefined) {
      nodes.push(<em key={key++}>{italic}</em>)
    }
    last = m.index + m[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  // dir="auto": lesson text takes its own direction, so English stays left to right inside an Arabic interface.
  return (
    <span lang={lang} dir="auto" className={className}>
      {nodes}
    </span>
  )
}

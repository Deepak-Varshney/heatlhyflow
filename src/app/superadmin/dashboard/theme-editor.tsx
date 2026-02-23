'use client'

import { useState } from 'react'
import { saveCustomTheme } from '@/app/actions/theme' // Import your server action

export function ThemePasteDialog() {
  const [themeInput, setThemeInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // useEffect for localStorage is no longer needed, so it has been removed.

  const applyTheme = async () => { // Make the function async
    const styleTag = document.getElementById('theme-overrides')
    if (!styleTag) return

    const rootVars = extractCSSBlock(themeInput, ':root')
    const darkVars = extractCSSBlock(themeInput, '.dark')

    const finalCSS = `
      :root {
        ${rootVars}
      }
      .dark {
        ${darkVars}
      }
    `.trim()

    // 1. Instantly update the UI
    styleTag.innerHTML = finalCSS

    // 2. Save the theme permanently to the database
    await saveCustomTheme(finalCSS)

    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Dev Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700"
      >
        Paste Theme
      </button>

      {/* Dialog (No changes needed in the JSX) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 text-black dark:text-white p-6 rounded-lg max-w-2xl w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">Paste Theme Variables</h2>
            <textarea
              className="w-full h-64 p-3 text-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded resize-none font-mono"
              placeholder={`:root {\n    --background: oklch(1 0 0);\n    ...\n}\n\n.dark {\n    --background: oklch(0.145 0 0);\n    ...\n}`}
              value={themeInput}
              onChange={(e) => setThemeInput(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm rounded hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={applyTheme}
                className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700"
              >
                Apply Theme
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// This function remains the same
function extractCSSBlock(input: string, selector: ':root' | '.dark'): string {
  const regex = new RegExp(`${selector}\\s*{([\\s\\S]*?)}`, 'm')
  const match = input.match(regex)
  return match ? match[1].trim() : ''
}
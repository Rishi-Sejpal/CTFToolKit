export type ToolCategory =
  | 'Encoding'
  | 'Cryptography'
  | 'Text'
  | 'Network'
  | 'Forensics'
  | 'Reverse Engineering'
  | 'Utilities'
  | 'Recipe'
  | 'Reverse Shell'

import type React from "react"

export interface ToolDefinition {
  id: string
  name: string
  category: ToolCategory
  description: string
  keywords: string[]
  component: React.ComponentType
}

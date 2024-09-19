export interface Rect {
  left?: number | null
  top?: number | null
  width?: number | null
  height?: number | null
}

export interface Position {
  x: number
  y: number
}

export type Orientation = 'left' | 'right'

// Width of the title bar of the tool palette
export const WIDTH_OF_TITLE_BAR = 20

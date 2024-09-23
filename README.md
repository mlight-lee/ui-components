# Common UI Component Libaray

This is one common UI component library based on Element Plus. 

## Components

The following components are included in this package.

- Tool Palette: one dockable, resizable, and floating window, which is quite similar to AutoCAD Tool Palette.
- Toolbar: one toolbar which can be easily customized by one array of button data. 

### Tool Palette

AutoCAD uses [tool palettes](https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-167A8594-92CB-4FCC-B72C-0F546383E97C) to organize blocks, hatches, and custom tools in a tabbed window. Tool Palette component is quite similar to one in AutoCAD. It supports the following features.

- Dockable: dock to the left or right side of the window
- Folderable: roll open or closed as your need
- Auto-hide: roll open and closed as the cursor moves across it. When this option is cleared, the full tool palette stays open continuously.

<img src="./doc/palette.jpg" alt="Tool Palette Example">

You can customize tool palette by the following properties. 

```javascript
/**
 * Properties of MlToolPalette component
 */
interface Props {
  /**
   * The title of tool palette dialog
   */
  title?: string
  /**
   * The minimum distance from the left side of the tool palette to the left side of the window
   */
  leftOffset?: number
  /**
   * The minimum distance from the right side of the tool palette to the right side of the window
   */
  rightOffset?: number
  /**
   * The minimum distance from the top side of the tool palette to the top side of the window
   */
  topOffset?: number
  /**
   * The minimum distance from the bottom side of the tool palette to the bottom side of the window
   */
  bottomOffset?: number
}
```

Four `offsetXXX` properties are used to set the minimum distance from the side of the tool palette to the side of the window. It is quite useful if you want the tool palette is shown within certain area. For example, one web page has one title bar at the top of window, one status bar at the bottom of window, and one canvas area between the title bar and the status bar. The height of the title bar is 60px and the height of the status bar is 20px. Then you can set `topOffset` to 60 and `bottomOffset` to 20 to let the tool palette are shown and moved within canvas area only. 

```javascript
<script lang="ts" setup>
import { MlToolPalette } from '@mlightcad/ui-components'
const toolPaletteVisible = ref<boolean>(false)
</script>

<template>
  <ml-tool-palette
    class="tool-palette"
    v-model="toolPaletteVisible"
    title="Tool Palette Test"
    :top-offset="60"
    :bottom-offset="20"
  >
    <span>Tool Palette Test</span>
  </ml-tool-palette>
</template>

<style scoped>
.tool-palette {
  position: fixed;
  top: 55px;
  width: 400px;
}
</style>
```

### Toolbar

Toolbar component has the followiing features.

- Define button list by one array of `MlButtonData`
- Arrange button vertically or horizontally
- Support three kind of button size

<img src="./doc/toolbar.jpg" width="423" height="223" alt="ViewCube Example">

Features above can be customized by the following properties.

```javascript
/**
 * Properties of MLToolbar components
 */
interface Props {
  /**
   * An array of button data
   */
  items: MlButtonData[]
  /**
   * Button size.
   * - small: 30px
   * - medium: 50px
   * - large: 70px
   */
  size?: 'small' | 'medium'| 'large'
  /**
   * Layout type.
   * - vertical: arrange button vertically
   * - horizontal: arrange button horizontally
   */
  direction?: 'vertical' | 'horizontal'
}
```

Buttons in toolbar are described by the following data.

```javascript
/**
 * Data to descibe button appearance
 */
export interface MlButtonData {
  /**
   * Icon represented by one SVG string
   */
  icon: string
  /**
   * Text shown below icon
   */
  text: string
  /**
   * Command string which will be passed to click event as event arguments
   */
  command: string
  /**
   * Tooltips content when hover
   */
  description?: string
}
```

Usage of this component is as follows. To simplify example code, we use the same SVG icon for all button in toolbar.

```javascript
<script setup lang="ts">
import '@mlightcad/ui-components/dist/style.css'
import { MlButtonData, MlToolbar } from '@mlightcad/ui-components'
import { reactive } from 'vue'

const svg =
  '<svg data-v-d0da8fdb="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384m0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256"></path></svg>'

const data = reactive<MlButtonData[]>([
  {
    icon: svg,
    text: 'Edit',
    command: 'edit',
    description: 'This is description for edit button'
  },
  {
    icon: svg,
    text: 'Delete',
    command: 'delete',
    description: 'This is description for delete button'
  },
  {
    icon: svg,
    text: 'Search',
    command: 'search',
    description: 'This is description for search button'
  }
])

const handleCommand = (command: string) => {
  console.log(command)
}
</script>

<template>
  <div>
    <ml-toolbar :items="data1" layout="vertical" @click="handleCommand"/>
  </div>
</template>

<style></style>
```
import MlCollapse from './components/MlCollapse.vue'
import MlDropdown from './components/MlDropdown.vue'
import MlLanguage from './components/MlLanguage.vue'
import MlStatusBar from './components/MlStatusBar.vue'
import MlToggleButton from './components/MlToggleButton.vue'
import MlToolBar from './components/MlToolBar.vue'
import MlToolPalette from './components/MlToolPalette.vue'
export {
  MlCollapse,
  MlDropdown,
  MlLanguage,
  MlStatusBar,
  MlToggleButton,
  MlToolBar,
  MlToolPalette
}
export type { MlDropdownMenuItem } from './components/MlDropdown.vue'
export type { MlToggleButtonData } from './components/MlToggleButton.vue'
export type { MlButtonData } from './components/MlToolBar.vue'
export * from './components/types'

// Optionally, export them as a plugin for Vue
export default {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  install(app: any) {
    app.component('MlCollapse', MlDropdown)
    app.component('MlDropdown', MlDropdown)
    app.component('MlLanguage', MlLanguage)
    app.component('MlStatusBar', MlStatusBar)
    app.component('MlToggleButton', MlToggleButton)
    app.component('MlToolBar', MlToolBar)
    app.component('MlToolPalette', MlToolPalette)
  }
}

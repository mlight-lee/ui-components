import MlCollapse from './components/MlCollapse.vue'
import MlDropdown from './components/MlDropdown.vue'
import MlLanguage from './components/MlLanguage.vue'
import MlStatusBar from './components/MlStatusBar.vue'
import MlToolbar from './components/MlToolbar.vue'
import MlToolPalette from './components/MlToolPalette.vue'
export { MlCollapse, MlDropdown, MlLanguage, MlStatusBar, MlToolbar, MlToolPalette }
export type { MlDropdownMenuItem } from './components/MlDropdown.vue'
export type { MlButtonData } from './components/MlToolbar.vue'

// Optionally, export them as a plugin for Vue
export default {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  install(app: any) {
    app.component('MlCollapse', MlDropdown)
    app.component('MlDropdown', MlDropdown)
    app.component('MlLanguage', MlLanguage)
    app.component('MlStatusBar', MlStatusBar)
    app.component('MlToolbar', MlToolbar)
    app.component('MlToolPalette', MlToolPalette)
  }
}

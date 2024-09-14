import MlDropdown from './MlDropdown.vue'
import MlLanguage from './MlLanguage.vue'
import MlToolbar from './MlToolbar.vue'
export { MlLanguage, MlToolbar }
export type { MlDropdownMenuItem } from './MlDropdown.vue'
export type { MlButtonData } from './MlToolbar.vue'

// Optionally, export them as a plugin for Vue
export default {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  install(app: any) {
    app.component('MlDropdown', MlDropdown)
    app.component('MlLanguage', MlLanguage)
    app.component('MlToolbar', MlToolbar)
  }
}

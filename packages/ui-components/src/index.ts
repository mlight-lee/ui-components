import MlToolbar from './MlToolbar.vue'
export { MlToolbar }
export type { MlButtonData } from './MlToolbar.vue'

// Optionally, export them as a plugin for Vue
export default {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  install(app: any) {
    app.component('MlToolbar', MlToolbar)
  }
}

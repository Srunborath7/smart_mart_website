import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      bootstrap
    }
  }
})
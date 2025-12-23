import { vi } from 'vitest'
import { ref, computed } from 'vue'

global.ref = ref
global.computed = computed

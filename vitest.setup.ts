import '@testing-library/jest-dom'
import { configure } from '@testing-library/dom'

// Trim noisy HTML dumps from Testing Library errors
configure({
  getElementError: (message) => new Error(message),
})



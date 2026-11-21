import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the brand title and tagline', () => {
    render(<App />)
    expect(screen.getByText('Voca')).toBeInTheDocument()
    expect(screen.getByText(/Find your voice/i)).toBeInTheDocument()
  })

  it('renders the hybrid AI status indicator', () => {
    render(<App />)
    expect(screen.getByText(/Hybrid AI Engine Ready/i)).toBeInTheDocument()
  })
})

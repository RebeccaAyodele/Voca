import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the brand title and tagline', () => {
    render(<App />)
    expect(screen.getByText('Voca')).toBeInTheDocument()
    expect(screen.getByText(/Find your voice/i)).toBeInTheDocument()
  })

  it('renders the get started call to action', () => {
    render(<App />)
    expect(screen.getByText(/Get started/i)).toBeInTheDocument()
  })

  it('renders the acoustic soundform icon', () => {
    render(<App />)
    expect(screen.getByAltText(/Voca Soundform/i)).toBeInTheDocument()
  })
})

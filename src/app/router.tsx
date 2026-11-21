import { createBrowserRouter } from 'react-router-dom'
import WelcomeView from '@/features/auth/WelcomeView'
import AuthView from '@/features/auth/AuthView'
import GoalAssessmentView from '@/features/onboarding/GoalAssessmentView'
import SpeakingStudioView from '@/features/speaking-studio/SpeakingStudioView'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomeView />
  },
  {
    path: '/auth',
    element: <AuthView />
  },
  {
    path: '/onboarding/goals',
    element: <GoalAssessmentView />
  },
  {
    path: '/studio',
    element: <SpeakingStudioView />
  }
])

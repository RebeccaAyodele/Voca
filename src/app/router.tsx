import { createBrowserRouter } from 'react-router-dom'
import WelcomeView from '@/features/auth/WelcomeView'
import AuthView from '@/features/auth/AuthView'
import GoalAssessmentView from '@/features/onboarding/GoalAssessmentView'
import SpeakingStudioView from '@/features/speaking-studio/SpeakingStudioView'
import AnalysisResultsView from '@/features/speech-analysis/AnalysisResultsView'
import DashboardView from '@/features/dashboard/DashboardView'
import SkillMapView from '@/features/skill-map/SkillMapView'
import ProgressView from '@/features/progress/ProgressView'
import AppLayout from '@/components/layout/AppLayout'

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
    element: <AppLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardView />
      },
      {
        path: '/studio',
        element: <SpeakingStudioView />
      },
      {
        path: '/analysis',
        element: <AnalysisResultsView />
      },
      {
        path: '/skills',
        element: <SkillMapView />
      },
      {
        path: '/progress',
        element: <ProgressView />
      }
    ]
  }
])

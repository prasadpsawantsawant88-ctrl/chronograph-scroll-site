import { Story } from './components/Story'
import { StaticStory } from './components/StaticStory'
import { useReducedMotion } from './lib/useReducedMotion'

export default function App() {
  const reduced = useReducedMotion()
  return reduced ? <StaticStory /> : <Story />
}

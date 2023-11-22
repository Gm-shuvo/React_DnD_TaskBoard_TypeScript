import KanbanBoard from "../components/KanbanBoard"
import { useTheme } from "../contexts/ThemeContext"

const Home = () => {
  const { theme } = useTheme()
  return (
    <div className={`${theme == 'dark' ? 'bg-mainDarkBackgroundColor': 'bg-mainLightBackgroundColor'}`}>
      <KanbanBoard />
    </div>
  )
}

export default Home
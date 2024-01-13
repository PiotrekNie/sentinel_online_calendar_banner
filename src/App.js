import './App.scss';
import CalendarSection from './components/NewsList';

function App() {
  return (
    <div className="App">
      <div className="container grid grid grid-cols-2 gap-6">
        <div></div>
        <div>
          <CalendarSection />
        </div>
      </div>
    </div>
  );
}

export default App;

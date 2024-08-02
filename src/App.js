import './App.scss';
import CalendarSection from './components/NewsList';

function App({ configuration }) {
  return (
    <div className="App">
      <CalendarSection
        news={configuration?.newsListURL ?? '/web/sentinel/calendar'}
      />
    </div>
  );
}

export default App;

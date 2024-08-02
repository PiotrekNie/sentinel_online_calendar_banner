import './App.scss';
import CalendarContainer from './components/NewsList';

function App({ configuration }) {
  return (
    <div className="App">
      <CalendarContainer
        news={configuration?.newsListURL ?? '/web/sentinel/calendar'}
      />
    </div>
  );
}

export default App;

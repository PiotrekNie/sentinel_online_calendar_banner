import './App.scss';
import CalendarSection from './components/NewsList';

function App({ configuration }) {
  return (
    <div className="App">
      <div className="container grid grid grid-cols-2 gap-6">
        <div></div>
        <div>
          <CalendarSection news={configuration.newsListURL} />
        </div>
      </div>
    </div>
  );
}

export default App;

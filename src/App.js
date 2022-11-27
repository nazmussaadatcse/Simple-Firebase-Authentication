import './App.css';
import app from './firebase.init';
import {getAuth} from 'firebase/auth';

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

function App() {
  return (
    <div className="App">
      
    </div>
  );
}

export default App;

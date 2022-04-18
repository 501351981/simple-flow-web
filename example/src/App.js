import SimpleFlow from "./components/SimpleFlow";
import logo from './logo.svg';
import './App.css';
import {useRef} from "react";

function App() {
    const save = function (){
        localStorage.setItem('display', window.dataModel.serialize())
    }
  return (
    <div className="App">
        <SimpleFlow />
        <div className={'operate-area'}>
            <button onClick={save}>保存</button>
            <p>{process.env.NODE_ENV}</p>
        </div>
    </div>
  );
}

export default App;

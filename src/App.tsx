import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Container} from './components/Container/Container';
import { FixedPage } from './components/FixedPage/FixedPage';
import { TenzieContainer } from './components/Tenzies/TenzieContainer/TenzieContainer';

function App() {
  const containers = [{title: "Web design", text: "aaaaaa" }, {title: "Magic Maker", text: "Woop Woop" }, {title: "Amazing!", text: "How do I do math" }, {title: "What's going on!?", text: "Hey yoo!" }];
  const screeenshots = [{path: "", alt: "this is a picture 1"}, {path: "", alt: "this is a picture 2"}, {path: "", alt: "this is a picture3"}, {path: "", alt: "this is a picture4"}]
  return (
    <div>
    {/* <div className='App-header'>
        <FixedPage containers={containers} screenshots={screeenshots} />

    </div> */}
       

       <div>
       <hr style={{marginTop: "20px"}} />

         <TenzieContainer />
       </div>       
       </div>
  );
}

export default App;

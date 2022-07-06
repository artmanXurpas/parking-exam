import "bootstrap/dist/css/bootstrap.min.css";
import {Container} from "react-bootstrap";
import Section from './components/sections/Section'
import './App.css'

function App() {
  return <Container className="bg-background">
    <Section />
  </Container>;
}

export default App;

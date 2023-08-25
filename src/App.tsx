import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Home } from "./pages/Home";
import { NovoQuadro } from './pages/NovoQuadro';
import { Quadro } from './pages/Quadro';
import { AuthContextProvider } from './contexts/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/quadro/new" component={NovoQuadro} />
          <Route path="/quadro/:id" component={Quadro} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter >
  );
}

export default App;

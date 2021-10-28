import Unicamp from '../assets/images/unicamp.png';

import '../styles/logo.scss';

export function Logo() {
  return (
    <div>
      <div className="Cima">
        <div className="Azul"> </div>
        <div className="Branco">
          <img src={Unicamp} />
          <h2> Resolução de Problemas I SI202/A </h2>
        </div>
      </div>
      <div className="Baixo">
        <div className="Amarelo"> </div>
        <div className="Vermelho"> </div>
      </div>
    </div >
  )
}
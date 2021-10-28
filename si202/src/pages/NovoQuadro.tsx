import { Link, useHistory } from 'react-router-dom';
import LogoImg from '../assets/images/logo.jpg';
import { Logo } from "../pages/Logo";
import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/novoQuadro.scss';

export function NovoQuadro() {
  const { user } = useAuth();
  const history = useHistory()
  const [newQuadro, setNewQuadro] = useState('');
  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newQuadro.trim() === '') {
      return;
    }

    const quadroRef = database.ref('quadro');
    const firebaseQuadro = await quadroRef.push({
      title: newQuadro,
      authorId: user?.id
    });
    history.push(`/quadro/${firebaseQuadro.key}`);
  }

  return (
    <div className="Principal">
      <div className="Esquerda">
        <div className="PEsq">
          <img src={LogoImg} />
          <h1> Crie um novo quadro </h1>
          <div className=" Separator"> </div>
          <form onSubmit={handleCreateRoom}>
            <input type="text" className="Texto" placeholder="Nome do quadro"
              onChange={event => setNewQuadro(event.target.value)} value={newQuadro} />
            <div className=" Separator"> </div>
            <input type="submit" className="Criar" value="Criar quadro" />
          </form>
          <div className=" Separator"> </div>
          <span> Quer entrar em um quadro já existente? <Link to="/"> Clique aqui </Link> </span>
        </div>
      </div>
      <div className='Direita'> <Logo /> </div>
    </div>
  )
}
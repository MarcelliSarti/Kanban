import { useHistory } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import LogoImg from '../assets/images/logo.jpg';
import Google from '../assets/images/google-icon.svg';
import { Logo } from "../pages/Logo";
import '../styles/home.scss';
import { database } from '../services/firebase';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [quadroCode, setQuadroCode] = useState('');

  async function handleCreateQuadro() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push('/quadro/new');
  }

  async function handleJoinQuadro(event: FormEvent) {
    event.preventDefault();

    if (quadroCode.trim() === '') {
      return;
    }

    const quadroRef = database.ref(`quadro/${quadroCode}`).get();

    if (!(await quadroRef).exists()) {
      alert('Quadro não existe!');
      return;
    }

    if ((await quadroRef).val().endedAt) {
      alert('Quadro já encerrado!')
      return;
    }

    history.push(`quadro/${quadroCode}`);
  }

  return (
    <div className="Principal">
      <div className="Esquerda">
        <div className="PEsq">
          <img src={LogoImg} />
          <button className="Google" onClick={handleCreateQuadro}>
            <img src={Google} /> Crie seu quadro com o Google
          </button>
          <div className=" Separator"> </div>
          <div className=" Outro">
            <div className="Linha"> </div>
            <span> ou entre em um quadro </span>
            <div className="Linha"> </div>
          </div>
          <div className=" Separator"> </div>
          <form onSubmit={handleJoinQuadro}>
            <input type="text" className="Texto" placeholder="Digite o código do quadro"
              onChange={event => setQuadroCode(event.target.value)} value={quadroCode} />
            <div className=" Separator"> </div>
            <input type="submit" className="Criar" value=" ->] Entrar no quadro" />
          </form>
        </div>
      </div>
      <div className="Direita"> <Logo /> </div>
    </div>
  )
}
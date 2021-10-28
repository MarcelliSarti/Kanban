import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { Cartoes } from "../components/cartao";
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import LogoImg from '../assets/images/logo.png';
import Copy from '../assets/images/copy.svg';
import Modal from '../components/modal';
import '../styles/quadro.scss';

type QuadroParams = {
  id: string;
}

type CartoesType = {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  }
  title: string;
  content: string;
  section: string;
}

type FirebaseCartao = Record<string, {
  author: {
    id: string;
    name: string;
    avatar: string;
  }
  title: string;
  content: string;
  section: string;
}>

export function Quadro() {
  const [isModalEncerrarVisible, setIsModalEncerrarVisible] = useState(false);
  const [isModalAdicionarVisible, setIsModalAdicionarVisible] = useState(false);
  const [funcaoModalAdicionar, setFuncaoModalAdicionar] = useState('');
  const [cartaoId, setCartaoId] = useState('');
  const [newCartaoTitle, setNewCartaoTitle] = useState('');
  const [newCartaoContent, setNewCartaoContent] = useState('');
  const [newCartaoSection, setNewCartaoSection] = useState('');
  const [cartoes, setCartoes] = useState<CartoesType[]>([]);
  const [title, setTitle] = useState('');
  const [quadroOwner, setQuadroOwner] = useState('');
  const { user, signInWithGoogle } = useAuth();
  const params = useParams<QuadroParams>();
  const quadroId = params.id;
  const history = useHistory();

  useEffect(() => {
    const quadroRef = database.ref(`quadro/${quadroId}`);

    quadroRef.on('value', quadro => {
      const databaseQuadro = quadro.val();

      const FirebaseCartao: FirebaseCartao = databaseQuadro.cartoes ?? {};
      const parsedCartoes = Object.entries(FirebaseCartao).map(([key, value]) => {
        return {
          id: key,
          title: value.title,
          content: value.content,
          section: value.section,
          author: value.author,
        }
      })

      setTitle(databaseQuadro.title);
      setQuadroOwner(databaseQuadro.authorId);
      setCartoes(parsedCartoes);
    })
  }, [quadroId]);

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(params.id)
  }

  async function handleCreateNewCartao(event: FormEvent) {
    event.preventDefault();
    setIsModalAdicionarVisible(true);
    setFuncaoModalAdicionar('I');

    if ((newCartaoTitle.trim() === '') || (newCartaoContent.trim() === '') || (newCartaoSection.trim() === '')) {
      return;
    }

    if (!user) {
      throw new Error('Você deve estar logado');
    }

    const cartoes = {
      title: newCartaoTitle,
      content: newCartaoContent,
      section: newCartaoSection,
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
    };

    await database.ref(`quadro/${quadroId}/cartoes`).push(cartoes);

    setNewCartaoTitle('');
    setNewCartaoContent('');
    setNewCartaoSection('');
    setIsModalAdicionarVisible(false);
  }

  async function handleUpdateCartao(cartaoId: string, title: string, content: string, section: string) {
    setIsModalAdicionarVisible(true);
    setFuncaoModalAdicionar('A');
    setCartaoId(cartaoId)

    setNewCartaoTitle(title);
    setNewCartaoContent(content);
    setNewCartaoSection(section);
  }

  async function handleUpdateCartaoSend(event: FormEvent) {
    event.preventDefault();

    if ((newCartaoTitle.trim() === '') || (newCartaoContent.trim() === '') || (newCartaoSection.trim() === '')) {
      return;
    }

    await database.ref(`quadro/${quadroId}/cartoes/${cartaoId}`).update({
      title: newCartaoTitle,
      content: newCartaoContent,
      section: newCartaoSection,
    });

    setNewCartaoTitle('');
    setNewCartaoContent('');
    setNewCartaoSection('');
    setIsModalAdicionarVisible(false);
  }

  async function handleEndRoom() {
    await database.ref(`quadro/${quadroId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  async function handleSingInWithGoogle() {
    if (!user) {
      await signInWithGoogle();
    }
  }

  return (
    <div>
      <div className="Header">
        <img src={LogoImg} />
        <div className="Botoes">
          <div className="Quadro">
            <div className="Copiar"> <img src={Copy} onClick={copyRoomCodeToClipboard} /> </div>
            <span> Quadro {quadroId} </span>
          </div>
          {quadroOwner == user?.id &&
            <button className="Botao" id="Encerrar" onClick={() => setIsModalEncerrarVisible(true)}> Encerrar Quadro </button>
          }
        </div>
        <div className="Linha"> </div>
      </div>
      <div className="Titulo">
        <h2> Quadro {title} </h2>
        {!user ?
          <span className="Autenticar" id="Auth" onClick={handleSingInWithGoogle}> Identifique-se para continuar! </span>
          :
          <button className="Botao" id="Add" onClick={handleCreateNewCartao}> Adicionar Cartão </button>
        }
      </div>
      {(cartoes.length > 0)
        ?
        <div className="cartoes-header">
          <div className="Vermelho">
            <div className="V">  Tarefas </div>
            {cartoes.map(cartao => {
              return (
                cartao.section == 'T' &&
                <>
                  <div className="Separator"> </div>
                  <Cartoes
                    id={cartao.id}
                    title={cartao.title}
                    content={cartao.content}
                    section={cartao.section}
                    author={cartao.author}
                  >
                    <h2 onClick={() => handleUpdateCartao(cartao.id, cartao.title, cartao.content, cartao.section)}> ... </h2>
                  </Cartoes>
                </>
              )
            })}
          </div>
          <div className="Amarelo">
            <div className="Am"> Em andamento </div>
            {cartoes.map(cartao => {
              return (
                cartao.section == 'A' &&
                <>
                  <div className="Separator"> </div>
                  <Cartoes
                    id={cartao.id}
                    title={cartao.title}
                    content={cartao.content}
                    section={cartao.section}
                    author={cartao.author}
                  >
                    <h2 onClick={() => handleUpdateCartao(cartao.id, cartao.title, cartao.content, cartao.section)}> ... </h2>
                  </Cartoes>
                </>
              )
            })}
          </div>
          <div className="Azul">
            <div className="Az"> Finalizado  </div>
            {cartoes.map(cartao => {
              return (
                cartao.section == 'F' &&
                <>
                  <div className="Separator"> </div>
                  <Cartoes
                    id={cartao.id}
                    title={cartao.title}
                    content={cartao.content}
                    section={cartao.section}
                    author={cartao.author}
                  >
                    <h2 onClick={() => handleUpdateCartao(cartao.id, cartao.title, cartao.content, cartao.section)}> ... </h2>
                  </Cartoes>
                </>
              )
            })}
          </div>
        </div >
        :
        < div className="Vazio" >
          <div className="Separator1"> </div>
          <img src={LogoImg} />
          <h3> Nenhuma tarefa por aqui ... </h3>
          <span> Envie o código desse quadro para seus  amigos e comece a organizar tarefas! </span>
        </div >
      }
      {
        isModalAdicionarVisible &&
        <Modal onClose={() => setIsModalAdicionarVisible(false)}>
          <div className="modal-header" id="Adicionar">
            <h3> Adicionar cartão </h3>
          </div>
          <form >
            <div className="modalCorpo">
              <span> Título </span>
              <input type="text"
                onChange={event => setNewCartaoTitle(event.target.value)} value={newCartaoTitle} />
              <div className="Separator" />
              <span> Descrição </span>
              <input type="text"
                onChange={event => setNewCartaoContent(event.target.value)} value={newCartaoContent} />
              <div className="Separator" />
              <span> Status </span>
              <div className="Separator" />
              <select
                onChange={event => setNewCartaoSection(event.target.value)} value={newCartaoSection}>
                <option value="DEFAULT"> Escolha um Status </option>
                <option value="T"> Tarefa </option>
                <option value="A"> Em andamento </option>
                <option value="F"> Finalizado </option>
              </select>
            </div>
            <div className="Separator"> </div>
            <div className="Separator"> </div>
            <div className="Separator"> </div>
            <div className="Separator"> </div>
            <div className="modal-footer">
              {funcaoModalAdicionar == 'I' ?
                <button className="BotaoModalAdd" onClick={handleCreateNewCartao} disabled={!user}> Adicionar </button>
                :
                <button className="BotaoModalAdd" onClick={handleUpdateCartaoSend} disabled={!user}> Atualizar </button>
              }
              <button className="BotaoModal" onClick={() => setIsModalAdicionarVisible(false)} > Cancelar </button>
            </div>
          </form>
        </Modal >
      }

      {
        isModalEncerrarVisible &&
        <Modal onClose={() => setIsModalEncerrarVisible(false)}>
          <div className="modal-header" id="EncerrarModal"> </div>
          <div className="modalCorpo">
            <div className="Separator" />
            <div className="Separator" />
            <div className="Circulo"> <span> X </span> </div>
            <div className="Separator" />
            <div className="Outro">
              <h2> Encerrar quadro </h2>
            </div>
            <div className="Separator" />
            <div className="Outro2">
              <span> Tem certeza que deseja encerrar esse quadro?</span>
            </div>
          </div>
          <div className="modal-footer">
            <button className="BotaoModalAdd" onClick={handleEndRoom}> Sim, encerrar </button>
            <button className="BotaoModal" onClick={() => setIsModalEncerrarVisible(false)} > Cancelar </button>
          </div>
        </Modal >
      }
    </div >
  )
}
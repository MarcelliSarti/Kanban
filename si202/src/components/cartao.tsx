import { useState, FormEvent, ReactNode } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/cartoes.scss';
import Modal from './modal';

type QuadroParams = {
  id: string;
}

type CartoesProps = {
  id: string;
  title: string;
  content: string;
  section: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  }
  children?: ReactNode;
}

export function Cartoes({ id, title, content, section, author, children }: CartoesProps) {
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const params = useParams<QuadroParams>();
  const quadroId = params.id;
  const { user } = useAuth();

  async function handleDeleteCartao(cartaoId: string) {
    await database.ref(`quadro/${quadroId}/cartoes/${cartaoId}`).remove();
  }

  return (
    <>
      <div id="Content" className={`Content ${section == 'T' ? 'Vermelho' : `${section == 'A' ? 'Amarelo' : 'Azul'}`}`} >
        <div className="Cartoes-header">
          <h3> {title} </h3>
          <h2> {children} </h2>
        </div>
        <span> {content} </span>
        <div className="Separator"> </div>
        <div className="Cartoes-footer">
          <div className="Informacoes">
            <img src={author.avatar} className="Pessoa" />
            <span> {author.name} </span>
          </div>
          {user?.id == author.id &&
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setIsModalDeleteVisible(true)}>
              <path d="M3 5.99988H5H21" stroke={`# ${section == 'T' ? 'FF4033' : `${section == 'A' ? 'FFC604' : '5271FF'}`}`} strokeWidth="1.5" strokeLinecap="round"
                strokeLinejoin="round" />
              <path
                d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z"
                stroke={`${section == 'T' ? '#FF4033' : `${section == 'A' ? '#FFC604' : '#5271FF'}`}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        </div>
      </div >
      {
        isModalDeleteVisible &&
        <Modal onClose={() => setIsModalDeleteVisible(false)}>
          <div className="modal-header" id="ExcluirModal"> </div>
          <div className="modalCorpo">
            <div className="Separator" />
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 5.99988H5H21" stroke="#FF4033" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#FF4033" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div className="Separator" />
            <div className="Outro">
              <h2> Excluir cartão </h2>
            </div>
            <div className="Separator" />
            <div className="Outro2">
              <span> Tem certeza que você deseja excluir esse cartão?</span>
            </div>
          </div>
          <div className="modal-footer">
            <button className="BotaoModalAdd" onClick={() => handleDeleteCartao(id)}> Sim, Excluir </button>
            <button className="BotaoModal" onClick={() => setIsModalDeleteVisible(false)} > Cancelar </button>
          </div>
        </Modal >
      } </>
  );
}
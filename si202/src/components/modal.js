import { react } from 'react';
import '../styles/modal.scss';

const modal = ({ id = "modal", onClose = () => { }, children }) => {
  const handleOutsideClick = (e) => {
    if (e.target.id === id) onClose();
  }
  return (
    <div id={id} className='modal' onClick={handleOutsideClick}>
      <div className='container'>
        <div className='modal-header'>
          <button className='close' onClick={onClose} />
        </div>
        <div className='content'> {children} </div>
      </div>
    </div>
  );
}

export default modal;
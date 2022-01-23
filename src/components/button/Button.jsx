import React from 'react';
import './button.scss';

const Button = (props) => {
  const { title, onClick } = props;
  return (
    <div
      className="button"
      onClick={onClick}
    >
      { title }
    </div>
  )
}

export default Button
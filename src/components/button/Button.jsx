import React from 'react';
import './button.scss';

const Button = (props) => {
  const { title } = props;
  return (
    <div className="button">
      { title }
    </div>
  )
}

export default Button
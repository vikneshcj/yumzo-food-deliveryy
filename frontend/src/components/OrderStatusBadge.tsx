import React from 'react';

interface Props {
  status: string;
}

export const OrderStatusBadge: React.FC<Props> = ({ status }) => {
  return (
    <span className={`status-badge status-${status}`}>
      {status}
    </span>
  );
};

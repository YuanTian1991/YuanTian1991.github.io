import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function Copyright() {
  return (
    <div style={{ paddingTop: '3em', paddingBottom: '3em', textAlign: 'center' }}>
      <p variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
          Yuan Tian
          {' '}
        {new Date().getFullYear()}
        {'.'}
      </p>
    </div>
  );
}

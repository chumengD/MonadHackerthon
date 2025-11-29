import React from 'react';
import { ContentProvider } from './hooks/context'
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
        

import { Page } from './page';

function App() {

  return (<div>
    <ContentProvider>
      <PrimeReactProvider>
 <Page />
 </PrimeReactProvider>
    </ContentProvider>
  </div>)
}

export default App;

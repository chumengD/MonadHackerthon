import React from 'react';
import { ContentProvider } from './hooks/context'

import { Page } from './page';

function App() {
  return (<div>
    <ContentProvider>
 <Page />
    </ContentProvider>
  </div>)
}

export default App;

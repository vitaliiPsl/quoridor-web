import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'
import WebsocketProvider from './providers/WebsocketProvider'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<Router>
			<WebsocketProvider>
				<App />
			</WebsocketProvider>
		</Router>
	</React.StrictMode>
)

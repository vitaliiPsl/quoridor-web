import React from 'react'
import { Route, Routes } from 'react-router-dom'

import GamePage from './pages/GamePage'

function App() {
	return (
		<div className='App h-screen flex flex-col items-center justify-center bg-zinc-900'>
			<Routes>
				<Route path='/' element={<GamePage />} />
			</Routes>
		</div>
	)
}

export default App

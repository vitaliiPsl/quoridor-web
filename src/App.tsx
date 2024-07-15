import React from 'react'
import { Route, Routes } from 'react-router-dom'

function App() {
	return (
		<div className='App h-screen flex flex-col items-center justify-center bg-zinc-900'>
			<Routes>
				<Route path='/' element={<></>} />
			</Routes>
		</div>
	)
}

export default App

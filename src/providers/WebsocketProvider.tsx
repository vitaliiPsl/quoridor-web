import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
	ReactNode,
} from 'react'

interface WebsocketContextProps {
	connect: (
		userId: string,
		onConnect?: () => void,
		onDisconnect?: () => void
	) => void
	disconnect: () => void
	sendMessage: (message: any) => void
	onMessage: (callback: (message: any) => void) => void
}

const WebsocketContext = createContext<WebsocketContextProps | undefined>(
	undefined
)

export const useWebsocket = () => {
	const context = useContext(WebsocketContext)
	if (!context) {
		throw new Error('useWebsocket must be used within a WebsocketProvider')
	}
	return context
}

interface WebsocketProviderProps {
	children: ReactNode
}

const WebsocketProvider: React.FC<WebsocketProviderProps> = ({ children }) => {
	const [socket, setSocket] = useState<WebSocket | null>(null)
	const socketRef = useRef<WebSocket | null>(null)

	const connect = (
		userId: string,
		onConnect?: () => void,
		onDisconnect?: () => void
	) => {
		const ws = new WebSocket(`ws://localhost:8080/v1/ws?user_id=${userId}`)
		socketRef.current = ws

		ws.onopen = () => {
			setSocket(ws)
			if (onConnect) onConnect()
		}

		ws.onclose = () => {
			setSocket(null)
			socketRef.current = null
			if (onDisconnect) onDisconnect()
		}

		ws.onerror = (error) => {
		}

		ws.onmessage = (event) => {
		}
	}

	const disconnect = () => {
		if (socketRef.current) {
			socketRef.current.close()
			setSocket(null)
			socketRef.current = null
		}
	}

	const sendMessage = (message: any) => {
		if (
			socketRef.current &&
			socketRef.current.readyState === WebSocket.OPEN
		) {
			socketRef.current.send(JSON.stringify(message))
		}
	}

	const onMessage = (callback: (message: any) => void) => {
		if (socketRef.current) {
			socketRef.current.onmessage = (event) => {
				const message = JSON.parse(event.data)
				callback(message)
			}
		}
	}

	useEffect(() => {
		return () => {
			if (socketRef.current) {
				socketRef.current.close()
			}
		}
	}, [])

	return (
		<WebsocketContext.Provider
			value={{ connect, disconnect, sendMessage, onMessage }}
		>
			{children}
		</WebsocketContext.Provider>
	)
}

export default WebsocketProvider

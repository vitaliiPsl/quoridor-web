import { Wall as WallType } from '../types/game'

interface WallProps {
	wall: WallType
	isWall: boolean
	isHovered: boolean
	onHover: (wall: WallType) => void
	onHoverEnd: () => void
	onPlaceWall: (wall: WallType) => void
}

const Wall: React.FC<WallProps> = ({
	wall,
	isWall,
	isHovered,
	onPlaceWall,
	onHover,
	onHoverEnd,
}) => (
	<div
		className={`
            ${wall.direction === 'vertical' ? 'w-2 h-14' : 'h-2 w-14'}
            ${isWall ? 'bg-purple-500' : isHovered ? 'bg-purple-300' : 'bg-gray-200 hover:bg-gray-300'}
            transition-colors duration-150 ease-in-out
            ${!isWall ? 'cursor-pointer' : ''}
        `}
		onMouseEnter={() => !isWall && onHover(wall)}
		onMouseLeave={() => !isWall && onHoverEnd()}
		onClick={() => !isWall && onPlaceWall(wall)}
	/>
)

export default Wall
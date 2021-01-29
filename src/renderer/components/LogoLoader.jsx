import styled, { css, keyframes } from 'styled-components';

const animPart = ({ width, height }) => keyframes`
	0% {
		transform: translate3d(-${width / 2}px, -${height / 2}px, 0);
	}
	100% {
		transform: translate3d(${width / 2}px, ${height / 2}px, 0);
	}
`;
const animBlend = keyframes`
	0% {
		transform: scale(0.01, 0.01) rotateY(0);
		animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
	}
	50% {
		transform: scale(1, 1) rotateY(0);
		animation-timing-function: cubic-bezier(0.39, 0.575, 0.565, 1);
	}
	100% {
		transform: scale(0.01, 0.01) rotateY(0);
	}
`;

const Square = styled.div`
  margin: auto;
	width: ${({ width }) => width}px;
	height: ${({ height }) => height}px;
	transform: rotate(-45deg);
`;

const SquarePart = styled.div`
	position: absolute;
	width: ${({ width }) => width}px;
	height: ${({ height }) => height}px;
  z-index: 1;
  animation: ${props => animPart(props)} 0.92s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite alternate;
`;

const SquareGreen = styled(SquarePart)`
	background: rgb(126,207,232);
	right: 0;
	bottom: 0;
	animation-direction: alternate-reverse;
`;

const SquarePink = styled(SquarePart)`
	background: rgb(0,105,170);
	left: 0;
	top: 0;
`;

const SquareBlend = styled.div`
  background: rgb(120,255,255);
  background-image: ${({ useLogo = true }) => useLogo ? `url(${require('../../../assets/bsm-icon-square.png').default})` : 'none'};
  background-size: contain;
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 2;
	animation: ${animBlend} 0.92s ease-in infinite;
`;

export default function(props) {
  return (
    <Square {...props}>
      <SquareGreen {...props}/>
      <SquarePink {...props}/>
      <SquareBlend {...props}/>
    </Square>
  );
}

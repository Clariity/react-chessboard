// https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces
// By en:User:Cburnett - Own work
// This W3C - unspecified vector image was created with Inkscape., CC BY - SA 3.0, https://commons.wikimedia.org/w/index.php?curid=1499810

import { PieceRenderObject } from './types';

export const defaultPieces: PieceRenderObject = {
  wP: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 45 45"
      width="100%"
      height="100%"
      style={props?.svgStyle}
    >
      <path
        d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z"
        style={{
          opacity: '1',
          fill: props?.fill ?? '#ffffff',
          fillOpacity: '1',
          fillRule: 'nonzero',
          stroke: '#000000',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'miter',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
      />
    </svg>
  ),
  wR: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 45 45"
      width="100%"
      height="100%"
      style={props?.svgStyle}
    >
      <g
        style={{
          opacity: '1',
          fill: props?.fill ?? '#ffffff',
          fillOpacity: '1',
          fillRule: 'evenodd',
          stroke: '#000000',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
      >
        <path
          d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z "
          style={{ strokeLinecap: 'butt' }}
        />
        <path
          d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z "
          style={{ strokeLinecap: 'butt' }}
        />
        <path
          d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14"
          style={{ strokeLinecap: 'butt' }}
        />
        <path d="M 34,14 L 31,17 L 14,17 L 11,14" />
        <path
          d="M 31,17 L 31,29.5 L 14,29.5 L 14,17"
          style={{ strokeLinecap: 'butt', strokeLinejoin: 'miter' }}
        />
        <path d="M 31,29.5 L 32.5,32 L 12.5,32 L 14,29.5" />
        <path
          d="M 11,14 L 34,14"
          style={{ fill: 'none', stroke: '#000000', strokeLinejoin: 'miter' }}
        />
      </g>
    </svg>
  ),
  wN: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 45 45"
      width="100%"
      height="100%"
      style={props?.svgStyle}
    >
      <g
        style={{
          opacity: '1',
          fill: 'none',
          fillOpacity: '1',
          fillRule: 'evenodd',
          stroke: '#000000',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
      >
        <path
          d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18"
          style={{ fill: props?.fill ?? '#ffffff', stroke: '#000000' }}
        />
        <path
          d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10"
          style={{ fill: props?.fill ?? '#ffffff', stroke: '#000000' }}
        />
        <path
          d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z"
          style={{ fill: '#000000', stroke: '#000000' }}
        />
        <path
          d="M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z"
          transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)"
          style={{ fill: '#000000', stroke: '#000000' }}
        />
      </g>
    </svg>
  ),
  wB: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 45 45"
      width="100%"
      height="100%"
      style={props?.svgStyle}
    >
      <g
        style={{
          opacity: '1',
          fill: 'none',
          fillRule: 'evenodd',
          fillOpacity: '1',
          stroke: '#000000',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
      >
        <g
          style={{
            fill: props?.fill ?? '#ffffff',
            stroke: '#000000',
            strokeLinecap: 'butt',
          }}
        >
          <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z" />
          <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" />
          <path d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z" />
        </g>
        <path
          d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18"
          style={{ fill: 'none', stroke: '#000000', strokeLinejoin: 'miter' }}
        />
      </g>
    </svg>
  ),
  wQ: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 45 45"
      width="100%"
      height="100%"
      style={props?.svgStyle}
    >
      <g
        style={{
          fill: props?.fill ?? '#ffffff',
          stroke: '#000000',
          strokeWidth: '1.5',
          strokeLinejoin: 'round',
        }}
      >
        <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z" />
        <path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z" />
        <path d="M 11.5,30 C 15,29 30,29 33.5,30" style={{ fill: 'none' }} />
        <path
          d="M 12,33.5 C 18,32.5 27,32.5 33,33.5"
          style={{ fill: 'none' }}
        />
        <circle cx="6" cy="12" r="2" />
        <circle cx="14" cy="9" r="2" />
        <circle cx="22.5" cy="8" r="2" />
        <circle cx="31" cy="9" r="2" />
        <circle cx="39" cy="12" r="2" />
      </g>
    </svg>
  ),
  wK: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 45 45"
      width="100%"
      height="100%"
      style={props?.svgStyle}
    >
      <g
        style={{
          fill: 'none',
          fillOpacity: '1',
          fillRule: 'evenodd',
          stroke: '#000000',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
      >
        <path
          d="M 22.5,11.63 L 22.5,6"
          style={{ fill: 'none', stroke: '#000000', strokeLinejoin: 'miter' }}
        />
        <path
          d="M 20,8 L 25,8"
          style={{ fill: 'none', stroke: '#000000', strokeLinejoin: 'miter' }}
        />
        <path
          d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25"
          style={{
            fill: props?.fill ?? '#ffffff',
            stroke: '#000000',
            strokeLinecap: 'butt',
            strokeLinejoin: 'miter',
          }}
        />
        <path
          d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37"
          style={{ fill: props?.fill ?? '#ffffff', stroke: '#000000' }}
        />
        <path
          d="M 12.5,30 C 18,27 27,27 32.5,30"
          style={{ fill: 'none', stroke: '#000000' }}
        />
        <path
          d="M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5"
          style={{ fill: 'none', stroke: '#000000' }}
        />
        <path
          d="M 12.5,37 C 18,34 27,34 32.5,37"
          style={{ fill: 'none', stroke: '#000000' }}
        />
      </g>
    </svg>
  ),
  bP: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 45 45"
      width="100%"
      height="100%"
      style={props?.svgStyle}
    >
      <path
        d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z"
        style={{
          opacity: '1',
          fill: props?.fill ?? '#000000',
          fillOpacity: '1',
          fillRule: 'nonzero',
          stroke: '#000000',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'miter',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
      />
    </svg>
  ),
  bR: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 45 45"
      width="100%"
      height="100%"
      style={props?.svgStyle}
    >
      <g
        style={{
          opacity: '1',
          fill: props?.fill ?? '#000000',
          fillOpacity: '1',
          fillRule: 'evenodd',
          stroke: '#000000',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
      >
        <path
          d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z "
          style={{ strokeLinecap: 'butt' }}
        />
        <path
          d="M 12.5,32 L 14,29.5 L 31,29.5 L 32.5,32 L 12.5,32 z "
          style={{ strokeLinecap: 'butt' }}
        />
        <path
          d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z "
          style={{ strokeLinecap: 'butt' }}
        />
        <path
          d="M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z "
          style={{ strokeLinecap: 'butt', strokeLinejoin: 'miter' }}
        />
        <path
          d="M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z "
          style={{ strokeLinecap: 'butt' }}
        />
        <path
          d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14 z "
          style={{ strokeLinecap: 'butt' }}
        />
        <path
          d="M 12,35.5 L 33,35.5 L 33,35.5"
          style={{
            fill: 'none',
            stroke: '#ffffff',
            strokeWidth: '1',
            strokeLinejoin: 'miter',
          }}
        />
        <path
          d="M 13,31.5 L 32,31.5"
          style={{
            fill: 'none',
            stroke: '#ffffff',
            strokeWidth: '1',
            strokeLinejoin: 'miter',
          }}
        />
        <path
          d="M 14,29.5 L 31,29.5"
          style={{
            fill: 'none',
            stroke: '#ffffff',
            strokeWidth: '1',
            strokeLinejoin: 'miter',
          }}
        />
        <path
          d="M 14,16.5 L 31,16.5"
          style={{
            fill: 'none',
            stroke: '#ffffff',
            strokeWidth: '1',
            strokeLinejoin: 'miter',
          }}
        />
        <path
          d="M 11,14 L 34,14"
          style={{
            fill: 'none',
            stroke: '#ffffff',
            strokeWidth: '1',
            strokeLinejoin: 'miter',
          }}
        />
      </g>
    </svg>
  ),
  bN: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 45 45"
      width="100%"
      height="100%"
      style={props?.svgStyle}
    >
      <g
        style={{
          opacity: '1',
          fill: 'none',
          fillOpacity: '1',
          fillRule: 'evenodd',
          stroke: '#000000',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
      >
        <path
          d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18"
          style={{ fill: props?.fill ?? '#000000', stroke: '#000000' }}
        />
        <path
          d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10"
          style={{ fill: props?.fill ?? '#000000', stroke: '#000000' }}
        />
        <path
          d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z"
          style={{ fill: '#ffffff', stroke: '#ffffff' }}
        />
        <path
          d="M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z"
          transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)"
          style={{ fill: '#ffffff', stroke: '#ffffff' }}
        />
        <path
          d="M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 z "
          style={{ fill: '#ffffff', stroke: 'none' }}
        />
      </g>
    </svg>
  ),
  bB: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 45 45"
      width="100%"
      height="100%"
      style={props?.svgStyle}
    >
      <g
        style={{
          opacity: '1',
          fill: 'none',
          fillRule: 'evenodd',
          fillOpacity: '1',
          stroke: '#000000',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
      >
        <g
          style={{
            fill: props?.fill ?? '#000000',
            stroke: '#000000',
            strokeLinecap: 'butt',
          }}
        >
          <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z" />
          <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" />
          <path d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z" />
        </g>
        <path
          d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18"
          style={{ fill: 'none', stroke: '#ffffff', strokeLinejoin: 'miter' }}
        />
      </g>
    </svg>
  ),
  bQ: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 45 45"
      width="100%"
      height="100%"
      style={props?.svgStyle}
    >
      <g
        style={{
          fill: props?.fill ?? '#000000',
          stroke: '#000000',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
      >
        <path
          d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z"
          style={{ strokeLinecap: 'butt', fill: props?.fill ?? '#000000' }}
        />
        <path d="m 9,26 c 0,2 1.5,2 2.5,4 1,1.5 1,1 0.5,3.5 -1.5,1 -1,2.5 -1,2.5 -1.5,1.5 0,2.5 0,2.5 6.5,1 16.5,1 23,0 0,0 1.5,-1 0,-2.5 0,0 0.5,-1.5 -1,-2.5 -0.5,-2.5 -0.5,-2 0.5,-3.5 1,-2 2.5,-2 2.5,-4 -8.5,-1.5 -18.5,-1.5 -27,0 z" />
        <path d="M 11.5,30 C 15,29 30,29 33.5,30" />
        <path d="m 12,33.5 c 6,-1 15,-1 21,0" />
        <circle cx="6" cy="12" r="2" />
        <circle cx="14" cy="9" r="2" />
        <circle cx="22.5" cy="8" r="2" />
        <circle cx="31" cy="9" r="2" />
        <circle cx="39" cy="12" r="2" />
        <path
          d="M 11,38.5 A 35,35 1 0 0 34,38.5"
          style={{ fill: 'none', stroke: '#000000', strokeLinecap: 'butt' }}
        />
        <g style={{ fill: 'none', stroke: '#ffffff' }}>
          <path d="M 11,29 A 35,35 1 0 1 34,29" />
          <path d="M 12.5,31.5 L 32.5,31.5" />
          <path d="M 11.5,34.5 A 35,35 1 0 0 33.5,34.5" />
          <path d="M 10.5,37.5 A 35,35 1 0 0 34.5,37.5" />
        </g>
      </g>
    </svg>
  ),
  bK: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 45 45"
      width="100%"
      height="100%"
      style={props?.svgStyle}
    >
      <g
        style={{
          fill: 'none',
          fillOpacity: '1',
          fillRule: 'evenodd',
          stroke: '#000000',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
      >
        <path
          d="M 22.5,11.63 L 22.5,6"
          style={{ fill: 'none', stroke: '#000000', strokeLinejoin: 'miter' }}
          id="path6570"
        />
        <path
          d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25"
          style={{
            fill: props?.fill ?? '#000000',
            fillOpacity: '1',
            strokeLinecap: 'butt',
            strokeLinejoin: 'miter',
          }}
        />
        <path
          d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37"
          style={{ fill: props?.fill ?? '#000000', stroke: '#000000' }}
        />
        <path
          d="M 20,8 L 25,8"
          style={{ fill: 'none', stroke: '#000000', strokeLinejoin: 'miter' }}
        />
        <path
          d="M 32,29.5 C 32,29.5 40.5,25.5 38.03,19.85 C 34.15,14 25,18 22.5,24.5 L 22.5,26.6 L 22.5,24.5 C 20,18 10.85,14 6.97,19.85 C 4.5,25.5 13,29.5 13,29.5"
          style={{ fill: 'none', stroke: '#ffffff' }}
        />
        <path
          d="M 12.5,30 C 18,27 27,27 32.5,30 M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5 M 12.5,37 C 18,34 27,34 32.5,37"
          style={{ fill: 'none', stroke: '#ffffff' }}
        />
      </g>
    </svg>
  ),
};

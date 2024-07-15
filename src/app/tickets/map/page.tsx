"use client"

import React, { useState, useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface SeatProps {
  rowName: string;
  seatNumber: number;
  cx: number;
  cy: number;
  scale: number;
}

const Seat: React.FC<SeatProps> = ({ rowName, seatNumber, cx, cy, scale }) => {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent<SVGCircleElement>) => {
    setTooltip({ visible: true, x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0 });
  };

  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={8 / scale}
        className="seat"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      {tooltip.visible && (
        <foreignObject x={tooltip.x} y={tooltip.y} width="120" height="40">
          <div style={{
            background: 'white',
            border: '1px solid black',
            padding: '5px',
            borderRadius: '5px',
            fontSize: '12px'
          }}>
            Fila {rowName}, Asiento {seatNumber}
          </div>
        </foreignObject>
      )}
    </>
  );
};

const MapTickets: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState<Position>({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prevScale => Math.min(Math.max(0.5, prevScale * delta), 3));
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - startPosition.x;
    const dy = e.clientY - startPosition.y;
    setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const createRow = (rowName: string, startSeat: number, endSeat: number, yPosition: number) => {
    const seats = [];
    const seatCount = endSeat - startSeat + 1;
    const rowWidth = seatCount * 20;
    const startX = (1000 - rowWidth) / 2;

    for (let i = startSeat; i <= endSeat; i++) {
      seats.push(
        <Seat
          key={`${rowName}-${i}`}
          rowName={rowName}
          seatNumber={i}
          cx={(startX + (i - startSeat) * 20) / scale + position.x}
          cy={yPosition / scale + position.y}
          scale={scale}
        />
      );
    }
    return <g key={rowName}>{seats}</g>;
  };

  return (
    <div className="map-container" style={{ overflow: 'hidden', width: '100%', height: '600px' }}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 1000 600"
        xmlns="http://www.w3.org/2000/svg"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <g>
          <rect 
            x={400 / scale + position.x} 
            y={20 / scale + position.y} 
            width={200 / scale} 
            height={40 / scale} 
            fill="black" 
            rx={20 / scale} 
            ry={20 / scale} 
          />
          <text 
            x={500 / scale + position.x} 
            y={45 / scale + position.y} 
            fill="white" 
            textAnchor="middle" 
            fontSize={16 / scale}
          >
            ESCENARIO
          </text>
        </g>

        <g id="asientos">
          <g id="diamante" fill="purple">
            {createRow('A', 101, 140, 100)}
            {createRow('B', 101, 138, 130)}
            {createRow('C', 101, 134, 160)}
            {createRow('D', 101, 134, 190)}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default MapTickets;
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
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  content: string;
}

const Seat: React.FC<SeatProps> = ({ rowName, seatNumber, cx, cy }) => {
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, content: '' });

  const handleMouseEnter = (e: React.MouseEvent<SVGCircleElement>) => {
    const { clientX, clientY } = e;
    setTooltip({
      visible: true,
      x: clientX,
      y: clientY,
      content: `Fila ${rowName}, Asiento ${seatNumber}`
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r="8" // Aumentado el tamaño del círculo
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
            {tooltip.content}
          </div>
        </foreignObject>
      )}
    </>
  );
};

const MapTickets: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPosition, setStartPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        svgRef.current.setAttribute('viewBox', `0 0 ${width} ${height}`);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const newScale = scale - e.deltaY * 0.01;
    setScale(Math.min(Math.max(0.5, newScale), 3));
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - startPosition.x;
    const dy = e.clientY - startPosition.y;
    setPosition({ x: position.x + dx, y: position.y + dy });
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const createRow = (rowName: string, startSeat: number, endSeat: number, yPosition: number) => {
    const seats = [];
    const seatCount = endSeat - startSeat + 1;
    const rowWidth = seatCount * 20; // 20 es el espacio entre asientos
    const startX = (1000 - rowWidth) / 2; // Centrar respecto al ancho del SVG (1000)

    for (let i = startSeat; i <= endSeat; i++) {
      seats.push(
        <Seat
          key={`${rowName}-${i}`}
          rowName={rowName}
          seatNumber={i}
          cx={startX + (i - startSeat) * 20}
          cy={yPosition}
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
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: '0 0',
        }}
      >
        <g id="escenario">
          <rect x="400" y="20" width="200" height="40" fill="black" rx="20" ry="20" />
          <text x="500" y="45" fill="white" textAnchor="middle" fontSize="16">
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
          {/* Otros grupos de asientos aquí */}
        </g>
      </svg>
    </div>
  );
};

export default MapTickets;
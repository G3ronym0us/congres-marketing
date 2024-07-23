'use client';

import { numberToString } from 'pdf-lib';
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

  const handleInteractionStart = (
    e: React.MouseEvent<SVGCircleElement> | React.TouchEvent<SVGCircleElement>,
  ) => {
    const svgRect = (
      e.target as SVGCircleElement
    ).ownerSVGElement?.getBoundingClientRect();
    if (svgRect) {
      const x = cx - svgRect.left;
      const y = cy - svgRect.top;
      setTooltip({ visible: true, x, y });
    }
  };

  const handleInteractionEnd = () => {
    setTooltip({ visible: false, x: 0, y: 0 });
  };

  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={8 / scale}
        className="seat"
        onMouseEnter={handleInteractionStart}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
      />
      {tooltip.visible && (
        <foreignObject
          x={tooltip.x + 10 / scale}
          y={tooltip.y - 30 / scale}
          width={120 / scale}
          height={40 / scale}
        >
          <div
            style={{
              background: 'white',
              border: '1px solid black',
              padding: '5px',
              borderRadius: '5px',
              fontSize: `${12 / scale}px`,
              position: 'absolute',
              textAlign: 'center',
              width: `${120 / scale}px`,
            }}
          >
            Fila {rowName}, Asiento {seatNumber}
          </div>
        </foreignObject>
      )}
    </>
  );
};

interface SeatRows {
  locality: string;
  row: string;
  startSeat: number;
  endSeat: number;
  cols: React.JSX.Element[];
  y: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  interval?: number;
  offset?: number;
}

const MapTickets: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startDragPoint, setStartDragPoint] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [localitySelected, setLocalitySelected] = useState<string>();
  const [polygonPoints, setPolygonPoints] = useState<{
    platea_izquierda: string;
    platea_derecha: string;
    diamond: string;
    gold: string;
    vip: string;
    general: string;
  }>({
    diamond: '',
    gold: '',
    vip: '',
    general: '',
    platea_izquierda: '',
    platea_derecha: '',
  });

  const localityColors = {
    diamond: '#150FBF', // Cyan para Diamante
    gold: '#FFD700', // Dorado para Oro
    vip: '#FF69B4', // Rosa para VIP
    general: '#FFA500', // Naranja para General
    platea_izquierda: '#32CD32', // Verde lima para Platea Izquierda
    platea_derecha: '#32CD32', // Verde lima para Platea Derecha
  };

  const seats: SeatRows[] = React.useMemo(() => {
    const rows = [
      { locality: 'diamond', row: 'A', startSeat: 101, endSeat: 140, y: 100 },
      { locality: 'diamond', row: 'B', startSeat: 101, endSeat: 138, y: 130 },
      { locality: 'diamond', row: 'C', startSeat: 101, endSeat: 134, y: 160 },
      { locality: 'gold', row: 'D', startSeat: 101, endSeat: 134, y: 210 },
      { locality: 'gold', row: 'E', startSeat: 101, endSeat: 132, y: 240 },
      { locality: 'vip', row: 'F', startSeat: 101, endSeat: 134, y: 290 },
      { locality: 'vip', row: 'G', startSeat: 101, endSeat: 132, y: 320 },
      { locality: 'vip', row: 'H', startSeat: 101, endSeat: 134, y: 350 },
      { locality: 'vip', row: 'J', startSeat: 101, endSeat: 137, y: 380 },
      { locality: 'vip', row: 'K', startSeat: 101, endSeat: 138, y: 410 },
      { locality: 'general', row: 'L', startSeat: 101, endSeat: 132, y: 460 },
      { locality: 'general', row: 'M', startSeat: 101, endSeat: 126, y: 490 },
      { locality: 'general', row: 'N', startSeat: 101, endSeat: 126, y: 520 },
      { locality: 'general', row: 'P', startSeat: 101, endSeat: 126, y: 550 },
      { locality: 'general', row: 'Q', startSeat: 101, endSeat: 126, y: 580 },
      { locality: 'general', row: 'R', startSeat: 101, endSeat: 124, y: 610 },
      { locality: 'general', row: 'S', startSeat: 101, endSeat: 124, y: 640 },
      { locality: 'general', row: 'T', startSeat: 101, endSeat: 124, y: 670 },
      {
        locality: 'platea_izquierda',
        row: 'J',
        startSeat: 1,
        endSeat: 5,
        y: -240,
        interval: 2,
        offset: 0,
      },
      {
        locality: 'platea_izquierda',
        row: 'H',
        startSeat: 1,
        endSeat: 11,
        y: -210,
        interval: 2,
        offset: -0.5,
      },
      {
        locality: 'platea_izquierda',
        row: 'G',
        startSeat: 1,
        endSeat: 11,
        y: -180,
        interval: 2,
        offset: -0.5,
      },
      {
        locality: 'platea_izquierda',
        row: 'F',
        startSeat: 1,
        endSeat: 17,
        y: -150,
        interval: 2,
        offset: -0.5,
      },
      {
        locality: 'platea_izquierda',
        row: 'E',
        startSeat: 1,
        endSeat: 27,
        y: -120,
        interval: 2,
        offset: -0.5,
      },
      {
        locality: 'platea_izquierda',
        row: 'D',
        startSeat: 1,
        endSeat: 35,
        y: -90,
        interval: 2,
        offset: -1.5,
      },
      {
        locality: 'platea_izquierda',
        row: 'C',
        startSeat: 1,
        endSeat: 27,
        y: -60,
        interval: 2,
        offset: 1.5,
      },
      {
        locality: 'platea_izquierda',
        row: 'B',
        startSeat: 1,
        endSeat: 25,
        y: -30,
        interval: 2,
        offset: 2,
      },
      {
        locality: 'platea_izquierda',
        row: 'A',
        startSeat: 1,
        endSeat: 17,
        y: 0,
        interval: 2,
        offset: 5,
      },
      // ... add more rows for platea-izquierda ...
      {
        locality: 'platea_derecha',
        row: 'A',
        startSeat: 2,
        endSeat: 20,
        y: 100,
        interval: 2,
      },
      {
        locality: 'platea_derecha',
        row: 'B',
        startSeat: 2,
        endSeat: 28,
        y: 130,
        interval: 2,
        offset: -2,
      },
      {
        locality: 'platea_derecha',
        row: 'C',
        startSeat: 2,
        endSeat: 34,
        y: 160,
        offset: -3.5,
        interval: 2,
      },
      {
        locality: 'platea_derecha',
        row: 'D',
        startSeat: 2,
        endSeat: 40,
        y: 190,
        offset: -5,
        interval: 2,
      },
      {
        locality: 'platea_derecha',
        row: 'E',
        startSeat: 2,
        endSeat: 44,
        y: 220,
        offset: -6,
        interval: 2,
      },
      {
        locality: 'platea_derecha',
        row: 'F',
        startSeat: 2,
        endSeat: 46,
        y: 250,
        offset: -6.5,
        interval: 2,
      },
      {
        locality: 'platea_derecha',
        row: 'G',
        startSeat: 2,
        endSeat: 26,
        y: 280,
        offset: -7.5,
        interval: 2,
      },
      {
        locality: 'platea_derecha',
        row: 'H',
        startSeat: 2,
        endSeat: 20,
        y: 310,
        offset: -8,
        interval: 2,
      },
      {
        locality: 'platea_derecha',
        row: 'J',
        startSeat: 2,
        endSeat: 14,
        y: 340,
        offset: -8.5,
        interval: 2,
      },
      {
        locality: 'platea_derecha',
        row: 'K',
        startSeat: 2,
        endSeat: 6,
        y: 370,
        offset: -9.5,
        interval: 2,
      },
    ];

    const renderLocalityPolygon = (locality: string) => {
      const color = localityColors[locality as keyof typeof localityColors];
      const points = polygonPoints[locality as keyof typeof polygonPoints];

      // Calcular el centro del polígono para posicionar la etiqueta
      const pointsArray = points
        .split(' ')
        .map((p) => p.split(',').map(Number));
      const centerX =
        pointsArray.reduce((sum, [x]) => sum + x, 0) / pointsArray.length;
      const centerY =
        pointsArray.reduce((sum, [, y]) => sum + y, 0) / pointsArray.length;

      return (
        <g key={locality}>
          <polygon
            onClick={() => setLocalitySelected(locality)}
            points={points}
            fill={`${color}4D`} // 30% de opacidad
            stroke={color}
            strokeWidth="2"
          />
          <text
            x={centerX / scale + position.x}
            y={centerY / scale + position.y}
            fill={color}
            fontSize={16 / scale}
            textAnchor="middle"
            dominantBaseline="middle"
            pointerEvents="none"
          >
            {locality.replace('_', ' ').toUpperCase()}
          </text>
        </g>
      );
    };

    const rowsWithPosition = rows.map((row) => {
      const seatCount = Math.ceil(
        (row.endSeat - row.startSeat + 1) / (row.interval || 1),
      );
      const rowWidth = seatCount * 20;
      const startX =
        row.locality === 'platea_izquierda' ? 0 : (1000 - rowWidth) / 2;

      const cols = [];
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      for (let i = 0; i < seatCount; i++) {
        const seatNumber = row.startSeat + i * (row.interval || 1);
        if (seatNumber > row.endSeat) break;

        let x = startX + i * 20 + (row.offset || 0) * 20;
        let y = row.y;

        if (row.locality === 'platea_izquierda') {
          // Adjust initial position
          x -= 380; // Move seats to the left
          y += -50; // Adjust vertical position

          // Apply rotation transformation
          const angle = -110 * (Math.PI / 180); // Rotate by -45 degrees
          const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
          const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);

          x = rotatedX;
          y = rotatedY;
        }

        if (row.locality === 'platea_derecha') {
          // Adjust initial position
          x -= 350; // Move seats to the left
          y += 900; // Adjust vertical position

          // Apply rotation transformation
          const angle = -70 * (Math.PI / 180); // Rotate by -45 degrees
          const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
          const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);

          x = rotatedX;
          y = rotatedY;
        }

        x = x / scale + position.x;
        y = y / scale + position.y;

        cols.push(
          <Seat
            key={`${row.row}-${seatNumber}`}
            rowName={row.row}
            seatNumber={seatNumber}
            cx={x}
            cy={y}
            scale={scale}
          />,
        );

        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }

      return {
        ...row,
        cols,
        minX,
        minY,
        maxX,
        maxY,
      };
    });

    return rowsWithPosition;
  }, [scale, position]);

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const newScale = e.deltaY > 0 ? scale * 0.9 : scale * 1.1;
    setScale(newScale);
  };

  useEffect(() => {
    const svgElement = svgRef.current;
    if (svgElement) {
      const preventScroll = (e: WheelEvent) => {
        e.preventDefault();
      };
      svgElement.addEventListener('wheel', preventScroll, { passive: false });
      return () => {
        svgElement.removeEventListener('wheel', preventScroll);
      };
    }
  }, []);

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY,
      );
      setStartDragPoint({ x: distance, y: 0 });
    } else if (e.touches.length === 1) {
      setStartDragPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY,
      );
      const scaleFactor = distance / startDragPoint.x;
      setScale((prevScale) => prevScale * scaleFactor);
      setStartDragPoint({ x: distance, y: 0 });
    } else if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - startDragPoint.x;
      const dy = e.touches[0].clientY - startDragPoint.y;
      setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setStartDragPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // Previene el comportamiento por defecto para evitar seleccionar texto u otros elementos por accidente
    e.preventDefault();

    // Calcula el punto inicial del arrastre teniendo en cuenta la posición actual del SVG
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const doDrag = (moveEvent: MouseEvent) => {
      // Actualiza la posición basándose en el movimiento del mouse desde el punto inicial
      setPosition({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY,
      });
    };

    const stopDrag = () => {
      // Limpia los manejadores de eventos una vez que se suelta el botón del mouse
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    // Registra los manejadores de eventos para el movimiento y la liberación del mouse
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    setIsDragging(true);
    setStartDragPoint({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - startDragPoint.x;
    const dy = e.clientY - startDragPoint.y;
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setStartDragPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    polygonConstructor('diamond');
    polygonConstructor('gold');
    polygonConstructor('vip');
    polygonConstructor('general');
    polygonConstructor('platea_izquierda');
    polygonConstructor('platea_derecha');
  }, [seats]);

  React.useEffect(() => {
    console.log(polygonPoints);
  }, [polygonPoints]);

  const polygonConstructor = (locality: string) => {
    const localitySeats = seats.filter((seat) => seat.locality === locality);

    if (localitySeats.length === 0) return;

    // Find the outermost points of the seating area
    const minX = Math.min(...localitySeats.map((seat) => seat.minX)) - 15;
    const maxX = Math.max(...localitySeats.map((seat) => seat.maxX)) + 15;
    const minY = Math.min(...localitySeats.map((seat) => seat.minY)) - 15;
    const maxY = Math.max(...localitySeats.map((seat) => seat.maxY)) + 15;

    // Create a simplified polygon using just the corner points
    const cornerPoints = [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY },
    ];

    // Add some curvature to the polygon
    const curvePoints = [];
    for (let i = 0; i < cornerPoints.length; i++) {
      const current = cornerPoints[i];
      const next = cornerPoints[(i + 1) % cornerPoints.length];

      curvePoints.push(current);

      // Add a midpoint with some randomness for natural curvature
      const midX = (current.x + next.x) / 2 + (Math.random() - 0.5) * 10;
      const midY = (current.y + next.y) / 2 + (Math.random() - 0.5) * 10;
      curvePoints.push({ x: midX, y: midY });
    }

    // Convert the points to a string for the polygon
    const polygonPoints = curvePoints.map((p) => `${p.x},${p.y}`).join(' ');

    setPolygonPoints((prev) => ({ ...prev, [locality]: polygonPoints }));
  };

  return (
    <div className="w-full">
      <div className="map-container bg-gray-200  overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="-250 -100 1500 900"
          xmlns="http://www.w3.org/2000/svg"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <g>
            <rect
              x={150 / scale + position.x}
              y={20 / scale + position.y}
              width={700 / scale}
              height={60 / scale}
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
            {localitySelected === 'diamond' ? (
              <g
                id="diamond"
                fill={`${localityColors['diamond' as keyof typeof localityColors]}`}
              >
                {seats.map((seat) => {
                  if (seat.locality === 'diamond') return seat.cols;
                })}
              </g>
            ) : (
              // poligono con la forma que abarcan los circulos de los asientos
              <g>
                <polygon
                  onClick={() => setLocalitySelected('diamond')}
                  points={polygonPoints.diamond}
                  fill={`${localityColors['diamond' as keyof typeof localityColors]}4D`}
                  stroke={`${localityColors['diamond' as keyof typeof localityColors]}`}
                  strokeWidth="2"
                />
                <text
                  x={500 / scale + position.x}
                  y={120 / scale + position.y}
                  fill={`${localityColors['diamond' as keyof typeof localityColors]}`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`semibold`}
                >
                  DIAMANTE
                </text>
                <text
                  x={500 / scale + position.x}
                  y={155 / scale + position.y}
                  fill={`${localityColors['diamond' as keyof typeof localityColors]}`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`semibold`}
                >
                  380.000 COP
                </text>
              </g>
            )}
            {localitySelected === 'gold' ? (
              <g
                id="gold"
                fill={`${localityColors['gold' as keyof typeof localityColors]}`}
              >
                {seats.map((seat) => {
                  if (seat.locality === 'gold') return seat.cols;

                  return null;
                })}
              </g>
            ) : (
              <g>
                <polygon
                  onClick={() => setLocalitySelected('gold')}
                  points={polygonPoints.gold}
                  fill={`${localityColors['gold' as keyof typeof localityColors]}4D`}
                  stroke={`${localityColors['gold' as keyof typeof localityColors]}`}
                  strokeWidth="4"
                />
                <text
                  x={500 / scale + position.x}
                  y={230 / scale + position.y}
                  fill={`${localityColors['gold' as keyof typeof localityColors]}`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`semibold`}
                >
                  ORO - 380.000 COP
                </text>
              </g>
            )}
            {localitySelected === 'vip' ? (
              <g
                id="vip"
                fill={`${localityColors['vip' as keyof typeof localityColors]}`}
              >
                {seats.map((seat) => {
                  if (seat.locality === 'vip') return seat.cols;

                  return null;
                })}
              </g>
            ) : (
              <g>
                <polygon
                  onClick={() => setLocalitySelected('vip')}
                  points={polygonPoints.vip}
                  fill={`${localityColors['vip' as keyof typeof localityColors]}4D`}
                  stroke={`${localityColors['vip' as keyof typeof localityColors]}`}
                  strokeWidth="4"
                />
                <text
                  x={500 / scale + position.x}
                  y={330 / scale + position.y}
                  fill={`${localityColors['vip' as keyof typeof localityColors]}`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`semibold`}
                >
                  VIP
                </text>
                <text
                  x={500 / scale + position.x}
                  y={370 / scale + position.y}
                  fill={`${localityColors['vip' as keyof typeof localityColors]}`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`semibold`}
                >
                  300.000 COP
                </text>
              </g>
            )}
            {localitySelected === 'general' ? (
              <g
                id="general"
                fill={`${localityColors['general' as keyof typeof localityColors]}`}
              >
                {seats.map((seat) => {
                  if (seat.locality === 'general') return seat.cols;

                  return null;
                })}
              </g>
            ) : (
              <g>
                <polygon
                  onClick={() => setLocalitySelected('general')}
                  points={polygonPoints.general}
                  fill={`${localityColors['general' as keyof typeof localityColors]}4D`}
                  stroke={`${localityColors['general' as keyof typeof localityColors]}`}
                  strokeWidth="4"
                />
                <text
                  x={500 / scale + position.x}
                  y={550 / scale + position.y}
                  fill={`${localityColors['general' as keyof typeof localityColors]}`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`semibold`}
                >
                  GENERAL
                </text>
                <text
                  x={500 / scale + position.x}
                  y={590 / scale + position.y}
                  fill={`${localityColors['general' as keyof typeof localityColors]}`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`semibold`}
                >
                  200.000 COP
                </text>
              </g>
            )}
            {localitySelected === 'platea_izquierda' ? (
              <g
                id="platea_izquierda"
                fill={`${localityColors['platea_izquierda' as keyof typeof localityColors]}`}
              >
                {seats.map((seat) => {
                  if (seat.locality === 'platea_izquierda') return seat.cols;
                  return null;
                })}
              </g>
            ) : (
              <g>
                <polygon
                  onClick={() => setLocalitySelected('platea_izquierda')}
                  points={polygonPoints.platea_izquierda}
                  fill={`${localityColors['platea_izquierda' as keyof typeof localityColors]}4D`}
                  stroke={`${localityColors['platea_izquierda' as keyof typeof localityColors]}`}
                  strokeWidth="4"
                />
                <text
                  x={-52 / scale + position.x}
                  y={300 / scale + position.y}
                  fill={`${localityColors['platea_izquierda' as keyof typeof localityColors]}`}
                  textAnchor="middle"
                  fontSize={22 / scale}
                  fontWeight={`semibold`}
                >
                  PLATEA IZQUIERDA
                </text>
                <text
                  x={-52 / scale + position.x}
                  y={340 / scale + position.y}
                  fill={`${localityColors['platea_izquierda' as keyof typeof localityColors]}`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`semibold`}
                >
                  250.000 COP
                </text>
              </g>
            )}
            {localitySelected === 'platea_derecha' ? (
              <g
                id="platea_derecha"
                fill={`${localityColors['platea_derecha' as keyof typeof localityColors]}`}
              >
                {seats.map((seat) => {
                  if (seat.locality === 'platea_derecha') return seat.cols;
                  return null;
                })}
              </g>
            ) : (
              <g>
                <polygon
                  onClick={() => setLocalitySelected('platea_derecha')}
                  points={polygonPoints.platea_derecha}
                  fill={`${localityColors['platea_derecha' as keyof typeof localityColors]}4D`}
                  stroke={`${localityColors['platea_derecha' as keyof typeof localityColors]}`}
                  strokeWidth="4"
                />
                <text
                  x={1070 / scale + position.x}
                  y={300 / scale + position.y}
                  fill={`${localityColors['platea_derecha' as keyof typeof localityColors]}`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`semibold`}
                >
                  PLATEA DERECHA
                </text>
                <text
                  x={1070 / scale + position.x}
                  y={340 / scale + position.y}
                  fill={`${localityColors['platea_derecha' as keyof typeof localityColors]}`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`semibold`}
                >
                  250.000 COP
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>
      <div className="w-full bg-[#737373]">
        <p className="text-center text-lg">
          {localitySelected
            ? `Localidad seleccionada: ${localitySelected}`
            : 'Haz clic en una localidad para ver los asientos'}
        </p>
      </div>
    </div>
  );
};

export default MapTickets;

// @ts-nocheck
'use client';

export default function BuyTickets() {
  return (
    <div>
      <h1>Buy Tickets</h1>
    </div>
  );
}
/*
'use client';
import {
  Position,
  SeatRows,
  SeatUsed,
  traductions,
} from '@/types/tickets';
import { numberToString } from 'pdf-lib';
import React, { useState, useEffect, useRef } from 'react';

interface SeatProps {
  rowName: string;
  seatNumber: number;
  cx: number;
  cy: number;
  scale: number;
  handleModal: (row: string, number: number, locality: any) => void;
  locality: any;
  blocked: boolean;
}

const Seat: React.FC<SeatProps> = ({
  rowName,
  seatNumber,
  cx,
  cy,
  scale,
  handleModal,
  locality,
  blocked,
}) => {
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
    <g
      onClick={() => {
        if (blocked) return;
        handleModal(rowName, seatNumber, locality);
      }}
    >
      <circle
        cx={cx}
        cy={cy}
        r={10 / scale}
        className="seat"
        fill={blocked ? 'red' : localityColors[locality]}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={7 / scale}
        fill="white"
        pointerEvents="none"
      >
        {`${rowName} ${seatNumber}`}
      </text>
    </g>
  );
};

interface Props {
  toggleModal: (row: string, number: number, locality: Locality) => void;
  seatUseds: SeatUsed[];
  isMobile: boolean;
}

const MapTickets: React.FC<Props> = ({ toggleModal, seatUseds, isMobile }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [minScale, setMinScale] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startDragPoint, setStartDragPoint] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [localitySelected, setLocalitySelected] = useState<Locality>();
  const [polygonPoints, setPolygonPoints] = useState<{
    [key in Locality]: string;
  }>({
    [Locality.DIAMOND]: '',
    [Locality.GOLD]: '',
    [Locality.VIP]: '',
    [Locality.GENERAL]: '',
    [Locality.LEFT_STALL]: '',
    [Locality.RIGHT_STALL]: '',
  });
  const [viewBox, setViewBox] = useState({
    x: -380,
    y: -100,
    width: 1800,
    height: 900,
  });
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  const originalViewBox = isMobile
    ? { x: -350, y: -200, width: 1700, height: 2200 }
    : { x: -380, y: -100, width: 1800, height: 900 };

  const mapBounds = {
    minX: -380, // originalViewBox.x - 50
    minY: -100, // originalViewBox.y - 50
    maxX: 1420, // originalViewBox.x + originalViewBox.width + 50
    maxY: 800, // originalViewBox.y + originalViewBox.height + 50
  };

  useEffect(() => {
    setViewBox(originalViewBox);
  }, [isMobile]);

  const seats: SeatRows[] = React.useMemo(() => {
    const rows = [
      {
        locality: Locality.DIAMOND,
        row: 'A',
        startSeat: 101,
        endSeat: 140,
        y: 100,
      },
      {
        locality: Locality.DIAMOND,
        row: 'B',
        startSeat: 101,
        endSeat: 138,
        y: 130,
      },
      {
        locality: Locality.DIAMOND,
        row: 'C',
        startSeat: 101,
        endSeat: 134,
        y: 160,
      },
      {
        locality: Locality.GOLD,
        row: 'D',
        startSeat: 101,
        endSeat: 134,
        y: 210,
      },
      {
        locality: Locality.GOLD,
        row: 'E',
        startSeat: 101,
        endSeat: 132,
        y: 240,
      },
      {
        locality: Locality.VIP,
        row: 'F',
        startSeat: 101,
        endSeat: 134,
        y: 290,
      },
      {
        locality: Locality.VIP,
        row: 'G',
        startSeat: 101,
        endSeat: 132,
        y: 320,
      },
      {
        locality: Locality.VIP,
        row: 'H',
        startSeat: 101,
        endSeat: 134,
        y: 350,
      },
      {
        locality: Locality.VIP,
        row: 'J',
        startSeat: 101,
        endSeat: 137,
        y: 380,
      },
      {
        locality: Locality.VIP,
        row: 'K',
        startSeat: 101,
        endSeat: 138,
        y: 410,
      },
      {
        locality: Locality.GENERAL,
        row: 'L',
        startSeat: 101,
        endSeat: 132,
        y: 460,
      },
      {
        locality: Locality.GENERAL,
        row: 'M',
        startSeat: 101,
        endSeat: 126,
        y: 490,
      },
      {
        locality: Locality.GENERAL,
        row: 'N',
        startSeat: 101,
        endSeat: 126,
        y: 520,
      },
      {
        locality: Locality.GENERAL,
        row: 'P',
        startSeat: 101,
        endSeat: 126,
        y: 550,
      },
      {
        locality: Locality.GENERAL,
        row: 'Q',
        startSeat: 101,
        endSeat: 126,
        y: 580,
      },
      {
        locality: Locality.GENERAL,
        row: 'R',
        startSeat: 101,
        endSeat: 124,
        y: 610,
      },
      {
        locality: Locality.GENERAL,
        row: 'S',
        startSeat: 101,
        endSeat: 124,
        y: 640,
      },
      {
        locality: Locality.GENERAL,
        row: 'T',
        startSeat: 101,
        endSeat: 124,
        y: 670,
      },
      {
        locality: Locality.LEFT_STALL,
        row: 'J',
        startSeat: 1,
        endSeat: 5,
        y: -240,
        interval: 2,
        offset: 0,
      },
      {
        locality: Locality.LEFT_STALL,
        row: 'H',
        startSeat: 1,
        endSeat: 11,
        y: -210,
        interval: 2,
        offset: -0.5,
      },
      {
        locality: Locality.LEFT_STALL,
        row: 'G',
        startSeat: 1,
        endSeat: 11,
        y: -180,
        interval: 2,
        offset: -0.5,
      },
      {
        locality: Locality.LEFT_STALL,
        row: 'F',
        startSeat: 1,
        endSeat: 17,
        y: -150,
        interval: 2,
        offset: -0.5,
      },
      {
        locality: Locality.LEFT_STALL,
        row: 'E',
        startSeat: 1,
        endSeat: 27,
        y: -120,
        interval: 2,
        offset: -0.5,
      },
      {
        locality: Locality.LEFT_STALL,
        row: 'D',
        startSeat: 1,
        endSeat: 35,
        y: -90,
        interval: 2,
        offset: -1.5,
      },
      {
        locality: Locality.LEFT_STALL,
        row: 'C',
        startSeat: 1,
        endSeat: 27,
        y: -60,
        interval: 2,
        offset: 1.5,
      },
      {
        locality: Locality.LEFT_STALL,
        row: 'B',
        startSeat: 1,
        endSeat: 25,
        y: -30,
        interval: 2,
        offset: 2,
      },
      {
        locality: Locality.LEFT_STALL,
        row: 'A',
        startSeat: 1,
        endSeat: 17,
        y: 0,
        interval: 2,
        offset: 5,
      },
      // ... add more rows for platea-izquierda ...
      {
        locality: Locality.RIGHT_STALL,
        row: 'A',
        startSeat: 2,
        endSeat: 20,
        y: 100,
        interval: 2,
      },
      {
        locality: Locality.RIGHT_STALL,
        row: 'B',
        startSeat: 2,
        endSeat: 28,
        y: 130,
        interval: 2,
        offset: -2,
      },
      {
        locality: Locality.RIGHT_STALL,
        row: 'C',
        startSeat: 2,
        endSeat: 34,
        y: 160,
        offset: -3.5,
        interval: 2,
      },
      {
        locality: Locality.RIGHT_STALL,
        row: 'D',
        startSeat: 2,
        endSeat: 40,
        y: 190,
        offset: -5,
        interval: 2,
      },
      {
        locality: Locality.RIGHT_STALL,
        row: 'E',
        startSeat: 2,
        endSeat: 44,
        y: 220,
        offset: -6,
        interval: 2,
      },
      {
        locality: Locality.RIGHT_STALL,
        row: 'F',
        startSeat: 2,
        endSeat: 46,
        y: 250,
        offset: -6.5,
        interval: 2,
      },
      {
        locality: Locality.RIGHT_STALL,
        row: 'G',
        startSeat: 2,
        endSeat: 26,
        y: 280,
        offset: -7.5,
        interval: 2,
      },
      {
        locality: Locality.RIGHT_STALL,
        row: 'H',
        startSeat: 2,
        endSeat: 20,
        y: 310,
        offset: -8,
        interval: 2,
      },
      {
        locality: Locality.RIGHT_STALL,
        row: 'J',
        startSeat: 2,
        endSeat: 14,
        y: 340,
        offset: -8.5,
        interval: 2,
      },
      {
        locality: Locality.RIGHT_STALL,
        row: 'K',
        startSeat: 2,
        endSeat: 6,
        y: 370,
        offset: -9.5,
        interval: 2,
      },
    ];

    const renderLocalityPolygon = (locality: Locality) => {
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
      const seatSpacing = 25;
      const rowWidth = seatCount * seatSpacing;
      const startX =
        row.locality === Locality.LEFT_STALL ? 0 : (1000 - rowWidth) / 2;

      const cols = [];
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      for (let i = 0; i < seatCount; i++) {
        let seatNumber: number;
        
        // Invert seat numbering for specific localities
        if ([Locality.DIAMOND, Locality.GOLD, Locality.VIP, Locality.GENERAL].includes(row.locality)) {
          seatNumber = row.endSeat - i * (row.interval || 1);
        } else {
          seatNumber = row.startSeat + i * (row.interval || 1);
        }
        
        if (seatNumber < row.startSeat || seatNumber > row.endSeat) continue;

        let x = startX + i * seatSpacing + (row.offset || 0) * seatSpacing;
        let y = row.y;

        if (row.locality === Locality.LEFT_STALL) {
          // Adjust initial position
          x -= 400;
          y += -180;

          // Apply rotation transformation
          const angle = -110 * (Math.PI / 180);
          const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
          const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);

          x = rotatedX;
          y = rotatedY;
        }

        if (row.locality === Locality.RIGHT_STALL) {
          // Adjust initial position
          x -= 300;
          y += 1000;

          // Apply rotation transformation
          const angle = -70 * (Math.PI / 180);
          const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
          const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);

          x = rotatedX;
          y = rotatedY;
        }

        x = x / scale + position.x;
        y = y / scale + position.y;

        const blocked = seatUseds.find(
          (seat) =>
            seat.number === seatNumber &&
            seat.row === row.row &&
            seat.type === row.locality,
        );

        cols.push(
          <Seat
            key={`${row.row}-${seatNumber}`}
            rowName={row.row}
            seatNumber={seatNumber}
            cx={x}
            cy={y}
            scale={scale}
            handleModal={toggleModal}
            locality={row.locality}
            blocked={!!blocked}
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
  }, [scale, position, seatUseds]);

  useEffect(() => {
    // Calcula el minScale basado en las dimensiones del SVG y el contenedor
    const updateMinScale = () => {
      if (svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const containerRect =
          svgRef.current.parentElement?.getBoundingClientRect();
        if (containerRect) {
          const scaleX = containerRect.width / svgRect.width;
          const scaleY = containerRect.height / svgRect.height;
          setMinScale(Math.min(scaleX, scaleY));
        }
      }
    };

    updateMinScale();
    window.addEventListener('resize', updateMinScale);

    return () => {
      window.removeEventListener('resize', updateMinScale);
    };
  }, []);

  const clampViewBox = (vb: typeof viewBox) => {
    const newVB = { ...vb };
    newVB.x = Math.max(
      mapBounds.minX,
      Math.min(mapBounds.maxX - newVB.width, newVB.x),
    );
    newVB.y = Math.max(
      mapBounds.minY,
      Math.min(mapBounds.maxY - newVB.height, newVB.y),
    );
    newVB.width = Math.min(originalViewBox.width, newVB.width);
    newVB.height = Math.min(originalViewBox.height, newVB.height);
    return newVB;
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const { deltaY } = e;
    const { left, top, width, height } =
      svgRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const zoomFactor = deltaY > 0 ? 1.1 : 0.9;

    let newWidth = viewBox.width * zoomFactor;
    let newHeight = viewBox.height * zoomFactor;

    // Limit zoom out to original viewBox size
    newWidth = Math.min(originalViewBox.width, newWidth);
    newHeight = Math.min(originalViewBox.height, newHeight);

    const mouseXRatio = mouseX / width;
    const mouseYRatio = mouseY / height;

    const newX = viewBox.x - (newWidth - viewBox.width) * mouseXRatio;
    const newY = viewBox.y - (newHeight - viewBox.height) * mouseYRatio;

    setViewBox(
      clampViewBox({ x: newX, y: newY, width: newWidth, height: newHeight }),
    );
  };

  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(
    null,
  );

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY,
      );
      setLastPosition({ x: distance, y: 0 });
    } else if (e.touches.length === 1) {
      setLastPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!isDragging) return;

    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY,
      );

      const zoomFactor = distance / lastPosition.x;
      const { left, top, width, height } =
        svgRef.current!.getBoundingClientRect();
      const centerX = (touch1.clientX + touch2.clientX) / 2 - left;
      const centerY = (touch1.clientY + touch2.clientY) / 2 - top;

      const mouseXRatio = centerX / width;
      const mouseYRatio = centerY / height;

      let newWidth = viewBox.width / zoomFactor;
      let newHeight = viewBox.height / zoomFactor;

      // Limit zoom out to original viewBox size
      newWidth = Math.min(originalViewBox.width, newWidth);
      newHeight = Math.min(originalViewBox.height, newHeight);

      const newX = viewBox.x - (newWidth - viewBox.width) * mouseXRatio;
      const newY = viewBox.y - (newHeight - viewBox.height) * mouseYRatio;

      setViewBox(
        clampViewBox({ x: newX, y: newY, width: newWidth, height: newHeight }),
      );
      setLastPosition({ x: distance, y: 0 });
    } else if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - lastPosition.x;
      const dy = e.touches[0].clientY - lastPosition.y;

      const { width, height } = svgRef.current!.getBoundingClientRect();
      const scaleX = viewBox.width / width;
      const scaleY = viewBox.height / height;

      setViewBox((vb) =>
        clampViewBox({
          ...vb,
          x: vb.x - dx * scaleX,
          y: vb.y - dy * scaleY,
        }),
      );
      setLastPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;

    const dx = e.clientX - lastPosition.x;
    const dy = e.clientY - lastPosition.y;

    const { width, height } = svgRef.current!.getBoundingClientRect();
    const scaleX = viewBox.width / width;
    const scaleY = viewBox.height / height;

    setViewBox((vb) =>
      clampViewBox({
        ...vb,
        x: vb.x - dx * scaleX,
        y: vb.y - dy * scaleY,
      }),
    );

    setLastPosition({ x: e.clientX, y: e.clientY });
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

  useEffect(() => {
    const svgElement = svgRef.current;
    if (svgElement && isMobile) {
      const preventDefaultZoom = (e: TouchEvent) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      };

      svgElement.addEventListener('touchstart', preventDefaultZoom, {
        passive: false,
      });
      svgElement.addEventListener('touchmove', preventDefaultZoom, {
        passive: false,
      });

      return () => {
        svgElement.removeEventListener('touchstart', preventDefaultZoom);
        svgElement.removeEventListener('touchmove', preventDefaultZoom);
      };
    }
  }, [isMobile]);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  React.useEffect(() => {
    polygonConstructor(Locality.DIAMOND);
    polygonConstructor(Locality.GOLD);
    polygonConstructor(Locality.VIP);
    polygonConstructor(Locality.GENERAL);
    polygonConstructor(Locality.LEFT_STALL);
    polygonConstructor(Locality.RIGHT_STALL);
  }, [seats]);

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
      <div
        className="map-container bg-gray-200 overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
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
            {localitySelected === Locality.DIAMOND ? (
              <g id="diamond" fill={`${localityColors[Locality.DIAMOND]}`}>
                {seats.map((seat) => {
                  if (seat.locality === Locality.DIAMOND) return seat.cols;
                })}
              </g>
            ) : (
              // poligono con la forma que abarcan los circulos de los asientos
              <g>
                <polygon
                  onClick={() => setLocalitySelected(Locality.DIAMOND)}
                  points={polygonPoints.diamond}
                  fill={`${localityColors[Locality.DIAMOND]}4D`}
                  stroke={`${localityColors[Locality.DIAMOND]}`}
                  strokeWidth="2"
                />
                <text
                  x={500 / scale + position.x}
                  y={120 / scale + position.y}
                  fill={`${localityColors[Locality.DIAMOND]}E6`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`bold`}
                >
                  DIAMANTE
                </text>
                <text
                  x={500 / scale + position.x}
                  y={155 / scale + position.y}
                  fill={`${localityColors[Locality.DIAMOND]}E6`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`bold`}
                >
                  500.000 COP
                </text>
              </g>
            )}
            {localitySelected === Locality.GOLD ? (
              <g
                id="gold"
                fill={`${localityColors[Locality.GOLD as keyof typeof localityColors]}`}
              >
                {seats.map((seat) => {
                  if (seat.locality === Locality.GOLD) return seat.cols;

                  return null;
                })}
              </g>
            ) : (
              <g>
                <polygon
                  onClick={() => setLocalitySelected(Locality.GOLD)}
                  points={polygonPoints.gold}
                  fill={`${localityColors[Locality.GOLD as keyof typeof localityColors]}4D`}
                  stroke={`${localityColors[Locality.GOLD as keyof typeof localityColors]}`}
                  strokeWidth="4"
                />
                <text
                  x={500 / scale + position.x}
                  y={230 / scale + position.y}
                  fill={`#D0A113`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`bold`}
                >
                  ORO - 380.000 COP
                </text>
              </g>
            )}
            {localitySelected === Locality.VIP ? (
              <g
                id="vip"
                fill={`${localityColors[Locality.VIP as keyof typeof localityColors]}`}
              >
                {seats.map((seat) => {
                  if (seat.locality === Locality.VIP) return seat.cols;

                  return null;
                })}
              </g>
            ) : (
              <g>
                <polygon
                  onClick={() => setLocalitySelected(Locality.VIP)}
                  points={polygonPoints.vip}
                  fill={`${localityColors[Locality.VIP as keyof typeof localityColors]}4D`}
                  stroke={`${localityColors[Locality.VIP as keyof typeof localityColors]}`}
                  strokeWidth="4"
                />
                <text
                  x={500 / scale + position.x}
                  y={330 / scale + position.y}
                  fill={`${localityColors[Locality.VIP as keyof typeof localityColors]}`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`bold`}
                >
                  VIP
                </text>
                <text
                  x={500 / scale + position.x}
                  y={370 / scale + position.y}
                  fill={`${localityColors[Locality.VIP as keyof typeof localityColors]}`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`bold`}
                >
                  300.000 COP
                </text>
              </g>
            )}
            {localitySelected === Locality.GENERAL ? (
              <g
                id="general"
                fill={`${localityColors[Locality.GENERAL as keyof typeof localityColors]}`}
              >
                {seats.map((seat) => {
                  if (seat.locality === Locality.GENERAL) return seat.cols;

                  return null;
                })}
              </g>
            ) : (
              <g>
                <polygon
                  onClick={() => setLocalitySelected(Locality.GENERAL)}
                  points={polygonPoints.general}
                  fill={`${localityColors[Locality.GENERAL as keyof typeof localityColors]}4D`}
                  stroke={`${localityColors[Locality.GENERAL as keyof typeof localityColors]}`}
                  strokeWidth="4"
                />
                <text
                  x={500 / scale + position.x}
                  y={550 / scale + position.y}
                  fill={`${localityColors[Locality.GENERAL as keyof typeof localityColors]}`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`bold`}
                >
                  GENERAL
                </text>
                <text
                  x={500 / scale + position.x}
                  y={590 / scale + position.y}
                  fill={`${localityColors[Locality.GENERAL as keyof typeof localityColors]}`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`bold`}
                >
                  200.000 COP
                </text>
              </g>
            )}
            {localitySelected === Locality.LEFT_STALL ? (
              <g
                id="platea_izquierda"
                fill={`${localityColors[Locality.LEFT_STALL as keyof typeof localityColors]}`}
              >
                {seats.map((seat) => {
                  if (seat.locality === Locality.LEFT_STALL) return seat.cols;
                  return null;
                })}
              </g>
            ) : (
              <g>
                <polygon
                  onClick={() => setLocalitySelected(Locality.LEFT_STALL)}
                  points={polygonPoints[Locality.LEFT_STALL]}
                  fill={`${localityColors[Locality.LEFT_STALL as keyof typeof localityColors]}4D`}
                  stroke={`${localityColors[Locality.LEFT_STALL as keyof typeof localityColors]}`}
                  strokeWidth="4"
                />
                <text
                  x={-175 / scale + position.x}
                  y={300 / scale + position.y}
                  fill={`green`}
                  textAnchor="middle"
                  fontSize={22 / scale}
                  fontWeight={`bold`}
                >
                  PLATEA IZQUIERDA
                </text>
                <text
                  x={-175 / scale + position.x}
                  y={340 / scale + position.y}
                  fill={`green`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`bold`}
                >
                  250.000 COP
                </text>
              </g>
            )}
            {localitySelected === Locality.RIGHT_STALL ? (
              <g
                id="platea_derecha"
                fill={`${localityColors[Locality.RIGHT_STALL as keyof typeof localityColors]}`}
              >
                {seats.map((seat) => {
                  if (seat.locality === Locality.RIGHT_STALL) return seat.cols;
                  return null;
                })}
              </g>
            ) : (
              <g>
                <polygon
                  onClick={() => setLocalitySelected(Locality.RIGHT_STALL)}
                  points={polygonPoints[Locality.RIGHT_STALL]}
                  fill={`${localityColors[Locality.RIGHT_STALL as keyof typeof localityColors]}4D`}
                  stroke={`${localityColors[Locality.RIGHT_STALL as keyof typeof localityColors]}`}
                  strokeWidth="4"
                />
                <text
                  x={1170 / scale + position.x}
                  y={300 / scale + position.y}
                  fill={`green`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`bold`}
                >
                  PLATEA DERECHA
                </text>
                <text
                  x={1170 / scale + position.x}
                  y={340 / scale + position.y}
                  fill={`green`}
                  textAnchor="middle"
                  fontSize={24 / scale}
                  fontWeight={`bold`}
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
            ? `Localidad seleccionada: ${traductions[localitySelected]}`
            : 'Haz clic en una localidad para ver los asientos'}
        </p>
        <p className="text-center text-lg">Nota: Los asientos señalados en rojo ya no están disponibles.</p>
      </div>
    </div>
  );
};

export default MapTickets;
*/
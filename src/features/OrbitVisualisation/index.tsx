import React, { useRef, useEffect, useState } from "react";
import { type Product } from "../../types";

interface OrbitVisualizationProps {
  comets: Product[];
  selectedComet?: Product | null;
  onCometSelect?: (comet: Product | null) => void;
}

interface OrbitData {
  comet: Product;
  name: string;
  perihelion: number;
  aphelion: number;
  eccentricity: number;
  inclination: number;
  color: string;
  semiMajorAxis: number;
  semiMinorAxis: number;
}

export default function OrbitVisualization({
  comets,
  selectedComet,
  onCometSelect,
}: OrbitVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredComet, setHoveredComet] = useState<Product | null>(null);
  const [scale, setScale] = useState(10);

  // Helper function to get property value
  const getPropertyValue = (comet: Product, propertyId: number) => {
    const property = comet.property_values.find(
      (p) => p.property_id === propertyId,
    );
    return property ? property.value : null;
  };

  // Process comet data for orbital calculations
  const processComets = (): OrbitData[] => {
    return comets.map((comet) => {
      const name = getPropertyValue(comet, 0) as string;
      const perihelion = getPropertyValue(comet, 5) as number; // Perihelion Distance (AU)
      const aphelion = getPropertyValue(comet, 6) as number; // Aphelion Distance (AU)
      const eccentricity = getPropertyValue(comet, 3) as number; // Eccentricity
      const inclination = getPropertyValue(comet, 7) as number; // Orbital Inclination

      const semiMajorAxis = (perihelion + aphelion) / 2;
      const semiMinorAxis =
        semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);

      // Color coding based on period type or eccentricity
      let color: string;
      if (eccentricity < 0.3)
        color = "#4CAF50"; // Green for nearly circular
      else if (eccentricity < 0.7)
        color = "#2196F3"; // Blue for elliptical
      else if (eccentricity < 0.9)
        color = "#FF9800"; // Orange for highly elliptical
      else color = "#F44336"; // Red for nearly parabolic

      return {
        comet,
        name,
        perihelion,
        aphelion,
        eccentricity,
        inclination,
        color,
        semiMajorAxis,
        semiMinorAxis,
      };
    });
  };

  // Draw the orbital visualization
  const drawOrbits = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = "#000011";
    ctx.fillRect(0, 0, width, height);

    const orbitData = processComets();

    // Find max distance for scaling
    const maxDistance = Math.max(...orbitData.map((d) => d.aphelion));
    const scaleFactor =
      (Math.min(width, height) * 0.4) / ((maxDistance * scale) / 10);

    // Draw Sun
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Add Sun label
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "12px Arial";
    ctx.fillText("Sun", centerX + 12, centerY + 4);

    // Draw Earth's orbit for reference
    ctx.strokeStyle = "#444444";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, 1 * scaleFactor, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Earth orbit label
    ctx.fillStyle = "#888888";
    ctx.font = "10px Arial";
    ctx.fillText("Earth (1 AU)", centerX + 1 * scaleFactor + 5, centerY);

    // Draw comet orbits
    orbitData.forEach((orbit) => {
      const { comet, name, semiMajorAxis, semiMinorAxis, eccentricity, color } =
        orbit;

      const isSelected = selectedComet?.id === comet.id;
      const isHovered = hoveredComet?.id === comet.id;

      // Calculate focus offset (Sun is at one focus)
      const focusOffset = semiMajorAxis * eccentricity * scaleFactor;

      // Draw orbit ellipse
      ctx.strokeStyle = isSelected
        ? "#FFFFFF"
        : isHovered
          ? color
          : color + "80";
      ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1;

      ctx.save();
      ctx.translate(centerX - focusOffset, centerY);
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        semiMajorAxis * scaleFactor,
        semiMinorAxis * scaleFactor,
        0,
        0,
        2 * Math.PI,
      );
      ctx.stroke();
      ctx.restore();

      // Draw perihelion point
      const perihelionX =
        centerX -
        focusOffset +
        (semiMajorAxis - orbit.perihelion) * scaleFactor;
      const perihelionY = centerY;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(
        perihelionX,
        perihelionY,
        isSelected ? 6 : isHovered ? 5 : 3,
        0,
        2 * Math.PI,
      );
      ctx.fill();

      // Draw comet label for selected/hovered
      if (isSelected || isHovered) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "11px Arial";
        const labelX = perihelionX + 8;
        const labelY = perihelionY - 8;

        // Background for label
        const metrics = ctx.measureText(name);
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(labelX - 2, labelY - 12, metrics.width + 4, 14);

        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(name, labelX, labelY);

        // Show orbital details
        ctx.font = "9px Arial";
        ctx.fillStyle = "#CCCCCC";
        const details = `e=${eccentricity.toFixed(3)} | ${orbit.perihelion.toFixed(2)}-${orbit.aphelion.toFixed(1)} AU`;
        ctx.fillText(details, labelX, labelY + 12);
      }
    });

    // Draw legend
    drawLegend(ctx, width, height);
  };

  const drawLegend = (
    ctx: CanvasRenderingContext2D,
    _width: number,
    height: number,
  ) => {
    const legendX = 10;
    const legendY = height - 120;

    // Legend background
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(legendX - 5, legendY - 5, 200, 110);

    ctx.font = "11px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Orbit Shape by Eccentricity:", legendX, legendY + 10);

    const legendItems = [
      { color: "#4CAF50", label: "Nearly Circular (e < 0.3)" },
      { color: "#2196F3", label: "Elliptical (e < 0.7)" },
      { color: "#FF9800", label: "Highly Elliptical (e < 0.9)" },
      { color: "#F44336", label: "Nearly Parabolic (e ≥ 0.9)" },
    ];

    legendItems.forEach((item, index) => {
      const y = legendY + 25 + index * 18;
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, y, 12, 12);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "10px Arial";
      ctx.fillText(item.label, legendX + 18, y + 9);
    });
  };

  // Handle mouse interactions
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const orbitData = processComets();
    const maxDistance = Math.max(...orbitData.map((d) => d.aphelion));
    const scaleFactor =
      (Math.min(canvas.width, canvas.height) * 0.4) /
      ((maxDistance * scale) / 10);

    // Check if mouse is near any comet's perihelion point
    let nearestComet: Product | null = null;
    let minDistance = Infinity;

    orbitData.forEach((orbit) => {
      const focusOffset =
        orbit.semiMajorAxis * orbit.eccentricity * scaleFactor;
      const perihelionX =
        centerX -
        focusOffset +
        (orbit.semiMajorAxis - orbit.perihelion) * scaleFactor;
      const perihelionY = centerY;

      const distance = Math.sqrt(
        (mouseX - perihelionX) ** 2 + (mouseY - perihelionY) ** 2,
      );
      if (distance < 15 && distance < minDistance) {
        minDistance = distance;
        nearestComet = orbit.comet;
      }
    });

    setHoveredComet(nearestComet);
    canvas.style.cursor = nearestComet ? "pointer" : "default";
  };

  const handleClick = () => {
    if (hoveredComet && onCometSelect) {
      onCometSelect(
        selectedComet?.id === hoveredComet.id ? null : hoveredComet,
      );
    }
  };

  // Zoom controls
  const handleZoomIn = () => setScale(Math.max(1, scale - 2));
  const handleZoomOut = () => setScale(Math.min(20, scale + 2));

  useEffect(() => {
    drawOrbits();
  }, [comets, selectedComet, hoveredComet, scale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = Math.min(600, container.clientWidth * 0.75);
        drawOrbits();
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <div className="relative w-full">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Comet Orbits Visualization</h3>
        <div className="flex gap-2">
          <button
            onClick={handleZoomIn}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Zoom In
          </button>
          <button
            onClick={handleZoomOut}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Zoom Out
          </button>
        </div>
      </div>

      <div className="border border-gray-300 rounded">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          className="w-full block"
        />
      </div>

      <div className="mt-2 text-sm text-gray-600">
        <p>
          Interactive orbital view showing {comets.length} comets. Click on
          perihelion points (colored dots) to select comets. Zoom to see details
          of inner vs outer solar system orbits.
        </p>
        {selectedComet && (
          <p className="mt-1 font-semibold">
            Selected: {getPropertyValue(selectedComet, 0)}
          </p>
        )}
      </div>
    </div>
  );
}

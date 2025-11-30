// import { useRef, useState } from "react";

// export function useDragResize(initialPositions: any) {
//   const [positions, setPositions] = useState(initialPositions);

//   const activeField = useRef<string | null>(null);
//   const dragMode = useRef<"move" | "resize" | null>(null);

//   const startX = useRef(0);
//   const startY = useRef(0);
//   const offsetX = useRef(0);
//   const offsetY = useRef(0);
//   const startWidth = useRef(0);
//   const startHeight = useRef(0);

//   const onDragStart = (field: string, e: any) => {
//     e.preventDefault();
//     activeField.current = field;
//     dragMode.current = "move";

//     const pos = positions[field];
//     const x = e.clientX || e.touches?.[0]?.clientX;
//     const y = e.clientY || e.touches?.[0]?.clientY;

//     offsetX.current = x - pos.x;
//     offsetY.current = y - pos.y;

//     startEvents();
//   };

//   const onResizeStart = (field: string, e: any) => {
//     e.preventDefault();
//     e.stopPropagation();
//     activeField.current = field;
//     dragMode.current = "resize";

//     const pos = positions[field];
//     startWidth.current = pos.w;
//     startHeight.current = pos.h;

//     startX.current = e.clientX || e.touches?.[0]?.clientX;
//     startY.current = e.clientY || e.touches?.[0]?.clientY;

//     startEvents();
//   };

//   const startEvents = () => {
//     document.addEventListener("mousemove", onMove);
//     document.addEventListener("mouseup", stop);
//     document.addEventListener("touchmove", onMove);
//     document.addEventListener("touchend", stop);
//   };

//   const onMove = (e: any) => {
//     if (!activeField.current) return;

//     const x = e.clientX || e.touches?.[0]?.clientX;
//     const y = e.clientY || e.touches?.[0]?.clientY;

//     setPositions((p: any) => {
//       const pos = p[activeField.current!];

//       if (dragMode.current === "move") {
//         return {
//           ...p,
//           [activeField.current!]: {
//             ...pos,
//             x: x - offsetX.current,
//             y: y - offsetY.current,
//           },
//         };
//       }

//       if (dragMode.current === "resize") {
//         return {
//           ...p,
//           [activeField.current!]: {
//             ...pos,
//             w: startWidth.current + (x - startX.current),
//             h: startHeight.current + (y - startY.current),
//           },
//         };
//       }

//       return p;
//     });
//   };

//   const stop = () => {
//     activeField.current = null;
//     dragMode.current = null;

//     document.removeEventListener("mousemove", onMove);
//     document.removeEventListener("mouseup", stop);
//     document.removeEventListener("touchmove", onMove);
//     document.removeEventListener("touchend", stop);
//   };

//   return { positions, setPositions, onDragStart, onResizeStart };
// }




import { useRef, useState } from "react";

export const useDragResize = (initialPositions: any) => {
  const [positions, setPositions] = useState(initialPositions);

  const activeField = useRef<string | null>(null);
  const dragMode = useRef<"move" | "resize" | null>(null);

  const startX = useRef(0);
  const startY = useRef(0);
  const offsetX = useRef(0);
  const offsetY = useRef(0);
  const startWidth = useRef(0);
  const startHeight = useRef(0);

  const onDragStart = (field: string, e: any) => {
    e.preventDefault();
    activeField.current = field;
    dragMode.current = "move";

    const pos = positions[field];
    const x = e.clientX || e.touches?.[0]?.clientX;
    const y = e.clientY || e.touches?.[0]?.clientY;

    offsetX.current = x - pos.x;
    offsetY.current = y - pos.y;
    addListeners();
  };

  const onResizeStart = (field: string, e: any) => {
    e.preventDefault();
    activeField.current = field;
    dragMode.current = "resize";

    const pos = positions[field];
    startWidth.current = pos.w;
    startHeight.current = pos.h;

    startX.current = e.clientX || e.touches?.[0]?.clientX;
    startY.current = e.clientY || e.touches?.[0]?.clientY;
    addListeners();
  };

  const addListeners = () => {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", stop);
  };

  const onMove = (e: any) => {
    if (!activeField.current) return;

    const x = e.clientX || e.touches?.[0]?.clientX;
    const y = e.clientY || e.touches?.[0]?.clientY;

    setPositions((p: any) => {
      const pos = p[activeField.current!];

      if (dragMode.current === "move") {
        return {
          ...p,
          [activeField.current!]: {
            ...pos,
            x: x - offsetX.current,
            y: y - offsetY.current,
          },
        };
      }

      if (dragMode.current === "resize") {
        return {
          ...p,
          [activeField.current!]: {
            ...pos,
            w: startWidth.current + (x - startX.current),
            h: startHeight.current + (y - startY.current),
          },
        };
      }

      return p;
    });
  };

  const stop = () => {
    activeField.current = null;
    dragMode.current = null;

    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", stop);
    window.removeEventListener("touchmove", onMove);
    window.removeEventListener("touchend", stop);
  };

  return { positions, setPositions, onDragStart, onResizeStart };
};

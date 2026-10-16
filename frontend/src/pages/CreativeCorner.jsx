import React, { useRef, useState, useEffect } from 'react';
import { sound } from '../services/audioService';
import LumiMascot from '../components/LumiMascot';
import { 
  Palette, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Download, 
  Eraser, 
  Sparkles,
  Shuffle
} from 'lucide-react';

export default function CreativeCorner() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#EF4444');
  const [brushSize, setBrushSize] = useState(6);
  const [isEraser, setIsEraser] = useState(false);

  // DSA: LIFO Stacks for Undo and Redo operations
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Drawing prompts
  const prompts = [
    'Draw a smiling morning sun with fluffy clouds!',
    'Draw your favorite wild animal from the safari!',
    'Draw a colorful rainbow with all 7 glowing bands!',
    'Draw a superfast space rocket zooming towards stars!',
    'Draw a delicious slice of cheese pizza with toppings!'
  ];
  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);

  const palette = [
    { name: 'Red', hex: '#EF4444' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Yellow', hex: '#FACC15' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Sky Blue', hex: '#38BDF8' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Purple', hex: '#A855F7' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Brown', hex: '#78350F' },
    { name: 'Black', hex: '#1E293B' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Push initial blank state onto Undo Stack
    saveStateToStack();
  }, []);

  const saveStateToStack = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const snapshot = canvas.toDataURL();
    setUndoStack((prev) => [...prev, snapshot]);
    setRedoStack([]); // Clear redo stack on new stroke
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#FFFFFF' : selectedColor;
    ctx.lineWidth = brushSize;
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveStateToStack(); // Push onto LIFO Stack
    }
  };

  // DSA: Pop from Undo Stack, push onto Redo Stack!
  const handleUndo = () => {
    if (undoStack.length <= 1) return;
    sound.playPop();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const newUndo = [...undoStack];
    const currentState = newUndo.pop(); // Pop top of undo stack
    setRedoStack((prev) => [...prev, currentState]); // Push onto redo stack
    setUndoStack(newUndo);

    const prevState = newUndo[newUndo.length - 1];
    const img = new Image();
    img.src = prevState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  // DSA: Pop from Redo Stack, push back onto Undo Stack!
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    sound.playPop();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const newRedo = [...redoStack];
    const restoredState = newRedo.pop(); // Pop top of redo stack
    setUndoStack((prev) => [...prev, restoredState]);
    setRedoStack(newRedo);

    const img = new Image();
    img.src = restoredState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const handleClear = () => {
    sound.playPop();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveStateToStack();
  };

  const handleDownload = () => {
    sound.playSuccess();
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'little-learners-masterpiece.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleNewPrompt = () => {
    sound.playPop();
    const next = prompts[(prompts.indexOf(currentPrompt) + 1) % prompts.length];
    setCurrentPrompt(next);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-800 flex items-center gap-2">
            <span>Creative Corner</span>
            <span className="text-2xl">🎨</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Draw, doodle, and paint your favorite ideas with full Undo and Redo!
          </p>
        </div>
        <LumiMascot 
          size="sm"
          message="Show me your artistic creativity! Pick bright colors!"
        />
      </div>

      {/* Drawing Prompt Card */}
      <div className="card-soft p-4 bg-gradient-to-r from-amber-50 to-pink-50 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">✨</span>
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
              Today's Drawing Prompt:
            </span>
            <p className="font-display font-bold text-base text-slate-800">
              "{currentPrompt}"
            </p>
          </div>
        </div>
        <button
          onClick={handleNewPrompt}
          className="btn-bubbly flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-amber-300 text-amber-800 text-xs font-bold shadow-sm shrink-0 hover:bg-amber-100"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>New Prompt</span>
        </button>
      </div>

      {/* Canvas & Controls Container */}
      <div className="card-soft p-4 sm:p-6 bg-white border-2 border-slate-200 space-y-4 shadow-lg">
        
        {/* Top Control Bar: Colors, Brush, Undo/Redo */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
          
          {/* Color Palette */}
          <div className="flex items-center gap-2 flex-wrap">
            {palette.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  sound.playPop();
                  setSelectedColor(c.hex);
                  setIsEraser(false);
                }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-sm transition-transform ${
                  selectedColor === c.hex && !isEraser
                    ? 'scale-125 ring-2 ring-offset-2 ring-slate-800'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}

            {/* Eraser */}
            <button
              onClick={() => { sound.playPop(); setIsEraser(!isEraser); }}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 border-2 transition-all ${
                isEraser
                  ? 'bg-amber-100 border-amber-400 text-amber-900 scale-105'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
              title="Eraser tool"
            >
              <Eraser className="w-4 h-4" />
              <span className="hidden sm:inline">Eraser</span>
            </button>
          </div>

          {/* Brush Sizes */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            {[3, 6, 12, 20].map((size) => (
              <button
                key={size}
                onClick={() => { sound.playPop(); setBrushSize(size); }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  brushSize === size ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                }`}
              >
                {size === 3 ? 'Thin' : size === 6 ? 'Normal' : size === 12 ? 'Thick' : 'Jumbo'}
              </button>
            ))}
          </div>

          {/* Action Tools: Undo, Redo, Clear, Save */}
          <div className="flex items-center gap-2">
            
            {/* Undo (DSA Stack Pop) */}
            <button
              onClick={handleUndo}
              disabled={undoStack.length <= 1}
              className="btn-bubbly p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs flex items-center gap-1"
              title="Undo previous stroke (Stack Pop)"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Undo</span>
            </button>

            {/* Redo (DSA Stack Push) */}
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="btn-bubbly p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs flex items-center gap-1"
              title="Redo stroke"
            >
              <RotateCw className="w-4 h-4" />
              <span className="hidden sm:inline">Redo</span>
            </button>

            {/* Clear Canvas */}
            <button
              onClick={handleClear}
              className="btn-bubbly p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1"
              title="Clear canvas"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>

            {/* Save Picture */}
            <button
              onClick={handleDownload}
              className="btn-bubbly px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
              title="Save picture"
            >
              <Download className="w-4 h-4" />
              <span>Save Art</span>
            </button>

          </div>

        </div>

        {/* HTML5 Canvas Element */}
        <div className="w-full flex justify-center bg-slate-50 rounded-2xl p-2 border border-slate-200 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800}
            height={480}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="bg-white rounded-xl shadow-inner cursor-crosshair touch-none max-w-full h-auto"
          />
        </div>

        <p className="text-center text-xs font-mono font-bold text-slate-400">
          💡 DSA Feature in action: Undo/Redo is powered by dual LIFO Stacks! (Depth: {undoStack.length} states)
        </p>

      </div>
    </div>
  );
}

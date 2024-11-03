import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import { FaClipboard, FaImage, FaClock, FaQuestionCircle, FaTrash } from 'react-icons/fa';

const ItemTypes = {
  COMPONENT: 'component',
};

const DraggableComponent = ({ type, icon, id }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    item: { id, type, icon },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`component ${isDragging ? 'dragging' : ''}`}
      style={{ display: 'flex', alignItems: 'center', cursor: 'move', padding: '5px', border: '1px solid #ddd', borderRadius: '4px', margin: '5px' }}
    >
      {icon}
      <span style={{ marginLeft: '10px' }}>{type}</span>
    </div>
  );
};

const Canvas = ({ droppedItems, setDroppedItems }) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: ItemTypes.COMPONENT,
    drop: (item) => {
      // Add the dropped item to the canvas
      setDroppedItems((prev) => [...prev, item]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleDelete = (id) => {
    setDroppedItems((prev) => prev.filter(item => item.id !== id));
  };

  return (
    <div
      ref={dropRef}
      className="canvas"
      style={{
        backgroundColor: isOver ? '#e0e0e0' : '#f0f0f0',
        height: '100vh', // Full height for desktop
        padding: '20px',
        overflow: 'auto',
      }}
    >
      <h2>Canvas Area</h2>
      {droppedItems.map((item, index) => (
        <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', backgroundColor: '#fff' }}>
          {item.icon}
          <span style={{ marginLeft: '10px' }}>{item.type}</span>
          <button onClick={() => handleDelete(item.id)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', color: 'red' }}>
            <FaTrash />
          </button>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [droppedItems, setDroppedItems] = useState([]);

  const components = [
    { id: '1', type: 'Progress Bar', icon: <FaClipboard /> },
    { id: '2', type: 'Image', icon: <FaImage /> },
    { id: '3', type: 'Timer', icon: <FaClock /> },
    { id: '4', type: 'Question', icon: <FaQuestionCircle /> },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="admin-view">
        <div className="sidebar">
          <h2>Draggable Components</h2>
          {components.map((comp) => (
            <DraggableComponent
              key={comp.id}
              type={comp.type}
              icon={comp.icon}
              id={comp.id}
            />
          ))}
        </div>
        <Canvas droppedItems={droppedItems} setDroppedItems={setDroppedItems} />
      </div>
    </DndProvider>
  );
};

export default App;

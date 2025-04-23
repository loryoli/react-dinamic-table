import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const initialColumns = ["name", "email", "role"];

const data = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "Editor" },
  { id: 3, name: "Carol", email: "carol@example.com", role: "Viewer" }
];

function SortableHeader({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move px-4 py-2 border bg-gray-100 text-left"
    >
      {id.toUpperCase()}
    </th>
  );
}

const DynamicTable = () => {
  const [columns, setColumns] = useState(initialColumns);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = columns.indexOf(active.id);
      const newIndex = columns.indexOf(over.id);
      setColumns(arrayMove(columns, oldIndex, newIndex));
    }
  };

  return (
    <div className="p-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <table className="min-w-full border-collapse border">
          <thead>
            <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
              <tr>
                {columns.map((col) => (
                  <SortableHeader key={col} id={col} />
                ))}
              </tr>
            </SortableContext>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="even:bg-gray-50">
                {columns.map((col) => (
                  <td key={col} className="border px-4 py-2">
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </DndContext>
    </div>
  );
}

export default DynamicTable;
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

const TabelaDinamica = () => {
  const [columns, setColumns] = useState<string[]>([]);
  const [columnInput, setColumnInput] = useState('');
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [rowInput, setRowInput] = useState({});
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null); // Controla qual linha está em modo de edição
  const [editCell, setEditCell] = useState<{ column: string, value: string } | null>(null); // Controla qual célula está sendo editada
  const sensors = useSensors(useSensor(PointerSensor));

  // Adiciona nova coluna
  const handleAddColumn = () => {
    if (!columnInput.trim()) return;
    setColumns([...columns, columnInput.trim()]);
    setColumnInput('');
  };

  // Adiciona nova linha com base nas colunas
  const handleAddRow = () => {
    if (columns.length === 0) return;
    const newRow = {
      ...rowInput,
      id: crypto.randomUUID(),
    };
    setRows([...rows, newRow]);
    setRowInput({});
  };

  // Função para editar o valor de uma célula
  const handleEditCell = (rowIndex: number, column: string) => {
    setEditRowIndex(rowIndex);
    setEditCell({ column, value: rows[rowIndex][column] });
  };

  // Função para salvar a edição de uma célula
  const handleSaveEdit = (rowIndex: number) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][editCell?.column] = editCell?.value || '';
    setRows(updatedRows);
    setEditRowIndex(null);
    setEditCell(null);
  };

  // Função para lidar com mudanças no valor de uma célula editada
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editCell) {
      setEditCell({ ...editCell, value: e.target.value });
    }
  };

  // Função para deletar uma linha
  const handleDelete = (idToDelete) => {
    const confirm = window.confirm("Tem certeza que deseja apagar esta linha?");
    if (confirm) {
      setRows((prevRows) => prevRows.filter((row) => row.id !== idToDelete));
    }
  };

  // Função para gerenciar o arraste e reorganização das colunas
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = columns.indexOf(active.id);
      const newIndex = columns.indexOf(over.id);
      setColumns(arrayMove(columns, oldIndex, newIndex));
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Criar Tabela Dinâmica</h2>

      {/* Formulário de colunas */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nome da Coluna"
          value={columnInput}
          onChange={(e) => setColumnInput(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button
          onClick={handleAddColumn}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Adicionar Coluna
        </button>
      </div>

      {/* Formulário de dados da linha */}
      {columns.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Nova Linha</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {columns.map((col) => (
              <input
                key={col}
                type="text"
                placeholder={col}
                value={rowInput[col] || ''}
                onChange={(e) => setRowInput({ ...rowInput, [col]: e.target.value })}
                className="border px-2 py-1"
              />
            ))}
          </div>
          <button
            onClick={handleAddRow}
            className="bg-green-500 text-white px-4 py-1 rounded"
          >
            Adicionar Linha
          </button>
        </div>
      )}

      {/* Renderização da tabela */}
      {columns.length > 0 && rows.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <table className="table-auto border w-full">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((col) => (
                  <SortableHeader key={col} id={col} />
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr className={`row-${row.id}`} key={row.id}>
                  {columns.map((col) => (
                    <td key={col} className="border px-3 py-1">
                      {editRowIndex === rowIndex && editCell?.column === col ? (
                        <input
                          type="text"
                          value={editCell.value}
                          onChange={handleInputChange}
                          onBlur={() => handleSaveEdit(rowIndex)}
                          className="border px-2 py-1"
                        />
                      ) : (
                        <span onClick={() => handleEditCell(rowIndex, col)}>
                          {row[col] || '-'}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DndContext>
      )}
    </div>
  );
};

export default TabelaDinamica;

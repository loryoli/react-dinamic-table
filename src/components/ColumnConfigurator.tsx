import React, { useState } from 'react';

const ColumnConfigurator = () => {
    const [columns, setColumns] = useState<string[]>([]);
    const [columnInput, setColumnInput] = useState('');
    const [rows, setRows] = useState<Record<string, string>[]>([]);
    const [rowInput, setRowInput] = useState({});
  
    // Adiciona nova coluna
    const handleAddColumn = () => {
      if (!columnInput.trim()) return;
      setColumns([...columns, columnInput.trim()]);
      setColumnInput('');
    };
  
    // Adiciona nova linha com base nas colunas
    const handleAddRow = () => {
      if (columns.length === 0) return;
      setRows([...rows, rowInput]);
      setRowInput({});
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
          <button onClick={handleAddColumn} className="bg-blue-500 text-white px-4 py-1 rounded">
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
            <button onClick={handleAddRow} className="bg-green-500 text-white px-4 py-1 rounded">
              Adicionar Linha
            </button>
          </div>
        )}
  
        {/* Renderização da tabela */}
        {columns.length > 0 && rows.length > 0 && (
          <table className="table-auto border w-full">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="border px-3 py-2">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col} className="border px-3 py-1">{row[col] || '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
export default ColumnConfigurator;
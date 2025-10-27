'use client'
import './DataTable.css'



 export default  function DataTable({ columns, data, actions, loading }) {
  return (
    <>
      <div className="user_table_container">
        {loading ? (
          <div className="loading-container">
            Caricamento in corso
            <span className="loading-spinner"></span>
          </div>
        ) : (
          <table className="user_table">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col.label}</th>
                ))}
                {actions && <th>Azioni</th>}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="no-data">
                    Nessun elemento trovato
                  </td>
                </tr>
              ) : (
                data.map((item, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex}>
                        {col.key.includes("image") ? (
                          <img 
                            src={item[col.key]} 
                            alt={col.label} 
                            className="user_image"
                          />
                        ) : col.key.includes("created_at") ? (
                          <span className="user_date">
                            {new Date(item[col.key]).toLocaleString("it-IT", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </span>
                        ) : (
                          item[col.key]
                        )}
                      </td>
                    ))}
                    {actions && (
                      <td>
                        {actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => action.onClick(item)}
                            className={action.className || 'btn-action'}
                            title={action.label}
                          >
                            {action.icon || action.label}
                          </button>
                        ))}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
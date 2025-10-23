'use client'
import './DataTable.css'



export default function DataTable({columns, data, actions,loading}){

    return(
        <div className="user_table_container">
            <div className="data_table">
            {loading?(
                <p className="loading">caricamneto</p>
            ):(
                <table className='user_table' >
                    <thead className="column_name" >
                        <tr className='column_name_row' >
                            {columns.map((col) => (
                                <th key={col.key}>{col.label}</th>
                            ))}
                            {actions && <th>Azioni</th>}
                        </tr>
                    </thead>
                    <tbody  className="table_body" >
                        {data.lenght === 0 ? (
                        <tr>
                            <td colSpan={columns.lenght} style={{ textAlign: 'center', padding: '20px' }} >
                                nessun elemento trovato
                            </td>
                        </tr>
                        ):(
                            data.map((item) =>(
                                <tr className="user_row" key={item.id}>
                                    {columns.map((col) => (
                                        <td className="user_date" key={col.key}>
                                            {col.key.includes("image") ? (
                                                <img
                                                src={item[col.key]}
                                                alt={item.title || "immagine"}
                                                className="table-img"/>
                                            ) : col.key.includes("created_at") ? (
                                                new Date(item[col.key]).toLocaleString("it-IT", {
                                                dateStyle: "short",
                                                timeStyle: "short",
                                            })
                                            ) : (
                                                item[col.key]
                                                )}
                                        </td>
                                    ))}
                                    {actions && (
                    <td className="user_date">
                      <div className="action_buttons">
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
                      </div>
                    </td>
                  )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
        </div>
    )

}
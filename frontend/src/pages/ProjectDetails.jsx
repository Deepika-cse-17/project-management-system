import { useEffect, useState } from 'react';
import { useParams }           from 'react-router-dom';
import api                     from '../services/api';

export default function ProjectDetails() {
  const { id }             = useParams();
  const [project, setProject] = useState(null);
  const [tasks,   setTasks]   = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ task_name:'', description:'', priority:'Medium', status:'Pending', due_date:'' });

  const load = () => {
    api.get(`/projects/${id}`).then(r => setProject(r.data));
    api.get('/tasks', { params: { project_id: id } }).then(r => setTasks(r.data));
  };

  useEffect(() => { load(); }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/tasks', { ...form, project_id: id });
    setShowForm(false);
    load();
  };

  const deleteTask = async (tid) => {
    await api.delete(`/tasks/${tid}`);
    load();
  };

  const markDone = async (task) => {
    await api.put(`/tasks/${task.id}`, { status: 'Completed' });
    load();
  };

  const priorityBadge = { Low:'success', Medium:'warning', High:'danger' };

  if (!project) return <div className="spinner-border mt-5"/>;

  return (
    <div>
      <h2>{project.project_name}</h2>
      <span className="badge bg-primary">{project.status}</span>
      <p className="mt-2">{project.description}</p>

      <div className="d-flex justify-content-between mt-4">
        <h4>Tasks</h4>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>+ Add Task</button>
      </div>

      {showForm && (
        <form className="card p-3 mt-2" onSubmit={submit}>
          <div className="row g-2">
            <div className="col-md-6">
              <input className="form-control" placeholder="Task name" value={form.task_name}
                onChange={e => setForm({...form, task_name: e.target.value})} required/>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
            <div className="col-md-3">
              <input type="date" className="form-control" value={form.due_date}
                onChange={e => setForm({...form, due_date: e.target.value})}/>
            </div>
            <div className="col-12">
              <textarea className="form-control" placeholder="Description" value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}/>
            </div>
          </div>
          <button className="btn btn-success mt-2">Add Task</button>
        </form>
      )}

      <table className="table mt-3">
        <thead>
          <tr><th>Task</th><th>Priority</th><th>Status</th><th>Due Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {tasks.map(t => (
            <tr key={t.id}>
              <td>{t.task_name}</td>
              <td><span className={`badge bg-${priorityBadge[t.priority]}`}>{t.priority}</span></td>
              <td>{t.status}</td>
              <td>{t.due_date}</td>
              <td className="d-flex gap-1">
                {t.status !== 'Completed' && (
                  <button className="btn btn-sm btn-outline-success" onClick={() => markDone(t)}>✓ Done</button>
                )}
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTask(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {tasks.length === 0 && <tr><td colSpan="5" className="text-muted">No tasks yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
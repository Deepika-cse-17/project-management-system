import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ project_name:'', description:'', status:'Not Started', start_date:'', end_date:'' });

  const load = () => {
    api.get('/projects', { params: { search, status } }).then(r => setProjects(r.data));
  };

  useEffect(() => { load(); }, [search, status]);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/projects', form);
    setShowForm(false);
    setForm({ project_name:'', description:'', status:'Not Started', start_date:'', end_date:'' });
    load();
  };

  const remove = async (id) => {
    if (window.confirm('Delete this project?')) {
      await api.delete(`/projects/${id}`);
      load();
    }
  };

  const statusBadge = { 'Not Started':'secondary', 'In Progress':'primary', 'Completed':'success' };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Projects</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ New Project</button>
      </div>

      {showForm && (
        <form className="card p-3 mt-3" onSubmit={submit}>
          <div className="row g-2">
            <div className="col-md-6">
              <input className="form-control" placeholder="Project name" value={form.project_name}
                onChange={e => setForm({...form, project_name: e.target.value})} required />
            </div>
            <div className="col-md-6">
              <select className="form-select" value={form.status}
                onChange={e => setForm({...form, status: e.target.value})}>
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div className="col-12">
              <textarea className="form-control" placeholder="Description" value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}/>
            </div>
            <div className="col-md-6">
              <label>Start date</label>
              <input type="date" className="form-control" value={form.start_date}
                onChange={e => setForm({...form, start_date: e.target.value})}/>
            </div>
            <div className="col-md-6">
              <label>End date</label>
              <input type="date" className="form-control" value={form.end_date}
                onChange={e => setForm({...form, end_date: e.target.value})}/>
            </div>
          </div>
          <button className="btn btn-success mt-2">Create Project</button>
        </form>
      )}

      <div className="d-flex gap-2 mt-3">
        <input className="form-control w-50" placeholder="Search projects..."
          value={search} onChange={e => setSearch(e.target.value)}/>
        <select className="form-select w-25" value={status} onChange={e => setStatus(e.target.value)}>
          <option>All</option><option>Not Started</option><option>In Progress</option><option>Completed</option>
        </select>
      </div>

      <div className="row g-3 mt-2">
        {projects.map(p => (
          <div className="col-md-4" key={p.id}>
            <div className="card h-100 p-3">
              <h5>{p.project_name}</h5>
              <span className={`badge bg-${statusBadge[p.status]}`}>{p.status}</span>
              <p className="text-muted mt-2 small">{p.description}</p>
              <p className="small">📅 {p.start_date} → {p.end_date}</p>
              <div className="d-flex gap-2 mt-auto">
                <Link to={`/projects/${p.id}`} className="btn btn-sm btn-outline-primary">View Tasks</Link>
                <button className="btn btn-sm btn-outline-danger" onClick={() => remove(p.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-muted">No projects found.</p>}
      </div>
    </div>
  );
}
export default function Features() {
  return (
    <div className="landing-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container-main">
          <h1>Features</h1>
          <p>Everything you need to manage projects successfully</p>
        </div>
      </section>

      {/* Main Features */}
      <section className="features-section">
        <div className="container-main">
          <div className="feature-row">
            <div className="feature-description">
              <h2>Project Management</h2>
              <p>
                Create and organize multiple projects with detailed descriptions, 
                timelines, and status tracking. Easily monitor project progress from 
                start to completion.
              </p>
              <ul className="feature-list">
                <li>Create unlimited projects</li>
                <li>Set project timelines</li>
                <li>Track project status</li>
                <li>Monitor team members</li>
              </ul>
            </div>
          </div>

          <div className="feature-row feature-row-reverse">
            <div className="feature-description">
              <h2>Task Organization</h2>
              <p>
                Break down projects into actionable tasks with clear priorities, 
                due dates, and status indicators. Assign tasks to team members and 
                track progress in real-time.
              </p>
              <ul className="feature-list">
                <li>Create and assign tasks</li>
                <li>Set priorities (High, Medium, Low)</li>
                <li>Manage deadlines</li>
                <li>Track task completion</li>
              </ul>
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-description">
              <h2>Team Collaboration</h2>
              <p>
                Work together efficiently with shared projects and tasks. 
                Keep everyone on the same page with centralized communication 
                and clear accountability.
              </p>
              <ul className="feature-list">
                <li>Share projects with team</li>
                <li>Real-time updates</li>
                <li>Clear task assignments</li>
                <li>Progress visibility</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

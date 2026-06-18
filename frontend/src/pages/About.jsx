export default function About() {
  return (
    <div className="landing-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container-main">
          <h1>About ProjectHub</h1>
          <p>Our mission is to simplify project management</p>
        </div>
      </section>

      {/* About Content */}
      <section className="about-section">
        <div className="container-main">
          <div className="about-content">
            <div className="about-block">
              <h2>Our Mission</h2>
              <p>
                We believe that project management should be simple, intuitive, and accessible 
                to teams of all sizes. ProjectHub was created to help teams collaborate more 
                effectively, reduce complexity, and deliver projects on time.
              </p>
            </div>

            <div className="about-block">
              <h2>What We Believe</h2>
              <p>
                We're committed to providing a platform that:
              </p>
              <ul className="about-list">
                <li>Removes unnecessary complexity from project management</li>
                <li>Empowers teams to work together efficiently</li>
                <li>Provides clear visibility into project progress</li>
                <li>Helps teams deliver results consistently</li>
              </ul>
            </div>

            <div className="about-block">
              <h2>Our Values</h2>
              <div className="values-grid">
                <div className="value-item">
                  <h3>Simplicity</h3>
                  <p>Clean design, easy to use, no learning curve</p>
                </div>
                <div className="value-item">
                  <h3>Reliability</h3>
                  <p>Stable, secure, and always available when you need it</p>
                </div>
                <div className="value-item">
                  <h3>Collaboration</h3>
                  <p>Built for teams to work together seamlessly</p>
                </div>
                <div className="value-item">
                  <h3>Innovation</h3>
                  <p>Continuously improving based on user feedback</p>
                </div>
              </div>
            </div>

            <div className="about-block">
              <h2>Why We Built This</h2>
              <p>
                We've seen teams struggle with overly complicated project management tools. 
                They spend more time learning the software than actually managing projects. 
                ProjectHub is our solution—a platform that gets out of the way and lets 
                teams focus on what matters: delivering great work.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

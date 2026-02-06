import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './Blogs.css';

const Blogs = () => {
  const blogs = [
    {
      title: '10 Tips for Healthy Living',
      excerpt: 'Discover essential tips to maintain a healthy lifestyle...',
      date: 'February 1, 2026',
    },
    {
      title: 'Understanding Heart Health',
      excerpt: 'Learn about cardiovascular health and prevention...',
      date: 'January 28, 2026',
    },
    {
      title: 'Mental Health Awareness',
      excerpt: 'Breaking the stigma around mental health issues...',
      date: 'January 25, 2026',
    },
    {
      title: 'Nutrition and Wellness',
      excerpt: 'How proper nutrition impacts overall health...',
      date: 'January 20, 2026',
    },
  ];

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="blogs-page">
            <h1>Health & Wellness Blog</h1>
            <div className="blogs-grid">
              {blogs.map((blog, index) => (
                <div key={index} className="blog-card">
                  <div className="blog-date">{blog.date}</div>
                  <h3>{blog.title}</h3>
                  <p>{blog.excerpt}</p>
                  <button className="read-more">Read More</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blogs;

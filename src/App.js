import React, { useState, useEffect } from 'react';

function App() {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [factCount, setFactCount] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [requestedCount, setRequestedCount] = useState('1');

  // Fetch multiple facts
  const fetchCatFacts = async () => {
    const count = parseInt(requestedCount, 10);
    if (isNaN(count) || count < 1 || count > 10) {
      setError('Please enter a number between 1 and 10');
      return;
    }

    setLoading(true);
    setError('');
    setFacts([]);

    try {
      // fetch facts in parallel
      const promises = [];
      for (let i = 0; i < count; i++) {
        promises.push(fetch('https://catfact.ninja/fact').then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        }));
      }

      const dataArr = await Promise.all(promises);
      setFacts(dataArr.map((d) => d.fact));
      setFactCount(count);
    } catch (err) {
      setError('😿 Oops! Could not fetch cat facts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.backgroundColor = darkMode ? '#121212' : '#f5f7fa';
    document.body.style.overflowX = 'hidden';
  }, [darkMode]);

  return (
    <div style={darkMode ? styles.pageWrapperDark : styles.pageWrapperLight}>
      {/* Animated Cat Background */}
      <CatBackground darkMode={darkMode} />

      {/* Navbar */}
      <nav style={darkMode ? styles.navbarDark : styles.navbarLight}>
        <div style={styles.navTitle}>
          <span role="img" aria-label="cat">
            🐱
          </span>{' '}
          Cat Facts
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={darkMode ? styles.toggleBtnDark : styles.toggleBtnLight}
          aria-label="Toggle dark/light mode"
        >
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </nav>

      <main style={darkMode ? styles.mainDark : styles.mainLight}>
        <h1 style={darkMode ? styles.headingDark : styles.headingLight}>
          🐱 Random Cat Facts
        </h1>
        <p style={darkMode ? styles.subtitleDark : styles.subtitleLight}>
          Enter how many cat facts you want (1-10) and click the button below!
        </p>

        <input
          type="number"
          min="1"
          max="10"
          value={requestedCount}
          onChange={(e) => setRequestedCount(e.target.value)}
          style={darkMode ? styles.inputDark : styles.inputLight}
          aria-label="Number of cat facts to fetch"
          disabled={loading}
        />

        <button
          onClick={fetchCatFacts}
          style={{
            ...styles.button,
            backgroundColor: loading
              ? darkMode
                ? '#555'
                : '#aaa'
              : darkMode
              ? '#bb86fc'
              : '#4a90e2',
            cursor: loading ? 'not-allowed' : 'pointer',
            color: darkMode ? '#121212' : '#fff',
            marginLeft: '10px',
          }}
          disabled={loading}
        >
          {loading ? (
            <span>
              <span className="spinner" style={styles.spinner}></span> Fetching...
            </span>
          ) : (
            'Get Cat Facts'
          )}
        </button>

        {error && (
          <div style={darkMode ? styles.errorBoxDark : styles.errorBoxLight}>
            <p style={darkMode ? styles.errorDark : styles.errorLight}>{error}</p>
            <button style={styles.retryButton} onClick={fetchCatFacts} disabled={loading}>
              🔄 Retry
            </button>
          </div>
        )}

        <div style={darkMode ? {...styles.factsContainer, ...styles.factsContainerPosition} : {...styles.factsContainer, ...styles.factsContainerPosition}}>
          {facts.map((fact, index) => (
            <div
              key={index}
              style={darkMode ? styles.factBoxDark : styles.factBoxLight}
            >
              <p style={darkMode ? styles.factDark : styles.factLight}>🐾 {fact}</p>
              <p style={darkMode ? styles.factMetaDark : styles.factMetaLight}>
                Fact #{index + 1} | Length: {fact.length} characters
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer style={darkMode ? styles.footerDark : styles.footerLight}>
        <p>© {new Date().getFullYear()} Cat Facts Inc.</p>
      </footer>
    </div>
  );
}

// Animated floating cats background component
function CatBackground({ darkMode }) {
  // Create 20 animated cat emojis floating around
  const cats = Array.from({ length: 20 });

  return (
    <div style={{ ...styles.catBackground, pointerEvents: 'none' }}>
      {cats.map((_, i) => (
        <span
          key={i}
          style={{
            ...styles.floatingCat,
            animationDuration: `${10 + Math.random() * 20}s`,
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            opacity: 0.1 + Math.random() * 0.3,
            filter: darkMode ? 'drop-shadow(0 0 2px #bb86fc)' : 'drop-shadow(0 0 2px #4a90e2)',
          }}
          aria-hidden="true"
        >
          🐱
        </span>
      ))}
    </div>
  );
}

const baseContainer = {
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  width: '100vw',
  transition: 'background-color 0.4s ease, color 0.4s ease',
  position: 'relative',
  overflowX: 'hidden',
};

const styles = {
  pageWrapperLight: {
    ...baseContainer,
    background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
    color: '#222',
  },
  pageWrapperDark: {
    ...baseContainer,
    background: '#121212',
    color: '#eee',
  },

  navbarLight: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffffdd',
    padding: '15px 20px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxSizing: 'border-box',
    borderRadius: '10px 10px 0 0',
    width: '100vw',
    margin: 0,
    left: 0,
    right: 0,
    boxShadow: 'none',
    border: 'none',
  },
  navbarDark: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: '15px 20px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxSizing: 'border-box',
    borderRadius: '10px 10px 0 0',
    width: '100vw',
    margin: 0,
    left: 0,
    right: 0,
    boxShadow: 'none',
    border: 'none',
  },

  navTitle: {
    fontSize: '22px',
    fontWeight: '700',
  },

  subtitleLight: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '25px',
  },
  subtitleDark: {
    fontSize: '18px',
    color: '#bbb',
    marginBottom: '25px',
  },

  toggleBtnLight: {
    backgroundColor: '#4a90e2',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 4px 10px rgba(74, 144, 226, 0.4)',
    transition: 'background-color 0.3s ease',
  },
  toggleBtnDark: {
    backgroundColor: '#bb86fc',
    color: '#121212',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 4px 10px rgba(187, 134, 252, 0.6)',
    transition: 'background-color 0.3s ease',
  },

  mainLight: {
    flex: 1,
    padding: '40px 20px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 10,
  },
  mainDark: {
    flex: 1,
    padding: '40px 20px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 10,
  },

  headingLight: {
    fontSize: '32px',
    marginBottom: '10px',
  },
  headingDark: {
    fontSize: '32px',
    marginBottom: '10px',
  },

  inputLight: {
    fontSize: '16px',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1.5px solid #4a90e2',
    width: '60px',
    textAlign: 'center',
  },
  inputDark: {
    fontSize: '16px',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1.5px solid #bb86fc',
    backgroundColor: '#292929',
    color: '#eee',
    width: '60px',
    textAlign: 'center',
  },

  button: {
    padding: '14px 30px',
    fontSize: '18px',
    border: 'none',
    borderRadius: '8px',
    marginBottom: '30px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },

  factsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
    maxWidth: '900px',
    margin: '0 auto',
    zIndex: 10,

    // Make it easier to move the entire card container:
    position: 'relative',
  },

  // Example position adjustments - you can edit or remove these
  factsContainerPosition: {
    top: '30px',   // move down 30px
    left: '10px',  // move right 10px
  },

  factBoxLight: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '25px 20px',
    maxWidth: '300px',
    flex: '1 1 300px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'left',
  },
  factBoxDark: {
    backgroundColor: '#292929',
    borderRadius: '10px',
    padding: '25px 20px',
    maxWidth: '300px',
    flex: '1 1 300px',
    boxShadow: '0 2px 8px rgba(255,255,255,0.1)',
    textAlign: 'left',
  },

  factLight: {
    fontSize: '18px',
    color: '#222',
    marginBottom: '10px',
  },
  factDark: {
    fontSize: '18px',
    color: '#eee',
    marginBottom: '10px',
  },

  factMetaLight: {
    fontSize: '12px',
    color: '#666',
  },
  factMetaDark: {
    fontSize: '12px',
    color: '#ccc',
  },

  errorBoxLight: {
    backgroundColor: '#ffe6e6',
    padding: '20px',
    borderRadius: '8px',
    display: 'inline-block',
    marginBottom: '20px',
  },
  errorBoxDark: {
    backgroundColor: '#5a1e1e',
    padding: '20px',
    borderRadius: '8px',
    display: 'inline-block',
    marginBottom: '20px',
  },

  errorLight: {
    color: '#d8000c',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  errorDark: {
    color: '#ffbaba',
    fontWeight: 'bold',
    marginBottom: '10px',
  },

  retryButton: {
    backgroundColor: '#ff5c5c',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },

  spinner: {
    width: '18px',
    height: '18px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #fff',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '8px',
    animation: 'spin 1s linear infinite',
  },

  footerLight: {
    backgroundColor: '#ffffffcc',
    textAlign: 'center',
    padding: '15px 10px',
    fontSize: '14px',
    color: '#555',
    border: 'none',
    position: 'relative',
    zIndex: 10,
  },
  footerDark: {
    backgroundColor: '#1a1a1a',
    textAlign: 'center',
    padding: '15px 10px',
    fontSize: '14px',
    color: '#aaa',
    border: 'none',
    position: 'relative',
    zIndex: 10,
  },

  catBackground: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    zIndex: 1,
    pointerEvents: 'none',
  },

  floatingCat: {
    position: 'absolute',
    fontSize: '2.5rem',
    userSelect: 'none',
    animationName: 'floatUpDown',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
  },
};

// Global animations
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes floatUpDown {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;
document.head.appendChild(styleSheet);

export default App;

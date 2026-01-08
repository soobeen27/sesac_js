import Header from './Header';
import Footer from './Footer';

function App() {
    const pageTitle = 'Welconme to my Website';
    const copyWrightYear = 2026;
    return (
        <div>
            <Header title={pageTitle} />
            <main>
                <p>Hello</p>
            </main>
            <Footer year={copyWrightYear} />
        </div>
    );
}

export default App;

export default function Header({ onToggle, searchText, onSearch, onSearchClick }) {
    return (
        <>
            <header className="dashboard-header">
                <div className="header-left">
                    <button className="menu-btn" onClick={onToggle}>☰</button>

                    <h2>Notes</h2>
                </div>

                <div className="search-bar">
                    <input type="text" placeholder="Search notes" value={searchText} onChange={(e)=>onSearch(e.target.value)} />
                </div>
                <button type="button" className="btn btn-success" onClick={onSearchClick}>Search Now</button>
            </header >
        </>
    );
}
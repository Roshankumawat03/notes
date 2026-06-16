import { Link, NavLink } from "react-router-dom";

export default function Sidebar({ collapsed, mobileOpen }) {
    return (
        <aside
            className={`dashboard-sidebar ${collapsed ? "collapsed" : ""
                } ${mobileOpen ? "mobile-open" : ""}`}
        >
            <ul>
                <li className="active"><Link to="/">Notes</Link></li>
                <li><Link to="/allnotes">All Notes</Link></li>
                <li><Link to='/archive'>Archive</Link></li>
                <li><Link to='/pinned'>Pinned</Link></li>
                <li><Link to='/trash'>Trash</Link> </li>

            </ul>
        </aside>
    );
}
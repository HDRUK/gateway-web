import Link from "next/link";
import HeaderNav from "../HeaderNav/HeaderNav";

function Header() {
    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <ul
                style={{
                    padding: "20px",
                    display: "inline-block",
                    listStyle: "none",
                }}>
                <li
                    style={{
                        display: "inline-block",
                        paddingLeft: "10px",
                    }}>
                    <Link href="/">Home</Link>
                </li>
            </ul>
            <HeaderNav />
        </div>
    );
}

export default Header;

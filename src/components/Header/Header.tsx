import Link from "@/components/Link";
import HeaderNav from "../HeaderNav/HeaderNav";

function Header() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
            <ul
                style={{
                    display: "inline-block",
                    listStyle: "none",
                }}>
                <li
                    style={{
                        display: "inline-block",
                    }}>
                    <Link href="/" label="Home" />
                </li>
            </ul>
            <HeaderNav />
        </div>
    );
}

export default Header;

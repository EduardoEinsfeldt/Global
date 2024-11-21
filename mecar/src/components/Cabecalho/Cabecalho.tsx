import Link from "next/link";

export default function Cabecalho() {
    return(
        <nav className="cabecalho">
            <li>
                <Link href="/">Home</Link>
            </li>
            <li>
                <Link href="/cadastro">Cadastrar</Link>
            </li>
            <li>
                <Link href="/login">Login</Link>
            </li>
        </nav>
    )
}
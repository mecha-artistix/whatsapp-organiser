import { Home, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";

function Navigation() {
  const links = [
    { name: "Dashboard", link: "/", icon: <Home /> },
    { name: "Whatsapp", link: "/whatsapp", icon: <MessageSquareText /> },
  ];
  return (
    <ul>
      {links.map((item, i) => (
        <li key={i}>
          <Link to={item.link}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Navigation;

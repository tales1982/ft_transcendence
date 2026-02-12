import { useTranslation } from "react-i18next";
import {Bar, Row, Left, NavLink, Right, NavBtn, RegisterBtn} from "./NavBar.styled";
import LanguageDropdown from "./LanguageDropdown";




export function Navbar() {
  const { t, i18n } = useTranslation();

  return (
    <Bar>
      <Row>
        <Left>
          <strong>{t("app.title")}</strong>
          <NavLink to="/">{t("nav.home")}</NavLink>
        </Left>

        <Right>
          <LanguageDropdown/>
          <NavBtn to="/login">{t("nav.login")}</NavBtn>
          <RegisterBtn to="/register">{t("nav.register")}</RegisterBtn>
        </Right>
      </Row>
    </Bar>
  );
}

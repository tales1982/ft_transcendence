import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LANGUAGES } from "../../constants/languages";
import { setLanguage } from "../../store/slices/LanguagesSlices";
import type { RootState } from "../../store/store";
import {
  Wrapper,
  Trigger,
  Flag,
  Label,
  Chevron,
  Menu,
  Item,
} from "./LanguageDropdown.styled";

export default function LanguageDropdown() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const currentLang = useSelector((state: RootState) => state.language.current);
  const current = LANGUAGES.find((lang) => lang.code === currentLang) || LANGUAGES[0];

  return (
    <Wrapper>
      <Trigger onClick={() => setOpen(!open)}>
        <Flag src={current.flag} alt={current.name} />
        <Label>{current.label}</Label>
        <Chevron open={open} />
      </Trigger>

      {open && (
        <Menu>
          {LANGUAGES.map((lang) => (
            <Item
              key={lang.code}
              onClick={() => {
                dispatch(setLanguage(lang.code as "pt" | "en" | "fr"));
                setOpen(false);
              }}
            >
              <Flag src={lang.flag} alt={lang.name} />
              <span>{lang.name}</span>
            </Item>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
}

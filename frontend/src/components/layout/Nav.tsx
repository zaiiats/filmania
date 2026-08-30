import styled from "styled-components";
import Logo from "./Logo";
import { Link, useLocation } from "react-router-dom";
import { useTypedDispatch, useTypedSelector } from "@/store/store";
import { useEffect } from "react";
import Button from "../reusable/Button";

const StyledNav = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
`;

const LinksWrapper = styled.ul`
  display: flex;
  gap: 1rem;
`;

export default function Nav() {
  const dispatch = useTypedDispatch();
  const { username } = useTypedSelector((store) => store.user);
  const location = useLocation();

  useEffect(() => {
    //dispatch(login({ email: "1241234", userData: null, username: "dasfasdf" }));
  }, [dispatch]);

  useEffect(() => {}, [location]);

  return (
    <StyledNav>
      <Link to={"/"}>
        <Logo />
      </Link>
      <LinksWrapper>
        {username ? (
          <>
            <li>
              <Link to="/account">{username}</Link>
            </li>
          </>
        ) : (
          <>
            <Link to="/login">
              <li>
                <Button variant="filled">Login</Button>
              </li>
            </Link>
            <Link to="/signup">
              <li>
                <Button variant="outline">SignUp</Button>
              </li>
            </Link>
          </>
        )}
      </LinksWrapper>
    </StyledNav>
  );
}

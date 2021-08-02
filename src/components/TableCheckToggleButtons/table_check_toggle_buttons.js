import styled from "styled-components";

export const ButtonGroupLabel = styled.label.attrs({
  className: "table-check"
})`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  &:hover {
    background: ${(props) => (props.checked ? "0d6efd" : "#FFF")};
    color: ${(props) => (props.checked ? "#FFF" : "#0d6efd")};
  }
`;

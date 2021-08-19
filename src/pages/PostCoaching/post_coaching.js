import styled from "styled-components";

export const PercentageAlert = styled.div.attrs({
    className: "alert",
    role:"alert",
    id:"puntaje"
})`
  color: ${(props) => (props.colors.color)};
  background: ${(props) => (props.colors.backgroundColor)};
  border: 1px solid ${(props) => (props.colors.color)};
  marginBottom: "1.6rem";
`;
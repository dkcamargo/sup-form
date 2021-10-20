import styled from "styled-components";

export const LateDateAlert = styled.td.attrs({
    className: "table-data numeric-data date",
    role:"alert"
})`
    color: ${(props) => (props.color)};
`;
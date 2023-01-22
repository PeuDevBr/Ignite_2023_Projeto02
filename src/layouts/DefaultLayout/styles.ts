import styled from 'styled-components'

export const LayoutContainer = styled.div`
  max-width: 74rem;
  min-height: calc(
    100vh - 10rem
  ); /* -10rem => 5rem de margim em cima e 5rem em baixo*/
  margin: 5rem auto; /* auto => fica centralizado */
  padding: 2.5rem;

  background-color: ${(props) => props.theme['gray-800']};
  border-radius: 8px;

  display: flex;
  flex-direction: column;
`

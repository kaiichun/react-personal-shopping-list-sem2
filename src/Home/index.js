import { Container, Title, Space, Divider } from "@mantine/core";

import Items from "../Items";

function Home() {
  return (
    <Container>
      <Space h="50px" />
      <Title align="center" color="red">
        Personal Shopping List
      </Title>
      <Space h="20px" />
      <Title order={2} align="center">
        Add something to buy!
      </Title>
      <Space h="30px" />
      <Divider />
      <Space h="30px" />
      <Items />
      <Space h="30px" />
    </Container>
  );
}

export default Home;

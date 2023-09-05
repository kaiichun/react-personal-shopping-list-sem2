import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  NumberInput,
  Divider,
  Button,
  Group,
} from "@mantine/core";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";

function ItemEdit1() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [priority, setpPriority] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9999/items/" + id)
      .then((response) => {
        // set value for every fields
        setName(response.data.name);
        setQuantity(response.data.quantity);
        setUnit(response.data.unit);
        setpPriority(response.data.priority);
      })
      .catch((error) => {
        notifications.show({
          title: error.response.data.message,
          color: "red",
        });
      });
  }, []);

  const handleUpdateItem = async (event) => {
    event.preventDefault();
    try {
      const response = await axios({
        method: "PUT",
        url: "http://localhost:9999/items" + id,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          name: name,
          quantity: quantity,
          priority: priority,
          unit: unit,
        }),
      });
      // redirect back to home page
      navigate("/");
    } catch (error) {
      notifications.show({
        name: error.response.data.message,
        color: "red",
      });
    }
  };

  return (
    <Container>
      <Space h="50px" />
      <Title order={2} align="center">
        Edit Item
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={name}
          placeholder="Enter the list name here.."
          label="Name"
          description="What is the list"
          withAsterisk
          onChange={(event) => setName(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <NumberInput
          value={quantity}
          placeholder="Enter the quantity here"
          label="Quantity"
          description="what is the quantity"
          withAsterisk
          onChange={setQuantity}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={unit}
          placeholder="Enter the unit here"
          label="Unit"
          description="What is the uint"
          withAsterisk
          onChange={(event) => setUnit(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={priority}
          placeholder="Enter the priority here"
          label="Priority"
          description="What is priority?"
          withAsterisk
          onChange={(event) => setpPriority(event.target.value)}
        />
        <Space h="20px" />
        <Button fullWidth onClick={handleUpdateItem}>
          Update List
        </Button>
      </Card>
      <Space h="50px" />
      <Group position="center">
        <Button component={Link} to="/" variant="subtle" size="xs" color="gray">
          Go back to Home
        </Button>
      </Group>
      <Space h="50px" />
    </Container>
  );
}
export default ItemEdit1;
